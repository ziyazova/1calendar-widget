import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { BoardSettings } from '../../../domain/value-objects/BoardSettings';
import { useResolvedTheme, adaptColorForDarkMode } from '../../hooks/useResolvedTheme';
import { InspirationBoard } from './board/styles/InspirationBoard';

interface BoardWidgetProps {
  widget: Widget;
}

export const BoardWidget: React.FC<BoardWidgetProps> = ({ widget }) => {
  const settings = widget.settings as BoardSettings;
  const resolvedTheme = useResolvedTheme(settings.theme);
  const isDark = resolvedTheme === 'dark';
  const effectiveBg = isDark ? adaptColorForDarkMode(settings.backgroundColor, 'background') : settings.backgroundColor;

  const effectiveSettings = isDark ? { ...settings, backgroundColor: effectiveBg } as BoardSettings : settings;

  return <InspirationBoard settings={effectiveSettings} />;
};
