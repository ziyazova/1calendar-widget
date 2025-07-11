import React from 'react';
import styled from 'styled-components';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface CompactDateProps {
  settings: CalendarSettings;
}

const CompactContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
`;

const DateNumber = styled.div<{ $textColor: string; $primaryColor: string }>`
  font-size: 4.5rem;
  font-weight: 800;
  color: ${({ $textColor }) => $textColor};
  line-height: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.05em;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    135deg,
    ${({ $primaryColor }) => $primaryColor} 0%,
    ${({ $primaryColor }) => $primaryColor}CC 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
  
  @keyframes glow {
    from {
      filter: drop-shadow(0 0 5px ${({ $primaryColor }) => $primaryColor}40);
    }
    to {
      filter: drop-shadow(0 0 15px ${({ $primaryColor }) => $primaryColor}60);
    }
  }
`;

const MonthYear = styled.div<{ $textColor: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $textColor }) => `${$textColor}90`};
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const DayOfWeek = styled.div<{ $textColor: string; $accentColor: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}70`};
  margin-bottom: 8px;
  padding: 8px 16px;
  background: ${({ $accentColor }) => `${$accentColor}30`};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const CompactDate: React.FC<CompactDateProps> = ({ settings }) => {
  const today = new Date();
  const textColor = getContrastColor(settings.backgroundColor);

  return (
    <CompactContainer
      $backgroundColor={settings.backgroundColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $accentColor={settings.accentColor}
      $textColor={textColor}
    >
      <DayOfWeek $textColor={textColor} $accentColor={settings.accentColor}>
        {dayNames[today.getDay()]}
      </DayOfWeek>

      <DateNumber $textColor={textColor} $primaryColor={settings.primaryColor}>
        {today.getDate()}
      </DateNumber>

      <MonthYear $textColor={textColor}>
        {monthNames[today.getMonth()]} {today.getFullYear()}
      </MonthYear>
    </CompactContainer>
  );
}; 