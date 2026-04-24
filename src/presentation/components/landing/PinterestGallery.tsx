import React from 'react';
import styled from 'styled-components';

const PinterestGrid = styled.div<{ $rows?: number; $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 4}, 1fr);
  grid-template-rows: repeat(${({ $rows }) => $rows || 4}, 1fr);
  gap: 16px;
  height: ${({ $rows }) => $rows === 2 ? '420px' : $rows === 3 ? '560px' : '530px'};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(${({ $cols }) => Math.min($cols || 3, 3)}, 1fr);
    height: ${({ $rows }) => $rows === 2 ? '360px' : $rows === 3 ? '480px' : '450px'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(${({ $rows }) => $rows || 4}, 1fr);
    height: ${({ $rows }) => $rows === 2 ? '340px' : $rows === 3 ? '440px' : '480px'};
    gap: 12px;
  }
`;

const PinCard = styled.div<{ $col?: string; $row?: string; $mobileCol?: string; $mobileRow?: string; $hideOnMobile?: boolean; $hideOnTablet?: boolean }>`
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  cursor: default;
  border: 1.5px solid rgba(200, 195, 230, 0.25);
  grid-column: ${({ $col }) => $col || 'auto'};
  grid-row: ${({ $row }) => $row || 'auto'};
  position: relative;
  min-height: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: ${({ $hideOnTablet }) => $hideOnTablet ? 'none' : 'block'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $hideOnMobile }) => $hideOnMobile ? 'none' : 'block'};
    grid-column: ${({ $mobileCol, $col }) => $mobileCol || $col || 'auto'};
    grid-row: ${({ $mobileRow, $row }) => $mobileRow || $row || 'auto'};
  }

  &:hover img {
    opacity: 1;
    transform: scale(1.03);
  }
`;

const PinImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.9;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const PinText = styled.div<{ $bg: string; $color?: string }>`
  padding: 20px;
  background: ${({ $bg }) => {
    if ($bg === '#1F1F1F') return $bg;
    const hex = $bg.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `linear-gradient(150deg, rgba(${r},${g},${b},1) 0%, rgba(${r},${g},${b},0.9) 50%, rgba(${r},${g},${b},0.95) 100%)`;
  }};
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  color: ${({ $color }) => $color || '#1F1F1F'};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 16px 14px;
  }
`;

const PinTextTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

const PinTextDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  opacity: 0.7;
  line-height: 1.5;
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 11px;
    line-height: 1.3;
  }
`;

/* Grid layout: 4 columns × 4 rows desktop, 3 cols tablet, 2 cols mobile */
type PinItem = { type: 'image' | 'text'; image?: string; bg?: string; color?: string; title?: string; desc?: string; col?: string; row?: string; mobileCol?: string; mobileRow?: string; hideOnMobile?: boolean; hideOnTablet?: boolean };

const PIN_SETS: Record<string, PinItem[]> = {
  Featured: [
    { type: 'image', image: '/widget-calendar.png', col: '1', row: '1 / 3', mobileCol: '1', mobileRow: '1 / 3' },
    { type: 'text', bg: '#E0F5ED', title: 'Yours from day one.', desc: 'Color palettes, layout guides, and pre-made themes included.', col: '1', row: '3 / 5', mobileCol: '1', mobileRow: '3 / 5' },
    { type: 'image', image: '/widget-clock2.png', col: '2', row: '1 / 4', mobileCol: '2', mobileRow: '1 / 4' },
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Only on Peachy.', desc: 'Widgets you won\'t find anywhere else.', col: '2', row: '4 / 5', mobileCol: '2', mobileRow: '4 / 5' },
    { type: 'text', bg: '#E8EDFF', title: 'Pay once. Keep forever.', desc: 'Buy it once and it\'s yours — come back to it whenever you need, for as long as you want.', col: '3', row: '1 / 3', hideOnMobile: true },
    { type: 'image', image: '/template-main.png', col: '3', row: '3 / 5', hideOnMobile: true },
    { type: 'image', image: '/camera-frame.png', col: '4', row: '1 / 4', hideOnMobile: true, hideOnTablet: true },
    { type: 'text', bg: '#FFF8E0', title: 'Built for both themes.', desc: 'Most templates adapt to light and dark mode.', col: '4', row: '4 / 5', hideOnMobile: true, hideOnTablet: true },
  ],
  Calendar: [
    { type: 'image', image: '/gallery-calendar-typewriter.png', col: '1', row: '1 / 4', mobileCol: '1', mobileRow: '1 / 3' },
    { type: 'text', bg: '#E8EDFF', title: 'Unique styles.', desc: 'Typewriter, collage, classic — pick the one that fits your vibe.', col: '1', row: '4 / 5', mobileCol: '1', mobileRow: '3 / 5' },
    { type: 'text', bg: '#F0E6FF', title: 'Embed in seconds.', desc: 'Copy the link, paste in Notion. That\'s it.', col: '2', row: '1 / 2', mobileCol: '2', mobileRow: '1 / 2' },
    { type: 'image', image: '/gallery-clock-flower.png', col: '2', row: '2 / 5', mobileCol: '2', mobileRow: '2 / 5' },
    { type: 'image', image: '/gallery-camera.png', col: '3', row: '1 / 3', hideOnMobile: true },
    { type: 'text', bg: '#FFF8E0', title: 'Fully customizable.', desc: 'Colors, borders, themes — make it yours.', col: '3', row: '3 / 5', hideOnMobile: true },
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Auto dark mode.', desc: 'Adapts to your Notion theme automatically.', col: '4', row: '1 / 3', hideOnMobile: true, hideOnTablet: true },
    { type: 'image', image: '/gallery-clock-flip.png', col: '4', row: '3 / 5', hideOnMobile: true, hideOnTablet: true },
  ],
  WidgetFeatures: [
    { type: 'image', image: '/gallery-hero-video.gif', col: '1', row: '1 / 3', mobileCol: '1', mobileRow: '1 / 3' },
    { type: 'text', bg: '#E8EDFF', title: 'No iframe lag.', desc: 'Instant load, no spinner, no white flash. Your widgets just appear.', col: '1', row: '3 / 4', mobileCol: '1', mobileRow: '3 / 4' },
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Pixel-perfect.', desc: 'Designed to match Notion\'s own UI language. Feels native.', col: '2', row: '1 / 2', mobileCol: '2', mobileRow: '1 / 2' },
    { type: 'image', image: '/gallery-studio-clock.png', col: '2', row: '2 / 4', mobileCol: '2', mobileRow: '2 / 4' },
    { type: 'image', image: '/gallery-studio-sidebar.png', col: '3', row: '1 / 3', hideOnMobile: true },
    { type: 'text', bg: '#FFF8E0', title: 'One link.', desc: 'Copy. Paste. Done. Works in any Notion page, database, or toggle.', col: '3', row: '3 / 4', hideOnMobile: true },
  ],
  Clocks: [
    /* col 1: текст + фото */
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Digital', desc: 'Modern time with seconds toggle.', col: '1', row: '1 / 2', mobileCol: '1', mobileRow: '1 / 2' },
    { type: 'image', image: '/widget-clock.png', col: '1', row: '2 / 5', mobileCol: '1', mobileRow: '2 / 5' },
    /* col 2: большое фото */
    { type: 'image', image: '/widget-clock2.png', col: '2', row: '1 / 3', mobileCol: '2', mobileRow: '1 / 3' },
    { type: 'text', bg: '#F0E6FF', title: 'Analog', desc: 'Animated hour and minute hands.', col: '2', row: '3 / 4', mobileCol: '2', mobileRow: '3 / 4' },
    { type: 'text', bg: '#E8EDFF', title: '24h / 12h', desc: 'Switch formats instantly.', col: '2', row: '4 / 5', mobileCol: '2', mobileRow: '4 / 5' },
    /* col 3: flower clock */
    { type: 'image', image: '/flower-clock-green.png', col: '3', row: '1 / 4', hideOnMobile: true },
    { type: 'text', bg: '#E0F4E8', title: 'Flower Clock', desc: 'Decorative frame styles.', col: '3', row: '4 / 5', hideOnMobile: true },
    /* col 4 */
    { type: 'text', bg: '#FFF8E0', title: 'Show Date', desc: 'Date below the time display.', col: '4', row: '1 / 2', hideOnMobile: true, hideOnTablet: true },
    { type: 'image', image: '/widget-clock.png', col: '4', row: '2 / 5', hideOnMobile: true, hideOnTablet: true },
  ],
  Boards: [
    /* col 1: большое фото на всю высоту */
    { type: 'image', image: '/template-main.png', col: '1', row: '1 / 5', mobileCol: '1', mobileRow: '1 / 3' },
    /* col 2: текст + фото + текст */
    { type: 'text', bg: '#E0F4E8', title: 'Collage', desc: 'Pin photos, notes, and ideas.', col: '2', row: '1 / 2', mobileCol: '1', mobileRow: '3 / 4' },
    { type: 'image', image: '/template-dashboard.png', col: '2', row: '2 / 4', mobileCol: '2', mobileRow: '1 / 4' },
    { type: 'text', bg: '#F0E6FF', title: 'Mood Board', desc: 'Visual inspiration board.', col: '2', row: '4 / 5', mobileCol: '1', mobileRow: '4 / 5' },
    /* col 3 */
    { type: 'image', image: '/template-main.png', col: '3', row: '1 / 3', hideOnMobile: true },
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Drag & Drop', desc: 'Rearrange with ease.', col: '3', row: '3 / 5', hideOnMobile: true },
    /* col 4 */
    { type: 'text', bg: '#FFF8E0', title: 'Custom Images', desc: 'Upload your own photos.', col: '4', row: '1 / 3', hideOnMobile: true, hideOnTablet: true },
    { type: 'image', image: '/template-dashboard.png', col: '4', row: '3 / 5', hideOnMobile: true, hideOnTablet: true },
  ],
  Buttons: [
    /* col 1: большое фото typewriter */
    { type: 'image', image: '/widget-typewriter.png', col: '1', row: '1 / 4', mobileCol: '1', mobileRow: '1 / 4' },
    { type: 'text', bg: '#E8EDFF', title: 'Typewriter', desc: 'Vintage aesthetic.', col: '1', row: '4 / 5', mobileCol: '1', mobileRow: '4 / 5' },
    /* col 2: текст сверху, camera снизу */
    { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Decorative', desc: 'Make your workspace unique.', col: '2', row: '1 / 3', mobileCol: '2', mobileRow: '1 / 2' },
    { type: 'image', image: '/camera-frame.png', col: '2', row: '3 / 5', mobileCol: '2', mobileRow: '2 / 5' },
    /* col 3: чередование */
    { type: 'image', image: '/alarm-clock-frame.png', col: '3', row: '1 / 3', hideOnMobile: true },
    { type: 'text', bg: '#F0E6FF', title: 'Alarm Clock', desc: 'Classic alarm frame style.', col: '3', row: '3 / 5', hideOnMobile: true },
    /* col 4 */
    { type: 'text', bg: '#FFF8E0', title: 'Embed Ready', desc: 'One-click Notion embed.', col: '4', row: '1 / 2', hideOnMobile: true, hideOnTablet: true },
    { type: 'image', image: '/knitted-clock-frame.png', col: '4', row: '2 / 5', hideOnMobile: true, hideOnTablet: true },
  ],
};

interface PinterestGalleryProps {
  filter?: string;
  rows?: number;
  cols?: number;
}

export const PinterestGallery: React.FC<PinterestGalleryProps> = ({ filter = 'All', rows, cols }) => {
  const items = PIN_SETS[filter] || PIN_SETS.Featured;
  return (
    <PinterestGrid $rows={rows} $cols={cols}>
      {items.map((pin, i) => (
        <PinCard key={i} $col={pin.col} $row={pin.row} $mobileCol={pin.mobileCol} $mobileRow={pin.mobileRow} $hideOnMobile={pin.hideOnMobile} $hideOnTablet={pin.hideOnTablet}>
          {pin.type === 'image' ? (
            <PinImage src={pin.image} alt="" />
          ) : (
            <PinText $bg={pin.bg!} $color={pin.color}>
              <PinTextTitle>{pin.title}</PinTextTitle>
              <PinTextDesc>{pin.desc}</PinTextDesc>
            </PinText>
          )}
        </PinCard>
      ))}
    </PinterestGrid>
  );
};
