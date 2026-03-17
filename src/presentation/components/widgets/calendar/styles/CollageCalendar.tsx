import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface CollageCalendarProps {
  settings: CalendarSettings;
}

const DESIGN_WIDTH = 318;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZoomWrapper = styled.div<{ $zoom: number }>`
  width: ${DESIGN_WIDTH}px;
  zoom: ${({ $zoom }) => $zoom};
`;

/* Background image container — the collage photo is the entire scene */
const SceneWrapper = styled.div`
  position: relative;
  width: ${DESIGN_WIDTH}px;
  aspect-ratio: ${1460 / 1678};
  background-image: url('/collage-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;

/* White sheet positioned over the background image */
const CalendarOverlay = styled.div<{ $backgroundColor: string }>`
  position: absolute;
  top: 23.8%;
  left: 14.4%;
  width: 64%;
  height: auto;
  background: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  flex-direction: column;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  padding: 10px 10px 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

/* ── Binder clip image ── */
const ClipImage = styled.img`
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  width: 72px;
  height: auto;
  z-index: 10;
  pointer-events: none;
`;

/* ── Header ── */
const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 2px 6px;
`;

const MonthName = styled.h2<{ $color: string }>`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: ${({ $color }) => $color};
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: -0.01em;
`;

const YearText = styled.span<{ $color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

/* ── Navigation ── */
const NavRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  padding: 0 0 2px;
`;

const NavBtn = styled.button<{ $textColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: ${({ $textColor }) => `${$textColor}50`};
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ $textColor }) => $textColor};
  }

  svg {
    width: 12px;
    height: 12px;
    stroke-width: 2;
  }
`;

/* ── Week day headers ── */
const WeekDaysRow = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => $showWeekends ? 7 : 5}, 1fr);
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 6px;
`;

const WeekDayLabel = styled.div<{ $isSunday: boolean; $primaryColor: string; $textColor: string }>`
  text-align: center;
  font-size: 8px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 4px 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: ${({ $isSunday, $primaryColor, $textColor }) =>
    $isSunday ? $primaryColor : `${$textColor}70`};
`;

/* ── Days grid ── */
const DaysGrid = styled.div<{ $showWeekends: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $showWeekends }) => ($showWeekends ? 7 : 5)}, 1fr);
  flex: 1;
  align-content: start;
`;

const DayCell = styled.div<{
  $isCurrentMonth: boolean;
  $isToday: boolean;
  $isSunday: boolean;
  $primaryColor: string;
  $textColor: string;
}>`
  text-align: center;
  padding: 0 2px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isToday }) => $isToday ? '14px' : '11px'};
  font-weight: ${({ $isToday }) => $isToday ? '700' : '400'};
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: ${({ $isCurrentMonth, $isToday, $isSunday, $primaryColor, $textColor }) => {
    if (!$isCurrentMonth) return `${$textColor}18`;
    if ($isToday) return $primaryColor;
    if ($isSunday) return $primaryColor;
    return $textColor;
  }};
  position: relative;
  cursor: default;
`;

/* ── Pushpin SVG ── */
const PushpinWrapper = styled.div`
  position: absolute;
  top: -13px;
  right: -10px;
  width: 17px;
  height: 21px;
  transform: rotate(45deg);
  z-index: 5;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
`;

const Pushpin: React.FC<{ color: string }> = ({ color }) => (
  <PushpinWrapper>
    <svg width="16" height="20" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="6" fill={color} />
      <circle cx="10" cy="8" r="4.5" fill={color} />
      <ellipse cx="8" cy="6.5" rx="2" ry="1.5" fill="rgba(255,255,255,0.35)" />
      <line x1="10" y1="13" x2="10" y2="23" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </PushpinWrapper>
);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDaysSun = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const weekDaysMon = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const weekDaysWork = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

export const CollageCalendar: React.FC<CollageCalendarProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const textColor = getContrastColor(settings.backgroundColor);

  const isEmbed = window.location.pathname.includes('/embed/');

  useEffect(() => {
    if (!outerRef.current) return;
    const maxZoom = isEmbed ? 2.0 : 1.2;
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

  const startOnMonday = settings.weekStart === 'monday';
  if (settings.showWeekends) {
    if (startOnMonday) {
      const day = firstDisplayDay.getDay();
      const offset = day === 0 ? -6 : 1 - day;
      firstDisplayDay.setDate(firstDisplayDay.getDate() + offset);
    } else {
      firstDisplayDay.setDate(firstDisplayDay.getDate() - firstDisplayDay.getDay());
    }
  } else {
    const mondayOffset = firstDisplayDay.getDay() === 0 ? -6 : 1 - firstDisplayDay.getDay();
    firstDisplayDay.setDate(firstDisplayDay.getDate() + mondayOffset);
  }

  const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
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

  const weekDaysArr = settings.showWeekends ? (startOnMonday ? weekDaysMon : weekDaysSun) : weekDaysWork;

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <SceneWrapper>
          <CalendarOverlay $backgroundColor={settings.backgroundColor}>
            <ClipImage src="/collage-clip.png" alt="" />
            {/* Month + Year header */}
            <HeaderRow>
              <MonthName $color={settings.primaryColor}>
                {monthNames[month]}
              </MonthName>
              <YearText $color={settings.primaryColor}>
                {year}
              </YearText>
            </HeaderRow>

            {/* Navigation arrows */}
            <NavRow>
              <NavBtn $textColor={textColor} onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                <ChevronLeft />
              </NavBtn>
              <NavBtn $textColor={textColor} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                <ChevronRight />
              </NavBtn>
            </NavRow>

            {/* Weekday labels */}
            <WeekDaysRow $showWeekends={settings.showWeekends}>
              {weekDaysArr.map((day, i) => (
                <WeekDayLabel
                  key={i}
                  $isSunday={day === 'SUN'}
                  $primaryColor={settings.primaryColor}
                  $textColor={textColor}
                >
                  {day}
                </WeekDayLabel>
              ))}
            </WeekDaysRow>

            {/* Days */}
            <DaysGrid $showWeekends={settings.showWeekends}>
              {days.map((day) => {
                const isSunday = day.date.getDay() === 0;
                return (
                  <DayCell
                    key={day.date.toISOString()}
                    $isCurrentMonth={day.isCurrentMonth}
                    $isToday={day.isToday}
                    $isSunday={isSunday}
                    $primaryColor={settings.primaryColor}
                    $textColor={textColor}
                  >
                    {day.date.getDate()}
                    {day.isToday && <Pushpin color={settings.primaryColor} />}
                  </DayCell>
                );
              })}
            </DaysGrid>
          </CalendarOverlay>
        </SceneWrapper>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
