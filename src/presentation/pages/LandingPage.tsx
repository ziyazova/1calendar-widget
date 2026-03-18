import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { ArrowRight, Calendar, Clock, Image, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

/* ── Debug Mode ── */
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

function useDebugMode() {
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
          const m = [mt, mr, mb, ml].filter(v => v !== '0px');
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
  return { enabled, info, toggle, locked, unlock, copyInfo, measureMode, toggleMeasure, measureInfo };
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div<{ $transitioning?: boolean }>`
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
`;

const PageContent = styled.div<{ $transitioning?: boolean }>`
  opacity: ${({ $transitioning }) => $transitioning ? 0 : 1};
  transition: opacity 0.4s ease;
`;

/* Nav is now TopNav component */

/* ── Rotating text ── */
const RotatingLine = styled.span<{ $width: number }>`
  display: inline-block;
  vertical-align: bottom;
  position: relative;
  width: ${({ $width }) => $width}px;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const RotatingWordWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 100%;
`;

const MorphBlob = styled.span<{ $bg: string; $radius: string }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1.1em;
  left: -0.25em;
  right: -0.25em;
  background-color: ${({ $bg }) => $bg};
  border-radius: ${({ $radius }) => $radius};
  transition: background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              border-radius 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
`;

const RotatingText = styled.span<{ $state: 'in' | 'out' | 'idle'; $color: string }>`
  display: inline-flex;
  align-items: center;
  color: ${({ $color }) => $color};
  position: relative;
  z-index: 1;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              filter 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: ${({ $state }) => $state === 'out' ? 0 : 1};
  transform: ${({ $state }) => $state === 'out' ? 'scale(0.92)' : 'scale(1)'};
  filter: ${({ $state }) => $state === 'out' ? 'blur(2px)' : 'blur(0)'};
  white-space: nowrap;
`;

/* Hidden span to measure text width */
const MeasureSpan = styled.span`
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  pointer-events: none;
`;

const ROTATING_WORDS = [
  { text: 'better', bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', radius: '14px' },
  { text: 'smarter', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', radius: '50px' },
  { text: 'faster', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', radius: '8px' },
  { text: 'easier', bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', radius: '50px' },
];

const useRotatingWord = () => {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [state, setState] = useState<'in' | 'out' | 'idle'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % ROTATING_WORDS.length;
      setNextIndex(next);
      setState('out');
      setTimeout(() => {
        setIndex(next);
        setState('in');
      }, 250);
    }, 2000);
    return () => clearInterval(interval);
  }, [index]);

  return { word: ROTATING_WORDS[index], nextWord: ROTATING_WORDS[nextIndex], state };
};

/* ── Hero ── */
const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 48px 88px;
  text-align: center;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: rgba(51, 132, 244, 0.06);
  color: #3384F4;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 28px;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 600;
  color: #1F1F1F;
  line-height: 1.2;
  letter-spacing: -0.035em;
  margin: 0 0 24px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 auto 40px;
  max-width: 480px;
  letter-spacing: -0.01em;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: #1F1F1F;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: #3384F4;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(51, 132, 244, 0.2);
  }

  svg { width: 16px; height: 16px; }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  background: #F5F5F5;
  color: #1F1F1F;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: #EBEBEB;
    transform: translateY(-2px);
  }
`;

/* ── Templates Gallery (horizontal marquee) ── */
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TemplatesGallery = styled.section`
  padding: 40px 0 80px;
  background: #ffffff;
  position: relative;
`;

const TemplatesMarqueeWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;

  &[data-scrolled="false"] {
    mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 0%, black 88%, transparent 100%);
  }

  &[data-scrolled="true"] {
    mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  }

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TemplatesGalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TemplatesGalleryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
`;

const TemplatesGalleryLink = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #9A9A9A;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1F1F1F;
  }
`;

const TemplateMarqueeTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 28px;
  padding: 10px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TemplatesScrollHint = styled.div`
  position: absolute;
  right: 106px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: all 0.2s;

  svg {
    width: 14px;
    height: 14px;
    color: #1F1F1F;
  }

  &:hover {
    background: #333;
    transform: translateY(-50%);
  }
`;

const TemplateCardWrap = styled.div`
  flex-shrink: 0;
  cursor: pointer;
`;

const TemplateCard = styled.div`
  width: 252px;
  height: 200px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  ${TemplateCardWrap}:hover & img {
    transform: scale(1.15);
  }
`;

const TemplateCardPreview = styled.div<{ $gradient: string }>`
  height: 160px;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PreviewLine = styled.div<{ $width?: string; $dark?: boolean }>`
  height: 6px;
  border-radius: 3px;
  width: ${({ $width }) => $width || '100%'};
  background: ${({ $dark }) => $dark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'};
`;

const PreviewBlock = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const PreviewSquare = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: rgba(0,0,0,0.04);
`;

const TemplateCardMeta = styled.div`
  padding: 10px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TemplateCardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  letter-spacing: -0.01em;
`;

const TemplateCardPrice = styled.span<{ $free?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $free }) => $free ? '#22C55E' : '#9A9A9A'};
`;

const TemplateCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.08);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const TemplateCardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 14px 10px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TemplateCard}:hover & {
    opacity: 1;
  }
`;

const TemplateCardTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
`;

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Education: { bg: 'rgba(99, 102, 241, 0.07)', color: '#8B8FC7' },
  Productivity: { bg: 'rgba(245, 158, 11, 0.07)', color: '#C4A46A' },
  Personal: { bg: 'rgba(236, 72, 153, 0.07)', color: '#C48DA5' },
  Premium: { bg: 'rgba(139, 92, 246, 0.07)', color: '#9B8BBF' },
  Work: { bg: 'rgba(59, 130, 246, 0.07)', color: '#8AABC7' },
  Finance: { bg: 'rgba(16, 185, 129, 0.07)', color: '#7BB5A0' },
  Free: { bg: 'rgba(34, 197, 94, 0.07)', color: '#7BB58E' },
  Popular: { bg: 'rgba(245, 158, 11, 0.07)', color: '#C4A46A' },
};

const TemplateCardTag = styled.span<{ $bg?: string; $color?: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: ${({ $bg }) => $bg || 'rgba(0, 0, 0, 0.05)'};
  color: ${({ $color }) => $color || '#888'};
`;

const TEMPLATE_ROW_1 = [
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tag: 'Education' },
  { image: '/template-main.png', title: 'Habit Tracker', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Weekly Planner', price: 'Free', tag: 'Productivity' },
  { image: '/template-main.png', title: 'Journal', price: 'Free', tag: 'Personal' },
];

const TEMPLATE_ROW_2 = [
  { image: '/template-assignments.png', title: 'Life OS', tags: ['Premium', '$7.99'] },
  { image: '/template-main.png', title: 'Project Roadmap', tags: ['Work', '$1.99'] },
  { image: '/template-assignments.png', title: 'Book Tracker', tags: ['Personal', '$2.99'] },
  { image: '/template-main.png', title: 'Budget Tracker', tags: ['Finance', 'Free'] },
];

const TrustLine = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #ABABAB;
  letter-spacing: -0.01em;
  margin: 24px 0 0;
`;

/* ── Widgets Section ── */
const WidgetsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 60px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const WidgetGrid = styled.div`
  display: flex;
  gap: 20px;
`;

const WidgetCardWrap = styled.div`
  cursor: pointer;
  flex: 1;
`;

const WidgetCardBox = styled.div`
  width: 100%;
  height: 207px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${WidgetCardWrap}:hover & img {
    transform: scale(1.15);
  }
`;

const WidgetCardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.05);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const WIDGET_DATA = [
  { image: '/widget-calendar.png', title: 'Calendar' },
  { image: '/widget-clock2.png', title: 'Clock' },
  { image: '/widget-calendar2.png', title: 'Classic Calendar' },
];

/* ── Bestsellers ── */
const Bestsellers = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const BestsellersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const BestsellersHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BestsellersTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0;
`;

const BestsellersSubtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #9A9A9A;
  margin: 0;
`;

const BrowseAllButton = styled.button`
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1F1F1F;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: #333;
  }
`;

const BestsellerGrid = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const BestsellerCard = styled.div`
  cursor: pointer;
  width: calc((100% - 60px) / 4);
  min-width: 220px;
  flex-shrink: 0;
  scroll-snap-align: start;
`;

const BestsellerImageWrap = styled.div`
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: scale(1.02);
  }
`;

const BestsellerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  display: block;
  transform: scale(1.15);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${BestsellerCard}:hover & {
    transform: scale(1.18);
  }
`;

const BestsellerMeta = styled.div`
  padding: 12px 4px 0;
`;

const BestsellerTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
`;

const BestsellerInfo = styled.div`
  font-size: 13px;
  color: #9A9A9A;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BestsellerTag = TemplateCardTag;

const BESTSELLER_DATA = [
  { image: '/template-main.png', title: 'Life OS Template', price: '$7.99', tags: ['Premium', 'Popular'] },
  { image: '/template-assignments.png', title: 'Weekly Planner', price: 'Free', tags: ['Productivity'] },
  { image: '/template-main.png', title: 'Student Planner', price: '$3.99', tags: ['Education'] },
  { image: '/template-assignments.png', title: 'Budget Tracker', price: 'Free', tags: ['Finance'] },
];

/* ── Widget Studio Block ── */
const StudioBlock = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 80px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const StudioCard = styled.div`
  border-radius: 28px;
  padding: 64px 48px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
    #F8F8F7;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.04);
    border-color: rgba(51, 132, 244, 0.08);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
`;

const StudioIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
`;

const StudioIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  svg { width: 22px; height: 22px; color: #6B6B6B; }
`;

const StudioTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 10px;
`;

const StudioDesc = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 auto 28px;
  letter-spacing: -0.01em;
  max-width: 380px;
`;

/* ── (old Showcase kept for compat) ── */
const _Showcase = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const ShowcaseCard = styled.div`
  background: #F8F8F7;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 32px;
    min-height: 280px;
  }
`;

const ShowcasePlaceholder = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  opacity: 0.4;

  svg { width: 48px; height: 48px; color: #9A9A9A; }
`;

/* ── Products ── */
const Products = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 120px;

  @media (max-width: 768px) {
    padding: 0 24px 80px;
  }
`;

const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 600;
  color: #ABABAB;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0 0 32px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: #F8F8F7;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 32px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
    border-color: rgba(51, 132, 244, 0.12);
  }
`;

const ProductIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(51, 132, 244, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg { width: 20px; height: 20px; color: #3384F4; }
`;

const ProductTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
`;

const ProductDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.6;
  margin: 0 0 20px;
  letter-spacing: -0.01em;
`;

const ProductLink = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #3384F4;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  letter-spacing: -0.01em;

  svg { width: 14px; height: 14px; }
`;

/* ── Features ── */
const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const FeatureItem = styled.div``;

const FeatureLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1F1F1F;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
`;

const FeatureDesc = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.5;
  margin: 0;
  letter-spacing: -0.01em;
`;

/* ── Feature Cards (stacked) ── */
const FeatureCardsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 40px;

  @media (max-width: 768px) {
    padding: 0 24px 60px;
  }
`;

const FeatureStack = styled.div`
  position: relative;
  height: 810px;
`;

const FeatureCard = styled.div<{ $active: boolean; $index: number; $total: number; $activeIdx: number }>`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0
      ? '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.03)'
      : '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03)';
  }};
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  height: 644px;
  z-index: ${({ $index, $activeIdx, $total }) => {
    // circular distance behind active
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? $total + 1 : $total - behind;
  }};
  top: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    const base = ($total - 1) * 52;
    return `${base - behind * 52}px`;
  }};
  transform: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    if (behind === 0) return 'scale(1)';
    const scaleVal = 1 - behind * 0.04;
    return `scale(${scaleVal})`;
  }};
  margin-left: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  margin-right: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return `${behind * 20}px`;
  }};
  opacity: ${({ $index, $activeIdx, $total }) => {
    const behind = ($index - $activeIdx + $total) % $total;
    return behind === 0 ? 1 : 1 - behind * 0.06;
  }};
  transition: top 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1), margin 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;

  &:hover {
    opacity: 1;
    box-shadow: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      return behind === 0 ? '0 20px 56px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.06)' : '0 16px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04)';
    }};
    top: ${({ $index, $activeIdx, $total }) => {
      const behind = ($index - $activeIdx + $total) % $total;
      const base = ($total - 1) * 52;
      if (behind === 0) return `${base}px`;
      return `${base - behind * 52 - 14}px`;
    }};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 28px;
    gap: 24px;
    height: auto;
  }
`;

const FeatureCardTab = styled.div<{ $color: string; $intensity?: number }>`
  padding: 10px 16px;
  background: ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.4})`;
  }};
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border-bottom: 1px solid ${({ $color, $intensity = 0.05 }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${$intensity * 0.3})`;
  }};
  border-radius: 24px 24px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #CDCDCD;
`;

const FeatureTabIcon = styled.span`
  font-size: 16px;
`;

const FeatureTabTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #555;
  letter-spacing: -0.01em;
`;

const FeatureTabActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #aaa;
  font-size: 14px;
`;

const FeatureCardBody = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 28px 40px 0;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px 28px;
    gap: 24px;
  }
`;

const FeatureCardText = styled.div`
  flex: 0 0 40%;
`;

const FeatureCardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #111;
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.3;
`;

const FeatureCardDesc = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
`;

const FeatureCardImage = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  margin: 28px 40px 40px 20px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transform: scale(1.1);
  }
`;

const FEATURE_CARDS = [
  {
    tab: 'Design',
    icon: '🎨',
    color: '#F59E0B',
    title: 'Pixel-perfect design',
    desc: 'Every widget is crafted with Apple-level attention to detail. Clean typography, balanced spacing, and premium color palettes.',
    image: '/widget-calendar.png',
  },
  {
    tab: 'Embed',
    icon: '🔗',
    color: '#3B82F6',
    title: 'One-click embed',
    desc: 'Copy the URL, paste into Notion. No accounts, no databases, no tracking. Everything is encoded in the URL.',
    image: '/template-main.png',
  },
  {
    tab: 'Themes',
    icon: '🌙',
    color: '#8B5CF6',
    title: 'Dark mode that just works',
    desc: 'Auto theme detection means your widgets adapt to Notion\'s light and dark mode seamlessly. No manual switching.',
    image: '/widget-clock2.png',
  },
  {
    tab: 'Pricing',
    icon: '✨',
    color: '#10B981',
    title: 'Free forever',
    desc: 'All widgets are completely free. No sign-up, no premium tier, no limits. Just beautiful tools for your workspace.',
    image: '/widget-calendar2.png',
  },
];

/* ── Categories Marquee ── */
const CategoriesSection = styled.section`
  padding: 0 0 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoriesTrack = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  gap: 12px;
  width: max-content;
  animation: ${scrollLeft} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};

  &:hover {
    animation-play-state: paused;
  }
`;

const CategoryChip = styled.div<{ $color: string }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  background: ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.04)`;
  }};
  border: 1px solid ${({ $color }) => {
    const hex = $color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.06)`;
  }};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ease;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }

  &:hover {
    background: ${({ $color }) => {
      const hex = $color.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.08)`;
    }};
    transform: scale(1.04);
    color: #444;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const CategoriesWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const CATEGORY_CHIPS_ROW1 = [
  { label: 'Planners', color: '#F59E0B' },
  { label: 'Dashboards', color: '#3B82F6' },
  { label: 'Trackers', color: '#8B5CF6' },
  { label: 'Journals', color: '#EC4899' },
  { label: 'Finance', color: '#10B981' },
  { label: 'Productivity', color: '#6366F1' },
  { label: 'Health & Wellness', color: '#F97316' },
  { label: 'Goals', color: '#14B8A6' },
  { label: 'Widget Studio', color: '#3B82F6' },
];

const CATEGORY_CHIPS_ROW2 = [
  { label: 'Weekly Planner', color: '#F59E0B' },
  { label: 'Life OS', color: '#A855F7' },
  { label: 'Budget Tracker', color: '#22C55E' },
  { label: 'Habit Tracker', color: '#3B82F6' },
  { label: 'Mood Journal', color: '#F43F5E' },
  { label: 'Student Planner', color: '#8B5CF6' },
  { label: 'Project Roadmap', color: '#06B6D4' },
  { label: 'Reading List', color: '#6366F1' },
  { label: 'Meal Planner', color: '#10B981' },
];

/* ── Testimonials (dark marquee) ── */
const scrollUp = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const TestimonialsSection = styled.section`
  background: #F0F0F0;
  padding: 80px 0;
  overflow: hidden;
  position: relative;


  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const TestimonialsTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #6E3FF3, #3B82F6, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0 0 48px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
    margin: 0 0 36px;
    padding: 0 24px;
  }
`;

const TestimonialsSubtitle = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  text-align: center;
  margin: -32px 0 48px;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    margin: -20px 0 36px;
    padding: 0 24px;
  }
`;

const MarqueeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }
`;

const MarqueeColumn = styled.div`
  overflow: hidden;
  height: 600px;
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: 768px) {
    height: 500px;
  }
`;

const MarqueeInner = styled.div<{ $duration: number; $reverse?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${scrollUp} ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => $reverse ? 'reverse' : 'normal'};

  &:hover {
    animation-play-state: paused;
  }
`;

const TestimonialCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  flex-shrink: 0;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TestimonialAvatar = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
`;

const TestimonialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TestimonialName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const TestimonialRole = styled.span`
  font-size: 12px;
  color: #9A9A9A;
  letter-spacing: -0.01em;

  strong {
    color: #9A9A9A;
    font-weight: 500;
  }
`;

const TestimonialText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
`;

/* ── CTA ── */
const CTASection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 48px 100px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 24px 80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
`;

const CTASubtitle = styled.p`
  font-size: 16px;
  color: #9A9A9A;
  margin: 0 0 32px;
  letter-spacing: -0.01em;
`;

/* ── Footer ── */
const Footer = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 24px;
    flex-direction: column;
    gap: 12px;
  }
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #ABABAB;
  letter-spacing: -0.01em;
`;

/* ── Testimonials data ── */
const testimonials = {
  col1: [
    { name: 'Anna Kovacs', initials: 'AK', role: 'Product Designer', company: 'Figma', color: '#6366F1', text: 'Finally a widget tool that doesn\'t look like it\'s from 2015. The calendar fits perfectly into my Notion setup — clean, minimal, and actually aesthetic.' },
    { name: 'James Chen', initials: 'JC', role: 'Engineering Lead', company: 'Vercel', color: '#3B82F6', text: 'We embed Peachy calendars across all our team dashboards in Notion. The dark mode support is flawless and it just works.' },
    { name: 'Sofia Martinez', initials: 'SM', role: 'Content Creator', company: 'YouTube', color: '#EC4899', text: 'I use the clock widget in my streaming setup and the calendar in my content planner. Both look premium and load instantly.' },
    { name: 'David Park', initials: 'DP', role: 'Founder', company: 'IndieHacker', color: '#10B981', text: 'Replaced three different widget tools with Peachy. One studio for everything — calendars, clocks, all customizable. And it\'s free?' },
    { name: 'Lena Fischer', initials: 'LF', role: 'UX Researcher', company: 'Spotify', color: '#F59E0B', text: 'The attention to typography and spacing is rare for a free tool. You can tell someone who cares about design built this.' },
  ],
  col2: [
    { name: 'Marcus Thompson', initials: 'MT', role: 'Startup Founder', company: 'Arc', color: '#8B5CF6', text: 'The Life OS template saved me an entire weekend of setup. Combined with Peachy widgets, my Notion workspace finally feels complete.' },
    { name: 'Yuki Tanaka', initials: 'YT', role: 'Project Manager', company: 'Linear', color: '#06B6D4', text: 'Our whole team switched to Peachy calendars in Notion. The embed URL system is brilliant — just paste and it works. No auth, no fuss.' },
    { name: 'Rachel Kim', initials: 'RK', role: 'Freelance Designer', company: 'Dribbble', color: '#F43F5E', text: 'I\'ve tried every Notion widget out there. Peachy is the only one that matches the quality of my workspace design. Highly recommend.' },
    { name: 'Alex Rivera', initials: 'AR', role: 'Student', company: 'MIT', color: '#14B8A6', text: 'The student planner template + calendar widget combo is perfect. I can see my whole semester at a glance right in Notion.' },
    { name: 'Emma Wilson', initials: 'EW', role: 'Marketing Lead', company: 'Stripe', color: '#A855F7', text: 'Clean design, instant setup, zero maintenance. Exactly what our marketing team needed for our Notion dashboards.' },
  ],
  col3: [
    { name: 'Oliver Brown', initials: 'OB', role: 'Developer', company: 'GitHub', color: '#EF4444', text: 'As a dev, I appreciate that everything is URL-encoded — no accounts, no databases, no tracking. Pure client-side. Respect.' },
    { name: 'Nina Patel', initials: 'NP', role: 'Operations Manager', company: 'Notion', color: '#0EA5E9', text: 'We actually use Peachy widgets internally. The auto theme detection means they look great in both light and dark mode automatically.' },
    { name: 'Tom Anderson', initials: 'TA', role: 'Creative Director', company: 'Pentagram', color: '#D946EF', text: 'The design language is Apple-level clean. Border radius, typography, color palette — everything is considered. Beautiful work.' },
    { name: 'Lisa Chang', initials: 'LC', role: 'Productivity Coach', company: 'Skillshare', color: '#F97316', text: 'I recommend Peachy to all my clients. The templates are thoughtfully structured and the widgets add that extra polish to any workspace.' },
    { name: 'Chris Murphy', initials: 'CM', role: 'CEO', company: 'Calm', color: '#22C55E', text: 'We evaluated several widget solutions. Peachy won on design quality alone. The fact that it\'s free makes it an absolute no-brainer.' },
  ],
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [templateScrolled, setTemplateScrolled] = useState(false);
  const templateWrapRef = useRef<HTMLDivElement>(null);
  const debug = useDebugMode();
  const { word: rotatingWord, nextWord, state: wordState } = useRotatingWord();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Measure width: when 'out' — measure next word, when 'in' — measure current
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [rotatingWord.text, nextWord.text, wordState]);

  // The blob should morph to the NEXT shape/color as soon as 'out' starts
  const blobWord = wordState === 'out' ? nextWord : rotatingWord;
  const measureText = wordState === 'out' ? nextWord.text : rotatingWord.text;

  const goToStudio = useCallback(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoPos({ x: rect.left, y: rect.top });
    }
    setTransitioning(true);
    setTimeout(() => navigate('/studio'), 450);
  }, [navigate]);

  return (
    <Page>
      {debug.enabled && <DebugStyles />}
      {debug.enabled && <DebugBadge data-debug-ui onClick={debug.toggle}>DEBUG ON</DebugBadge>}
      {debug.enabled && (
        <DebugBadge data-debug-ui onClick={debug.toggleMeasure} style={{ top: 100, background: debug.measureMode ? '#3B82F6' : '#666' }}>
          📏 {debug.measureMode ? 'MEASURE ON' : 'MEASURE'}
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
              <DebugUnlockBtn data-debug-ui onClick={debug.unlock}>✕</DebugUnlockBtn>
            </span>
          )}
        </DebugTooltip>
      )}
      <DebugToggle $on={debug.enabled} onClick={debug.toggle} data-debug-ui>⚙</DebugToggle>
      <TopNav logoPressed={transitioning} onLogoClick={() => navigate('/')} />
      <PageContent $transitioning={transitioning}>

      <Hero data-ux="Hero">
{/*        <Badge>For Notion</Badge> */}
        <Title data-ux="Hero Title">
          Make Notion work<br />
          <RotatingLine $width={textWidth}>
            <MeasureSpan ref={measureRef}>{measureText}</MeasureSpan>
            <RotatingWordWrap>
              <MorphBlob $bg={blobWord.bg} $radius={blobWord.radius} />
              <RotatingText $state={wordState} $color={rotatingWord.color}>
                {rotatingWord.text}
              </RotatingText>
            </RotatingWordWrap>
          </RotatingLine>{'\u00A0\u00A0'}for you.
        </Title>
        <HeroSubtitle data-ux="Hero Subtitle">
          Templates and widgets that turn it into a clear, structured system
          for life, work, business, and study.
        </HeroSubtitle>
        <ButtonRow>
          <PrimaryButton onClick={() => navigate('/templates')}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/widgets')}>Explore Widgets</SecondaryButton>
        </ButtonRow>
{/*        <TrustLine>Trusted by 11,000+ users worldwide</TrustLine> */}
      </Hero>

      {/* ── Categories Marquee ── */}
      <CategoriesWrap>
        <CategoriesSection data-ux="Categories Marquee">
          <CategoriesTrack $duration={50}>
            {[...CATEGORY_CHIPS_ROW1, ...CATEGORY_CHIPS_ROW1, ...CATEGORY_CHIPS_ROW1].map((c, i) => (
              <CategoryChip key={`cr1-${i}`} $color={c.color} onClick={() => c.label === 'Widget Studio' ? navigate('/widgets') : navigate(`/templates?cat=${c.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}>{c.label}</CategoryChip>
            ))}
          </CategoriesTrack>
          <CategoriesTrack $duration={55} $reverse>
            {[...CATEGORY_CHIPS_ROW2, ...CATEGORY_CHIPS_ROW2, ...CATEGORY_CHIPS_ROW2].map((c, i) => (
              <CategoryChip key={`cr2-${i}`} $color={c.color} onClick={() => navigate(`/templates?cat=${c.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`)}>{c.label}</CategoryChip>
            ))}
          </CategoriesTrack>
        </CategoriesSection>
      </CategoriesWrap>

      <FeatureCardsSection data-ux="Feature Cards Section">
        <FeatureStack data-ux="Feature Stack">
          {FEATURE_CARDS.map((f, i) => (
            <FeatureCard
              key={i}
              $active={activeFeature === i}
              $index={i}
              $total={FEATURE_CARDS.length}
              $activeIdx={activeFeature}
              onClick={() => setActiveFeature(i === activeFeature ? (i + 1) % FEATURE_CARDS.length : i)}
            >
              <FeatureCardTab $color={f.color} $intensity={0.46 - ((i - activeFeature + FEATURE_CARDS.length) % FEATURE_CARDS.length) * 0.1} data-ux="Feature Card Tab">
                <FeatureTabIcon>{f.icon}</FeatureTabIcon>
                <FeatureTabTitle>{f.tab}</FeatureTabTitle>
                <FeatureTabActions>⋯</FeatureTabActions>
              </FeatureCardTab>
              <FeatureCardBody data-ux="Feature Card Body">
                <FeatureCardText>
                  <FeatureCardTitle>{f.title}</FeatureCardTitle>
                  <FeatureCardDesc>{f.desc}</FeatureCardDesc>
                </FeatureCardText>
                <FeatureCardImage>
                  <img src={f.image} alt={f.title} />
                </FeatureCardImage>
              </FeatureCardBody>
            </FeatureCard>
          ))}
        </FeatureStack>
      </FeatureCardsSection>

      {/* ── Templates Gallery ── */}
      <TemplatesGallery data-ux="Templates Gallery">
        <BestsellersHeader style={{ maxWidth: 1200, margin: '0 auto 20px', padding: '0 48px', position: 'relative', zIndex: 2 }}>
          <BestsellersHeaderLeft>
            <BestsellersTitle data-ux="Section Title">Top templates</BestsellersTitle>
            <BestsellersSubtitle>Top picks from our community</BestsellersSubtitle>
          </BestsellersHeaderLeft>
          <BrowseAllButton onClick={() => navigate('/templates')}>Explore all</BrowseAllButton>
        </BestsellersHeader>
        <TemplatesMarqueeWrap
          data-ux="Marquee Wrap"
          data-scrolled={templateScrolled ? 'true' : 'false'}
          ref={templateWrapRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setTemplateScrolled(el.scrollLeft > 10);
          }}
        >
          <TemplateMarqueeTrack $duration={60}>
            {[...TEMPLATE_ROW_1, ...TEMPLATE_ROW_1].map((t, i) => (
              <TemplateCardWrap key={`tr1-${i}`} onClick={() => navigate('/templates')}>
                <TemplateCard data-ux="Template Card">
                  <TemplateCardImage src={t.image} alt={t.title} />
                </TemplateCard>
                <TemplateCardMeta>
                  <TemplateCardTitle>{t.title}</TemplateCardTitle>
                  <TemplateCardTags>
                    <TemplateCardTag $bg={TAG_COLORS[t.tag]?.bg} $color={TAG_COLORS[t.tag]?.color}>{t.tag}</TemplateCardTag>
                    <span style={{ fontSize: 12, color: '#9A9A9A' }}>{t.price}</span>
                  </TemplateCardTags>
                </TemplateCardMeta>
              </TemplateCardWrap>
            ))}
          </TemplateMarqueeTrack>
        </TemplatesMarqueeWrap>
        <TemplatesScrollHint onClick={() => {
          if (templateWrapRef.current) templateWrapRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }}>
          <ArrowRight />
        </TemplatesScrollHint>
      </TemplatesGallery>

      {/* ── Widgets ── */}
      <WidgetsSection data-ux="Widgets Section">
        <BestsellersHeader>
          <BestsellersHeaderLeft>
            <BestsellersTitle data-ux="Section Title">Featured widgets</BestsellersTitle>
            <BestsellersSubtitle>Embed into Notion in seconds</BestsellersSubtitle>
          </BestsellersHeaderLeft>
          <BrowseAllButton onClick={() => navigate('/widgets')}>Explore all</BrowseAllButton>
        </BestsellersHeader>
        <WidgetGrid>
          {WIDGET_DATA.map((w, i) => (
            <WidgetCardWrap key={i} onClick={() => navigate('/widgets')}>
              <WidgetCardBox data-ux="Widget Card Image">
                <WidgetCardImage src={w.image} alt={w.title} />
              </WidgetCardBox>
              <TemplateCardMeta>
                <TemplateCardTitle>{w.title}</TemplateCardTitle>
              </TemplateCardMeta>
            </WidgetCardWrap>
          ))}
        </WidgetGrid>
      </WidgetsSection>

      {/* ── Testimonials ── */}
      <TestimonialsSection data-ux="Testimonials Section">
        <TestimonialsTitle>Loved by 10,000+ users</TestimonialsTitle>
        <TestimonialsSubtitle>See what people are saying about Peachy</TestimonialsSubtitle>
        <MarqueeContainer>
          {/* Column 1 — scrolls up */}
          <MarqueeColumn>
            <MarqueeInner $duration={35}>
              {[...testimonials.col1, ...testimonials.col1].map((t, i) => (
                <TestimonialCard key={`c1-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>

          {/* Column 2 — scrolls down */}
          <MarqueeColumn>
            <MarqueeInner $duration={40} $reverse>
              {[...testimonials.col2, ...testimonials.col2].map((t, i) => (
                <TestimonialCard key={`c2-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>

          {/* Column 3 — scrolls up */}
          <MarqueeColumn>
            <MarqueeInner $duration={45}>
              {[...testimonials.col3, ...testimonials.col3].map((t, i) => (
                <TestimonialCard key={`c3-${i}`}>
                  <TestimonialAuthor>
                    <TestimonialAvatar $color={t.color}>{t.initials}</TestimonialAvatar>
                    <TestimonialInfo>
                      <TestimonialName>{t.name}</TestimonialName>
                      <TestimonialRole>{t.role} at <strong>{t.company}</strong></TestimonialRole>
                    </TestimonialInfo>
                  </TestimonialAuthor>
                  <TestimonialText>{t.text}</TestimonialText>
                </TestimonialCard>
              ))}
            </MarqueeInner>
          </MarqueeColumn>
        </MarqueeContainer>
      </TestimonialsSection>

      <CTASection data-ux="CTA Section">
        <CTATitle>Ready to level up?</CTATitle>
        <CTASubtitle>Explore templates or build your own widgets — no sign up needed.</CTASubtitle>
        <ButtonRow>
          <PrimaryButton onClick={() => navigate('/templates')}>
            Browse Templates
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/widgets')}>Explore Widgets</SecondaryButton>
        </ButtonRow>
      </CTASection>

      <Footer>
        <FooterText>Peachy Studio</FooterText>
        <FooterText>Widgets &middot; Planners &middot; Templates</FooterText>
      </Footer>
      </PageContent>
    </Page>
  );
};
