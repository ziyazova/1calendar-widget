import React from 'react';
import styled from 'styled-components';

interface AestheticCalendarProps {
  backgroundImage?: string;
}

const CalendarWrapper = styled.div<{ $bg?: string }>`
  position: relative;
  width: 340px;
  height: 360px;
  border-radius: 24px;
  overflow: hidden;
  background: ${({ $bg }) => $bg ? `url(${$bg}) center/cover no-repeat` : '#eaeaea'};
  box-shadow: 0 4px 32px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(6px);
    z-index: 1;
  }
`;

const DateTitle = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 32px;
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  text-align: center;
`;

const CalendarBox = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 24px;
  background: #fff;
  border-radius: 18px;
  padding: 18px 18px 12px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  width: 90%;
`;

const WeekRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DayCell = styled.div<{ $today?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ $today }) => $today ? '#a67c52' : '#222'};
  border-radius: 50%;
  border: ${({ $today }) => $today ? '2px solid #a67c52' : 'none'};
  background: ${({ $today }) => $today ? 'rgba(166,124,82,0.07)' : 'transparent'};
  transition: background 0.2s;
`;

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix: (number | null)[][] = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6; w++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    matrix.push(week);
  }
  return matrix;
}

export const AestheticCalendar: React.FC<AestheticCalendarProps> = ({ backgroundImage }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const monthMatrix = getMonthMatrix(year, month);
  const monthName = today.toLocaleString('en-US', { month: 'long' }).toUpperCase();

  return (
    <CalendarWrapper $bg={backgroundImage}>
      <DateTitle>
        {monthName} {day}, {year}
      </DateTitle>
      <CalendarBox>
        <WeekRow>
          {weekDays.map((wd) => (
            <DayCell key={wd} style={{ color: '#a67c52', fontWeight: 600 }}>{wd}</DayCell>
          ))}
        </WeekRow>
        {monthMatrix.map((week, i) => (
          <WeekRow key={i}>
            {week.map((d, j) => (
              <DayCell key={j} $today={d === day && today.getMonth() === month && today.getFullYear() === year}>
                {d || ''}
              </DayCell>
            ))}
          </WeekRow>
        ))}
      </CalendarBox>
    </CalendarWrapper>
  );
}; 