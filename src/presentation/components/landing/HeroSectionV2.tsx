import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { Button as SharedButton } from '../shared';

/* Brand palette lives in `theme.colors.peach.*`. Animation values that
 * can't access theme (keyframes) use the raw hex `#F4A672` — kept in sync
 * with `theme.colors.peach.deepWarm` via code review. */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatLeft = keyframes`
  0%, 100% { transform: rotate(-8deg) translateY(0); }
  50% { transform: rotate(-9.5deg) translateY(-10px); }
`;

const floatRight = keyframes`
  0%, 100% { transform: rotate(8deg) translateY(0); }
  50% { transform: rotate(9.5deg) translateY(-12px); }
`;

const Hero = styled.section`
  position: relative;
  width: 100%;
  max-width: 1680px;
  margin: -72px auto 0;
  padding: 40px 48px 0;
  text-align: center;
  min-height: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 900px) {
    margin-top: -44px;
    padding: 36px 20px 0;
  }

  /* Tablet (769–1024) — compact min-height (480 vs 620 desktop) and
   * symmetric vertical padding so the Hero band reads as a tight,
   * balanced block instead of inheriting the desktop's tall slot.
   * Mobile (≤768) is overridden separately below and stays untouched. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 480px;
    padding: 36px 20px 36px;
  }

  /* Narrow tablet (769–900) — tighter padding so content packs together
   * inside the band, but min-height stays at the tablet 480 so the
   * tinted background slab keeps its height. Per "верни заливку". */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: 900px) {
    padding: 28px 20px 28px;
  }

  /* Narrow desktop without floats (1025–1240) — widgets are hidden in
   * this range, so the default desktop's asymmetric 40/0 vertical
   * padding leaves content biased upward. Switch to symmetric 36/36
   * with the desktop 48 horizontal gutter so the Stack sits centered
   * in the section. Range bumped from 1140 → 1240 to match the
   * widget-hide cap. Per "до 1240 не показывай виджеты". */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.tablet} + 1px))
    and (max-width: 1240px) {
    min-height: 480px;
    padding: 36px 48px 36px;
  }

  /* Phone — symmetric 63/63 padding (total 126). Hero height locked at 545
   * per "высоту хиро 545 у обоих" + content vertically centered within
   * the section per "выровни контент по середине секции". The earlier
   * 78/48 split was asymmetric to align Hero → first-section gap with
   * /widgets; that constraint is dropped in favor of true vertical
   * centering on the main landing. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: auto;
    margin-top: 0;
    padding: 63px 20px;
    justify-content: center;
  }
`;

/* Keep text/CTA group above the tilted template cards */
const Stack = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ── Eyebrow badge ── */
const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.44);
  border: 0.5px solid rgba(26, 22, 19, 0.06);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 1px 2px rgba(20, 20, 40, 0.03),
    0 4px 12px -4px rgba(20, 20, 40, 0.05);
  font-size: 13px;
  color: ${({ theme }) => theme.colors.peach.inkSoft};
  font-weight: 500;
  margin-top: -32px;

  /* Tablet + narrow desktop without floats (769–1240) — Hero uses
   * symmetric padding to center the Stack; the desktop's −32 lift
   * biases content upward and leaves a visible gap at the bottom of
   * the section. Reset so Stack truly centers across the entire
   * no-widgets range. Per "772–1048 не отцентрован — чекни". */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: 1240px) {
    margin-top: 0;
  }

  /* Mobile — fixed-height pill (32); spacing below = 28 (was 24, +4),
   * stars-group → text gap = 10. Text 12. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 32px;
    margin: 0 0 28px;
    padding: 0 12px;
    gap: 10px;
    font-size: 12px;
  }
`;

const Avatars = styled.div`
  display: flex;

  /* Hide on mobile — at 22px each, the three avatars read as decorative
   * speckles next to the eyebrow text. The "10K+ creators" copy alone
   * carries the social-proof signal at this width.
   * Comment c_mog0vj1m (2026-04-26): "убери аватары из версии телефона". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Avatar = styled.i<{ $bg: string; $i: number }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: ${({ $i }) => ($i === 0 ? 0 : '-6px')};
  display: block;
  background: ${({ $bg }) => $bg};
`;

/* keyframes can't access theme — brand peach deep-warm hardcoded here.
 * Kept in sync with `theme.colors.peach.deepWarm` via code review. */
const starPop = keyframes`
  0%   { transform: scale(1); color: rgba(150, 145, 135, 0.35); }
  50%  { transform: scale(1.4); color: #F4A672; }
  100% { transform: scale(1); color: #F4A672; }
`;

const Stars = styled.span`
  color: ${({ theme }) => theme.colors.peach.deepWarm};
  letter-spacing: 0;
  font-size: 12px;
  display: inline-flex;
  gap: 0;

  /* Mobile — small gap between stars per spec. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 2px;
  }
`;

const Star = styled.span<{ $i: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  color: rgba(150, 145, 135, 0.35);
  animation: ${starPop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: ${({ $i }) => 0.9 + $i * 0.13}s;
  svg { width: 12px; height: 12px; fill: currentColor; }

  /* Mobile — 14px stars per spec. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    svg { width: 14px; height: 14px; }
  }
`;

/* ── Headline ── */
const Headline = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: clamp(44px, 6vw, 84px);
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin: 22px 0 0;
  color: ${({ theme }) => theme.colors.peach.deep};
  max-width: 920px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Mobile spec: 44/700/1.05/-0.02em + balanced wrap. Hard cap 318
     * matches the Hero buttons cap so the headline doesn't stretch on
     * 414+ phones. Centered. margin-bottom 20 carries the gap to Sub. */
    max-width: 318px;
    margin: 0 auto 20px;
    font-size: 44px;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  em {
    font-style: normal;
    font-weight: 600;
    position: relative;
    display: inline-block;
    isolation: isolate;
    color: ${({ theme }) => theme.colors.peach.deep};

    &::before {
      content: '';
      position: absolute;
      left: -0.1em;
      right: -0.06em;
      top: 8%;
      bottom: 2%;
      border: 2.5px solid rgba(244, 166, 114, 0.78);
      border-top-width: 1.5px;
      border-right-width: 3px;
      border-bottom-width: 3px;
      border-left-width: 2px;
      border-radius: 52% 48% 50% 50% / 55% 48% 52% 45%;
      transform: rotate(-10deg) scaleX(1.05) skewX(-5deg);
      z-index: -1;
      pointer-events: none;
      border-top-color: rgba(244, 166, 114, 0.5);
      border-left-color: rgba(232, 155, 155, 0.72);
      border-bottom-color: rgba(244, 166, 114, 0.85);
    }
  }
`;

const Sub = styled.p`
  margin: 22px auto 0;
  /* Desktop 18 (was 16) — hero subtitles get a touch more weight than
   * generic body. Mobile keeps 16 in the @media md block below — phone
   * hero copy already runs longer at smaller widths.
   * Comment c_mogbd1x8: "на десктопе мб это 18 сделать ток у хиро". */
  font-size: 18px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.peach.muted};
  max-width: 440px;
  font-weight: 400;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
    line-height: 1.5;
    /* Hard cap 318 — matches Hero buttons + headline cap so subtitle
     * doesn't stretch on big-phone viewports. Centered. */
    max-width: 318px;
    margin: 0 auto 28px;
  }
`;

/* ── CTAs ── */
const CTAs = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  /* Mobile: vertical stack, full-width, gap 12. Height/radius/font
   * all come from the shared Button DS xl tokens (mobileHeight 44,
   * radius 12, mobileFontSize 13) — no inline overrides. Only the
   * 100% width and the secondary's bumped 600 weight are layout
   * choices that aren't part of the DS. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
    /* Fixed 318 cap on phone — buttons no longer stretch with viewport
     * (was uncapped + 8px inset, which made buttons 14-30px too wide on
     * larger phones). −16 vs the prior trim, locked. Per "уменьши на 16
     * пикселей и зафиксируй на мобильной — пока в Hero". */
    max-width: 318px;
    margin: 0 auto;
    gap: 12px;
    padding: 0;

    & > * {
      width: 100%;
      font-weight: 600;
    }
  }
`;

/* Hero CTAs now use shared <Button $size="xl"> — see buttons-polish PR. */

/* ── Meta row ── */
const Meta = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.peach.hint};

  /* Hide on mobile — three feature bullets feel like padding when the
   * page already has the full Templates Gallery and Why-people-love
   * sections to convey the same message. Comment c_mofyz2zm (2026-04-26):
   * "убрать в телефонной версии". */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const MetaDot = styled.i`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.peach.deepWarm};
  display: inline-block;
`;

/* ── Template cards ── */
const TplFloat = styled.div<{ $pos: 'left' | 'right' }>`
  position: absolute;
  z-index: 1;
  width: 250px;
  height: 248px;
  will-change: transform;
  animation: ${({ $pos }) => ($pos === 'left' ? floatLeft : floatRight)}
    ${({ $pos }) => ($pos === 'left' ? '7.3s' : '10.7s')} ease-in-out infinite both;
  animation-delay: ${({ $pos }) => ($pos === 'left' ? '0s' : '-3.4s')};

  &:hover {
    z-index: 3;
  }

  ${({ $pos }) =>
    $pos === 'left'
      ? `top: 56px; left: calc(2% + 84px);`
      : `bottom: 40px; right: calc(2% + 98px);`}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: ${({ $pos }) => ($pos === 'left' ? 'rotate(-8deg)' : 'rotate(8deg)')};
  }

  /* Phone + tablet + narrow desktop (≤1099) — hide decorative floats.
   * From 1100+ widgets reappear. Per "пусть виджеты появляются с 1100". */
  @media (max-width: 1099px) {
    display: none;
  }

  /* Narrow desktop (1025–1459) — keep the 250×248 container, but scale
   * the inner card via transform so ALL internal content (text, checkboxes,
   * habit ticks, icons) shrinks proportionally instead of leaving the
   * box smaller while content overflows. Position is moved closer to the
   * headline so the cards don't read as banished to the corners.
   * The inner TplCard has its own scale(0.94) base and scale(1) on hover;
   * we override both via the direct child div. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.tablet} + 1px))
    and (max-width: 1459px) {
    ${({ $pos }) =>
      $pos === 'left'
        ? `top: 48px; left: calc(2% + 24px);`
        : `bottom: 32px; right: calc(2% + 24px);`}

    & > div {
      transform: scale(0.7) !important;
    }
    &:hover > div {
      transform: scale(0.74) !important;
    }
  }

  /* Very narrow desktop (1025–1184) — at this width the headline is
   * close enough to the viewport edge that the calc(2% + 24px) offset
   * still has the cards crowding the centered text. Pull 16px further
   * outward (calc(2% + 8px)) so the visible card clears the headline.
   * From ≥1185 the gutter is wide enough that the +24 default reads
   * fine. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.tablet} + 1px))
    and (max-width: 1184px) {
    ${({ $pos }) =>
      $pos === 'left'
        ? `left: calc(2% + 8px);`
        : `right: calc(2% + 8px);`}
  }

  /* Wider narrow desktop (1340–1459) — viewport has enough gutter that
   * the cards can read at a more confident size. Bump scale 0.7 → 0.82
   * (and hover 0.74 → 0.86) so they don't look like miniatures next to
   * the still-large headline. */
  @media (min-width: 1340px) and (max-width: 1459px) {
    & > div {
      transform: scale(0.82) !important;
    }
    &:hover > div {
      transform: scale(0.86) !important;
    }
  }
`;

const TplCard = styled.div<{ $variant: 'planner' | 'habits' }>`
  background: #fff;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  text-align: left;
  border: 1px solid ${({ $variant }) => {
    const hex = TAB_COLORS[$variant].replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  }};
  /* Soft layered elevation — was 0 12 24 / 0.08 + 0 32 64 / 0.16 which
   * pooled as a dirty dark slab under each card. Replaced with a
   * three-stop ambient shadow (warm near-black + negative spread offsets)
   * so the cards lift cleanly off the page without a heavy underline. */
  box-shadow:
    0 1px 2px rgba(26, 22, 19, 0.04),
    0 12px 24px -8px rgba(26, 22, 19, 0.08),
    0 28px 56px -20px rgba(26, 22, 19, 0.12);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  transform: scale(0.94);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;

  &:hover {
    transform: scale(1);
  }
`;

const TAB_COLORS = {
  planner: '#F4A672',
  habits: '#7FA96B',
};

const Chrome = styled.div<{ $variant: 'planner' | 'habits' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  /* Tab label = per-card $variant colour × 0.55 (darkened tone) so
   * "Planner" / "Routine" echo the dot but read as a confident dark
   * accent — mirrors the FeatureCardsSection ("Functionality" / "Design"
   * / "Payment") pattern. Crumbs inherits this colour. */
  color: ${({ $variant }) => {
    const hex = TAB_COLORS[$variant].replace('#', '');
    const r = Math.round(parseInt(hex.slice(0, 2), 16) * 0.55);
    const g = Math.round(parseInt(hex.slice(2, 4), 16) * 0.55);
    const b = Math.round(parseInt(hex.slice(4, 6), 16) * 0.55);
    return `rgb(${r}, ${g}, ${b})`;
  }};
  background: ${({ $variant }) => {
    const hex = TAB_COLORS[$variant].replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.26)`;
  }};
  transition: background 0.5s ease, filter 0.5s ease;

  ${TplCard}:hover & {
    background: ${({ $variant }) => {
      const hex = TAB_COLORS[$variant].replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.34)`;
    }};
  }
`;

const Crumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  /* Inherit Chrome's per-card darkened tone so the "Planner"/"Routine"
   * text picks up the same colour as the dot. */
  color: inherit;
  letter-spacing: -0.01em;
`;

const TabDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Dots = styled.div<{ $color: string }>`
  display: flex;
  gap: 4px;
  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    opacity: 0.45;
    display: block;
  }
`;

const CardBody = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 14px 18px 16px;
  position: relative;
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #37352F;
  margin-top: 2px;
  line-height: 1.2;
`;

const CardDesc = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.peach.muted};
  margin-top: 4px;
  line-height: 1.5;
`;

const SectionLabel = styled.div`
  font-size: 9.5px;
  color: ${({ theme }) => theme.colors.peach.muted};
  font-weight: 500;
  margin: 18px 0 4px;
  letter-spacing: -0.005em;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Ic = styled.span`
  opacity: 0.6;
  font-size: 9px;
`;

const TaskRow = styled.div<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3.5px 0;
  font-size: 10.5px;
  color: #37352F;
  cursor: pointer;
  user-select: none;
  transition: opacity ${({ theme }) => theme.transitions.medium};

  &:hover {
    opacity: 0.7;
  }

  span {
    color: ${({ $done }) => ($done ? '#B5B1A9' : '#37352F')};
    text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
    transition: color ${({ theme }) => theme.transitions.medium}, text-decoration-color ${({ theme }) => theme.transitions.medium};
  }
`;

const Checkbox = styled.div<{ $on?: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: ${({ theme }) => theme.radii.xs};
  border: 1.2px solid ${({ $on }) => ($on ? '#7B9FD1' : '#E2DED5')};
  background: ${({ $on }) => ($on ? '#7B9FD1' : '#fff')};
  flex-shrink: 0;
  position: relative;
  transition:
    background 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:active {
    transform: scale(0.88);
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 46%;
    width: 6px;
    height: 3px;
    border-left: 1.5px solid #fff;
    border-bottom: 1.5px solid #fff;
    transform: translate(-50%, -50%) rotate(-45deg) scale(${({ $on }) => ($on ? 1 : 0)});
    opacity: ${({ $on }) => ($on ? 1 : 0)};
    transition:
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.2s ease;
  }
`;

const HabitRow = styled.div<{ $add?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 10px;
  color: ${({ $add }) => ($add ? '#C7C3BA' : '#37352F')};
  &:last-child {
    border-bottom: 0;
  }
`;

const HabitName = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .ic {
    width: 12px;
    height: 12px;
    border-radius: ${({ theme }) => theme.radii.xs};
    background: #F7F2EC;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
  }
  .ic.plus {
    background: transparent;
    border: 1px dashed #D8D2C6;
    color: ${({ theme }) => theme.colors.peach.hint};
    font-size: 11px;
    line-height: 1;
  }
  .add-lbl {
    font-style: italic;
    font-size: 11px;
  }
`;

const Ticks = styled.div`
  display: flex;
  gap: 4px;

  i {
    width: 14px;
    height: 14px;
    border-radius: ${({ theme }) => theme.radii.xs};
    background: #F1ECE4;
    display: block;
    position: relative;
    cursor: pointer;
    transition:
      background 0.25s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  i:hover {
    transform: scale(1.18);
  }
  i:active {
    transform: scale(0.88);
  }
  i::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 46%;
    width: 6px;
    height: 3px;
    border-left: 1.5px solid #fff;
    border-bottom: 1.5px solid #fff;
    transform: translate(-50%, -50%) rotate(-45deg) scale(0);
    opacity: 0;
    transition:
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.2s ease;
  }
  i.on {
    background: #7B9FD1;
  }
  i.on::after {
    transform: translate(-50%, -50%) rotate(-45deg) scale(1);
    opacity: 1;
  }
`;

const DayHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin: 18px 0 4px;
  font-size: 9.5px;
  color: ${({ theme }) => theme.colors.peach.muted};
  font-weight: 500;
  letter-spacing: -0.005em;

  & > span:first-child {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  & > span:last-child {
    display: flex;
    gap: 4px;
    font-size: 9px;
    color: #C7C3BA;
    letter-spacing: 0.06em;
  }
  & > span:last-child span {
    width: 14px;
    text-align: center;
  }
`;

const SectionSplit = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-size: 9.5px;
  color: ${({ theme }) => theme.colors.peach.muted};
  font-weight: 500;
  margin: 18px 0 4px;
  letter-spacing: -0.005em;

  & > span:first-child {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  & > .date {
    color: ${({ theme }) => theme.colors.peach.hint};
    font-weight: 500;
    font-size: 9px;
    letter-spacing: 0.02em;
    font-variant-numeric: tabular-nums;
  }
`;

interface HeroSectionV2Props {
  onBrowseTemplates: () => void;
  onExploreWidgets: () => void;
}

export const HeroSectionV2: React.FC<HeroSectionV2Props> = ({ onBrowseTemplates, onExploreWidgets }) => {
  const [tasks, setTasks] = useState<boolean[]>([true, true, false, false]);
  const [habits, setHabits] = useState<boolean[][]>([
    [true, true, true, true, true],
    [true, true, true, true, true],
    [true, true, true, true, true],
  ]);
  const toggleTask = (i: number) =>
    setTasks(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  const toggleHabit = (r: number, c: number) =>
    setHabits(prev =>
      prev.map((row, ri) =>
        ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row,
      ),
    );

  return (
    <Hero data-ux="Hero V2">
        {/* Planner card — left, tilted left */}
        <TplFloat $pos="left">
        <TplCard $variant="planner" data-ux="Tpl Planner">
          <Chrome $variant="planner">
            <Crumbs>
              <TabDot $color={TAB_COLORS.planner} />
              <span>Planner</span>
            </Crumbs>
            <Dots $color={TAB_COLORS.planner}><i /><i /><i /></Dots>
          </Chrome>
          <CardBody>
            <CardTitle>Daily Planner</CardTitle>
            <CardDesc>A soft start to a good day.</CardDesc>
            <SectionSplit>
              <span><Ic>▤</Ic>Today</span>
              <span className="date">Mon · Apr 20</span>
            </SectionSplit>
            <TaskRow $done={tasks[0]} onClick={() => toggleTask(0)}><Checkbox $on={tasks[0]} /><span>Morning pages · 10 min</span></TaskRow>
            <TaskRow $done={tasks[1]} onClick={() => toggleTask(1)}><Checkbox $on={tasks[1]} /><span>Stretch · 5 min</span></TaskRow>
            <TaskRow $done={tasks[2]} onClick={() => toggleTask(2)}><Checkbox $on={tasks[2]} /><span>Deep work block</span></TaskRow>
            <TaskRow $done={tasks[3]} onClick={() => toggleTask(3)}><Checkbox $on={tasks[3]} /><span>Reply to three emails</span></TaskRow>
          </CardBody>
        </TplCard>
        </TplFloat>

        {/* Habits card — right, tilted right */}
        <TplFloat $pos="right">
        <TplCard $variant="habits" data-ux="Tpl Habits">
          <Chrome $variant="habits">
            <Crumbs>
              <TabDot $color={TAB_COLORS.habits} />
              <span>Routine</span>
            </Crumbs>
            <Dots $color={TAB_COLORS.habits}><i /><i /><i /></Dots>
          </Chrome>
          <CardBody>
            <CardTitle>Habit Tracker</CardTitle>
            <CardDesc>Small wins, tracked gently.</CardDesc>
            <DayHeader>
              <span><Ic>○</Ic>Habit</span>
              <span>
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
              </span>
            </DayHeader>
            {[
              { emoji: '📖', name: 'Read 20 min' },
              { emoji: '🚶', name: 'Walk' },
              { emoji: '💧', name: 'Water' },
            ].map((h, ri) => (
              <HabitRow key={ri}>
                <HabitName><div className="ic">{h.emoji}</div>{h.name}</HabitName>
                <Ticks>
                  {habits[ri].map((on, ci) => (
                    <i key={ci} className={on ? 'on' : ''} onClick={() => toggleHabit(ri, ci)} />
                  ))}
                </Ticks>
              </HabitRow>
            ))}
            <HabitRow $add>
              <HabitName><div className="ic plus">+</div><span className="add-lbl">New habit</span></HabitName>
            </HabitRow>
          </CardBody>
        </TplCard>
        </TplFloat>

        <Stack>
          <Eyebrow data-ux="Hero V2 Social Proof">
            <Avatars>
              <Avatar $bg="linear-gradient(135deg, #F8E3D0, #EFCAAB)" $i={0} />
              <Avatar $bg="linear-gradient(135deg, #F2D8D8, #E4BEBE)" $i={1} />
              <Avatar $bg="linear-gradient(135deg, #DAE0EC, #B9C4D8)" $i={2} />
            </Avatars>
            <Stars aria-hidden>
              {[0, 1, 2, 3, 4].map(i => (
                <Star key={i} $i={i}>
                  <svg viewBox="0 0 24 24"><path d="M12 2.5c.4 0 .8.2 1 .6l2.4 5 5.4.8c.5.1.9.4 1 .9.2.4 0 .9-.3 1.2l-3.9 3.8.9 5.4c.1.5-.1 1-.5 1.2-.4.3-.9.3-1.3.1L12 18.8l-4.7 2.7c-.4.2-.9.2-1.3-.1-.4-.3-.6-.7-.5-1.2l.9-5.4L2.5 11c-.3-.3-.5-.8-.3-1.2.2-.5.5-.8 1-.9l5.4-.8 2.4-5c.2-.4.6-.6 1-.6z" /></svg>
                </Star>
              ))}
            </Stars>
            <span>Loved by 11,000+ people</span>
          </Eyebrow>

          <Headline data-ux="Hero V2 Title">
            Notion that finally<br />
            feels <em>yours.</em>
          </Headline>

          <Sub data-ux="Hero V2 Subtitle">
            Templates and widgets that make Notion beautiful, organized, and completely yours.
          </Sub>

          <CTAs>
            <SharedButton $variant="primary" $size="xl" onClick={onBrowseTemplates}>
              Browse templates <ArrowRight />
            </SharedButton>
            <SharedButton $variant="secondary" $size="xl" onClick={onExploreWidgets}>
              Explore widgets
            </SharedButton>
          </CTAs>

          <Meta data-ux="Hero V2 Meta">
            <MetaItem><MetaDot />Works instantly in Notion</MetaItem>
            <MetaItem><MetaDot />No sign-up required</MetaItem>
            <MetaItem><MetaDot />Easy to customize</MetaItem>
          </Meta>
        </Stack>
    </Hero>
  );
};
