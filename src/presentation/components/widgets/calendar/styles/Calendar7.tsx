import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const Container = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: clamp(200px, 60vw, 400px);
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}` : `1px solid ${$accentColor}40`};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  padding: clamp(8px, 2.5vw, 20px);
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(6px, 2vw, 14px);
`;

const MonthTitle = styled.h2<{ $primaryColor: string }>`
  font-size: clamp(12px, 3vw, 20px);
  font-weight: 700;
  margin: 0;
  color: ${({ $primaryColor }) => $primaryColor};
  text-align: center;
  flex: 1;
`;

const NavBtn = styled.button<{ $primaryColor: string; $borderRadius: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(22px, 5vw, 32px);
  height: clamp(22px, 5vw, 32px);
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}60`};
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 3) + 1, 10)}px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primaryColor }) => $primaryColor};
    color: white;
    border-color: ${({ $primaryColor }) => $primaryColor};
  }

  svg {
    width: clamp(12px, 2.5vw, 16px);
    height: clamp(12px, 2.5vw, 16px);
  }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(1px, 0.5vw, 4px);
  margin-bottom: clamp(2px, 0.8vw, 6px);
`;

const WeekDayCell = styled.div<{ $textColor: string }>`
  text-align: center;
  font-size: clamp(8px, 1.8vw, 12px);
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}70`};
  padding: clamp(2px, 0.5vw, 6px) 0;
  text-transform: uppercase;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(1px, 0.5vw, 4px);
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: clamp(3px, 1vw, 8px) clamp(1px, 0.3vw, 4px);
  border: none;
  background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : 'transparent')};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  cursor: pointer;
  font-size: clamp(9px, 2vw, 14px);
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  font-family: inherit;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : `${$primaryColor}25`)};
    color: ${({ $isToday, $primaryColor }) => ($isToday ? '#FFFFFF' : $primaryColor)};
  }

  ${({ $isToday }) => $isToday && `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);`}
`;

const Label = styled.div`
  text-align: center;
  font-size: 10px;
  color: #999;
  margin-top: clamp(4px, 1vw, 10px);
`;

export const Calendar7: React.FC<{ settings: CalendarSettings }> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const textColor = getContrastColor(settings.backgroundColor);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDisplayDay = new Date(firstDayOfMonth);
  firstDisplayDay.setDate(firstDisplayDay.getDate() - firstDisplayDay.getDay());

  const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
  const currentDay = new Date(firstDisplayDay);
  for (let i = 0; i < 35; i++) {
    days.push({
      date: new Date(currentDay),
      isCurrentMonth: currentDay.getMonth() === month,
      isToday: currentDay.toDateString() === today.toDateString(),
    });
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <Container
      $backgroundColor={settings.backgroundColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $accentColor={settings.accentColor}
      $textColor={textColor}
    >
      <Header>
        <NavBtn $primaryColor={settings.primaryColor} $borderRadius={settings.borderRadius} onClick={goToPreviousMonth}>
          <ChevronLeft />
        </NavBtn>
        <MonthTitle $primaryColor={settings.primaryColor}>
          {monthNames[month]} {year}
        </MonthTitle>
        <NavBtn $primaryColor={settings.primaryColor} $borderRadius={settings.borderRadius} onClick={goToNextMonth}>
          <ChevronRight />
        </NavBtn>
      </Header>

      <WeekRow>
        {weekDayLabels.map((d, i) => (
          <WeekDayCell key={i} $textColor={textColor}>{d}</WeekDayCell>
        ))}
      </WeekRow>

      <DaysGrid>
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
            $isCurrentMonth={day.isCurrentMonth}
            $isToday={day.isToday}
            $primaryColor={settings.primaryColor}
            $borderRadius={settings.borderRadius}
            $textColor={textColor}
          >
            {day.date.getDate()}
          </DayCell>
        ))}
      </DaysGrid>

      <Label>Viewport Units</Label>
    </Container>
  );
};
