import React from 'react';
import styled from 'styled-components';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface WeeklyTimelineProps {
  settings: CalendarSettings;
}

const TimelineContainer = styled.div<{
  $backgroundColor: string;
  $borderRadius: number;
  $showBorder: boolean;
  $accentColor: string;
  $textColor: string;
}>`
  width: 100%;
  max-width: 500px;
  padding: 24px;
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $showBorder, $accentColor }) =>
    $showBorder ? `1px solid ${$accentColor}40` : 'none'};
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  color: ${({ $textColor }) => $textColor};
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const TimelineHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const WeekTitle = styled.h2<{ $textColor: string; $primaryColor: string }>`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  background: linear-gradient(
    135deg,
    ${({ $primaryColor }) => $primaryColor} 0%,
    ${({ $primaryColor }) => $primaryColor}AA 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const WeekRange = styled.div<{ $textColor: string }>`
  font-size: 14px;
  color: ${({ $textColor }) => `${$textColor}70`};
  font-weight: 500;
`;

const DaysTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DayRow = styled.div<{
  $isToday: boolean;
  $primaryColor: string;
  $accentColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background: ${({ $isToday, $primaryColor, $accentColor }) => {
    if ($isToday) {
      return `linear-gradient(
        135deg,
        ${$primaryColor}20 0%,
        ${$primaryColor}10 100%
      )`;
    }
    return `${$accentColor}15`;
  }};
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 16)}px;
  border: ${({ $isToday, $primaryColor }) =>
    $isToday ? `2px solid ${$primaryColor}40` : '1px solid rgba(255, 255, 255, 0.1)'
  };
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background: ${({ $isToday, $primaryColor }) =>
    $isToday ? $primaryColor : 'transparent'
  };
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: ${({ $primaryColor }) => `${$primaryColor}25`};
    transform: translateX(8px);
    border-color: ${({ $primaryColor }) => `${$primaryColor}50`};
    
    &::before {
      height: 80%;
      background: ${({ $primaryColor }) => $primaryColor};
    }
  }
`;

const DayInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
`;

const DayName = styled.div<{ $textColor: string; $isToday: boolean; $primaryColor: string }>`
  font-size: 16px;
  font-weight: ${({ $isToday }) => $isToday ? '700' : '600'};
  color: ${({ $isToday, $textColor, $primaryColor }) =>
    $isToday ? $primaryColor : $textColor
  };
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const DayDate = styled.div<{ $textColor: string; $isToday: boolean }>`
  font-size: 13px;
  color: ${({ $textColor, $isToday }) =>
    $isToday ? `${$textColor}90` : `${$textColor}60`
  };
  font-weight: 500;
`;

const DayNumber = styled.div<{
  $isToday: boolean;
  $primaryColor: string;
  $textColor: string;
  $borderRadius: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ $isToday, $primaryColor }) => {
    if ($isToday) {
      return `linear-gradient(
        135deg,
        ${$primaryColor} 0%,
        ${$primaryColor}CC 100%
      )`;
    }
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${({ $isToday, $textColor }) =>
    $isToday ? '#FFFFFF' : $textColor
  };
  border-radius: ${({ $borderRadius }) => Math.min($borderRadius, 12)}px;
  font-size: 18px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  border: ${({ $isToday, $primaryColor }) =>
    $isToday ? 'none' : `1px solid rgba(255, 255, 255, 0.2)`
  };
  box-shadow: ${({ $isToday }) =>
    $isToday ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none'
  };
  transition: all 0.3s ease;
`;

const EventDot = styled.div<{ $primaryColor: string }>`
  width: 8px;
  height: 8px;
  background: ${({ $primaryColor }) => $primaryColor};
  border-radius: 50%;
  margin-left: 12px;
  opacity: 0.7;
`;

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({ settings }) => {
  const textColor = getContrastColor(settings.backgroundColor);
  const today = new Date();

  // Get current week
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day;
  startOfWeek.setDate(diff);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    if (!settings.showWeekends && (i === 0 || i === 6)) continue;

    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    weekDays.push({
      date,
      isToday: date.toDateString() === today.toDateString(),
      dayName: dayNames[date.getDay()],
      hasEvent: Math.random() > 0.7, // Random events for demo
    });
  }

  const startDate = weekDays[0].date;
  const endDate = weekDays[weekDays.length - 1].date;

  return (
    <TimelineContainer
      $backgroundColor={settings.backgroundColor}
      $borderRadius={settings.borderRadius}
      $showBorder={settings.showBorder}
      $accentColor={settings.accentColor}
      $textColor={textColor}
    >
      <TimelineHeader>
        <WeekTitle $textColor={textColor} $primaryColor={settings.primaryColor}>
          Week Timeline
        </WeekTitle>
        <WeekRange $textColor={textColor}>
          {monthNames[startDate.getMonth()]} {startDate.getDate()} - {monthNames[endDate.getMonth()]} {endDate.getDate()}, {today.getFullYear()}
        </WeekRange>
      </TimelineHeader>

      <DaysTimeline>
        {weekDays.map((day, index) => (
          <DayRow
            key={index}
            $isToday={day.isToday}
            $primaryColor={settings.primaryColor}
            $accentColor={settings.accentColor}
            $borderRadius={settings.borderRadius}
          >
            <DayNumber
              $isToday={day.isToday}
              $primaryColor={settings.primaryColor}
              $textColor={textColor}
              $borderRadius={settings.borderRadius}
            >
              {day.date.getDate()}
            </DayNumber>

            <DayInfo>
              <DayName
                $textColor={textColor}
                $isToday={day.isToday}
                $primaryColor={settings.primaryColor}
              >
                {day.dayName}
              </DayName>
              <DayDate $textColor={textColor} $isToday={day.isToday}>
                {monthNames[day.date.getMonth()]} {day.date.getDate()}, {day.date.getFullYear()}
              </DayDate>
            </DayInfo>

            {day.hasEvent && (
              <EventDot $primaryColor={settings.primaryColor} />
            )}
          </DayRow>
        ))}
      </DaysTimeline>
    </TimelineContainer>
  );
}; 