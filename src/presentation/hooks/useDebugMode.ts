import { useState, useRef, useCallback, useEffect } from 'react';

export function useDebugMode() {
  const [enabled, setEnabled] = useState(false);
  const [info, setInfo] = useState('');
  const [locked, setLocked] = useState(false);
  const selectedRef = useRef<HTMLElement | null>(null);
  const secondRef = useRef<HTMLElement | null>(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measureInfo, setMeasureInfo] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setEnabled(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const getInfo = (el: HTMLElement) => {
      const tag = el.tagName.toLowerCase();
      const cls = el.className?.toString().split(/\s+/).find(c => c.startsWith('sc-')) || '';
      const dataName = (el as any)?.dataset?.debugName || '';

      // Walk up to find UX name from data-ux attribute
      let uxName = '';
      let walk: HTMLElement | null = el;
      while (walk && !uxName) {
        uxName = walk.dataset?.ux || '';
        walk = walk.parentElement;
      }

      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const s = window.getComputedStyle(el);

      const parts: string[] = [];

      // Name
      parts.push(uxName ? `[${uxName}]` : (dataName || `<${tag}${cls ? `.${cls}` : ''}>`));

      // Size
      parts.push(`${w}×${h}px`);

      // Padding (individual sides if different)
      const pt = s.paddingTop, pr = s.paddingRight, pb = s.paddingBottom, pl = s.paddingLeft;
      if (pt !== '0px' || pr !== '0px' || pb !== '0px' || pl !== '0px') {
        if (pt === pr && pr === pb && pb === pl) {
          parts.push(`pad: ${pt}`);
        } else if (pt === pb && pl === pr) {
          parts.push(`pad: ${pt} ${pr}`);
        } else {
          parts.push(`pad: ${pt} ${pr} ${pb} ${pl}`);
        }
      }

      // Margin
      const mt = s.marginTop, mr = s.marginRight, mb = s.marginBottom, ml = s.marginLeft;
      if (mt !== '0px' || mr !== '0px' || mb !== '0px' || ml !== '0px') {
        if (mt === mr && mr === mb && mb === ml) {
          parts.push(`margin: ${mt}`);
        } else if (mt === mb && ml === mr) {
          parts.push(`margin: ${mt} ${mr}`);
        } else {
          const _m = [mt, mr, mb, ml].filter(v => v !== '0px');
          parts.push(`margin: ${mt} ${mr} ${mb} ${ml}`);
        }
      }

      // Gap
      if (s.gap !== 'normal' && s.gap !== '' && s.gap !== '0px') parts.push(`gap: ${s.gap}`);

      // Border radius
      if (s.borderRadius !== '0px' && s.borderRadius !== '') parts.push(`radius: ${s.borderRadius}`);

      // Border
      if (s.borderWidth !== '0px' && s.borderStyle !== 'none') {
        parts.push(`border: ${s.borderWidth} ${s.borderColor}`);
      }

      // Typography
      if (el.childNodes.length > 0 && el.textContent?.trim()) {
        parts.push(`font: ${s.fontSize}/${s.fontWeight}`);
        if (s.lineHeight !== 'normal') parts.push(`lh: ${s.lineHeight}`);
        if (s.letterSpacing !== 'normal' && s.letterSpacing !== '0px') parts.push(`ls: ${s.letterSpacing}`);
        parts.push(`color: ${s.color}`);
      }

      // Background
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') {
        parts.push(`bg: ${s.backgroundColor}`);
      }

      // Display/layout
      if (s.display === 'flex' || s.display === 'grid') {
        parts.push(`display: ${s.display}`);
        if (s.flexDirection && s.flexDirection !== 'row') parts.push(`dir: ${s.flexDirection}`);
        if (s.alignItems && s.alignItems !== 'normal') parts.push(`align: ${s.alignItems}`);
        if (s.justifyContent && s.justifyContent !== 'normal') parts.push(`justify: ${s.justifyContent}`);
      }

      // Overflow
      if (s.overflow !== 'visible' && s.overflow !== '') parts.push(`overflow: ${s.overflow}`);

      // Opacity
      if (s.opacity !== '1') parts.push(`opacity: ${s.opacity}`);

      // Transform
      if (s.transform !== 'none' && s.transform !== '') parts.push(`transform: ${s.transform.slice(0, 40)}`);

      // Distance to siblings
      const prev = el.previousElementSibling as HTMLElement;
      const next = el.nextElementSibling as HTMLElement;
      if (prev) {
        const prevRect = prev.getBoundingClientRect();
        const distTop = Math.round(rect.top - prevRect.bottom);
        if (distTop !== 0) parts.push(`↑ prev: ${distTop}px`);
      }
      if (next) {
        const nextRect = next.getBoundingClientRect();
        const distBottom = Math.round(nextRect.top - rect.bottom);
        if (distBottom !== 0) parts.push(`↓ next: ${distBottom}px`);
      }

      // Distance to parent edges
      const parent = el.parentElement;
      if (parent) {
        const pRect = parent.getBoundingClientRect();
        const toTop = Math.round(rect.top - pRect.top);
        const toLeft = Math.round(rect.left - pRect.left);
        const toRight = Math.round(pRect.right - rect.right);
        const toBottom = Math.round(pRect.bottom - rect.bottom);
        parts.push(`in parent: ↑${toTop} →${toRight} ↓${toBottom} ←${toLeft}`);
      }

      return parts.filter(Boolean).join(' · ');
    };

    const handleMove = (e: MouseEvent) => {
      if (locked) return;
      const el = e.target as HTMLElement;
      if (!el) return;
      setInfo(getInfo(el));
    };

    const handleClick = (e: MouseEvent) => {
      if (!enabled) return;
      const el = e.target as HTMLElement;
      if (!el) return;
      if (el.closest('[data-debug-ui]')) return;
      e.preventDefault();
      e.stopPropagation();

      if (measureMode && selectedRef.current) {
        // Second click — measure distance
        if (secondRef.current) secondRef.current.removeAttribute('data-debug-selected');
        el.setAttribute('data-debug-selected', 'true');
        secondRef.current = el;
        const r1 = selectedRef.current.getBoundingClientRect();
        const r2 = el.getBoundingClientRect();
        const dx = Math.round(r2.left - r1.right);
        const dy = Math.round(r2.top - r1.bottom);
        const dxCenter = Math.round((r2.left + r2.width/2) - (r1.left + r1.width/2));
        const dyCenter = Math.round((r2.top + r2.height/2) - (r1.top + r1.height/2));
        const gapH = Math.round(Math.max(0, r2.left - r1.right, r1.left - r2.right));
        const gapV = Math.round(Math.max(0, r2.top - r1.bottom, r1.top - r2.bottom));
        setMeasureInfo(
          `📏 Gap H: ${gapH}px · Gap V: ${gapV}px · ΔX center: ${dxCenter}px · ΔY center: ${dyCenter}px · Edge→Edge H: ${dx}px · Edge→Edge V: ${dy}px`
        );
        setLocked(true);
        return;
      }

      // First click — select element
      if (selectedRef.current) selectedRef.current.removeAttribute('data-debug-selected');
      if (secondRef.current) { secondRef.current.removeAttribute('data-debug-selected'); secondRef.current = null; }
      el.setAttribute('data-debug-selected', 'true');
      selectedRef.current = el;
      setMeasureInfo('');
      const text = getInfo(el);
      setInfo(text);
      setLocked(true);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [enabled, locked]);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      if (prev) {
        if (selectedRef.current) { selectedRef.current.removeAttribute('data-debug-selected'); selectedRef.current = null; }
        if (secondRef.current) { secondRef.current.removeAttribute('data-debug-selected'); secondRef.current = null; }
        setMeasureMode(false);
        setMeasureInfo('');
      }
      return !prev;
    });
    setLocked(false);
  }, []);
  const unlock = useCallback(() => {
    if (selectedRef.current) { selectedRef.current.removeAttribute('data-debug-selected'); selectedRef.current = null; }
    if (secondRef.current) { secondRef.current.removeAttribute('data-debug-selected'); secondRef.current = null; }
    setLocked(false);
    setMeasureInfo('');
  }, []);
  const copyInfo = useCallback(() => {
    navigator.clipboard.writeText(info);
  }, [info]);
  const toggleMeasure = useCallback(() => {
    setMeasureMode(prev => !prev);
    if (secondRef.current) { secondRef.current.removeAttribute('data-debug-selected'); secondRef.current = null; }
    setMeasureInfo('');
  }, []);
  // Redlines data
  const [redlines, setRedlines] = useState<{
    el: DOMRect; parent: DOMRect | null;
    prevGap: number | null; nextGap: number | null;
    toTop: number; toRight: number; toBottom: number; toLeft: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled) { setRedlines(null); return; }
    const update = (e: MouseEvent) => {
      if (locked) return;
      const el = e.target as HTMLElement;
      if (!el || el.closest('[data-debug-ui]')) return;
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement?.getBoundingClientRect() || null;
      const prev = el.previousElementSibling as HTMLElement;
      const next = el.nextElementSibling as HTMLElement;
      const prevGap = prev ? Math.round(rect.top - prev.getBoundingClientRect().bottom) : null;
      const nextGap = next ? Math.round(next.getBoundingClientRect().top - rect.bottom) : null;
      setRedlines({
        el: rect, parent,
        prevGap, nextGap,
        toTop: parent ? Math.round(rect.top - parent.top) : 0,
        toRight: parent ? Math.round(parent.right - rect.right) : 0,
        toBottom: parent ? Math.round(parent.bottom - rect.bottom) : 0,
        toLeft: parent ? Math.round(rect.left - parent.left) : 0,
      });
    };
    document.addEventListener('mousemove', update);
    return () => document.removeEventListener('mousemove', update);
  }, [enabled, locked]);

  return { enabled, info, toggle, locked, unlock, copyInfo, measureMode, toggleMeasure, measureInfo, redlines };
}
