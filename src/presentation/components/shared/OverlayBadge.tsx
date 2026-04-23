import styled from 'styled-components';

/**
 * OverlayBadge — glass pill pinned top-left of card art. Used for
 * widget-type tags on studio preview cards ("Calendar" / "Clock" /
 * "Board") and for "New"-style markers on template cards.
 *
 * Tones:
 *   neutral — dark text on glass (template "New" badges)
 *   accent  — indigo text, semibold (studio widget-type tags)
 */

export type OverlayBadgeTone = 'neutral' | 'accent';

export const OverlayBadge = styled.span<{ $tone?: OverlayBadgeTone }>`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  font-size: 11px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  z-index: 1;

  color: ${({ $tone = 'neutral', theme }) =>
    $tone === 'accent' ? '#6366F1' : theme.colors.text.primary};
  font-weight: ${({ $tone = 'neutral' }) =>
    $tone === 'accent' ? 600 : 500};
`;
