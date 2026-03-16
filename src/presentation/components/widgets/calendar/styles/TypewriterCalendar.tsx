import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';
import { useResolvedTheme, adaptColorForDarkMode } from '../../../../hooks/useResolvedTheme';

interface TypewriterCalendarProps {
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

/* Background image container — the typewriter photo is the entire scene */
const TYPEWRITER_IMAGES: Record<string, string> = {
  blue: '/typewriter-blue.png',
  green: '/typewriter-green.png',
  pink: '/typewriter-pink.png',
  brown: '/typewriter-brown.png',
  beige: '/typewriter-beige.png',
};

const SceneWrapper = styled.div<{ $bgImage: string }>`
  position: relative;
  width: ${DESIGN_WIDTH}px;
  aspect-ratio: ${721 / 822};
  background-image: url('${({ $bgImage }) => $bgImage}');
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;

/* Calendar sheet positioned over the paper area of the typewriter */
const CalendarOverlay = styled.div<{ $backgroundColor: string }>`
  position: absolute;
  top: calc(5% + 20px);
  left: 19%;
  width: 62%;
  height: 48%;
  background: transparent;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', Courier, monospace;
  box-sizing: border-box;
  padding: 0 4px 4px;
`;

/* ── Header ── */
const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 2px 6px;
`;

const MonthName = styled.h2<{ $textColor: string }>`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: ${({ $textColor }) => $textColor};
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const YearText = styled.span<{ $textColor: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $textColor }) => $textColor};
  font-family: 'Courier New', Courier, monospace;
`;

/* ── Navigation ── */
const NavRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  padding: 24px 0 0;
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
  margin-top: 4px;
  margin-bottom: 4px;
`;

const WeekDayLabel = styled.div<{ $isSunday: boolean; $primaryColor: string; $textColor: string }>`
  text-align: center;
  font-size: 7px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 0;
  font-family: 'Courier New', Courier, monospace;
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
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isToday }) => $isToday ? '13px' : '10px'};
  font-weight: ${({ $isToday }) => $isToday ? '700' : '400'};
  font-family: 'Courier New', Courier, monospace;
  color: ${({ $isCurrentMonth, $isToday, $isSunday, $primaryColor, $textColor }) => {
    if (!$isCurrentMonth) return `${$textColor}12`;
    if ($isToday) return $primaryColor;
    if ($isSunday) return $primaryColor;
    return $textColor;
  }};
  position: relative;
  cursor: default;
`;

/* ── Pen circle around today ── */
const PenCircle = styled.div<{ $color: string }>`
  position: absolute;
  top: -1px;
  left: -2px;
  right: -2px;
  bottom: -1px;
  border: 1px solid ${({ $color }) => $color};
  border-radius: 45% 55% 50% 48% / 52% 46% 54% 50%;
  pointer-events: none;
  transform: rotate(-5deg) scaleX(1.05);
`;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDaysFull = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const weekDaysWork = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

export const TypewriterCalendar: React.FC<TypewriterCalendarProps> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);
  const resolvedTheme = useResolvedTheme(settings.theme);
  const isDark = resolvedTheme === 'dark';
  const effectiveBg = isDark ? adaptColorForDarkMode(settings.backgroundColor, 'background') : settings.backgroundColor;
  const textColor = getContrastColor(settings.backgroundColor);

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

  const weekDaysArr = settings.showWeekends ? weekDaysFull : weekDaysWork;

  return (
    <OuterWrapper ref={outerRef}>
      <ZoomWrapper $zoom={zoom}>
        <SceneWrapper $bgImage={TYPEWRITER_IMAGES[settings.typewriterColor] || TYPEWRITER_IMAGES.blue}>
          <CalendarOverlay $backgroundColor={effectiveBg}>
            {/* Month + Year header */}
            <HeaderRow>
              <MonthName $textColor={textColor}>
                {monthNames[month]}
              </MonthName>
              <YearText $textColor={textColor}>
                {year}
              </YearText>
            </HeaderRow>

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
                    {day.isToday && <PenCircle $color={settings.primaryColor} />}
                  </DayCell>
                );
              })}
            </DaysGrid>

            {/* Navigation arrows */}
            <NavRow>
              <NavBtn $textColor={textColor} onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                <ChevronLeft />
              </NavBtn>
              <NavBtn $textColor={textColor} onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                <ChevronRight />
              </NavBtn>
            </NavRow>
          </CalendarOverlay>
        </SceneWrapper>
      </ZoomWrapper>
    </OuterWrapper>
  );
};
