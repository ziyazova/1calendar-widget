import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor, getLuminance } from '../../../../themes/colors';
import { WIDGET_TYPOGRAPHY } from '../../../../themes/widgetTokens';
import { useResolvedTheme, adaptColorForDarkMode } from '../../../../hooks/useResolvedTheme';

interface ClassicCalendarProps {
  settings: CalendarSettings;
}

const DESIGN_WIDTH = 268;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomWrapper = styled.div<{ $zoom: number }>`
  width: ${DESIGN_WIDTH}px;
  zoom: ${({ $zoom }) => $zoom};
`;

const GridContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $textColor: string;
}>`
  width: 100%;
  max-width: ${DESIGN_WIDTH}px;
  height: auto;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $textColor }) =>
    $showBorder ? `1px solid ${$textColor}20` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderBar = styled.div<{
  $primaryColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ $primaryColor }) => $primaryColor};
  opacity: 0.85;
  border-radius: ${({ $borderRadius }) => $borderRadius}px ${({ $borderRadius }) => $borderRadius}px 0 0;
  flex-shrink: 0;
  color: ${({ $primaryColor }) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($primaryColor);
    if (!result) return '#ffffff';
    const [r, g, b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      .map(c => { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 0.5 ? '#000000' : '#ffffff';
  }};
`;

const MonthTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: inherit;
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  text-align: center;
  flex: 1;
`;

const NavArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.15s ease;
  padding: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.5;
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }
`;

const CalendarBody = styled.div`
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
`;

const WeekDaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 4px;
  margin-bottom: 6px;
  flex-shrink: 0;
`;

const WeekDay = styled.div`
  padding: 4px 2px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.55;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => ($showWeekends ? 7 : 5)}, 1fr);
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 4px;
  align-content: start;
`;

const DayCell = styled.button<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $primaryColor: string;
  $borderRadius: number;
  $textColor: string;
  $showDayBorders: boolean;
}>`
  padding: 6px;
  border: ${({ $isToday, $textColor, $showDayBorders }) => {
    if (!$showDayBorders) return '1px solid transparent';
    return `1px solid ${$textColor}10`;
  }};
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) return `${$primaryColor}30`;
    return 'transparent';
  }};
  color: ${({ $isCurrentMonth, $isToday, $textColor, $primaryColor }) => {
    if ($isToday) {
      // If primary is too light, use text color instead
      const lum = (() => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($primaryColor);
        if (!result) return 1;
        const [r, g, b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
          .map(c => { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      })();
      return lum > 0.7 ? $textColor : $primaryColor;
    }
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: ${WIDGET_TYPOGRAPHY.body};
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;

  &:hover:not(:disabled) {
    background: ${({ $isToday, $primaryColor }) => {
      if ($isToday) return `${$primaryColor}40`;
      return `${$primaryColor}15`;
    }};
    color: ${({ $primaryColor }) => $primaryColor};
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const weekDaysWorkdays = ['M', 'T', 'W', 'T', 'F'];

export const ClassicCalendar: React.FC<ClassicCalendarProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const resolvedTheme = useResolvedTheme(settings.theme);
  const isDark = resolvedTheme === 'dark';
  const effectiveBg = isDark ? adaptColorForDarkMode(settings.backgroundColor, 'background') : settings.backgroundColor;
  const effectiveAccent = isDark ? adaptColorForDarkMode(settings.accentColor, 'accent') : settings.accentColor;
  const textColor = getContrastColor(effectiveBg);

  const isEmbed = window.location.pathname.includes('/embed/');

  useEffect(() => {
    if (!outerRef.current) return;
    const maxZoom = isEmbed ? 2.0 : 1.0;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const parentWidth = entry.contentRect.width;
        setZoom(Math.min(maxZoom, Math.max(0.25, parentWidth / DESIGN_WIDTH)));
      }
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [isEmbed]);

  const today = new Date();
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

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <GridContainer
          $backgroundColor={effectiveBg}
          $borderRadius={settings.borderRadius}
          $showBorder={settings.showBorder}
          $textColor={textColor}
        >
          <HeaderBar
            $primaryColor={settings.primaryColor}
            $borderRadius={settings.borderRadius}
          >
            <NavArrow onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <ChevronLeft />
            </NavArrow>

            <MonthTitle>
              {monthNames[month]} {year}
            </MonthTitle>

            <NavArrow onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <ChevronRight />
            </NavArrow>
          </HeaderBar>

          <CalendarBody>
            <WeekDaysGrid $showWeekends={settings.showWeekends}>
              {(settings.showWeekends ? weekDays : weekDaysWorkdays).map((day, index) => (
                <WeekDay key={index}>
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
                  $showDayBorders={settings.showDayBorders}
                  disabled={!day.isCurrentMonth}
                >
                  {day.date.getDate()}
                </DayCell>
              ))}
            </DaysGrid>
          </CalendarBody>
        </GridContainer>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
