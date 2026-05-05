import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useDebugMode } from '../../hooks/useDebugMode';

const DebugStyles = createGlobalStyle`
  * {
    outline: 1px solid rgba(255, 0, 0, 0.1) !important;
  }
  *:hover {
    outline: 2px solid rgba(99, 102, 241, 0.5) !important;
  }
  [data-debug-selected="true"] {
    outline: 3px solid rgba(99, 102, 241, 0.95) !important;
    box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.14) !important;
  }
`;

/* ── Inspector panel (locked / structured) ─────────────────────────── */

const InspectorPanel = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  width: 320px;
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(99, 102, 241, 0.10) 0%, rgba(99, 102, 241, 0) 60%),
    rgba(18, 18, 22, 0.78);
  @supports not (backdrop-filter: blur(0)) {
    background: rgba(18, 18, 22, 0.96);
  }
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  color: rgba(255, 255, 255, 0.95);
  font-family: 'SF Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  z-index: 99999;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow:
    0 24px 48px -16px rgba(0, 0, 0, 0.55),
    0 4px 12px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  user-select: text;
  overflow: hidden;
  animation: dbg-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);

  @keyframes dbg-in {
    from { transform: translateY(8px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const InspectorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const InspectorName = styled.div`
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: #c7d2fe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InspectorSize = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
`;

const InspectorScroll = styled.div`
  overflow-y: auto;
  padding: 4px 6px 10px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.10);
    border-radius: 3px;
  }
`;

const InspectorGroup = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  margin: 4px 2px;
`;

const InspectorGroupLabel = styled.div`
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.40);
  margin-bottom: 6px;
`;

const InspectorRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 0;
  line-height: 1.5;
`;

const InspectorKey = styled.span`
  flex-shrink: 0;
  width: 92px;
  color: rgba(255, 255, 255, 0.55);
`;

const InspectorValue = styled.span`
  flex: 1;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.92);
`;

/* Tiny per-row marker. ◆ = on-system (value comes from a theme token);
 * ⨯ = off-system (hardcoded value). Token path lives in the native
 * title tooltip — visible on hover, doesn't clutter the row. */
const TokenMark = styled.span<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  font-size: 8.5px;
  font-weight: 700;
  cursor: help;
  background: ${({ $on }) => $on
    ? 'rgba(129, 140, 248, 0.18)'
    : 'rgba(248, 113, 113, 0.16)'};
  color: ${({ $on }) => $on ? '#c7d2fe' : '#fecaca'};
`;

/* Header-level summary pill. Reads "✓ on-system 12/15" when most
 * values come from tokens, "✗ off-system 3" when several are
 * hardcoded — single glance answer to "does this element follow the
 * design system?". */
const TokenSummary = styled.span<{ $clean: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${({ $clean }) => $clean
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.30), rgba(99, 102, 241, 0.18))'
    : 'linear-gradient(135deg, rgba(248, 113, 113, 0.28), rgba(248, 113, 113, 0.16))'};
  border: 1px solid ${({ $clean }) => $clean ? 'rgba(129, 140, 248, 0.40)' : 'rgba(248, 113, 113, 0.40)'};
  color: ${({ $clean }) => $clean ? '#e0e7ff' : '#fecaca'};
  flex-shrink: 0;
`;

const InspectorBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
`;

const ResponsiveChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(244, 166, 114, 0.30), rgba(244, 166, 114, 0.16));
  border: 1px solid rgba(244, 166, 114, 0.40);
  color: #fed7aa;
  font-size: 10px;
  font-weight: 600;
  font-family: ui-monospace, monospace;

  &::before {
    content: '📱';
    font-size: 10px;
  }
`;

const InspectorActions = styled.div`
  display: flex;
  gap: 6px;
  padding: 8px 10px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const InspectorBtn = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
    border-color: rgba(255, 255, 255, 0.20);
  }
`;

/* ── Hover tooltip (cheap string render, before lock) ──────────────── */

const HoverTooltip = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  background: rgba(18, 18, 22, 0.90);
  color: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  font-family: ui-monospace, monospace;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 99999;
  pointer-events: none;
  max-width: 600px;
  line-height: 1.55;
  backdrop-filter: blur(12px);
  word-break: break-word;
`;

/* ── Top-right state badges ─────────────────────────────────────────── */

const StatusBadge = styled.button<{ $accent?: 'indigo' | 'amber' | 'red' }>`
  position: fixed;
  top: 70px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: ${({ $accent = 'indigo' }) => {
    if ($accent === 'amber') return 'linear-gradient(135deg, rgba(244, 166, 114, 0.30), rgba(244, 166, 114, 0.18))';
    if ($accent === 'red') return 'linear-gradient(135deg, rgba(239, 68, 68, 0.36), rgba(239, 68, 68, 0.20))';
    return 'linear-gradient(135deg, rgba(99, 102, 241, 0.32), rgba(99, 102, 241, 0.18))';
  }};
  color: #fff;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-family: ui-monospace, monospace;
  cursor: pointer;
  z-index: 99999;
  backdrop-filter: blur(12px);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.5);
  }
`;

/* ── Redlines (unchanged contract; restyled colours) ───────────────── */

const RedlinesOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99998;
`;

const RedlineV = styled.div<{ $color?: string }>`
  position: absolute;
  width: 1px;
  background: ${({ $color }) => $color || '#6366F1'};
  opacity: 0.85;

  &::before, &::after {
    content: '';
    position: absolute;
    left: -3px;
    width: 7px;
    height: 1px;
    background: ${({ $color }) => $color || '#6366F1'};
  }
  &::before { top: 0; }
  &::after { bottom: 0; }
`;

const RedlineH = styled.div<{ $color?: string }>`
  position: absolute;
  height: 1px;
  background: ${({ $color }) => $color || '#6366F1'};
  opacity: 0.85;

  &::before, &::after {
    content: '';
    position: absolute;
    top: -3px;
    height: 7px;
    width: 1px;
    background: ${({ $color }) => $color || '#6366F1'};
  }
  &::before { left: 0; }
  &::after { right: 0; }
`;

const RedlineLabel = styled.span<{ $color?: string }>`
  position: absolute;
  left: 6px;
  background: ${({ $color }) => $color || '#6366F1'};
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  font-family: ui-monospace, monospace;
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
  line-height: 14px;
`;

export const DebugOverlay: React.FC = () => {
  const debug = useDebugMode();
  const isEmbed = typeof window !== 'undefined' && window.location.pathname.startsWith('/embed');

  if (isEmbed) return null;
  if (!debug.enabled) return null;

  return (
    <>
      <DebugStyles />
      <StatusBadge data-debug-ui onClick={debug.toggle} $accent="red">
        DEBUG · ON
      </StatusBadge>
      <StatusBadge
        data-debug-ui
        onClick={debug.toggleMeasure}
        $accent={debug.measureMode ? 'indigo' : 'amber'}
        style={{ top: 100 }}
      >
        {debug.measureMode ? 'MEASURE · ON' : 'MEASURE'}
      </StatusBadge>

      {/* Locked = structured panel; hover = compact tooltip. */}
      {debug.locked && debug.details ? (() => {
        const allItems = debug.details.groups.flatMap(g => g.items);
        const totalProps = allItems.length;
        const tokenisedProps = allItems.filter(it => it.tokens.length > 0).length;
        const offSystemProps = totalProps - tokenisedProps;
        const isClean = offSystemProps === 0 && totalProps > 0;
        return (
        <InspectorPanel data-debug-ui>
          <InspectorHeader>
            <InspectorName>{debug.details.name}</InspectorName>
            <InspectorSize>{debug.details.size}</InspectorSize>
          </InspectorHeader>

          {/* Top-of-panel summary — single glance answer to "is this
              element on-system?". Hover the marker on each row below
              for the actual token path. */}
          {totalProps > 0 && (
            <InspectorBadgeRow>
              <TokenSummary
                $clean={isClean}
                title={isClean
                  ? 'Every styled prop on this element comes from a theme token.'
                  : `${offSystemProps} prop${offSystemProps === 1 ? '' : 's'} use raw values instead of tokens.`}
              >
                {isClean ? '✓ on-system' : '✗ off-system'} {tokenisedProps}/{totalProps}
              </TokenSummary>
              {debug.details.responsive.map(q => (
                <ResponsiveChip key={q} title={`Element matched by @media ${q}`}>{q}</ResponsiveChip>
              ))}
            </InspectorBadgeRow>
          )}

          <InspectorScroll>
            {debug.details.groups.map(g => (
              <InspectorGroup key={g.label}>
                <InspectorGroupLabel>{g.label}</InspectorGroupLabel>
                {g.items.map((it, i) => (
                  <InspectorRow key={`${it.key}-${i}`}>
                    <InspectorKey>{it.key}</InspectorKey>
                    <InspectorValue>
                      {it.value}
                      <TokenMark
                        $on={it.tokens.length > 0}
                        title={it.tokens.length > 0
                          ? `Token: ${it.tokens.join(' · ')}`
                          : 'Off-system — raw value, not in theme tokens'}
                      >
                        {it.tokens.length > 0 ? '◆' : '⨯'}
                      </TokenMark>
                    </InspectorValue>
                  </InspectorRow>
                ))}
              </InspectorGroup>
            ))}

            {debug.measureInfo && (
              <InspectorGroup>
                <InspectorGroupLabel>Measure</InspectorGroupLabel>
                <InspectorRow>
                  <InspectorValue style={{ color: '#86efac' }}>{debug.measureInfo}</InspectorValue>
                </InspectorRow>
              </InspectorGroup>
            )}
          </InspectorScroll>

          <InspectorActions>
            <InspectorBtn data-debug-ui onClick={debug.copyInfo}>Copy</InspectorBtn>
            <InspectorBtn data-debug-ui onClick={debug.unlock}>Close</InspectorBtn>
          </InspectorActions>
        </InspectorPanel>
        );
      })() : (
        debug.info && <HoverTooltip data-debug-ui>{debug.info}</HoverTooltip>
      )}

      {debug.redlines && debug.redlines.parent && (
        <RedlinesOverlay data-debug-ui>
          {debug.redlines.toTop > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.parent.top, height: debug.redlines.toTop }}>
              <RedlineLabel style={{ top: debug.redlines.toTop / 2 - 8 }}>{debug.redlines.toTop}</RedlineLabel>
            </RedlineV>
          )}
          {debug.redlines.toBottom > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.bottom, height: debug.redlines.toBottom }}>
              <RedlineLabel style={{ top: debug.redlines.toBottom / 2 - 8 }}>{debug.redlines.toBottom}</RedlineLabel>
            </RedlineV>
          )}
          {debug.redlines.toLeft > 0 && (
            <RedlineH style={{ top: debug.redlines.el.top + debug.redlines.el.height / 2 - 0.5, left: debug.redlines.parent.left, width: debug.redlines.toLeft }}>
              <RedlineLabel style={{ left: debug.redlines.toLeft / 2 - 12 }}>{debug.redlines.toLeft}</RedlineLabel>
            </RedlineH>
          )}
          {debug.redlines.toRight > 0 && (
            <RedlineH style={{ top: debug.redlines.el.top + debug.redlines.el.height / 2 - 0.5, left: debug.redlines.el.right, width: debug.redlines.toRight }}>
              <RedlineLabel style={{ left: debug.redlines.toRight / 2 - 12 }}>{debug.redlines.toRight}</RedlineLabel>
            </RedlineH>
          )}
          {debug.redlines.prevGap !== null && debug.redlines.prevGap > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.top - debug.redlines.prevGap, height: debug.redlines.prevGap }} $color="#F4A672">
              <RedlineLabel $color="#F4A672" style={{ top: debug.redlines.prevGap / 2 - 8 }}>↑{debug.redlines.prevGap}</RedlineLabel>
            </RedlineV>
          )}
          {debug.redlines.nextGap !== null && debug.redlines.nextGap > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.bottom, height: debug.redlines.nextGap }} $color="#F4A672">
              <RedlineLabel $color="#F4A672" style={{ top: debug.redlines.nextGap / 2 - 8 }}>↓{debug.redlines.nextGap}</RedlineLabel>
            </RedlineV>
          )}
        </RedlinesOverlay>
      )}
    </>
  );
};
