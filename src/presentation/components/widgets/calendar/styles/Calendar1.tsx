import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ScaleOrigin = styled.div<{ $scale: number }>`
  width: 270px;
  transform-origin: top left;
  transform: scale(${({ $scale }) => $scale});
`;

const Container = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: 270px;
  padding: 14px;
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
  margin-bottom: 10px;
`;

const MonthTitle = styled.h2<{ $primaryColor: string }>`
  font-size: 14px;
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
  width: 26px;
  height: 26px;
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

  svg { width: 14px; height: 14px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const WeekDayCell = styled.div<{ $textColor: string }>`
  padding: 3px 0;
  text-align: center;
  font-size: 9px;
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
  padding: 4px;
  border: none;
  background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : 'transparent')};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 6)}px;
  cursor: pointer;
  font-size: 11px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : `${$primaryColor}25`)};
  }
`;

const ApproachLabel = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 8px;
  text-align: left;
`;

export const Calendar1: React.FC<{ settings: CalendarSettings }> = ({ settings }) => {
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

  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!outerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        setScale(Math.max(0.25, parentWidth / 270));
      }
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <OuterWrapper ref={outerRef}>
      <ScaleOrigin $scale={scale}>
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
          <ApproachLabel>Scale Transform</ApproachLabel>
        </Container>
      </ScaleOrigin>
    </OuterWrapper>
  );
};
