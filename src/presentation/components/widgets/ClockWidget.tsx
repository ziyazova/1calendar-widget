import React, { useState, useEffect } from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { ClockSettings } from '../../../domain/value-objects/ClockSettings';
import { getContrastColor } from '../../themes/colors';
import { useResolvedTheme, adaptColorForDarkMode } from '../../hooks/useResolvedTheme';
import { AnalogClassicClock } from './clock/styles/AnalogClassicClock';
import { ModernClock } from './clock/styles/ModernClock';

interface ClockWidgetProps {
  widget: Widget;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ widget }) => {
  const settings = widget.settings as ClockSettings;
  const [time, setTime] = useState(new Date());
  const resolvedTheme = useResolvedTheme(settings.theme);
  const isDark = resolvedTheme === 'dark';
  const effectiveBg = isDark ? adaptColorForDarkMode(settings.backgroundColor, 'background') : settings.backgroundColor;
  const textColor = getContrastColor(effectiveBg);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const effectiveSettings = isDark ? { ...settings, backgroundColor: effectiveBg } as ClockSettings : settings;

  switch (settings.style) {
    case 'analog-classic':
      return <AnalogClassicClock settings={effectiveSettings} time={time} textColor={textColor} />;
    case 'modern':
    default:
      return <ModernClock settings={effectiveSettings} time={time} textColor={textColor} />;
  }
}; 