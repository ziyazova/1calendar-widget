import styled from 'styled-components';

export const WeatherWidgetContainer = styled.div<{
  $backgroundColor?: string;
  $accentColor?: string;
  $borderRadius?: number;
  $showBorder?: boolean;
  $textColor?: string;
  $style?: string;
}>`
  width: 100%;
  max-width: 350px;
  padding: 16px;
  background: ${({ $backgroundColor }) => $backgroundColor || 'transparent'};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor || '#000'}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius || 12}px;
  color: ${({ $textColor }) => $textColor || 'inherit'};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`; 