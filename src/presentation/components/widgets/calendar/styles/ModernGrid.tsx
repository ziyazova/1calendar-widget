import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface ModernGridProps {
  settings: CalendarSettings;
}

const GridContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: 100%;
  max-width: 420px;
  padding: 28px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}30` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(25px);
  box-shadow: 
    0 10px 35px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 15px 45px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const MonthTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${({ $primaryColor }) => $primaryColor} 0%,
    ${({ $primaryColor }) => $primaryColor}CC 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const NavButton = styled.button<{
  $primaryColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ $primaryColor }) => `${$primaryColor}20`} 0%,
    ${({ $primaryColor }) => `${$primaryColor}10`} 100%
  );
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 14)}px;
  cursor: pointer;
  backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}25`};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(
      135deg,
      ${({ $primaryColor }) => `${$primaryColor}35`} 0%,
      ${({ $primaryColor }) => `${$primaryColor}20`} 100%
    );
    transform: scale(1.08);
    border-color: ${({ $primaryColor }) => `${$primaryColor}40`};
    
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
  gap: 10px;
  margin-bottom: 18px;
`;

const WeekDay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
  $primaryColor: string;
}>`
  padding: 14px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $textColor }) => `${$textColor}75`};
  background: linear-gradient(
    135deg,
    ${({ $accentColor }) => `${$accentColor}35`} 0%,
    ${({ $accentColor }) => `${$accentColor}20`} 100%
  );
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 10)}px;
  backdrop-filter: blur(12px);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}15`};
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(
      135deg,
      ${({ $primaryColor }) => `${$primaryColor}25`} 0%,
      ${({ $primaryColor }) => `${$primaryColor}15`} 100%
    );
    color: ${({ $primaryColor }) => $primaryColor};
  }
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 8px;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 16px 8px;
  border: none;
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) {
      return `linear-gradient(
        135deg,
        ${$primaryColor} 0%,
        ${$primaryColor}DD 50%,
        ${$primaryColor}CC 100%
      )`;
    }
    return 'transparent';
  }};
  color: ${({ $isCurrentMonth, $isToday, $textColor, $primaryColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 12)}px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
  font-weight: ${({ $isToday }) => $isToday ? '700' : '500'};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $isToday, $primaryColor }) =>
    $isToday ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
  };
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $primaryColor }) => `
      linear-gradient(
        135deg,
        ${$primaryColor}15 0%,
        ${$primaryColor}08 100%
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
          ${$primaryColor}EE 50%,
          ${$primaryColor}DD 100%
        )`;
    }
    return `linear-gradient(
        135deg,
        ${$primaryColor}20 0%,
        ${$primaryColor}10 100%
      )`;
  }};
    transform: scale(1.05);
    border-color: ${({ $primaryColor }) => `${$primaryColor}30`};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  ${({ $isToday }) => $isToday && `
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  `}
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekDaysWorkdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const ModernGrid: React.FC<ModernGridProps> = ({ settings }) => {
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
    <GridContainer
      $backgroundColor={settings.backgroundColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $accentColor={settings.accentColor}
      $textColor={textColor}
    >
      <CalendarHeader>
        <NavButton
          $primaryColor={settings.primaryColor}
          $borderRadius={settings.borderRadius}
          onClick={goToPreviousMonth}
        >
          <ChevronLeft size={20} />
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
          <ChevronRight size={20} />
        </NavButton>
      </CalendarHeader>

      <WeekDaysGrid $showWeekends={settings.showWeekends}>
        {(settings.showWeekends ? weekDays : weekDaysWorkdays).map((day) => (
          <WeekDay
            key={day}
            $accentColor={settings.accentColor}
            $borderRadius={settings.borderRadius}
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
    </GridContainer>
  );
}; 