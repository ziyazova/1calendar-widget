import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, ExternalLink, Pencil, Trash2, LogOut, Search, FileDown, AlertTriangle, KeyRound, Lock, Eye, EyeOff, CheckCircle2, Check, UserCircle, Sparkles as SparkIcon, Shield as ShieldIcon, ShieldAlert } from 'lucide-react';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../ui/widgetConfig';
import type { DashboardView } from '../ui/sidebar/Sidebar';
import { useAuth } from '@/presentation/context/AuthContext';
import { useUpgradeModal } from '@/presentation/context/UpgradeModalContext';
import { WidgetStorageService, type SavedWidget } from '@/infrastructure/services/WidgetStorageService';
import { AccountService } from '@/infrastructure/services/AccountService';
import { SubscriptionService } from '@/infrastructure/services/SubscriptionService';
import { PurchaseService, type Purchase } from '@/infrastructure/services/PurchaseService';
import { TEMPLATES } from '@/presentation/data/templates';
import { CalendarSettings } from '@/domain/value-objects/CalendarSettings';
import { ClockSettings } from '@/domain/value-objects/ClockSettings';
import { PlanPill, Button as SharedButton, Card as SharedCard } from '@/presentation/components/shared';
import { BoardSettings } from '@/domain/value-objects/BoardSettings';
import { getContrastColor } from '@/presentation/themes/colors';

/* Calendar styles */
import { ModernGridZoomFixed } from '../widgets/calendar/styles/ModernGridZoomFixed';
import { ClassicCalendar } from '../widgets/calendar/styles/ClassicCalendar';
import { CollageCalendar } from '../widgets/calendar/styles/CollageCalendar';
import { TypewriterCalendar } from '../widgets/calendar/styles/TypewriterCalendar';
/* Clock styles */
import { ClassicClock } from '../widgets/clock/styles/ClassicClock';
import { FlowerClock } from '../widgets/clock/styles/FlowerClock';
import { DreamyClock } from '../widgets/clock/styles/DreamyClock';
/* Board styles */
import { InspirationBoard } from '../widgets/board/styles/InspirationBoard';

/* ── Shared ── */

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 48px 64px;

  @media (max-width: 768px) {
    padding: 32px 16px 24px;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 ${({ theme }) => theme.spacing['2']};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 ${({ theme }) => theme.spacing['8']};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterSpacer = styled.div`
  flex: 1;
`;

const SortSelect = styled.select`
  height: 32px;
  padding: 0 28px 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.03);
  color: #999;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  outline: none;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.12);
    color: #666;
  }

  &:focus {
    border-color: rgba(51, 132, 244, 0.3);
  }
`;

const FilterChip = styled.button<{ $active: boolean }>`
  height: 32px;
  padding: 0 14px;
  background: ${({ $active, theme }) => $active ? theme.colors.text.primary : 'rgba(0, 0, 0, 0.03)'};
  color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.text.subtle};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.text.primary : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.text.primary : 'rgba(0, 0, 0, 0.06)'};
    color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.text.dim};
  }
`;

const ChipCount = styled.span`
  font-size: 11px;
  opacity: 0.5;
`;

/* ── Widget Card ── */

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const PreviewScale = styled.div`
  transform: scale(0.32);
  transform-origin: center center;
  width: 420px;
  min-height: 380px;
  flex-shrink: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClockPreviewScale = styled(PreviewScale)`
  width: 360px;
  min-height: 360px;
`;

const BoardPreviewScale = styled(PreviewScale)`
  width: 420px;
  min-height: 420px;
`;

/* ── Widget Preview Renderers ── */

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

const WidgetPreview: React.FC<{ type: string; style: string; savedSettings?: Record<string, unknown> }> = ({ type, style, savedSettings }) => {
  const saved = (savedSettings || {}) as Record<string, unknown>;
  if (type === 'calendar') {
    const settings = new CalendarSettings({ ...saved, style: style as CalendarSettings['style'] });
    switch (style) {
      case 'classic': return <PreviewScale><ClassicCalendar settings={settings} /></PreviewScale>;
      case 'collage': return <PreviewScale><CollageCalendar settings={settings} /></PreviewScale>;
      case 'typewriter': return <PreviewScale><TypewriterCalendar settings={settings} /></PreviewScale>;
      default: return <PreviewScale><ModernGridZoomFixed settings={settings} /></PreviewScale>;
    }
  }
  if (type === 'clock') {
    const settings = new ClockSettings({ ...saved, style: style as ClockSettings['style'] });
    const textColor = getContrastColor(settings.backgroundColor);
    switch (style) {
      case 'flower': return <ClockPreviewScale><FlowerClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
      case 'dreamy': return <ClockPreviewScale><DreamyClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
      default: return <ClockPreviewScale><ClassicClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
    }
  }
  if (type === 'board') {
    const settings = new BoardSettings({ ...saved, layout: style as BoardSettings['layout'] });
    return <BoardPreviewScale><InspirationBoard settings={settings} /></BoardPreviewScale>;
  }
  return null;
};

/* ── Data ── */

type WidgetFilter = 'all' | 'calendar' | 'clock' | 'board';
const FILTERS: { key: WidgetFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'calendar', label: 'Calendars' },
  { key: 'clock', label: 'Clocks' },
  { key: 'board', label: 'Boards' },
];


const PURCHASES = [
  { id: 'p1', name: 'Weekly Planner', price: 'Free', date: 'Mar 22, 2026', order: '#PY-1042', image: '/template-main.png', slug: 'weekly-planner' },
  { id: 'p2', name: 'Life OS Template', price: '$7.99', date: 'Mar 20, 2026', order: '#PY-1038', image: '/template-main.png', slug: 'life-os' },
  { id: 'p3', name: 'Student Planner', price: '$3.99', date: 'Mar 15, 2026', order: '#PY-1025', image: '/template-main.png', slug: 'student-planner' },
];


/* ── Views ── */

/* ── Search Bar ── */

const SearchWrap = styled.div`
  position: relative;
  margin-bottom: 28px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px 0 42px;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  &::placeholder { color: rgba(0, 0, 0, 0.3); }
  &:focus { border-color: rgba(51, 132, 244, 0.3); background: #fff; }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.25);
  svg { width: 16px; height: 16px; }
`;

/* ── Section Heading ── */

const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 48px 0 14px;

  &:first-of-type { margin-top: 0; }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0;
`;

const SectionCount = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.3);
  font-weight: 400;
  text-transform: none;
  letter-spacing: -0.01em;
  margin-left: 8px;
`;


const ExploreScaleCalendar = styled.div`
  transform: scale(0.36);
  transform-origin: center center;
  width: 420px;
  min-height: 380px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExploreScaleClock = styled(ExploreScaleCalendar)`
  width: 360px;
  min-height: 360px;
`;

const ExploreScaleBoard = styled(ExploreScaleCalendar)`
  width: 420px;
  min-height: 420px;
`;

/* ── All Explore Widgets ── */

const ALL_EXPLORE_WIDGETS = [
  ...CALENDAR_STYLES.map(s => ({ type: 'calendar', style: s.value, label: s.label, category: 'Calendar' })),
  ...CLOCK_STYLES.map(s => ({ type: 'clock', style: s.value, label: s.label, category: 'Clock' })),
  ...BOARD_STYLES.map(s => ({ type: 'board', style: s.value, label: s.label, category: 'Canvas' })),
];

type ExploreFilter = 'all' | 'calendar' | 'clock' | 'board';
const EXPLORE_FILTERS: { key: ExploreFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'clock', label: 'Clocks' },
  { key: 'board', label: 'Canvas' },
];

const ExploreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

/* ═══════════════════════════════════════════════════════
   VIEWS: DASHBOARD · WIDGETS · TEMPLATES · SETTINGS
   ═══════════════════════════════════════════════════════ */

import { Calendar as CalIcon, Clock as ClkIcon, Image as ImgIcon, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';

/* ── Shared view components ── */

const Section = styled.section`
  margin-top: 40px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 32px;
`;

const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const WelcomeTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 4px;
`;

const WelcomeSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 32px;
`;

const CreateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) { gap: 8px; }
`;

const CreateCard = styled.button<{ $bg: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: ${({ $bg }) => $bg};
  border: 1.5px solid rgba(0,0,0,0.04);
  border-radius: 16px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px 12px;
    gap: 8px;
  }
`;

const CreateIconWrap = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg { width: 20px; height: 20px; color: ${({ $color }) => $color}; stroke-width: 1.6; }
`;

const CreateCardText = styled.div``;

const CreateCardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const CreateCardHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-top: 1px;
  @media (max-width: 768px) { display: none; }
`;

/* Big widget cards (Nodi-style) */

const BigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const BigCard = styled.div<{ $index: number }>`
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
  animation: ${cardAppear} 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${({ $index }) => 0.05 + $index * 0.04}s both;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
  }
`;

const BigCardPreview = styled.div`
  aspect-ratio: 3 / 2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  cursor: pointer;
  position: relative;
`;

const BigCardLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 6px;
  z-index: 1;
`;

const BigCardBottom = styled.div`
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const BigCardName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const BigCardMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-weight: 400;
  margin-left: 6px;
`;

const BigCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EmptyBox = styled.div`
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 56px 24px;
  text-align: center;
  cursor: pointer;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }
`;

const EmptyCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  svg { width: 24px; height: 24px; color: ${({ theme }) => theme.colors.accent}; }
`;

const EmptyTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px;
`;

const EmptyHint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

/* Purchase cards */

const PurchaseCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  transition: all 0.15s;

  &:hover {
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 2px 12px rgba(0,0,0,0.03);
  }

  & + & { margin-top: 8px; }
`;

const PurchaseImg = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const PurchaseDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const PurchaseTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PurchaseMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

const PurchasePriceTag = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: 8px;
`;

/* Settings */

const SettingsGroup = styled.div`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 16px;
`;

const SettingsGroupTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0 0 20px;
`;

/* Minimalist Settings sections — no colourful badges, consistent typography. */

const SectionBlock = styled.div<{ $danger?: boolean }>`
  padding: 48px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);

  &:first-of-type { padding-top: 24px; }
  &:last-of-type { border-bottom: none; padding-bottom: 24px; }
`;

const SectionBlockHead = styled.div`
  margin-bottom: 24px;
`;

const SectionBlockTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0 0 4px;
`;

const SectionBlockSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.subtle};
  margin: 0;
  letter-spacing: -0.005em;
  line-height: 1.5;
`;

const SectionBlockBody = styled.div``;

const SectionDivider = styled.div`
  height: 1px;
  background: rgba(0,0,0,0.05);
  margin: 18px 0;
`;

const SettingsRowSplit = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;

  > :last-child { flex-shrink: 0; }
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;

  &:last-child { margin-bottom: 0; }
`;

const SettingsLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 80px;
  flex-shrink: 0;
`;

const SettingsInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  outline: none;
  transition: border-color 0.2s;

  &:focus { border-color: rgba(0,0,0,0.2); background: ${({ theme }) => theme.colors.background.elevated}; }
  &:read-only { opacity: 0.5; cursor: not-allowed; }
`;

const CREATE_TYPES = [
  { key: 'calendar', label: 'Calendar', hint: 'Monthly & weekly', icon: CalIcon, color: '#6366F1', bg: 'linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.35) 100%)' },
  { key: 'clock', label: 'Clock', hint: 'Analog & digital', icon: ClkIcon, color: '#3384F4', bg: 'linear-gradient(135deg, rgba(232,237,255,0.5) 0%, rgba(220,235,255,0.35) 100%)' },
  { key: 'board', label: 'Board', hint: 'Moodboards', icon: ImgIcon, color: '#EC4899', bg: 'linear-gradient(135deg, rgba(255,240,245,0.5) 0%, rgba(252,228,236,0.35) 100%)' },
];

/* ── 1. DASHBOARD ── */

const DashboardView: React.FC<{
  onNavigate: (view: DashboardView) => void;
  onCreateType?: (type: string) => void;
  onEditWidget?: (widget: SavedWidget) => void;
}> = ({ onNavigate, onCreateType, onEditWidget }) => {
  const navigate = useNavigate();
  const { isRegistered, user, isPro } = useAuth();
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWidgets = useCallback(async () => {
    if (!isRegistered) { setLoading(false); return; }
    const data = await WidgetStorageService.getUserWidgets();
    setWidgets(data);
    setLoading(false);
  }, [isRegistered]);

  useEffect(() => { loadWidgets(); }, [loadWidgets]);

  const handleDelete = async (id: string) => {
    await WidgetStorageService.deleteWidget(id);
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <Container>
      <TopBar>
        <PlanPill $pro={isPro}>{isPro ? 'Pro' : 'Free'}</PlanPill>
        <AvatarCircle>{initials}</AvatarCircle>
      </TopBar>

      <WelcomeTitle>Hey, {firstName}</WelcomeTitle>
      <WelcomeSub>Create, customize, and manage your workspace</WelcomeSub>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
        <CreateCard $bg="linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.35) 100%)" onClick={() => onNavigate('my-widgets')}>
          <CreateIconWrap $color="#6366F1"><CalIcon /></CreateIconWrap>
          <CreateCardText>
            <CreateCardTitle>Explore Widgets</CreateCardTitle>
            <CreateCardHint>Browse and customize styles</CreateCardHint>
          </CreateCardText>
        </CreateCard>
        <CreateCard $bg="linear-gradient(135deg, rgba(255,240,245,0.5) 0%, rgba(252,228,236,0.35) 100%)" onClick={() => onNavigate('purchases')}>
          <CreateIconWrap $color="#EC4899"><ImgIcon /></CreateIconWrap>
          <CreateCardText>
            <CreateCardTitle>My Templates</CreateCardTitle>
            <CreateCardHint>Purchases and downloads</CreateCardHint>
          </CreateCardText>
        </CreateCard>
      </div>

      {/* My Widgets */}
      <Section>
        <SectionHeading>
          <SectionTitle>My Widgets <SectionCount>{widgets.length}</SectionCount></SectionTitle>
          {widgets.length > 0 && <SharedButton $variant="link" $size="sm" onClick={() => onNavigate('my-widgets')}>Browse all <ArrowRight /></SharedButton>}
        </SectionHeading>

        {!loading && widgets.length === 0 ? (
          <EmptyBox onClick={() => onNavigate('my-widgets')}>
            <EmptyCircle><Sparkles /></EmptyCircle>
            <EmptyTitle>Create your first widget</EmptyTitle>
            <EmptyHint>Browse widget styles and customize</EmptyHint>
          </EmptyBox>
        ) : (
          <BigGrid>
            {widgets.slice(0, 4).map((w, i) => (
              <BigCard key={w.id} $index={i}>
                <BigCardPreview onClick={() => onEditWidget?.(w)}>
                  <BigCardLabel>{w.type === 'calendar' ? 'Calendar' : w.type === 'clock' ? 'Clock' : 'Board'}</BigCardLabel>
                  <WidgetPreview type={w.type} style={w.style} savedSettings={w.settings} />
                </BigCardPreview>
                <BigCardBottom>
                  <BigCardName>{w.name}</BigCardName>
                  <BigCardActions>
                    <SharedButton $variant="primary" $size="sm" onClick={() => onEditWidget?.(w)}><Pencil /> Edit</SharedButton>
                    <SharedButton $variant="dangerStrong" $size="sm" onClick={() => handleDelete(w.id)}><Trash2 /></SharedButton>
                  </BigCardActions>
                </BigCardBottom>
              </BigCard>
            ))}
          </BigGrid>
        )}
      </Section>

      {/* Recent Purchases */}
      <Section>
        <SectionHeading>
          <SectionTitle>Recent Purchases <SectionCount>{PURCHASES.length}</SectionCount></SectionTitle>
          {PURCHASES.length > 0 && <SharedButton $variant="link" $size="sm" onClick={() => onNavigate('purchases')}>View all <ArrowRight /></SharedButton>}
        </SectionHeading>
        {PURCHASES.length === 0 ? (
          <EmptyBox onClick={() => onNavigate('templates')}>
            <EmptyCircle><Download /></EmptyCircle>
            <EmptyTitle>No purchases yet</EmptyTitle>
            <EmptyHint>Browse templates to find planners for Notion</EmptyHint>
          </EmptyBox>
        ) : (
          <>
            {PURCHASES.slice(0, 3).map(p => (
              <PurchaseCard key={p.id}>
                <PurchaseImg><img src={p.image} alt={p.name} /></PurchaseImg>
                <PurchaseDetails>
                  <PurchaseTitle>{p.name}</PurchaseTitle>
                  <PurchaseMeta>{p.date}</PurchaseMeta>
                </PurchaseDetails>
                <PurchasePriceTag>{p.price}</PurchasePriceTag>
                <SharedButton $variant="secondary" $size="sm"><Download /></SharedButton>
              </PurchaseCard>
            ))}
          </>
        )}
      </Section>
    </Container>
  );
};

/* ── 2. WIDGETS GALLERY ── */

const WidgetsGalleryView: React.FC<{ onAddNew?: () => void }> = ({ onAddNew }) => {
  const [filter, setFilter] = useState<ExploreFilter>('all');

  const renderPreview = (type: string, style: string) => {
    if (type === 'calendar') {
      const s = new CalendarSettings({ style: style as CalendarSettings['style'] });
      switch (style) {
        case 'classic': return <ExploreScaleCalendar><ClassicCalendar settings={s} /></ExploreScaleCalendar>;
        case 'collage': return <ExploreScaleCalendar><CollageCalendar settings={s} /></ExploreScaleCalendar>;
        case 'typewriter': return <ExploreScaleCalendar><TypewriterCalendar settings={s} /></ExploreScaleCalendar>;
        default: return <ExploreScaleCalendar><ModernGridZoomFixed settings={s} /></ExploreScaleCalendar>;
      }
    }
    if (type === 'clock') {
      const s = new ClockSettings({ style: style as ClockSettings['style'] });
      const tc = getContrastColor(s.backgroundColor);
      switch (style) {
        case 'flower': return <ExploreScaleClock><FlowerClock settings={s} time={PREVIEW_TIME} textColor={tc} /></ExploreScaleClock>;
        case 'dreamy': return <ExploreScaleClock><DreamyClock settings={s} time={PREVIEW_TIME} textColor={tc} /></ExploreScaleClock>;
        default: return <ExploreScaleClock><ClassicClock settings={s} time={PREVIEW_TIME} textColor={tc} /></ExploreScaleClock>;
      }
    }
    if (type === 'board') {
      const s = new BoardSettings({ layout: style as BoardSettings['layout'] });
      return <ExploreScaleBoard><InspirationBoard settings={s} /></ExploreScaleBoard>;
    }
    return null;
  };

  return (
    <Container>
      <Title>Widgets</Title>
      <Subtitle>Choose a style and customize it for your Notion</Subtitle>

      <FilterRow>
        {EXPLORE_FILTERS.map(f => (
          <FilterChip key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </FilterChip>
        ))}
      </FilterRow>

      <BigGrid>
        {ALL_EXPLORE_WIDGETS
          .filter(w => filter === 'all' || w.type === filter)
          .map((s, i) => (
            <BigCard key={`${s.type}-${s.style}`} $index={i}>
              <BigCardPreview onClick={() => onAddNew?.()}>
                <BigCardLabel>{s.category}</BigCardLabel>
                {renderPreview(s.type, s.style)}
              </BigCardPreview>
              <BigCardBottom>
                <BigCardName>{s.label}</BigCardName>
                <SharedButton $variant="primary" $size="sm" onClick={() => onAddNew?.()}><Pencil /> Customize</SharedButton>
              </BigCardBottom>
            </BigCard>
          ))}
      </BigGrid>
    </Container>
  );
};

/* ── 3. TEMPLATES (purchases + explore) ── */

const BrowseShopBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.text.primary} 0%, #333 100%)`};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  margin-top: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  }

  &:active { transform: translateY(0); }
  svg { width: 16px; height: 16px; }
`;

const PurchasesView: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await PurchaseService.getMyPurchases();
      if (!cancelled) {
        setPurchases(rows);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Resolve a card image + slug by looking up the polar product id in the
  // local catalogue. Falls back to a generic placeholder if the product
  // isn't on the site yet (legacy purchase or new Polar product).
  const enrich = (p: Purchase) => {
    const template = TEMPLATES.find(t => t.polarProductId === p.polarProductId);
    return {
      image: template?.image ?? '/template-main.png',
      slug: template?.id,
      title: template?.title ?? p.productName ?? 'Template purchase',
    };
  };

  const formatPrice = (cents: number | null, currency: string) => {
    if (cents == null) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return iso; }
  };

  return (
    <Container>
      <Title>My Purchases</Title>
      <Subtitle>Your purchased Notion planners and templates. Download links are also in your email.</Subtitle>

      {loading ? (
        <EmptyBox><EmptyHint>Loading your purchases…</EmptyHint></EmptyBox>
      ) : purchases.length === 0 ? (
        <EmptyBox onClick={() => navigate('/templates')}>
          <EmptyCircle><Download /></EmptyCircle>
          <EmptyTitle>No purchases yet</EmptyTitle>
          <EmptyHint>Browse the shop to find planners for Notion</EmptyHint>
        </EmptyBox>
      ) : (
        <>
          {purchases.map(p => {
            const info = enrich(p);
            return (
              <PurchaseCard key={p.id} style={{ cursor: info.slug ? 'pointer' : 'default' }} onClick={() => info.slug && navigate(`/templates/${info.slug}`)}>
                <PurchaseImg style={{ width: 64, height: 64 }}><img src={info.image} alt={info.title} /></PurchaseImg>
                <PurchaseDetails>
                  <PurchaseTitle>{info.title}</PurchaseTitle>
                  <PurchaseMeta>#{p.polarOrderId.slice(-8)} · {formatDate(p.createdAt)}{p.status === 'refunded' ? ' · refunded' : ''}</PurchaseMeta>
                </PurchaseDetails>
                <PurchasePriceTag>{formatPrice(p.amountCents, p.currency)}</PurchasePriceTag>
                <SharedButton $variant="secondary" $size="sm" onClick={(e) => {
                  e.stopPropagation();
                  // Download links live in the Polar email delivery. Open the
                  // Polar customer portal where the buyer can redownload.
                  void SubscriptionService.openCustomerPortal().then(ok => {
                    if (!ok) window.open('https://polar.sh', '_blank', 'noopener,noreferrer');
                  });
                }}><Download /> Download</SharedButton>
              </PurchaseCard>
            );
          })}
        </>
      )}

      <BrowseShopBtn onClick={() => navigate('/templates')}>
        Browse template shop <ArrowRight />
      </BrowseShopBtn>
    </Container>
  );
};

/* ── 4. SETTINGS ── */

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, supabaseUser, updatePassword, isPro, plan } = useAuth();
  const { open: openUpgrade } = useUpgradeModal();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Change password modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Detect if the user signed up with Google only (no password set).
  // Providers array on the user includes 'email' for password accounts.
  const hasPasswordLogin = Boolean(
    supabaseUser?.identities?.some(i => i.provider === 'email')
  );
  const pwChecks = [
    { label: 'At least 8 characters', met: newPw.length >= 8 },
    { label: 'Contains a letter', met: /[a-zA-Z]/.test(newPw) },
    { label: 'Contains a number', met: /\d/.test(newPw) },
    { label: 'Passwords match', met: confirmPw.length > 0 && newPw === confirmPw },
  ];
  const pwValid = pwChecks.every(c => c.met);

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = await AccountService.buildExportPayload();
      if (!payload) return;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `peachy-export-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    const err = await AccountService.deleteOwnAccount();
    if (err) {
      setDeleteError(err);
      setDeleting(false);
      return;
    }
    // Local auth state is refreshed by onAuthStateChange when signOut fires.
    navigate('/');
  };

  return (
    <Container>
      <Title>Settings</Title>
      <Subtitle>Manage your account, security and subscription</Subtitle>

      {/* Profile */}
      <SectionBlock>
        <SectionBlockHead>
          <SectionBlockTitle>Profile</SectionBlockTitle>
          <SectionBlockSub>Your name and email address</SectionBlockSub>
        </SectionBlockHead>
        <SectionBlockBody>
          <SettingsRow style={{ marginBottom: 14 }}>
            <SettingsLabel>Name</SettingsLabel>
            <SettingsInput defaultValue={user?.name || ''} />
          </SettingsRow>
          <SettingsRow style={{ marginBottom: 0 }}>
            <SettingsLabel>Email</SettingsLabel>
            <SettingsInput defaultValue={user?.email || ''} readOnly />
          </SettingsRow>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <SharedButton $variant="primary" $size="sm">Save changes</SharedButton>
          </div>
        </SectionBlockBody>
      </SectionBlock>

      {/* Security */}
      <SectionBlock>
        <SectionBlockHead>
          <SectionBlockTitle>Security</SectionBlockTitle>
          <SectionBlockSub>Password and sign-in methods</SectionBlockSub>
        </SectionBlockHead>
        <SectionBlockBody>
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>Password</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4, lineHeight: 1.5 }}>
                {hasPasswordLogin
                  ? 'Change the password you use to sign in with email.'
                  : "You signed up with Google, so there's no password on this account yet. Set one to also sign in with email."}
              </div>
            </div>
            <SharedButton $variant="secondary" $size="sm" onClick={() => { setShowPwModal(true); setNewPw(''); setConfirmPw(''); setPwError(null); setPwSuccess(false); }}>
              {hasPasswordLogin ? 'Change password' : 'Set a password'}
            </SharedButton>
          </SettingsRowSplit>
        </SectionBlockBody>
      </SectionBlock>

      {/* Subscription */}
      <SectionBlock>
        <SectionBlockHead>
          <SectionBlockTitle>Subscription</SectionBlockTitle>
          <SectionBlockSub>Your current plan and billing</SectionBlockSub>
        </SectionBlockHead>
        <SectionBlockBody>
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>{isPro ? 'Pro plan · $4 / month' : 'Free plan'}</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
                {isPro
                  ? (plan.currentPeriodEnd
                      ? `Next billing on ${new Date(plan.currentPeriodEnd).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}. Unlimited widgets, all styles.`
                      : 'Unlimited widgets, all styles, full customization.')
                  : '3 widgets, basic customization'}
              </div>
            </div>
            {isPro ? (
              <SharedButton $variant="secondary" $size="sm" onClick={async () => {
                const ok = await SubscriptionService.openCustomerPortal();
                if (!ok) window.open('https://polar.sh', '_blank', 'noopener,noreferrer');
              }}>Manage</SharedButton>
            ) : (
              <SharedButton $variant="primary" $size="sm" onClick={openUpgrade}>Upgrade to Pro</SharedButton>
            )}
          </SettingsRowSplit>
        </SectionBlockBody>
      </SectionBlock>

      {/* Privacy & data */}
      <SectionBlock>
        <SectionBlockHead>
          <SectionBlockTitle>Privacy &amp; data</SectionBlockTitle>
          <SectionBlockSub>Export or review how we handle your data</SectionBlockSub>
        </SectionBlockHead>
        <SectionBlockBody>
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>Download my data</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Export your profile and saved widgets as a JSON file.</div>
            </div>
            <SharedButton $variant="secondary" $size="sm" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Preparing…' : 'Download JSON'}
            </SharedButton>
          </SettingsRowSplit>
          <SectionDivider />
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>Privacy policy</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Read how we handle your data.</div>
            </div>
            <SharedButton $variant="secondary" $size="sm" onClick={() => navigate('/privacy')}>
              Read policy
            </SharedButton>
          </SettingsRowSplit>
        </SectionBlockBody>
      </SectionBlock>

      {/* Danger zone */}
      <SectionBlock>
        <SectionBlockHead>
          <SectionBlockTitle style={{ color: '#B91C1C' }}>Danger zone</SectionBlockTitle>
          <SectionBlockSub>Actions here cannot be undone. Proceed carefully.</SectionBlockSub>
        </SectionBlockHead>
        <SectionBlockBody>
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>Log out</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>End your session on this device.</div>
            </div>
            <SharedButton $variant="dangerStrong" $size="sm" onClick={async () => { await logout(); navigate('/'); }}>
              Log out
            </SharedButton>
          </SettingsRowSplit>
          <SectionDivider />
          <SettingsRowSplit>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1F1F1F' }}>Delete account</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Permanently remove your profile and all widgets. This cannot be undone.</div>
            </div>
            <SharedButton $variant="dangerStrong" $size="sm" onClick={() => { setShowDeleteConfirm(true); setDeleteConfirmText(''); setDeleteError(null); }}>
              Delete account
            </SharedButton>
          </SettingsRowSplit>
        </SectionBlockBody>
      </SectionBlock>

      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            onClick={() => !pwSubmitting && setShowPwModal(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: 24, padding: '32px 28px 28px',
            width: 440, maxWidth: '92vw',
            boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
          }}>
            {pwSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Password updated
                </div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 20 }}>
                  You can use your new password the next time you sign in with email.
                </div>
                <button
                  onClick={() => setShowPwModal(false)}
                  style={{
                    width: '100%', height: 44, background: '#1F1F1F', color: '#fff',
                    border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >Done</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em', marginBottom: 6 }}>
                  {hasPasswordLogin ? 'Change password' : 'Set a password'}
                </div>
                <div style={{ fontSize: 14, color: '#777', lineHeight: 1.5, marginBottom: 18 }}>
                  Choose a strong password you haven't used before.
                </div>
                {pwError && (
                  <div style={{
                    fontSize: 13, color: '#DC2828',
                    background: 'rgba(220,40,40,0.06)',
                    border: '1px solid rgba(220,40,40,0.15)',
                    padding: '10px 12px', borderRadius: 12, marginBottom: 12,
                  }}>{pwError}</div>
                )}
                <form onSubmit={async e => {
                  e.preventDefault();
                  setPwError(null);
                  if (!pwValid) {
                    setPwError('Password does not meet the requirements or does not match.');
                    return;
                  }
                  setPwSubmitting(true);
                  try {
                    const err = await updatePassword(newPw);
                    if (err) {
                      setPwError(err.toLowerCase().includes('same as') ? 'New password must be different from your current one.' : err);
                      return;
                    }
                    setPwSuccess(true);
                  } finally {
                    setPwSubmitting(false);
                  }
                }}>
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#999' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      autoFocus
                      placeholder="New password"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      style={{
                        width: '100%', height: 46, padding: '0 44px',
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                        fontSize: 14, fontFamily: 'inherit', color: '#1F1F1F',
                        background: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0, display: 'flex' }}
                    >
                      {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#999' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      style={{
                        width: '100%', height: 46, padding: '0 44px',
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                        fontSize: 14, fontFamily: 'inherit', color: '#1F1F1F',
                        background: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {newPw.length > 0 && (
                    <div style={{
                      padding: '10px 12px', background: 'rgba(0,0,0,0.02)',
                      borderRadius: 12, marginBottom: 16,
                      display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                      {pwChecks.map(c => (
                        <div key={c.label} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          fontSize: 12, color: c.met ? '#16A34A' : '#999',
                        }}>
                          {c.met
                            ? <CheckCircle2 style={{ width: 12, height: 12 }} />
                            : <Check style={{ width: 12, height: 12, opacity: 0.3 }} />}
                          {c.label}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setShowPwModal(false)}
                      disabled={pwSubmitting}
                      style={{
                        flex: 1, height: 44, background: '#fff', color: '#555',
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                        fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
                      }}
                    >Cancel</button>
                    <button
                      type="submit"
                      disabled={pwSubmitting || !pwValid}
                      style={{
                        flex: 1, height: 44, background: '#1F1F1F', color: '#fff',
                        border: 'none', borderRadius: 12,
                        fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                        opacity: (pwSubmitting || !pwValid) ? 0.5 : 1,
                      }}
                    >
                      {pwSubmitting ? 'Updating…' : 'Update password'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            onClick={() => !deleting && setShowDeleteConfirm(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          />
          <div style={{
            position: 'relative', background: '#fff', borderRadius: 24, padding: '36px 32px 28px',
            width: 460, maxWidth: '92vw',
            boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#B91C1C', letterSpacing: '-0.02em', marginBottom: 10 }}>
              Delete account?
            </div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.5, marginBottom: 20 }}>
              We'll permanently remove your profile and all saved widgets from our servers. You can always sign up again later with the same email.
              To confirm, please type <strong>delete</strong> below.
            </div>
            <input
              type="text"
              autoFocus
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder='Type "delete" to confirm'
              style={{
                width: '100%', height: 42, padding: '0 14px',
                border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                fontSize: 14, fontFamily: 'inherit', color: '#1F1F1F',
                background: '#FAFAFA', outline: 'none', marginBottom: deleteError ? 8 : 20,
                boxSizing: 'border-box',
              }}
            />
            {deleteError && (
              <div style={{ fontSize: 12, color: '#DC2828', marginBottom: 16 }}>{deleteError}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <SharedButton $variant="secondary" $size="sm" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </SharedButton>
              <SharedButton
                $variant="dangerStrong"
                $size="sm"
                onClick={handleDelete}
                disabled={deleting || deleteConfirmText.trim().toLowerCase() !== 'delete'}
                style={{
                  background: '#DC2828', color: '#fff', borderColor: '#DC2828',
                  opacity: (deleting || deleteConfirmText.trim().toLowerCase() !== 'delete') ? 0.5 : 1,
                }}
              >
                <Trash2 /> {deleting ? 'Deleting…' : 'Delete forever'}
              </SharedButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

/* ── Router ── */

interface DashboardContentProps {
  view: DashboardView;
  onAddNew?: () => void;
  onCreateType?: (type: string) => void;
  onEditWidget?: (widget: SavedWidget) => void;
  onNavigate?: (view: DashboardView) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ view, onAddNew, onCreateType, onEditWidget, onNavigate }) => {
  switch (view) {
    case 'dashboard': return <DashboardView onNavigate={onNavigate || (() => {})} onCreateType={onCreateType} onEditWidget={onEditWidget} />;
    case 'my-widgets': return <WidgetsGalleryView onAddNew={onAddNew} />;
    case 'templates':
    case 'purchases': return <PurchasesView />;
    case 'profile': return <ProfileView />;
    default: return null;
  }
};
