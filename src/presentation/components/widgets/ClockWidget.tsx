import React, { useState, useEffect } from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../themes/colors';
import { AnalogClassicClock } from './clock/styles/AnalogClassicClock';
import { ModernClock } from './clock/styles/ModernClock';

interface ClockWidgetProps {
  widget: Widget;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ widget }) => {
  const settings = widget.settings as ClockSettings;
  const [time, setTime] = useState(new Date());
  const textColor = getContrastColor(settings.backgroundColor);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  switch (settings.style) {
    case 'analog-classic':
      return <AnalogClassicClock settings={settings} time={time} textColor={textColor} />;
    case 'modern':
    default:
      return <ModernClock settings={settings} time={time} textColor={textColor} />;
  }
}; 