/* Debug analyzer — turns a DOM element into a structured snapshot for
 * the debug inspector panel. Three superpowers beyond raw computed
 * styles:
 *
 *   1. Detects which computed values map back to theme tokens
 *      (e.g. borderRadius "20px" → radii.xl) so the inspector can show
 *      "this is a tokenised value" instead of just a number.
 *   2. Detects which @media rules in the page stylesheets target the
 *      element — so you can see at a glance whether the element has
 *      mobile/tablet adaptation.
 *   3. Returns ungrouped + grouped output so the panel can render rows
 *      like "Spacing", "Style", "Type" rather than one mega string.
 */

import { theme } from '../themes/theme';

// ────────────────────────────────────────────────────────────────────
// Token reverse-lookup: value → list of token paths
// ────────────────────────────────────────────────────────────────────

type TokenIndex = Map<string, string[]>;

const HEX_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Normalize CSS values for cross-format equality. Hex → rgb, strip
 *  whitespace, lowercase. Keeps numeric values untouched. */
function normalizeValue(raw: string): string {
  if (typeof raw !== 'string') return String(raw);
  const v = raw.trim().toLowerCase();
  if (HEX_RE.test(v)) {
    const h = v.slice(1);
    const exp = h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6);
    const r = parseInt(exp.slice(0, 2), 16);
    const g = parseInt(exp.slice(2, 4), 16);
    const b = parseInt(exp.slice(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return v.replace(/\s+/g, ' ');
}

function buildTokenIndex(): TokenIndex {
  const out: TokenIndex = new Map();
  function walk(obj: unknown, path: string[]) {
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (v && typeof v === 'object') {
          walk(v, [...path, k]);
        } else if (typeof v === 'string' || typeof v === 'number') {
          const norm = normalizeValue(String(v));
          const list = out.get(norm) ?? [];
          list.push([...path, k].join('.'));
          out.set(norm, list);
        }
      }
    }
  }
  walk(theme, []);
  return out;
}

let _tokenIndex: TokenIndex | null = null;
function tokenIndex(): TokenIndex {
  if (!_tokenIndex) _tokenIndex = buildTokenIndex();
  return _tokenIndex;
}

/** Returns the theme-token paths whose value matches `value`, or [] if
 *  the value isn't tokenised. Multiple matches possible (e.g. 12px
 *  could be both spacing.3 and typography.sizes.xs). */
export function findTokens(value: string): string[] {
  const norm = normalizeValue(value);
  return tokenIndex().get(norm) ?? [];
}

// ────────────────────────────────────────────────────────────────────
// Responsive detection — which @media rules target this element
// ────────────────────────────────────────────────────────────────────

/** Iterate every CSS rule reachable from document.styleSheets and
 *  return the unique @media condition strings that contain a selector
 *  matching `el`. Wrapped in try/catch because cross-origin sheets
 *  throw when accessed. */
export function findResponsiveQueries(el: HTMLElement): string[] {
  const out = new Set<string>();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    if (!rules) continue;
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSMediaRule) {
        for (const inner of Array.from(rule.cssRules)) {
          if (inner instanceof CSSStyleRule) {
            try {
              if (el.matches(inner.selectorText)) {
                out.add(rule.conditionText || rule.media.mediaText);
                break;
              }
            } catch {
              // invalid selector (:has, etc.)
            }
          }
        }
      }
    }
  }
  return Array.from(out);
}

// ────────────────────────────────────────────────────────────────────
// Element analysis — structured snapshot
// ────────────────────────────────────────────────────────────────────

export interface DebugItem {
  key: string;
  value: string;
  /** Theme-token paths the value maps to (e.g. ["radii.xl"]). */
  tokens: string[];
}

export interface DebugGroup {
  label: string;
  items: DebugItem[];
}

export interface DebugDetails {
  /** Friendly name: data-ux value if found, else <tag.sc-class>. */
  name: string;
  size: string;
  groups: DebugGroup[];
  /** Unique theme-token paths used anywhere on the element. */
  tokens: string[];
  /** Distinct @media condition strings that match this element. */
  responsive: string[];
  /** Plain-text version for the legacy hover tooltip / clipboard copy. */
  text: string;
}

function pushItem(group: DebugGroup, key: string, value: string | undefined) {
  if (!value || value === 'normal' || value === '0px' || value === 'none') return;
  const tokens = findTokens(value);
  group.items.push({ key, value, tokens });
}

export function analyzeElement(el: HTMLElement): DebugDetails {
  const rect = el.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  const s = window.getComputedStyle(el);
  const tag = el.tagName.toLowerCase();
  const cls = el.className?.toString().split(/\s+/).find(c => c.startsWith('sc-')) ?? '';

  // Walk up to find UX name
  let uxName = '';
  let walk: HTMLElement | null = el;
  while (walk && !uxName) {
    uxName = (walk.dataset?.ux as string) || '';
    walk = walk.parentElement;
  }
  const name = uxName ? `[${uxName}]` : `<${tag}${cls ? `.${cls}` : ''}>`;

  // Layout
  const layout: DebugGroup = { label: 'Layout', items: [] };
  if (s.display !== 'inline' && s.display !== 'block') pushItem(layout, 'display', s.display);
  if (s.display === 'flex' || s.display === 'grid') {
    if (s.flexDirection && s.flexDirection !== 'row') pushItem(layout, 'direction', s.flexDirection);
    if (s.alignItems && s.alignItems !== 'normal') pushItem(layout, 'align', s.alignItems);
    if (s.justifyContent && s.justifyContent !== 'normal') pushItem(layout, 'justify', s.justifyContent);
  }
  if (s.position !== 'static') pushItem(layout, 'position', s.position);
  if (s.overflow !== 'visible' && s.overflow) pushItem(layout, 'overflow', s.overflow);

  // Spacing
  const spacing: DebugGroup = { label: 'Spacing', items: [] };
  const padShort = collapseBox(s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft);
  if (padShort) pushItem(spacing, 'padding', padShort);
  const marginShort = collapseBox(s.marginTop, s.marginRight, s.marginBottom, s.marginLeft);
  if (marginShort) pushItem(spacing, 'margin', marginShort);
  if (s.gap && s.gap !== 'normal' && s.gap !== '0px' && s.gap !== '') pushItem(spacing, 'gap', s.gap);

  // Style
  const style: DebugGroup = { label: 'Style', items: [] };
  pushItem(style, 'radius', s.borderRadius);
  if (s.borderWidth !== '0px' && s.borderStyle !== 'none') {
    pushItem(style, 'border', `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`);
    pushItem(style, 'border-color', s.borderColor);
  }
  if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') {
    pushItem(style, 'background', s.backgroundColor);
  }
  if (s.boxShadow !== 'none' && s.boxShadow) pushItem(style, 'shadow', s.boxShadow);
  if (s.opacity !== '1') pushItem(style, 'opacity', s.opacity);
  if (s.transform !== 'none') pushItem(style, 'transform', s.transform.slice(0, 60));

  // Type
  const type: DebugGroup = { label: 'Type', items: [] };
  if (el.textContent?.trim() && el.childNodes.length > 0) {
    pushItem(type, 'font-size', s.fontSize);
    pushItem(type, 'font-weight', s.fontWeight);
    if (s.lineHeight !== 'normal') pushItem(type, 'line-height', s.lineHeight);
    if (s.letterSpacing !== 'normal' && s.letterSpacing !== '0px') pushItem(type, 'letter-spacing', s.letterSpacing);
    pushItem(type, 'color', s.color);
  }

  const groups = [layout, spacing, style, type].filter(g => g.items.length > 0);

  // Aggregate token paths
  const allTokens = new Set<string>();
  for (const g of groups) for (const it of g.items) for (const t of it.tokens) allTokens.add(t);

  // Responsive
  const responsive = findResponsiveQueries(el);

  // Text fallback (single-line)
  const textParts: string[] = [name, `${w}×${h}px`];
  for (const g of groups) {
    for (const it of g.items) textParts.push(`${it.key}: ${it.value}`);
  }
  if (responsive.length) textParts.push(`responsive: ${responsive.join(' / ')}`);

  return {
    name,
    size: `${w}×${h}px`,
    groups,
    tokens: Array.from(allTokens),
    responsive,
    text: textParts.join(' · '),
  };
}

function collapseBox(t: string, r: string, b: string, l: string): string | undefined {
  const allZero = [t, r, b, l].every(v => v === '0px');
  if (allZero) return undefined;
  if (t === r && r === b && b === l) return t;
  if (t === b && l === r) return `${t} ${r}`;
  return `${t} ${r} ${b} ${l}`;
}
