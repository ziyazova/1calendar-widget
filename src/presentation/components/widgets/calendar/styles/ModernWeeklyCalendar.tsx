import React, { useState } from 'react';
import styled from 'styled-components';
import { WIDGET_CONTAINER, WIDGET_TYPOGRAPHY, WIDGET_SPACING } from '../../../../themes/widgetTokens';

const GradientWrapper = styled.div`
  position: relative;
  width: 100%;
  min-width: ${WIDGET_CONTAINER.minWidth};
  max-width: ${WIDGET_CONTAINER.maxWidth};
  min-height: ${WIDGET_CONTAINER.minHeight};
  padding: ${WIDGET_CONTAINER.padding};
  border-radius: clamp(16px, 6vw, 28px);
  background: linear-gradient(135deg, #fcb7e2 0%, #a1c4fd 100%);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  box-sizing: border-box;
`;

const ViewToggle = styled.div`
  display: flex;
  margin: clamp(12px, 3vw, 20px) 0 0 0;
  background: rgba(255, 255, 255, 0.35);
  border-radius: clamp(10px, 3vw, 18px);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  padding: clamp(6px, 1.5vw, 10px) clamp(20px, 6vw, 36px);
  font-size: ${WIDGET_TYPOGRAPHY.body};
  font-weight: 500;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#222' : '#555')};
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
`;

const NavRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${WIDGET_SPACING.margin};
`;

const NavArrow = styled.button`
  background: none;
  border: none;
  width: clamp(28px, 8vw, 40px);
  height: clamp(28px, 8vw, 40px);
  min-width: 28px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s;
  opacity: 0.7;
  flex-shrink: 0;

  &:hover {
    color: #f857a6;
    opacity: 1;
  }

  svg {
    width: clamp(14px, 4vw, 20px);
    height: clamp(14px, 4vw, 20px);
  }
`;

const DateRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(4px, 1vw, 12px);
  width: 100%;
  padding: 0 4px;
`;

const MonthText = styled.span`
  font-size: clamp(1.2rem, 5vw, 2.2rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DayText = styled.span`
  font-size: clamp(1.4rem, 6vw, 2.6rem);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${WIDGET_SPACING.gap};
  margin: clamp(12px, 3vw, 20px) 0 0 0;
  width: 100%;
  position: relative;
`;

const WeekDay = styled.div`
  font-size: ${WIDGET_TYPOGRAPHY.small};
  color: #fff;
  font-weight: 500;
  text-align: center;
  z-index: 1;
`;

const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${WIDGET_SPACING.gap};
  margin-top: ${WIDGET_SPACING.gapMedium};
  width: 100%;
  position: relative;
  z-index: 1;
`;

const DayCell = styled.div<{ $today?: boolean }>`
  aspect-ratio: 1;
  min-height: clamp(28px, 8vw, 44px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  color: #fff;
  background: ${({ $today }) =>
    $today ? 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' : 'transparent'};
  border-radius: 50%;
  box-shadow: ${({ $today }) => ($today ? '0 2px 8px rgba(248,87,166,0.18)' : 'none')};
  transition: background 0.2s;
`;

const MonthGrid = styled.div`
  margin-top: ${WIDGET_SPACING.gapMedium};
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 0.5vw, 8px);
`;

const MonthDayCell = styled.div<{ $today?: boolean }>`
  aspect-ratio: 1;
  min-height: clamp(24px, 6vw, 36px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${WIDGET_TYPOGRAPHY.small};
  font-weight: 600;
  color: #fff;
  background: ${({ $today }) =>
    $today ? 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' : 'transparent'};
  border-radius: 50%;
  box-shadow: ${({ $today }) => ($today ? '0 2px 8px rgba(248,87,166,0.18)' : 'none')};
  transition: background 0.2s;
`;

const weekDays = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

function getCurrentWeek(date: Date, weekOffset: number) {
  const dayOfWeek = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix: (number | null)[][] = [];
  let day = 1 - ((firstDay + 6) % 7);
  for (let w = 0; w < 6; w++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      // Только числа текущего месяца
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    matrix.push(week);
  }
  return matrix;
}

export const ModernWeeklyCalendar: React.FC = () => {
  const today = new Date();
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [weekOffset, setWeekOffset] = useState(0);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // Для weekly view вычисляем неделю с учётом смещения
  const weekDates = getCurrentWeek(today, weekOffset);
  // Для monthly view вычисляем матрицу для выбранного месяца
  const monthMatrix = getMonthMatrix(year, month);
  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' });
  const day = today.getDate();
  const isToday = (d: Date) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  // Для monthly view: выделяем сегодня только если месяц совпадает
  const isTodayMonth = (d: number | null) => d === day && month === today.getMonth() && year === today.getFullYear();

  // Переключение месяцев
  const handleMonthChange = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  // Переключение недель
  const handleWeekChange = (delta: number) => {
    setWeekOffset(weekOffset + delta);
  };

  // Сброс смещений при смене view
  const handleViewChange = (v: 'weekly' | 'monthly') => {
    setView(v);
    setWeekOffset(0);
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  return (
    <GradientWrapper>
      <ViewToggle>
        <ToggleButton $active={view === 'weekly'} onClick={() => handleViewChange('weekly')}>Weekly</ToggleButton>
        <ToggleButton $active={view === 'monthly'} onClick={() => handleViewChange('monthly')}>Monthly</ToggleButton>
      </ViewToggle>
      <NavRow>
        <NavArrow onClick={view === 'weekly' ? () => handleWeekChange(-1) : () => handleMonthChange(-1)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavArrow>
        <DateRow>
          <MonthText>{monthName}</MonthText>
          <DayText>{view === 'weekly' ? `${weekDates[0].getDate()} - ${weekDates[6].getDate()}` : year}</DayText>
        </DateRow>
        <NavArrow onClick={view === 'weekly' ? () => handleWeekChange(1) : () => handleMonthChange(1)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 4L11.5 9L6.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavArrow>
      </NavRow>
      {view === 'weekly' ? (
        <>
          <WeekRow>
            {weekDays.map((wd) => (
              <WeekDay key={wd}>{wd}</WeekDay>
            ))}
          </WeekRow>
          <DaysRow>
            {weekDates.map((d) => (
              <DayCell key={d.toISOString()} $today={isToday(d)}>
                {d.getDate()}
              </DayCell>
            ))}
          </DaysRow>
        </>
      ) : (
        <>
          <WeekRow>
            {weekDays.map((wd) => (
              <WeekDay key={wd}>{wd}</WeekDay>
            ))}
          </WeekRow>
          <MonthGrid>
            {monthMatrix.flat().map((d, i) => (
              <MonthDayCell key={d != null ? `d-${d}` : `empty-${i}`} $today={isTodayMonth(d)}>
                {d || ''}
              </MonthDayCell>
            ))}
          </MonthGrid>
        </>
      )}
    </GradientWrapper>
  );
}; 