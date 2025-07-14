import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import {
  CompactDate,
  ModernGrid,
  AestheticCalendar,
  ModernWeeklyCalendar
} from './calendar/styles';

interface CalendarWidgetProps {
  widget: Widget;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const settings = widget.settings as CalendarSettings;

  switch (settings.style) {
    case 'compact-date':
      return <CompactDate settings={settings} />;
    case 'modern-grid':
      return <ModernGrid settings={settings} />;
    case 'aesthetic':
      return <AestheticCalendar backgroundImage={settings.backgroundImage} />;
    case 'modern-weekly':
      return <ModernWeeklyCalendar />;
    default:
      return <ModernGrid settings={settings} />;
  }
}; 