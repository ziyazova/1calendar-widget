import { Calendar, CalendarDays, Clock, Image, Flower2, Grid, AlarmClock, Brush, Columns, Cat, GalleryThumbnails, Sparkle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface WidgetStyleConfig {
  label: string;
  value: string;
  icon: LucideIcon;
  category: string;  // 'Calendar', 'Clock', 'Canvas'
}

export const CALENDAR_STYLES: WidgetStyleConfig[] = [
  { label: 'Core', value: 'modern-grid-zoom-fixed', icon: Calendar, category: 'Calendar' },
  { label: 'Soft', value: 'classic', icon: CalendarDays, category: 'Calendar' },
  { label: 'Collage', value: 'collage', icon: GalleryThumbnails, category: 'Calendar' },
  { label: 'Letterpress', value: 'typewriter', icon: Sparkle, category: 'Calendar' },
];

export const CLOCK_STYLES: WidgetStyleConfig[] = [
  { label: 'Duo', value: 'classic', icon: Columns, category: 'Clock' },
  { label: 'Analog', value: 'flower', icon: Clock, category: 'Clock' },
  { label: 'Buddy', value: 'dreamy', icon: Cat, category: 'Clock' },
];

export const BOARD_STYLES: WidgetStyleConfig[] = [
  { label: 'Moodboard', value: 'grid', icon: Image, category: 'Canvas' },
];

export const ARCHIVE_STYLES: WidgetStyleConfig[] = [
  { label: 'Modern Grid', value: 'modern-grid', icon: Grid, category: 'Calendar' },
  { label: 'CSS Zoom', value: 'calendar-2', icon: Calendar, category: 'Calendar' },
  { label: 'Container Query', value: 'calendar-4', icon: Calendar, category: 'Calendar' },
  { label: 'SVG ViewBox', value: 'calendar-6', icon: Calendar, category: 'Calendar' },
];

export const CLOCK_ARCHIVE_STYLES: WidgetStyleConfig[] = [
  { label: 'Buddy', value: 'modern', icon: Brush, category: 'Clock' },
  { label: 'Analog Classic', value: 'analog-classic', icon: AlarmClock, category: 'Clock' },
];

// Lookup helpers
export function getWidgetStyleConfig(type: string, style: string): WidgetStyleConfig | null {
  if (type === 'calendar') {
    return CALENDAR_STYLES.find(s => s.value === style) || ARCHIVE_STYLES.find(s => s.value === style) || null;
  }
  if (type === 'clock') {
    return CLOCK_STYLES.find(s => s.value === style) || CLOCK_ARCHIVE_STYLES.find(s => s.value === style) || null;
  }
  if (type === 'board') {
    return BOARD_STYLES.find(s => s.value === style) || null;
  }
  return null;
}

export function getWidgetBadgeLabel(type: string, style: string): { icon: LucideIcon; label: string } | null {
  const config = getWidgetStyleConfig(type, style);
  if (!config) return null;
  return { icon: config.icon, label: `${config.label} ${config.category.toLowerCase()}` };
}
