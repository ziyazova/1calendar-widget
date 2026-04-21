import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ContainerQuery = styled.div`
  width: 100%;
  container-type: inline-size;
  container-name: calendar;
`;

const Inner = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: 100%;
  max-width: 246px;
  padding: 4cqi;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}` : `1px solid ${$accentColor}40`};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3cqi;
`;

const MonthTitle = styled.h2<{ $primaryColor: string }>`
  font-size: 6cqi;
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
  width: 8cqi;
  height: 8cqi;
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}60`};
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 3) + 1, 8)}px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primaryColor }) => $primaryColor};
    color: white;
  }

  svg {
    width: 5cqi;
    height: 5cqi;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1cqi;
`;

const WeekDayCell = styled.div<{ $textColor: string }>`
  padding: 1cqi 0;
  text-align: center;
  font-size: 3.2cqi;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}70`};
  text-transform: uppercase;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 1.5cqi;
  border: none;
  background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : 'transparent')};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 6)}px;
  cursor: pointer;
  font-size: 4cqi;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 7cqi;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : `${$primaryColor}25`)};
  }
`;

const ApproachLabel = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 2cqi;
  text-align: left;
`;

export const Calendar4: React.FC<{ settings: CalendarSettings }> = ({ settings }) => {
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
    <ContainerQuery>
      <Inner
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
        <Grid>
          {weekDayLabels.map((d, i) => (
            <WeekDayCell key={i} $textColor={textColor}>{d}</WeekDayCell>
          ))}
        </Grid>
        <Grid>
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
        </Grid>
        <ApproachLabel>Container Query</ApproachLabel>
      </Inner>
    </ContainerQuery>
  );
};
