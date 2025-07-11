import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface GlassmorphismProps {
  settings: CalendarSettings;
}

const GlassContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
  $primaryColor: string;
}>`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: ${({ $showBorder, $primaryColor }) =>
    $showBorder ? `1px solid rgba(255, 255, 255, 0.18)` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%,
      ${({ $primaryColor }) => `${$primaryColor}15`} 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const MonthTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: ${({ $textColor }) => $textColor};
  letter-spacing: -0.025em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ $primaryColor }) => $primaryColor} 0%,
      ${({ $primaryColor }) => `${$primaryColor}80`} 100%
    );
    border-radius: 2px;
    opacity: 0.7;
  }
`;

const NavButton = styled.button<{
  $primaryColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 12)}px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.3);
    color: ${({ $primaryColor }) => $primaryColor};
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WeekDaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const WeekDay = styled.div<{
  $textColor: string;
  $primaryColor: string;
}>`
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $textColor }) => `${$textColor}90`};
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${({ $primaryColor }) => $primaryColor};
    border-color: rgba(255, 255, 255, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 10px;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 14px 8px;
  border: none;
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) {
      return `linear-gradient(
        135deg,
        ${$primaryColor}CC 0%,
        ${$primaryColor}AA 100%
      )`;
    }
    return 'rgba(255, 255, 255, 0.06)';
  }};
  backdrop-filter: blur(15px);
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}30`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 10)}px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: ${({ $isToday }) => $isToday ? '700' : '500'};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $isToday }) =>
    $isToday ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)'
  };
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $primaryColor }) => `
      radial-gradient(
        circle at center,
        ${$primaryColor}30 0%,
        transparent 70%
      )
    `};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) {
      return `linear-gradient(
          135deg,
          ${$primaryColor} 0%,
          ${$primaryColor}DD 100%
        )`;
    }
    return 'rgba(255, 255, 255, 0.15)';
  }};
    transform: scale(1.08);
    border-color: rgba(255, 255, 255, 0.25);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: ${({ $isToday }) => $isToday ? 0 : 1};
    }
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  ${({ $isToday, $primaryColor }) => $isToday && `
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    
    &::before {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 100%
      );
      opacity: 1;
    }
  `}
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekDaysWorkdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const Glassmorphism: React.FC<GlassmorphismProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const textColor = getContrastColor(settings.backgroundColor);
  const today = new Date();

  // Regular calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDisplayDay = new Date(firstDayOfMonth);

  if (settings.showWeekends) {
    firstDisplayDay.setDate(firstDisplayDay.getDate() - firstDisplayDay.getDay());
  } else {
    const mondayOffset = firstDisplayDay.getDay() === 0 ? -6 : 1 - firstDisplayDay.getDay();
    firstDisplayDay.setDate(firstDisplayDay.getDate() + mondayOffset);
  }

  const days = [];
  const currentDay = new Date(firstDisplayDay);
  const totalDays = settings.showWeekends ? 42 : 30;

  for (let i = 0; i < totalDays; i++) {
    if (!settings.showWeekends && (currentDay.getDay() === 0 || currentDay.getDay() === 6)) {
      currentDay.setDate(currentDay.getDate() + 1);
      continue;
    }

    days.push({
      date: new Date(currentDay),
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: currentDay.toDateString() === today.toDateString(),
    });

    currentDay.setDate(currentDay.getDate() + 1);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <GlassContainer
      $backgroundColor={settings.backgroundColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $accentColor={settings.accentColor}
      $textColor={textColor}
      $primaryColor={settings.primaryColor}
    >
      <CalendarHeader>
        <NavButton
          $primaryColor={settings.primaryColor}
          $borderRadius={settings.borderRadius}
          onClick={goToPreviousMonth}
        >
          <ChevronLeft size={18} />
        </NavButton>

        <MonthTitle
          $textColor={textColor}
          $primaryColor={settings.primaryColor}
        >
          {monthNames[month]} {year}
        </MonthTitle>

        <NavButton
          $primaryColor={settings.primaryColor}
          $borderRadius={settings.borderRadius}
          onClick={goToNextMonth}
        >
          <ChevronRight size={18} />
        </NavButton>
      </CalendarHeader>

      <WeekDaysGrid $showWeekends={settings.showWeekends}>
        {(settings.showWeekends ? weekDays : weekDaysWorkdays).map((day) => (
          <WeekDay
            key={day}
            $textColor={textColor}
            $primaryColor={settings.primaryColor}
          >
            {day}
          </WeekDay>
        ))}
      </WeekDaysGrid>

      <DaysGrid $showWeekends={settings.showWeekends}>
        {days.map((day, index) => (
          <DayCell
            key={index}
            $isCurrentMonth={day.isCurrentMonth}
            $isToday={day.isToday}
            $primaryColor={settings.primaryColor}
            $borderRadius={settings.borderRadius}
            $textColor={textColor}
            disabled={!day.isCurrentMonth}
          >
            {day.date.getDate()}
          </DayCell>
        ))}
      </DaysGrid>
    </GlassContainer>
  );
}; 