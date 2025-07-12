import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import {
  CompactDate,
  ModernGrid,
  WeeklyTimeline
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

    case 'weekly-timeline':
      return <WeeklyTimeline settings={settings} />;

    default:
      return <ModernGrid settings={settings} />;
  }
}; 