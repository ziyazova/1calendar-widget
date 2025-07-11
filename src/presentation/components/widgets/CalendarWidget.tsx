import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../themes/colors';

interface CalendarWidgetProps {
  widget: Widget;
}

const CalendarContainer = styled.div<{
  $backgroundColor: string;
  $accentColor: string;
  $opacity: number;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
}>`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ $backgroundColor, $opacity }) =>
    $backgroundColor.includes('gradient')
      ? $backgroundColor
      : $opacity < 1
        ? `${$backgroundColor}${Math.round($opacity * 255).toString(16).padStart(2, '0')}`
        : $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MonthTitle = styled.h2<{ $textColor: string }>`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  margin: 0;
  color: ${({ $textColor }) => $textColor};
  background: linear-gradient(45deg, ${({ $textColor }) => $textColor}, ${({ $textColor }) => $textColor}80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavButton = styled.button<{
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ $primaryColor }) => `${$primaryColor}20`};
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 12)}px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${({ $primaryColor }) => `${$primaryColor}40`};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Compact Style Components
const CompactCalendar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CompactToday = styled.div<{ $primaryColor: string; $textColor: string }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  border-radius: 16px;
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}30`};
`;

const CompactDate = styled.div<{ $textColor: string }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  line-height: 1;
`;

const CompactMonth = styled.div<{ $textColor: string }>`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ $textColor }) => `${$textColor}80`};
  margin-top: 4px;
`;

// Regular calendar components
const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WeekDay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ $textColor }) => `${$textColor}70`};
  background: ${({ $accentColor }) => `${$accentColor}30`};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 8)}px;
  backdrop-filter: blur(10px);
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: ${({ $isToday, $primaryColor }) =>
    $isToday
      ? `linear-gradient(135deg, ${$primaryColor}, ${$primaryColor}CC)`
      : 'transparent'};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}30`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius / 2, 10)}px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $isToday }) => $isToday ? '700' : '500'};
  position: relative;
  
  &:hover:not(:disabled) {
    background: ${({ $isToday, $primaryColor }) =>
    $isToday
      ? `linear-gradient(135deg, ${$primaryColor}, ${$primaryColor}CC)`
      : `${$primaryColor}20`};
    transform: scale(1.05);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  ${({ $isToday }) => $isToday && `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      padding: 2px;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3));
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: subtract;
    }
  `}
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekDaysWorkdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const settings = widget.settings as CalendarSettings;
  const [currentDate, setCurrentDate] = useState(new Date());

  const textColor = getContrastColor(settings.backgroundColor);
  const today = new Date();

  // Compact style renders just today's date
  if (settings.style === 'compact') {
    return (
      <CalendarContainer
        $backgroundColor={settings.backgroundColor}
        $accentColor={settings.accentColor}
        $opacity={settings.opacity}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $textColor={textColor}
      >
        <CompactCalendar>
          <CompactToday $primaryColor={settings.primaryColor} $textColor={textColor}>
            <CompactDate $textColor={textColor}>{today.getDate()}</CompactDate>
            <CompactMonth $textColor={textColor}>
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </CompactMonth>
          </CompactToday>
        </CompactCalendar>
      </CalendarContainer>
    );
  }

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
    <CalendarContainer
      $backgroundColor={settings.backgroundColor}
      $accentColor={settings.accentColor}
      $opacity={settings.opacity}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $textColor={textColor}
    >
      <CalendarHeader>
        <NavButton
          $primaryColor={settings.primaryColor}
          $borderRadius={settings.borderRadius}
          $textColor={textColor}
          onClick={goToPreviousMonth}
        >
          <ChevronLeft size={20} />
        </NavButton>

        <MonthTitle $textColor={textColor}>
          {monthNames[month]} {year}
        </MonthTitle>

        <NavButton
          $primaryColor={settings.primaryColor}
          $borderRadius={settings.borderRadius}
          $textColor={textColor}
          onClick={goToNextMonth}
        >
          <ChevronRight size={20} />
        </NavButton>
      </CalendarHeader>

      <WeekDaysGrid>
        {(settings.showWeekends ? weekDays : weekDaysWorkdays).map((day) => (
          <WeekDay
            key={day}
            $accentColor={settings.accentColor}
            $borderRadius={settings.borderRadius}
            $textColor={textColor}
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
    </CalendarContainer>
  );
}; 