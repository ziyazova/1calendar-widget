import React from 'react';
import { Widget } from '../../../domain/entities/Widget';
import { BoardSettings } from '../../../domain/value-objects/BoardSettings';
import { InspirationBoard } from './board/styles/InspirationBoard';

interface BoardWidgetProps {
  widget: Widget;
}

export const BoardWidget: React.FC<BoardWidgetProps> = ({ widget }) => {
  const settings = widget.settings as BoardSettings;
  return <InspirationBoard settings={settings} />;
};
