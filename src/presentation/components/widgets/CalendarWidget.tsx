import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { CalendarSettings } from '../../../domain/value-objects/CalendarSettings';
import {
  CompactDate,
  ModernGrid,
  Glassmorphism,
  WeeklyTimeline
} from './calendar/styles';

interface CalendarWidgetProps {
  widget: Widget;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const settings = widget.settings as CalendarSettings;

  // Render the appropriate style component based on settings
  switch (settings.style) {
    case 'compact-date':
      return <CompactDate settings={settings} />;

    case 'modern-grid':
      return <ModernGrid settings={settings} />;

    case 'glassmorphism':
      return <Glassmorphism settings={settings} />;

    case 'weekly-timeline':
      return <WeeklyTimeline settings={settings} />;

    // Fallback styles for remaining variants
    case 'monthly-cards':
    case 'floating-calendar':
    default:
      // Use ModernGrid as fallback for now
      return <ModernGrid settings={settings} />;
  }
}; 