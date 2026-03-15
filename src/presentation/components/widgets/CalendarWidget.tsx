import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import {
  ModernGrid,
  ModernWeeklyCalendar,
  Calendar1,
  Calendar2,
  Calendar3,
  Calendar4,
  Calendar5,
  Calendar6,
  Calendar7,
  Calendar8,
  Calendar9,
  Calendar10,
  Calendar11,
  ModernGridZoom,
  ModernGridZoomFixed,
} from './calendar/styles';

interface CalendarWidgetProps {
  widget: Widget;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const settings = widget.settings as CalendarSettings;

  switch (settings.style) {
    case 'modern-weekly':
      return <ModernWeeklyCalendar />;
    case 'calendar-1':
      return <Calendar1 settings={settings} />;
    case 'calendar-2':
      return <Calendar2 settings={settings} />;
    case 'calendar-3':
      return <Calendar3 settings={settings} />;
    case 'calendar-4':
      return <Calendar4 settings={settings} />;
    case 'calendar-5':
      return <Calendar5 settings={settings} />;
    case 'calendar-6':
      return <Calendar6 settings={settings} />;
    case 'calendar-7':
      return <Calendar7 settings={settings} />;
    case 'calendar-8':
      return <Calendar8 settings={settings} />;
    case 'calendar-9':
      return <Calendar9 settings={settings} />;
    case 'calendar-10':
      return <Calendar10 settings={settings} />;
    case 'calendar-11':
      return <Calendar11 settings={settings} />;
    case 'modern-grid-zoom':
      return <ModernGridZoom settings={settings} />;
    case 'modern-grid-zoom-fixed':
      return <ModernGridZoomFixed settings={settings} />;
    case 'modern-grid':
    default:
      return <ModernGrid settings={settings} />;
  }
};
