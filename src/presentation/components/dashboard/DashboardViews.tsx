import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, ExternalLink, Pencil, Trash2, LogOut, Search } from 'lucide-react';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../ui/widgetConfig';
import type { DashboardView } from '../ui/sidebar/Sidebar';
import { useAuth } from '@/presentation/context/AuthContext';
import { WidgetStorageService, type SavedWidget } from '@/infrastructure/services/WidgetStorageService';
import { CalendarSettings } from '@/domain/value-objects/CalendarSettings';
import { ClockSettings } from '@/domain/value-objects/ClockSettings';
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
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 48px 48px;

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
  background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.03)'};
  color: ${({ $active }) => $active ? '#fff' : '#999'};
  border: 1px solid ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.06)'};
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
    background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.06)'};
    color: ${({ $active }) => $active ? '#fff' : '#666'};
  }
`;

const ChipCount = styled.span`
  font-size: 10px;
  opacity: 0.5;
`;

/* ── Widget Card ── */

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
`;

const Card = styled.div<{ $index?: number }>`
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  animation: ${cardAppear} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => 0.04 + ($index || 0) * 0.05}s;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &:hover ${CardOverlay} { opacity: 1; }
`;

const CardPreview = styled.div`
  aspect-ratio: 4 / 3;
  background: #FAFAFA;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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

const CardInfo = styled.div`
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const CardName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const CardMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

const OverlayBtn = styled.button<{ $danger?: boolean }>`
  height: 34px;
  padding: 0 18px;
  background: ${({ $danger }) => $danger ? 'rgba(220, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger }) => $danger ? '#fff' : '#1F1F1F'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;

  svg { width: 14px; height: 14px; }

  &:hover { transform: scale(1.04); }
  &:active { transform: scale(0.95); }
`;

const AddCard = styled.div`
  border: 2px dashed rgba(51, 132, 244, 0.25);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 172px;
  cursor: pointer;
  color: #3384F4;
  background: rgba(51, 132, 244, 0.03);
  transition: all 0.2s ease;
  opacity: 0;
  animation: ${cardAppear} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;

  svg { width: 24px; height: 24px; }

  &:hover {
    border-color: #3384F4;
    background: rgba(51, 132, 244, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(51, 132, 244, 0.12);
  }
`;

const AddLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

/* ── Purchase Row ── */

const PurchaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PurchaseRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']};
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};

  @media (max-width: 480px) { flex-wrap: wrap; }
`;

const PurchaseThumb = styled.div`
  width: 56px;
  height: 42px;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const PurchaseInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PurchaseName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PurchaseDate = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const PurchasePrice = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;

  svg { width: 13px; height: 13px; }

  &:hover { background: ${({ theme }) => theme.colors.interactive.hover}; color: ${({ theme }) => theme.colors.text.primary}; }
`;

/* ── Profile ── */

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing['8']};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['5']};
  max-width: 400px;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
`;

const ProfileForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['3']};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.page};
  outline: none;

  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

const SaveBtn = styled.button`
  height: 44px;
  background: ${({ theme }) => theme.colors.text.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing['2']};
  transition: all 0.15s ease;

  &:hover { background: #333; }
`;

/* ── Widget Preview Renderers ── */

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

const WidgetPreview: React.FC<{ type: string; style: string }> = ({ type, style }) => {
  if (type === 'calendar') {
    const settings = new CalendarSettings({ style: style as CalendarSettings['style'] });
    switch (style) {
      case 'classic': return <PreviewScale><ClassicCalendar settings={settings} /></PreviewScale>;
      case 'collage': return <PreviewScale><CollageCalendar settings={settings} /></PreviewScale>;
      case 'typewriter': return <PreviewScale><TypewriterCalendar settings={settings} /></PreviewScale>;
      default: return <PreviewScale><ModernGridZoomFixed settings={settings} /></PreviewScale>;
    }
  }
  if (type === 'clock') {
    const settings = new ClockSettings({ style: style as ClockSettings['style'] });
    const textColor = getContrastColor(settings.backgroundColor);
    switch (style) {
      case 'flower': return <ClockPreviewScale><FlowerClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
      case 'dreamy': return <ClockPreviewScale><DreamyClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
      default: return <ClockPreviewScale><ClassicClock settings={settings} time={PREVIEW_TIME} textColor={textColor} /></ClockPreviewScale>;
    }
  }
  if (type === 'board') {
    const settings = new BoardSettings({ layout: style as BoardSettings['layout'] });
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
  { id: 'p1', name: 'Weekly Planner', price: 'Free', date: 'Mar 22, 2026', order: '#PY-1042', image: '/template-main.png' },
  { id: 'p2', name: 'Life OS Template', price: '$7.99', date: 'Mar 20, 2026', order: '#PY-1038', image: '/template-main.png' },
  { id: 'p3', name: 'Student Planner', price: '$3.99', date: 'Mar 15, 2026', order: '#PY-1025', image: '/template-main.png' },
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
  background: #FAFAFA;
  font-size: 14px;
  font-family: inherit;
  color: #1F1F1F;
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
  color: #1F1F1F;
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


const ExploreCard = styled.div<{ $index: number }>`
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  animation: ${cardAppear} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => 0.04 + $index * 0.05}s;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ExplorePreview = styled.div`
  aspect-ratio: 4 / 3;
  background: #FAFAFA;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

const ExploreLabel = styled.div`
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

/* ── All Explore Widgets ── */

const ALL_EXPLORE_WIDGETS = [
  ...CALENDAR_STYLES.map(s => ({ type: 'calendar', style: s.value, label: s.label, category: 'Calendar' })),
  ...CLOCK_STYLES.map(s => ({ type: 'clock', style: s.value, label: s.label, category: 'Clock' })),
  ...BOARD_STYLES.map(s => ({ type: 'board', style: s.value, label: s.label, category: 'Canvas' })),
];

type ExploreFilter = 'all' | 'calendar' | 'clock' | 'board';
const EXPLORE_FILTERS: { key: ExploreFilter; label: string }[] = [
  { key: 'all', label: 'Featured' },
  { key: 'calendar', label: 'Calendars' },
  { key: 'clock', label: 'Clocks' },
  { key: 'board', label: 'Canvas' },
];

const ExploreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const MyWidgetsView: React.FC<{ onAddNew?: () => void; onEditWidget?: (widget: SavedWidget) => void }> = ({ onAddNew, onEditWidget }) => {
  const { isRegistered } = useAuth();
  const [filter, setFilter] = useState<WidgetFilter>('all');
  const [exploreFilter, setExploreFilter] = useState<ExploreFilter>('all');
  const [search, setSearch] = useState('');
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWidgets = useCallback(async () => {
    if (!isRegistered) { setLoading(false); return; }
    setLoading(true);
    const data = await WidgetStorageService.getUserWidgets();
    setWidgets(data);
    setLoading(false);
  }, [isRegistered]);

  useEffect(() => { loadWidgets(); }, [loadWidgets]);

  const handleDelete = async (id: string) => {
    await WidgetStorageService.deleteWidget(id);
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const filtered = (filter === 'all' ? widgets : widgets.filter(w => w.type === filter))
    .filter(w => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.style.toLowerCase().includes(search.toLowerCase()));

  const counts = FILTERS.map(f => ({
    ...f,
    count: f.key === 'all' ? widgets.length : widgets.filter(w => w.type === f.key).length,
  }));

  const renderExplorePreview = (type: string, style: string) => {
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
      <SearchWrap>
        <SearchIcon><Search /></SearchIcon>
        <SearchInput
          placeholder="Search widgets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrap>

      {/* Saved Widgets */}
      {widgets.length > 0 && (
        <>
          <SectionHeading>
            <SectionTitle>My Widgets <SectionCount>({widgets.length})</SectionCount></SectionTitle>
          </SectionHeading>
          <FilterRow>
            {counts.map(f => (
              <FilterChip key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label} <ChipCount>{f.count}</ChipCount>
              </FilterChip>
            ))}
          </FilterRow>
          <Grid>
            <AddCard onClick={() => onAddNew?.()}>
              <Plus />
              <AddLabel>New Widget</AddLabel>
            </AddCard>
            {filtered.map((w, i) => (
              <Card key={w.id} $index={i}>
                <CardPreview>
                  <WidgetPreview type={w.type} style={w.style} />
                  <CardOverlay>
                    <OverlayBtn onClick={() => onEditWidget?.(w)}><Pencil /> Edit</OverlayBtn>
                    <OverlayBtn $danger onClick={() => handleDelete(w.id)}><Trash2 /></OverlayBtn>
                  </CardOverlay>
                </CardPreview>
                <CardInfo>
                  <CardName>{w.name}</CardName>
                  <CardMeta>{w.style}</CardMeta>
                </CardInfo>
              </Card>
            ))}
          </Grid>
        </>
      )}

      {/* Empty state — just show Add New prominently */}
      {!loading && widgets.length === 0 && (
        <>
          <SectionHeading>
            <SectionTitle>My Widgets</SectionTitle>
          </SectionHeading>
          <AddCard onClick={() => onAddNew?.()} style={{ maxWidth: 240, margin: '0 0 8px' }}>
            <Plus />
            <AddLabel>Create your first widget</AddLabel>
          </AddCard>
        </>
      )}

      {/* Explore Widgets */}
      <SectionHeading>
        <SectionTitle>Explore</SectionTitle>
      </SectionHeading>
      <FilterRow>
        {EXPLORE_FILTERS.map(f => (
          <FilterChip key={f.key} $active={exploreFilter === f.key} onClick={() => setExploreFilter(f.key)}>
            {f.label}
          </FilterChip>
        ))}
        <FilterSpacer />
        <SortSelect defaultValue="newest">
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="name">A — Z</option>
        </SortSelect>
      </FilterRow>
      <ExploreGrid>
        {ALL_EXPLORE_WIDGETS
          .filter(w => exploreFilter === 'all' || w.type === exploreFilter)
          .map((s, i) => (
            <ExploreCard key={`${s.type}-${s.style}`} $index={i} onClick={() => onAddNew?.()}>
              <ExplorePreview>
                {renderExplorePreview(s.type, s.style)}
              </ExplorePreview>
              <ExploreLabel>{s.label} <span style={{ color: 'rgba(0,0,0,0.3)', fontWeight: 400 }}>{s.category}</span></ExploreLabel>
            </ExploreCard>
          ))}
      </ExploreGrid>
    </Container>
  );
};

const TemplatesView: React.FC = () => {
  const navigate = useNavigate();
  // Just redirect to templates shop
  React.useEffect(() => { navigate('/templates'); }, [navigate]);
  return null;
};

const PurchasesView: React.FC = () => (
  <Container>
    <Title>Purchase History</Title>
    <Subtitle>{PURCHASES.length} orders</Subtitle>
    <PurchaseList>
      {PURCHASES.map(p => (
        <PurchaseRow key={p.id}>
          <PurchaseThumb><img src={p.image} alt={p.name} /></PurchaseThumb>
          <PurchaseInfo>
            <PurchaseName>{p.name}</PurchaseName>
            <PurchaseDate>{p.order} · {p.date}</PurchaseDate>
          </PurchaseInfo>
          <PurchasePrice>{p.price}</PurchasePrice>
          <ActionBtn><Download /> Download</ActionBtn>
          <ActionBtn><ExternalLink /> Receipt</ActionBtn>
        </PurchaseRow>
      ))}
    </PurchaseList>
  </Container>
);

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <Container>
      <Title>Settings</Title>
      <Subtitle>Manage your account and preferences</Subtitle>

      <ProfileCard>
        <Avatar>{initials}</Avatar>
        <ProfileForm>
          <div>
            <Label>Name</Label>
            <Input defaultValue={user?.name || ''} />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user?.email || ''} type="email" readOnly style={{ opacity: 0.6 }} />
          </div>
          <SaveBtn>Save Changes</SaveBtn>
        </ProfileForm>
      </ProfileCard>

      <ProfileCard style={{ marginTop: 16, alignItems: 'flex-start' }}>
        <ProfileForm>
          <Label style={{ marginBottom: 0, fontSize: 15, fontWeight: 600, color: '#1F1F1F' }}>Danger Zone</Label>
          <ActionBtn onClick={async () => { await logout(); navigate('/'); }} style={{ color: '#DC2828', marginTop: 8 }}>
            <LogOut /> Log out
          </ActionBtn>
        </ProfileForm>
      </ProfileCard>
    </Container>
  );
};

/* ── Router ── */

interface DashboardContentProps {
  view: DashboardView;
  onAddNew?: () => void;
  onEditWidget?: (widget: SavedWidget) => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ view, onAddNew, onEditWidget }) => {
  switch (view) {
    case 'my-widgets': return <MyWidgetsView onAddNew={onAddNew} onEditWidget={onEditWidget} />;
    case 'templates': return <TemplatesView />;
    case 'purchases': return <PurchasesView />;
    case 'profile': return <ProfileView />;
    default: return null;
  }
};
