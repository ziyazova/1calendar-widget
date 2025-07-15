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
  height: 100%;
  max-width: 400px;
  padding: 16px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `2px solid ${$accentColor}` : `1px solid ${$accentColor}40`};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ $accentColor }) => $accentColor} 0%,
      ${({ $accentColor }) => `${$accentColor}80`} 100%
    );
    border-radius: ${({ $borderRadius }) => $borderRadius}px ${({ $borderRadius }) => $borderRadius}px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${({ $accentColor }) => $accentColor};
  }

  @media (max-width: 400px) {
    padding: 12px;
  }

  @media (max-width: 300px) {
    padding: 8px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;

  @media (max-width: 400px) {
    margin-bottom: 12px;
  }

  @media (max-width: 300px) {
    margin-bottom: 8px;
  }
`;

const MonthTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: 18px;
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
  text-align: center;
  flex: 1;

  @media (max-width: 400px) {
    font-size: 16px;
  }

  @media (max-width: 300px) {
    font-size: 14px;
  }
`;

const NavButton = styled.button<{
  $primaryColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 2px solid ${({ $primaryColor }) => `${$primaryColor}60`};
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 8)}px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  
  &:hover {
    background: ${({ $primaryColor }) => $primaryColor};
    color: white;
    border-color: ${({ $primaryColor }) => $primaryColor};
    transform: scale(1.05);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 400px) {
    width: 28px;
    height: 28px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (max-width: 300px) {
    width: 24px;
    height: 24px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const WeekDaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  flex-shrink: 0;

  @media (max-width: 400px) {
    gap: 3px;
    margin-bottom: 6px;
  }

  @media (max-width: 300px) {
    gap: 2px;
    margin-bottom: 4px;
  }
`;

const WeekDay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
  $primaryColor: string;
}>`
  padding: 8px 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}85`};
  background: ${({ $accentColor }) => `${$accentColor}20`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 3, 6)}px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $accentColor }) => `${$accentColor}40`};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    right: 20%;
    height: 2px;
    background: ${({ $primaryColor }) => $primaryColor};
    border-radius: 1px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    background: ${({ $primaryColor }) => `${$primaryColor}30`};
    color: ${({ $primaryColor }) => $primaryColor};
    border-color: ${({ $primaryColor }) => $primaryColor};
    
    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 400px) {
    padding: 6px 2px;
    font-size: 10px;
  }

  @media (max-width: 300px) {
    padding: 4px 1px;
    font-size: 9px;
  }
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 4px;
  flex: 1;
  align-content: start;

  @media (max-width: 400px) {
    gap: 3px;
  }

  @media (max-width: 300px) {
    gap: 2px;
  }
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 8px 4px;
  border: 1px solid ${({ $isToday, $primaryColor, $textColor }) => {
    if ($isToday) return $primaryColor;
    return `${$textColor}15`;
  }};
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) return $primaryColor;
    return 'transparent';
  }};
  color: ${({ $isCurrentMonth, $isToday, $textColor, $primaryColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 3, 6)}px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: ${({ $isToday }) => $isToday ? '700' : '500'};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  
  &:hover:not(:disabled) {
    background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) return $primaryColor;
    return `${$primaryColor}25`;
  }};
    color: ${({ $isToday, $primaryColor }) => {
    if ($isToday) return '#FFFFFF';
    return $primaryColor;
  }};
    border-color: ${({ $primaryColor }) => $primaryColor};
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  ${({ $isToday }) => $isToday && `
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}

  @media (max-width: 400px) {
    padding: 6px 2px;
    font-size: 12px;
    min-height: 28px;
  }

  @media (max-width: 300px) {
    padding: 4px 1px;
    font-size: 10px;
    min-height: 24px;
  }
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const weekDaysWorkdays = ['M', 'T', 'W', 'T', 'F'];

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
          <ChevronLeft />
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
          <ChevronRight />
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