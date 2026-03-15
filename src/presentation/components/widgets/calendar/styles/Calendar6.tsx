import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DESIGN_WIDTH = 300;
const DESIGN_HEIGHT = 340;

const SvgWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
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
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MonthTitle = styled.h2<{ $primaryColor: string }>`
  font-size: 16px;
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
  width: 28px;
  height: 28px;
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

  svg { width: 14px; height: 14px; }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 4px;
`;

const WeekDayCell = styled.div<{ $textColor: string }>`
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}70`};
  padding: 4px 0;
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
  padding: 6px 2px;
  border: none;
  background: ${({ $isToday, $primaryColor }) => ($isToday ? $primaryColor : 'transparent')};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  cursor: pointer;
  font-size: 12px;
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
  margin-top: 8px;
`;

export const Calendar6: React.FC<{ settings: CalendarSettings }> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(DESIGN_HEIGHT);
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
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) setContentHeight(h);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SvgWrapper>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${DESIGN_WIDTH} ${contentHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <foreignObject x="0" y="0" width={DESIGN_WIDTH} height={contentHeight}>
          <div ref={contentRef} style={{ width: DESIGN_WIDTH }}>
            <InnerContainer
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

              <Label>SVG ViewBox</Label>
            </InnerContainer>
          </div>
        </foreignObject>
      </svg>
    </SvgWrapper>
  );
};
