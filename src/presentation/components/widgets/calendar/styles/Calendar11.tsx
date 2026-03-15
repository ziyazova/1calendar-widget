import React, { useState } from 'react';
import { CalendarSettings } from '../../../../../domain/value-objects/CalendarSettings';
import { getContrastColor } from '../../../../themes/colors';

interface Calendar11Props {
  settings: CalendarSettings;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Design constants (pure SVG coordinates)
const W = 270;
const PAD = 12;
const HEADER_H = 30;
const WEEKDAY_H = 20;
const GAP = 4;
const CELL_W = (W - PAD * 2 - GAP * 6) / 7;
const CELL_H = 26;
const ROWS = 5;
const GRID_TOP = PAD + HEADER_H + 8 + WEEKDAY_H + 4;
const TOTAL_H = GRID_TOP + ROWS * (CELL_H + GAP) + PAD + 16;

export const Calendar11: React.FC<Calendar11Props> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const textColor = getContrastColor(settings.backgroundColor);
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDisplayDay = new Date(firstDayOfMonth);
  firstDisplayDay.setDate(firstDisplayDay.getDate() - firstDisplayDay.getDay());
  const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
  const cd = new Date(firstDisplayDay);
  for (let i = 0; i < 35; i++) {
    days.push({
      date: new Date(cd),
      isCurrentMonth: cd.getMonth() === month,
      isToday: cd.toDateString() === today.toDateString(),
    });
    cd.setDate(cd.getDate() + 1);
  }

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const borderColor = settings.showBorder ? settings.accentColor : `${settings.accentColor}40`;
  const r = settings.borderRadius;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${TOTAL_H}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: W, maxHeight: TOTAL_H, display: 'block' }}
    >
      {/* Drop shadow filter */}
      <defs>
        <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="115%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="card-clip">
          <rect x="0" y="0" width={W} height={TOTAL_H} rx={r} ry={r} />
        </clipPath>
      </defs>

      {/* Card background */}
      <rect
        x="0" y="0" width={W} height={TOTAL_H}
        rx={r} ry={r}
        fill={settings.backgroundColor}
        stroke={borderColor}
        strokeWidth="1"
        filter="url(#card-shadow)"
      />

      {/* Nav: prev button */}
      <g
        onClick={goToPreviousMonth}
        cursor="pointer"
        role="button"
      >
        <rect
          x={PAD} y={PAD}
          width={HEADER_H} height={HEADER_H}
          rx={Math.min(Math.round(r / 3) + 1, 10)}
          fill={`${settings.primaryColor}15`}
          stroke={`${settings.primaryColor}60`}
          strokeWidth="1"
        />
        <path
          d={`M${PAD + HEADER_H / 2 + 3} ${PAD + HEADER_H / 2 - 5} L${PAD + HEADER_H / 2 - 3} ${PAD + HEADER_H / 2} L${PAD + HEADER_H / 2 + 3} ${PAD + HEADER_H / 2 + 5}`}
          fill="none"
          stroke={settings.primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Month title */}
      <text
        x={W / 2}
        y={PAD + HEADER_H / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={settings.primaryColor}
        fontSize="16"
        fontWeight="700"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      >
        {monthNames[month]} {year}
      </text>

      {/* Nav: next button */}
      <g
        onClick={goToNextMonth}
        cursor="pointer"
        role="button"
      >
        <rect
          x={W - PAD - HEADER_H} y={PAD}
          width={HEADER_H} height={HEADER_H}
          rx={Math.min(Math.round(r / 3) + 1, 10)}
          fill={`${settings.primaryColor}15`}
          stroke={`${settings.primaryColor}60`}
          strokeWidth="1"
        />
        <path
          d={`M${W - PAD - HEADER_H / 2 - 3} ${PAD + HEADER_H / 2 - 5} L${W - PAD - HEADER_H / 2 + 3} ${PAD + HEADER_H / 2} L${W - PAD - HEADER_H / 2 - 3} ${PAD + HEADER_H / 2 + 5}`}
          fill="none"
          stroke={settings.primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Weekday headers */}
      {weekDayLabels.map((label, i) => {
        const x = PAD + i * (CELL_W + GAP);
        const y = PAD + HEADER_H + 8;
        return (
          <g key={`wd-${i}`}>
            <rect
              x={x} y={y}
              width={CELL_W} height={WEEKDAY_H}
              rx={Math.min(Math.round(r / 4) + 1, 8)}
              fill={`${settings.accentColor}20`}
              stroke={`${settings.accentColor}50`}
              strokeWidth="0.5"
            />
            <text
              x={x + CELL_W / 2}
              y={y + WEEKDAY_H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={`${textColor}85`}
              fontSize="9"
              fontWeight="700"
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
              textDecoration="none"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Day cells */}
      {days.map((day, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = PAD + col * (CELL_W + GAP);
        const y = GRID_TOP + row * (CELL_H + GAP);
        const cellR = Math.min(Math.round(r / 4) + 1, 8);

        let bgFill = 'transparent';
        let textFill = textColor;
        let fontW = '400';
        let strokeColor = `${textColor}20`;

        if (day.isToday) {
          bgFill = settings.primaryColor;
          textFill = '#FFFFFF';
          fontW = '700';
          strokeColor = settings.primaryColor;
        } else if (!day.isCurrentMonth) {
          textFill = `${textColor}25`;
          strokeColor = 'transparent';
        }

        return (
          <g key={day.date.toISOString()} cursor="pointer">
            <rect
              x={x} y={y}
              width={CELL_W} height={CELL_H}
              rx={cellR}
              fill={bgFill}
              stroke={strokeColor}
              strokeWidth="0.5"
            />
            <text
              x={x + CELL_W / 2}
              y={y + CELL_H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textFill}
              fontSize="12"
              fontWeight={fontW}
              fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
            >
              {day.date.getDate()}
            </text>
          </g>
        );
      })}

      {/* Approach label */}
      <text
        x={W / 2}
        y={TOTAL_H - 6}
        textAnchor="middle"
        fill={`${textColor}40`}
        fontSize="9"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      >
        Pure SVG (WidgetBox style)
      </text>
    </svg>
  );
};
