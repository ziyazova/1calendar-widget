import React from 'react';
import styled from 'styled-components';

const PinterestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 16px;
  height: 560px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    height: 480px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    height: 480px;
    gap: 12px;
  }
`;

const PinCard = styled.div<{ $col?: string; $row?: string; $mobileCol?: string; $mobileRow?: string; $hideOnMobile?: boolean; $hideOnTablet?: boolean }>`
  border-radius: 16px;
  overflow: hidden;
  cursor: default;
  grid-column: ${({ $col }) => $col || 'auto'};
  grid-row: ${({ $row }) => $row || 'auto'};
  position: relative;

  @media (max-width: 1024px) {
    display: ${({ $hideOnTablet }) => $hideOnTablet ? 'none' : 'block'};
  }

  @media (max-width: 768px) {
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
  padding: 28px 24px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color || '#1F1F1F'};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px 14px;
  }
`;

const PinTextTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 3px;
  }
`;

const PinTextDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  opacity: 0.7;
  line-height: 1.5;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 11px;
    line-height: 1.3;
  }
`;

/* Grid layout: 4 columns × 4 rows desktop, 3 cols tablet, 2 cols mobile */
type PinItem = { type: 'image' | 'text'; image?: string; bg?: string; color?: string; title?: string; desc?: string; col?: string; row?: string; mobileCol?: string; mobileRow?: string; hideOnMobile?: boolean; hideOnTablet?: boolean };

const PIN_ITEMS: PinItem[] = [
  /* col 1 */ { type: 'image', image: '/widget-calendar.png', col: '1', row: '1 / 3', mobileCol: '1', mobileRow: '1 / 3' },
  /* col 1 */ { type: 'text', bg: '#F0E6FF', title: 'Customizable', desc: 'Colors, borders, layouts — make it yours.', col: '1', row: '3 / 5', mobileCol: '1', mobileRow: '3 / 5' },
  /* col 2 */ { type: 'image', image: '/widget-clock2.png', col: '2', row: '1 / 4', mobileCol: '2', mobileRow: '1 / 4' },
  /* col 2 */ { type: 'text', bg: '#1F1F1F', color: '#fff', title: 'Dark mode', desc: 'Auto-adapts to Notion light and dark themes.', col: '2', row: '4 / 5', mobileCol: '2', mobileRow: '4 / 5' },
  /* col 3 */ { type: 'text', bg: '#E8EDFF', title: 'No sign-up', desc: 'Config lives in the URL. No accounts needed.', col: '3', row: '1 / 3', hideOnMobile: true },
  /* col 3 */ { type: 'image', image: '/template-main.png', col: '3', row: '3 / 5', hideOnMobile: true },
  /* col 4 */ { type: 'image', image: '/widget-calendar2.png', col: '4', row: '1 / 4', hideOnMobile: true, hideOnTablet: true },
  /* col 4 */ { type: 'text', bg: '#FFF8E0', title: 'Free forever', desc: 'No premium tier, no limits.', col: '4', row: '4 / 5', hideOnMobile: true, hideOnTablet: true },
];

export const PinterestGallery: React.FC = () => {
  return (
    <PinterestGrid>
      {PIN_ITEMS.map((pin, i) => (
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
