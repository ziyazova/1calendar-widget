import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import { ModernGrid, ModernWeeklyCalendar } from './calendar/styles';

interface CalendarWidgetProps {
  widget: Widget;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const settings = widget.settings as CalendarSettings;

  switch (settings.style) {
    case 'modern-weekly':
      return <ModernWeeklyCalendar />;
    case 'modern-grid':
    default:
      return <ModernGrid settings={settings} />;
  }
}; 