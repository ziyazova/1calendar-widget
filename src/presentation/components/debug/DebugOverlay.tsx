import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useDebugMode } from '../../hooks/useDebugMode';

const DebugStyles = createGlobalStyle`
  * {
    outline: 1px solid rgba(255, 0, 0, 0.1) !important;
  }
  *:hover {
    outline: 2px solid rgba(0, 120, 255, 0.4) !important;
  }
  [data-debug-selected="true"] {
    outline: 3px solid rgba(0, 120, 255, 0.9) !important;
    box-shadow: 0 0 0 6px rgba(0, 120, 255, 0.12) !important;
  }
`;

const DebugTooltip = styled.div<{ $locked?: boolean }>`
  position: fixed;
  bottom: 16px;
  left: 16px;
  background: ${({ $locked }) => $locked ? 'rgba(0, 80, 255, 0.92)' : 'rgba(0, 0, 0, 0.88)'};
  color: #fff;
  font-size: 11px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  padding: 10px 14px;
  border-radius: 10px;
  z-index: 99999;
  pointer-events: ${({ $locked }) => $locked ? 'auto' : 'none'};
  max-width: 600px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.7;
  backdrop-filter: blur(12px);
  user-select: text;
  cursor: ${({ $locked }) => $locked ? 'text' : 'default'};
  word-break: break-all;

  span {
    display: block;
  }
`;

const DebugCopyBtn = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'SF Mono', monospace;
  flex-shrink: 0;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const DebugUnlockBtn = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'SF Mono', monospace;
  flex-shrink: 0;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const DebugBadge = styled.button`
  position: fixed;
  top: 70px;
  right: 16px;
  background: #FF3B30;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  z-index: 99999;
  font-family: 'SF Mono', monospace;
  cursor: pointer;
  &:hover { background: #cc2a22; }
`;

const DebugToggle = styled.button<{ $on: boolean }>`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: ${({ $on }) => $on ? '#FF3B30' : 'rgba(0,0,0,0.06)'};
  color: ${({ $on }) => $on ? '#fff' : '#999'};
  font-size: 18px;
  cursor: pointer;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover { background: ${({ $on }) => $on ? '#cc2a22' : 'rgba(0,0,0,0.1)'}; }
`;

const RedlinesOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99998;
`;

const RedlineV = styled.div<{ $color?: string }>`
  position: absolute;
  width: 1px;
  background: ${({ $color }) => $color || '#FF3B30'};
  opacity: 0.8;

  &::before, &::after {
    content: '';
    position: absolute;
    left: -3px;
    width: 7px;
    height: 1px;
    background: ${({ $color }) => $color || '#FF3B30'};
  }
  &::before { top: 0; }
  &::after { bottom: 0; }
`;

const RedlineH = styled.div<{ $color?: string }>`
  position: absolute;
  height: 1px;
  background: ${({ $color }) => $color || '#FF3B30'};
  opacity: 0.8;

  &::before, &::after {
    content: '';
    position: absolute;
    top: -3px;
    height: 7px;
    width: 1px;
    background: ${({ $color }) => $color || '#FF3B30'};
  }
  &::before { left: 0; }
  &::after { right: 0; }
`;

const RedlineLabel = styled.span<{ $color?: string }>`
  position: absolute;
  left: 6px;
  background: ${({ $color }) => $color || '#FF3B30'};
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  font-family: 'SF Mono', monospace;
  padding: 1px 4px;
  border-radius: 3px;
  white-space: nowrap;
  line-height: 14px;
`;

export const DebugOverlay: React.FC = () => {
  const debug = useDebugMode();

  return (
    <>
      {debug.enabled && <DebugStyles />}
      {debug.enabled && <DebugBadge data-debug-ui onClick={debug.toggle}>DEBUG ON</DebugBadge>}
      {debug.enabled && (
        <DebugBadge data-debug-ui onClick={debug.toggleMeasure} style={{ top: 100, background: debug.measureMode ? '#3B82F6' : '#666' }}>
          {debug.measureMode ? 'MEASURE ON' : 'MEASURE'}
        </DebugBadge>
      )}
      {debug.enabled && debug.info && (
        <DebugTooltip $locked={debug.locked} data-debug-ui>
          <span>{debug.info.split(' · ').map((part, i) => {
            let color = '#e2e8f0';
            if (part.startsWith('[')) color = '#7dd3fc';
            else if (part.includes('×')) color = '#a78bfa';
            else if (part.startsWith('pad') || part.startsWith('margin') || part.startsWith('gap') || part.startsWith('in parent') || part.startsWith('↑') || part.startsWith('↓')) color = '#86efac';
            else if (part.startsWith('radius') || part.startsWith('border')) color = '#fca5a5';
            else if (part.startsWith('font') || part.startsWith('lh') || part.startsWith('ls') || part.startsWith('color')) color = '#fde68a';
            else if (part.startsWith('bg')) color = '#c4b5fd';
            else if (part.startsWith('display') || part.startsWith('dir') || part.startsWith('align') || part.startsWith('justify') || part.startsWith('overflow')) color = '#93c5fd';
            return <span key={i} style={{ color }}>{part}{i < debug.info.split(' · ').length - 1 ? ' · ' : ''}</span>;
          })}</span>
          {debug.measureInfo && (
            <span style={{ display: 'block', marginTop: 6, padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.15)', color: '#86efac' }}>
              {debug.measureInfo}
            </span>
          )}
          {debug.locked && (
            <span style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <DebugCopyBtn data-debug-ui onClick={debug.copyInfo}>Copy</DebugCopyBtn>
              <DebugUnlockBtn data-debug-ui onClick={debug.unlock}>{'\u2715'}</DebugUnlockBtn>
            </span>
          )}
        </DebugTooltip>
      )}
      {debug.enabled && debug.redlines && debug.redlines.parent && (
        <RedlinesOverlay data-debug-ui>
          {/* Top distance */}
          {debug.redlines.toTop > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.parent.top, height: debug.redlines.toTop }}>
              <RedlineLabel style={{ top: debug.redlines.toTop / 2 - 8 }}>{debug.redlines.toTop}</RedlineLabel>
            </RedlineV>
          )}
          {/* Bottom distance */}
          {debug.redlines.toBottom > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.bottom, height: debug.redlines.toBottom }}>
              <RedlineLabel style={{ top: debug.redlines.toBottom / 2 - 8 }}>{debug.redlines.toBottom}</RedlineLabel>
            </RedlineV>
          )}
          {/* Left distance */}
          {debug.redlines.toLeft > 0 && (
            <RedlineH style={{ top: debug.redlines.el.top + debug.redlines.el.height / 2 - 0.5, left: debug.redlines.parent.left, width: debug.redlines.toLeft }}>
              <RedlineLabel style={{ left: debug.redlines.toLeft / 2 - 12 }}>{debug.redlines.toLeft}</RedlineLabel>
            </RedlineH>
          )}
          {/* Right distance */}
          {debug.redlines.toRight > 0 && (
            <RedlineH style={{ top: debug.redlines.el.top + debug.redlines.el.height / 2 - 0.5, left: debug.redlines.el.right, width: debug.redlines.toRight }}>
              <RedlineLabel style={{ left: debug.redlines.toRight / 2 - 12 }}>{debug.redlines.toRight}</RedlineLabel>
            </RedlineH>
          )}
          {/* Prev sibling gap */}
          {debug.redlines.prevGap !== null && debug.redlines.prevGap > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.top - debug.redlines.prevGap, height: debug.redlines.prevGap }} $color="#F59E0B">
              <RedlineLabel $color="#F59E0B" style={{ top: debug.redlines.prevGap / 2 - 8 }}>↑{debug.redlines.prevGap}</RedlineLabel>
            </RedlineV>
          )}
          {/* Next sibling gap */}
          {debug.redlines.nextGap !== null && debug.redlines.nextGap > 0 && (
            <RedlineV style={{ left: debug.redlines.el.left + debug.redlines.el.width / 2 - 0.5, top: debug.redlines.el.bottom, height: debug.redlines.nextGap }} $color="#F59E0B">
              <RedlineLabel $color="#F59E0B" style={{ top: debug.redlines.nextGap / 2 - 8 }}>↓{debug.redlines.nextGap}</RedlineLabel>
            </RedlineV>
          )}
        </RedlinesOverlay>
      )}
      <DebugToggle $on={debug.enabled} onClick={debug.toggle} data-debug-ui>{'\u2699'}</DebugToggle>
    </>
  );
};
