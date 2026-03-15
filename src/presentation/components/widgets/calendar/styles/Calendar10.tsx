import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DESIGN_WIDTH = 270;

const ScaleWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Container = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
  $scale: number;
}>`
  width: ${DESIGN_WIDTH}px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}` : `1px solid ${$accentColor}40`};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06);
  transform: scale(${({ $scale }) => $scale});
  transform-origin: center center;
  transition: transform 0.15s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MonthTitle = styled.h2<{ $primaryColor: string }>`
  font-size: 15px;
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
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 3) + 1, 10)}px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primaryColor }) => $primaryColor};
    color: white;
    border-color: ${({ $primaryColor }) => $primaryColor};
  }

  svg { width: 13px; height: 13px; }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
`;

const WeekDayCell = styled.div<{ $textColor: string }>`
  text-align: center;
  font-size: 9px;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}70`};
  padding: 3px 0;
  text-transform: uppercase;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
}>`
  padding: 5px 2px;
  border: none;
  background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : 'transparent')};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  cursor: pointer;
  font-size: 11px;
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
  margin-top: 6px;
`;

export const Calendar10: React.FC<{ settings: CalendarSettings }> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && event.data.type === 'container-resize') {
        const { width, height } = event.data;
        if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
          const innerEl = containerRef.current;
          if (!innerEl) return;
          const naturalHeight = innerEl.offsetHeight;
          const scaleX = width / DESIGN_WIDTH;
          const scaleY = height / naturalHeight;
          const newScale = Math.min(scaleX, scaleY);
          setScale(Math.max(0.25, Math.min(2.0, newScale)));
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Send natural dimensions to parent on mount
    const sendDimensions = () => {
      const innerEl = containerRef.current;
      if (!innerEl) return;
      const naturalHeight = innerEl.offsetHeight;
      window.parent.postMessage(
        {
          type: 'calendar-dimensions',
          width: DESIGN_WIDTH,
          height: naturalHeight,
        },
        '*'
      );
    };

    // Small delay to ensure layout is complete
    const timer = setTimeout(sendDimensions, 50);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [currentDate]);

  return (
    <ScaleWrapper>
      <Container
        ref={containerRef}
        $backgroundColor={settings.backgroundColor}
        $borderRadius={settings.borderRadius}
        $showBorder={settings.showBorder}
        $accentColor={settings.accentColor}
        $textColor={textColor}
        $scale={scale}
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

        <Label>PostMessage {scale !== 1 ? `(${scale.toFixed(2)}x)` : ''}</Label>
      </Container>
    </ScaleWrapper>
  );
};
