import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';
import { WIDGET_CONTAINER, WIDGET_TYPOGRAPHY, WIDGET_SPACING } from '../../../../themes/widgetTokens';
import { useResolvedTheme, adaptColorForDarkMode } from '../../../../hooks/useResolvedTheme';

interface ModernGridZoomProps {
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
  $accentColor: string;
  $textColor: string;
  $debug?: boolean;
}>`
  width: 100%;
  max-width: ${DESIGN_WIDTH}px;
  ${({ $debug }) => $debug && `outline: 2px solid lime; outline-offset: -2px;`}
  height: auto;
  padding: 16px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $textColor }) =>
    $showBorder ? `1px solid ${$textColor}30` : `1px solid ${$textColor}10`};
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

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

const MonthTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: 17px;
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
  width: 26px;
  height: 26px;
  border: 1px solid ${({ $primaryColor }) => `${$primaryColor}60`};
  background: ${({ $primaryColor }) => `${$primaryColor}15`};
  color: ${({ $primaryColor }) => $primaryColor};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 3) + 1, 10)}px;
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
    stroke-width: 2.5;
  }
`;

const WeekDaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  gap: 4px;
  margin-bottom: 4px;
  flex-shrink: 0;
`;

const WeekDay = styled.div<{
  $accentColor: string;
  $borderRadius: number;
  $textColor: string;
  $primaryColor: string;
}>`
  padding: 2px 2px;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ $textColor }) => `${$textColor}85`};
  background: ${({ $accentColor }) => `${$accentColor}20`};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: 1px solid ${({ $accentColor }) => `${$accentColor}35`};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${({ $primaryColor }) => `${$primaryColor}30`};
    color: ${({ $primaryColor }) => $primaryColor};
    border-color: ${({ $primaryColor }) => $primaryColor};
  }
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
  border: ${({ $isToday, $primaryColor, $textColor, $showDayBorders }) => {
    if ($isToday) return `1px solid ${$primaryColor}`;
    if (!$showDayBorders) return '1px solid transparent';
    return `1px solid ${$textColor}15`;
  }};
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) return $primaryColor;
    return 'transparent';
  }};
  color: ${({ $isCurrentMonth, $isToday, $textColor }) => {
    if ($isToday) return '#FFFFFF';
    if (!$isCurrentMonth) return `${$textColor}25`;
    return $textColor;
  }};
  border-radius: ${({ $borderRadius }) => Math.min(Math.round($borderRadius / 4) + 1, 8)}px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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

export const ModernGridZoomFixed: React.FC<ModernGridZoomProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [debug, setDebug] = useState(false);
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const resolvedTheme = useResolvedTheme(settings.theme);
  const isDark = resolvedTheme === 'dark';
  const effectiveBg = isDark ? adaptColorForDarkMode(settings.backgroundColor, 'background') : settings.backgroundColor;
  const effectiveAccent = isDark ? adaptColorForDarkMode(settings.accentColor, 'accent') : settings.accentColor;
  const textColor = getContrastColor(effectiveBg);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data === 'debug-on') setDebug(true);
      if (e.data === 'debug-off') setDebug(false);
      if (e.data === 'toggle-debug') setDebug(prev => !prev);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Detect if running inside embed (iframe)
  const isEmbed = window.location.pathname.includes('/embed/');

  // CSS Zoom scaling
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

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <GridContainer
          $backgroundColor={effectiveBg}
          $borderRadius={settings.borderRadius}
          $showBorder={settings.showBorder}
          $accentColor={effectiveAccent}
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
                $accentColor={effectiveAccent}
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
                $showDayBorders={settings.showDayBorders}
                disabled={!day.isCurrentMonth}
              >
                {day.date.getDate()}
              </DayCell>
            ))}
          </DaysGrid>
        </GridContainer>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
