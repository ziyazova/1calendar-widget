import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';
import { WIDGET_CONTAINER, WIDGET_TYPOGRAPHY, WIDGET_SPACING } from '../../../../themes/widgetTokens';

interface ModernGridProps {
  settings: CalendarSettings;
}

const GridContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
  $debug?: boolean;
}>`
  width: 100%;
  max-width: ${WIDGET_CONTAINER.maxWidth};
  ${({ $debug }) => $debug && `outline: 2px solid lime; outline-offset: -2px;`}
  height: auto;
  padding: ${WIDGET_CONTAINER.padding};
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
    border-radius: ${({ $borderRadius }) => $borderRadius}px
      ${({ $borderRadius }) => $borderRadius}px 0 0;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${({ $accentColor }) => $accentColor};
  }

`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${WIDGET_SPACING.margin};
  flex-shrink: 0;
`;

const MonthTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: ${WIDGET_TYPOGRAPHY.heading};
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
`;

const NavButton = styled.button<{
  $primaryColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
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
  flex-shrink: 1;
  min-width: 24px;

  &:hover {
    background: ${({ $primaryColor }) => $primaryColor};
    color: white;
    border-color: ${({ $primaryColor }) => $primaryColor};
    transform: scale(1.02);
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const WeekDaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: ${WIDGET_SPACING.gap};
  margin-bottom: ${WIDGET_SPACING.gapMedium};
  flex-shrink: 0;
`;

const WeekDay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
  $primaryColor: string;
}>`
  padding: 4px 2px;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}85`};
  background: ${({ $accentColor }) => `${$accentColor}20`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 3, 6)}px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $accentColor }) => `${$accentColor}50`};
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
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => ($showWeekends ? 7 : 5)}, 1fr);
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: ${WIDGET_SPACING.gap};
  align-content: start;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 5px;
  border: 1px solid ${({ $isToday, $primaryColor, $textColor }) => {
    if ($isToday) return $primaryColor;
    return `${$textColor}20`;
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
  font-size: ${WIDGET_TYPOGRAPHY.body};
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '500')};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;

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
    transform: scale(1.02);
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

  ${({ $isToday }) =>
    $isToday &&
    `
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const weekDaysWorkdays = ['M', 'T', 'W', 'T', 'F'];

export const ModernGrid: React.FC<ModernGridProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [debug, setDebug] = useState(false);
  const textColor = getContrastColor(settings.backgroundColor);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'debug-on') setDebug(true);
      if (e.data === 'debug-off') setDebug(false);
      if (e.data === 'toggle-debug') setDebug(prev => !prev);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
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
  // Render 5 calendar rows
  const totalDays = settings.showWeekends ? 35 : 25;

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
      $debug={debug}
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
        {(settings.showWeekends ? weekDays : weekDaysWorkdays).map((day, index) => (
          <WeekDay
            key={index}
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
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
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