import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import styled, { keyframes, useTheme } from 'styled-components';
import { Copy, Check, Pencil, Trash2, Plus, Download, ExternalLink, LogOut, Settings, ArrowRight, Link as LinkIcon, Save as SaveIcon, Cloud, Loader2, FileText, Palette, LayoutGrid, Sparkles, ChevronLeft } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';
import { TopNav } from '../components/layout/TopNav';
import { EmailVerificationBanner } from '../components/shared/EmailVerificationBanner';
import { Button as SharedButton, BottomSheet, Segment, SegmentGroup, PlanUsageCard, Modal, ModalFooter, Tag, Toast } from '@/presentation/components/shared';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel, type PanelSection } from '../components/ui/forms/CustomizationPanel';
import { useAuth } from '../context/AuthContext';
import { useUpgradeModal } from '../context/UpgradeModalContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { WidgetStorageService, WidgetTierError, type SavedWidget } from '../../infrastructure/services/WidgetStorageService';
import { getContrastColor } from '../themes/colors';

/* Widget previews */
import { ModernGridZoomFixed } from '../components/widgets/calendar/styles/ModernGridZoomFixed';
import { ClassicCalendar } from '../components/widgets/calendar/styles/ClassicCalendar';
import { CollageCalendar } from '../components/widgets/calendar/styles/CollageCalendar';
import { TypewriterCalendar } from '../components/widgets/calendar/styles/TypewriterCalendar';
import { ClassicClock } from '../components/widgets/clock/styles/ClassicClock';
import { FlowerClock } from '../components/widgets/clock/styles/FlowerClock';
import { DreamyClock } from '../components/widgets/clock/styles/DreamyClock';
import { InspirationBoard } from '../components/widgets/board/styles/InspirationBoard';
import { CALENDAR_STYLES, CLOCK_STYLES, BOARD_STYLES } from '../components/ui/widgetConfig';

type AnySettings = Partial<CalendarSettings | ClockSettings | BoardSettings>;

interface StudioPageProps {
  diContainer: DIContainer;
}

/* ── Styles ── */

const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 64px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 32px 24px 32px; }
`;

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TabBarWrap = styled.div`
  margin-bottom: 32px;
`;

/* Section headers */
const SectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin: 0;
`;

const SectionCount = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-left: 6px;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

/* Widget cards */
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: 1fr; }
`;

export const WidgetCard = styled.div<{ $i: number }>`
  background: #fff;
  border: 1.5px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  animation: ${cardAppear} 0.35s ease ${({ $i }) => 0.04 + $i * 0.03}s both;
  transition: all ${({ theme }) => theme.transitions.medium};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.hairlineHover};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

export const WidgetPreviewWrap = styled.div`
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  cursor: pointer;
  position: relative;
`;

export const WidgetBottom = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,0.04);
`;

export const WidgetName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const WidgetActions = styled.div`
  display: flex;
  gap: 6px;
`;

/* Body copy for the Delete confirmation Modal. Mirrors the pattern used
   in SettingsPage so both confirmation dialogs read identically. */
const DeleteModalText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
  }
`;

/* Empty state */
const EmptyCard = styled.div`
  border: 1.5px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 56px 24px;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  &:hover { border-color: ${({ theme }) => theme.colors.border.hairlineHover}; box-shadow: ${({ theme }) => theme.shadows.cardHover}; }
`;

const EmptyCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients.avatarPeach};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  svg { width: 24px; height: 24px; color: ${({ theme }) => theme.colors.accent}; }
`;

/* ── Welcome + banner typography (replaces inline styles below) ── */
const WelcomeH1 = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes['6xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 6px;
`;

const WelcomeSub = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

const BannerTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const BannerSub = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 6px;
`;

const BannerCta = styled.button<{ $fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  svg { width: 16px; height: 16px; }
`;

const EmptyStateTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px;
`;

const EmptyStateSub = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
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
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.border.hairlineHover}; box-shadow: ${({ theme }) => theme.shadows.card}; }
  & + & { margin-top: 8px; }
`;

const PurchaseImg = styled.div`
  width: 56px; height: 56px; border-radius: ${({ theme }) => theme.radii.md}; overflow: hidden; background: ${({ theme }) => theme.colors.background.surfaceMuted}; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

/* ── Mobile editor (≤768) ── */
const MobileEditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: #fff;
  overflow: hidden;
`;

const MobileTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
`;

const MobileBackBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.body};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  svg { width: 18px; height: 18px; }
`;

const MobileWidgetName = styled.div`
  flex: 1;
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MobileCopyBtn = styled.button<{ $copied: boolean }>`
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $copied, theme }) => $copied ? theme.colors.success.base : theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: background ${({ theme }) => theme.transitions.fast};
  svg { width: 14px; height: 14px; }
`;

export const MobileArtboard = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  margin: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
    ${({ theme }) => theme.colors.background.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MobileDotGrid = styled.div`
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.5;
`;

export const MobileWidgetScale = styled.div`
  transform: scale(0.7);
  transform-origin: center center;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.08)) drop-shadow(0 2px 6px rgba(0,0,0,0.04));
`;

export const MobileSectionTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.background.elevated};
  border-top: 1px solid ${({ theme }) => theme.colors.border.hairline};
  flex-shrink: 0;
`;

export const MobileSectionTab = styled.button<{ $active: boolean; $disabled?: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px;
  height: 48px;
  border: none;
  background: ${({ $active, $disabled, theme }) =>
    $disabled ? 'transparent' : $active ? theme.colors.state.activeWash : 'transparent'};
  color: ${({ $active, $disabled, theme }) =>
    $disabled ? theme.colors.text.muted : $active ? theme.colors.state.active : theme.colors.text.hint};
  opacity: ${({ $disabled }) => $disabled ? 0.55 : 1};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast}, opacity ${({ theme }) => theme.transitions.fast};
  padding: 0;
  svg { width: 18px; height: 18px; }
`;

/* Preview helpers */
const PreviewScale = styled.div`
  transform: scale(0.55);
  transform-origin: center center;
  pointer-events: none;
`;

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

const PURCHASES = [
  { id: 'p1', name: 'Weekly Planner', price: 'Free', date: 'Mar 22, 2026', order: '#PY-1042', image: '/template-main.png', slug: 'weekly-planner' },
  { id: 'p2', name: 'Life OS Template', price: '$7.99', date: 'Mar 20, 2026', order: '#PY-1038', image: '/template-main.png', slug: 'life-os' },
  { id: 'p3', name: 'Student Planner', price: '$3.99', date: 'Mar 15, 2026', order: '#PY-1025', image: '/template-main.png', slug: 'student-planner' },
];

const WidgetPreview: React.FC<{ type: string; style: string; savedSettings?: Record<string, unknown> }> = ({ type, style, savedSettings }) => {
  const saved = (savedSettings || {}) as Record<string, unknown>;
  if (type === 'calendar') {
    const s = new CalendarSettings({ ...saved, style: style as CalendarSettings['style'] });
    switch (style) {
      case 'classic': return <PreviewScale><ClassicCalendar settings={s} /></PreviewScale>;
      case 'collage': return <PreviewScale><CollageCalendar settings={s} /></PreviewScale>;
      case 'typewriter': return <PreviewScale><TypewriterCalendar settings={s} /></PreviewScale>;
      default: return <PreviewScale><ModernGridZoomFixed settings={s} /></PreviewScale>;
    }
  }
  if (type === 'clock') {
    const s = new ClockSettings({ ...saved, style: style as ClockSettings['style'] });
    const tc = getContrastColor(s.backgroundColor);
    switch (style) {
      case 'flower': return <PreviewScale><FlowerClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
      case 'dreamy': return <PreviewScale><DreamyClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
      default: return <PreviewScale><ClassicClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
    }
  }
  if (type === 'board') {
    const s = new BoardSettings({ ...saved, layout: style as BoardSettings['layout'] });
    return <PreviewScale><InspirationBoard settings={s} /></PreviewScale>;
  }
  return null;
};

/* ── Downgrade banner ── */
// Shown after the user clicks "Cancel" in Polar's portal but before the
// current period ends — Pro features still work, but they need to know
// access lapses on the renewal date so the upgrade prompt doesn't feel
// like it appeared out of nowhere.

const DowngradeBannerWrap = styled.div`
  max-width: 1200px;
  margin: 12px auto 0;
  padding: 0 48px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 0 24px; }
`;

const DowngradeBannerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.warning.bg};
  border: 1px solid ${({ theme }) => theme.colors.warning.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.warning.text};
  letter-spacing: -0.005em;
  flex-wrap: wrap;
`;

const DowngradeBanner: React.FC<{
  isPro: boolean;
  status: string | null;
  endsAt: string | null;
}> = ({ isPro, status, endsAt }) => {
  if (!isPro || status !== 'canceled' || !endsAt) return null;
  const d = new Date(endsAt);
  if (Number.isNaN(d.getTime())) return null;
  const formatted = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <DowngradeBannerWrap>
      <DowngradeBannerInner>
        <span>
          <strong>Pro ends {formatted}.</strong>{' '}
          After that, editing is locked until you renew. Existing widgets keep working — embeds won't break.
        </span>
        <a
          href="/settings#subscription"
          style={{
            color: '#92400E', fontWeight: 600, textDecoration: 'none',
            borderBottom: '1px solid currentColor', paddingBottom: 1,
          }}
        >
          Manage in Settings →
        </a>
      </DowngradeBannerInner>
    </DowngradeBannerWrap>
  );
};

/* ── Component ── */

type StudioTab = 'widgets' | 'templates';

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRegistered, isGuest, user, plan, isPro, planLoading } = useAuth();
  // `?purchased=<polarProductId>` lands here from Polar after a successful
  // template checkout. Show a banner + optional signup CTA for guests.
  const [purchasedProductId, setPurchasedProductId] = useState<string | null>(() => searchParams.get('purchased'));
  const [tab, setTab] = useState<StudioTab>('widgets');
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [mobileSection, setMobileSection] = useState<PanelSection>(null);

  const { open: openUpgrade } = useUpgradeModal();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  // Editing state
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingWidgetKey, setEditingWidgetKey] = useState<string>('');
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editingWidgetName, setEditingWidgetName] = useState<string>('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedWidgetId, setCopiedWidgetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedWidget | null>(null);
  const [studioZoom, setStudioZoom] = useState(1.2);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSavedRef = useRef<string>('');
  const savedStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Convert class-based settings instance into plain JSON-safe object for storage.
  const serializeSettings = (widget: Widget): Record<string, unknown> =>
    JSON.parse(JSON.stringify(widget.settings));

  // Local storage helpers for widget simulation
  const LOCAL_KEY = 'peachy_local_widgets';
  const loadLocalWidgets = (): SavedWidget[] => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };
  const saveLocalWidgets = (list: SavedWidget[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  };

  const loadWidgets = useCallback(async () => {
    if (isRegistered) {
      const data = await WidgetStorageService.getUserWidgets();
      setWidgets(data);
    } else {
      setWidgets(loadLocalWidgets());
    }
    setLoading(false);
  }, [isRegistered]);

  useEffect(() => { loadWidgets(); }, [loadWidgets]);

  // Handle incoming newWidget from /widgets Customize flow
  useEffect(() => {
    const state = location.state as { newWidget?: { name: string; type: string; style: string } } | null;
    if (state?.newWidget) {
      const { name, type, style } = state.newWidget;
      // Clear state so it doesn't re-trigger
      window.history.replaceState({}, '');
      // Create widget and open editor
      (async () => {
        try {
          const widget = await diContainer.createWidgetUseCase.execute(type);
          let updated;
          if (type === 'calendar') {
            updated = widget.updateSettings(new CalendarSettings({ style: style as CalendarSettings['style'] }));
          } else if (type === 'clock') {
            updated = widget.updateSettings(new ClockSettings({ style: style as ClockSettings['style'] }));
          } else {
            updated = widget.updateSettings(new BoardSettings({ layout: style as BoardSettings['layout'] }));
          }
          setEditingWidget(updated);
          setEditingWidgetKey(`${type}-${style}`);
          setEditingWidgetName(name);
          setEditingWidgetId(null);
          setSaveStatus('idle');
          // Reset saved fingerprint so the first auto-save creates the record.
          lastSavedRef.current = '';
          setEditorOpen(true);
        } catch (err) {
          Logger.error('StudioPage', 'Failed to create widget from nav state', err);
        }
      })();
    }
  }, [location.state, diContainer, isRegistered]);

  // Save widget locally (simulation)
  const saveWidgetLocal = (name: string, type: string, style: string, settings: Record<string, unknown> = {}, editId?: string) => {
    const current = loadLocalWidgets();
    if (editId) {
      const updated = current.map(w => w.id === editId ? { ...w, name, settings, updated_at: new Date().toISOString() } : w);
      saveLocalWidgets(updated);
      setWidgets(updated);
    } else {
      const newWidget: SavedWidget = {
        id: crypto.randomUUID(),
        user_id: 'local',
        name,
        type,
        style,
        settings,
        embed_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newWidget, ...current];
      saveLocalWidgets(updated);
      setWidgets(updated);
      return newWidget.id;
    }
  };

  // Persist current editing widget — to Supabase for registered users, localStorage for guests.
  const persist = useCallback(async (widget: Widget, name: string) => {
    const settings = serializeSettings(widget);
    const style = editingWidgetKey.split('-').slice(1).join('-');

    if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current);
    setSaveStatus('saving');

    try {
      if (isRegistered) {
        if (editingWidgetId) {
          const ok = await WidgetStorageService.updateWidget(editingWidgetId, { name, settings });
          if (!ok) throw new Error('update failed');
        } else {
          const saved = await WidgetStorageService.saveWidget({ name, type: widget.type, style, settings });
          if (!saved) throw new Error('insert failed');
          setEditingWidgetId(saved.id);
        }
        // Refresh list in background — don't block save status UI.
        WidgetStorageService.getUserWidgets().then(setWidgets).catch(() => { /* ignore */ });
      } else {
        if (editingWidgetId) {
          saveWidgetLocal(name, widget.type, style, settings, editingWidgetId);
        } else {
          const newId = saveWidgetLocal(name, widget.type, style, settings);
          if (newId) setEditingWidgetId(newId);
        }
      }
      setSaveStatus('saved');
      savedStatusTimerRef.current = setTimeout(() => setSaveStatus('idle'), 1800);
    } catch (err) {
      // Server-side tier enforcement blocked the write — either the free
      // user hit the 3-widget cap racing past the client check, or they
      // tried to save a Pro-only style. Open the upgrade modal instead of
      // showing a generic error toast.
      if (err instanceof WidgetTierError) {
        Logger.info('StudioPage', 'Save blocked by tier policy', err.message);
        setSaveStatus('idle');
        openUpgrade();
        return;
      }
      Logger.error('StudioPage', 'Auto-save failed', err);
      setSaveStatus('error');
      savedStatusTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [isRegistered, editingWidgetId, editingWidgetKey, openUpgrade]);

  // Debounced auto-save: fires 1.5s after the last settings or name change while editor is open.
  useEffect(() => {
    if (!editorOpen || !editingWidget) return;
    const fingerprint = JSON.stringify(serializeSettings(editingWidget)) + '|' + editingWidgetName;
    if (fingerprint === lastSavedRef.current) return;

    const timer = setTimeout(() => {
      persist(editingWidget, editingWidgetName);
      lastSavedRef.current = fingerprint;
    }, 1500);

    return () => clearTimeout(timer);
  }, [editingWidget, editingWidgetName, editorOpen, persist]);

  const handleDelete = async (id: string) => {
    if (isRegistered) {
      await WidgetStorageService.deleteWidget(id);
    } else {
      const updated = loadLocalWidgets().filter(w => w.id !== id);
      saveLocalWidgets(updated);
    }
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleEdit = async (w: SavedWidget) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(w.type);
      const savedSettings = (w.settings || {}) as Record<string, unknown>;
      let updated;
      if (w.type === 'calendar') {
        updated = widget.updateSettings(new CalendarSettings({ ...savedSettings, style: w.style as CalendarSettings['style'] }));
      } else if (w.type === 'clock') {
        updated = widget.updateSettings(new ClockSettings({ ...savedSettings, style: w.style as ClockSettings['style'] }));
      } else {
        updated = widget.updateSettings(new BoardSettings({ ...savedSettings, layout: w.style as BoardSettings['layout'] }));
      }
      setEditingWidget(updated);
      setEditingWidgetKey(`${w.type}-${w.style}`);
      setEditingWidgetId(w.id);
      setEditingWidgetName(w.name);
      setSaveStatus('idle');
      // Mark current state as saved so the first debounced auto-save does not re-fire on open.
      lastSavedRef.current = JSON.stringify(serializeSettings(updated)) + '|' + w.name;
      setEditorOpen(true);
    } catch (err) {
      Logger.error('StudioPage', 'Failed to load widget for editing', err);
    }
  };

  const handleEditorBack = () => {
    // Flush any pending auto-save on exit so the user never loses unsaved edits.
    if (editingWidget) {
      const fingerprint = JSON.stringify(serializeSettings(editingWidget)) + '|' + editingWidgetName;
      if (fingerprint !== lastSavedRef.current) {
        persist(editingWidget, editingWidgetName);
        lastSavedRef.current = fingerprint;
      }
    }
    setEditorOpen(false);
    setEditingWidgetId(null);
  };

  // If editing, show full-screen editor (Figma-style artboard)
  if (editorOpen && editingWidget) {
    const embedUrl = diContainer.getWidgetEmbedUrlUseCase.execute(editingWidget);
    // copied state is declared at component level

    // ── Mobile editor (≤768): stacked layout + bottom sheet panel ──
    // Desktop code below stays intact. Mobile path duplicates state usage
    // but uses a completely separate JSX tree to avoid cross-viewport CSS risk.
    if (isMobile) {
      const calStyle = editingWidget.type === 'calendar' ? (editingWidget.settings as CalendarSettings).style : '';
      const clkStyle = editingWidget.type === 'clock' ? (editingWidget.settings as ClockSettings).style : '';
      const isBoardW = editingWidget.type === 'board';
      const isCollageW = calStyle === 'collage' || calStyle === 'typewriter' || clkStyle === 'flower';
      const isFlowerW = clkStyle === 'flower';

      // Panel sections — all four tabs are always shown in the bottom bar
      // for visual consistency; tabs unavailable for this widget type are
      // rendered greyed-out and do not open the sheet on tap.
      const sections: { key: Exclude<PanelSection, null>; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
        { key: 'style', label: 'Style', icon: <Sparkles />, disabled: !(isFlowerW || isBoardW) },
        { key: 'content', label: 'Content', icon: <FileText /> },
        { key: 'color', label: 'Color', icon: <Palette />, disabled: isBoardW },
        { key: 'layout', label: 'Layout', icon: <LayoutGrid />, disabled: isCollageW || isBoardW },
      ];

      const sheetOpen = mobileSection !== null;
      const openSection = (s: Exclude<PanelSection, null>, disabled?: boolean) => {
        if (disabled) return;
        setMobileSection(prev => prev === s ? null : s);
      };
      const closeSheet = () => setMobileSection(null);

      return (
        <MobileEditorWrap>
          <MobileTopBar>
            <MobileBackBtn onClick={handleEditorBack} aria-label="Back">
              <ChevronLeft />
            </MobileBackBtn>
            <MobileWidgetName>
              {editingWidgetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </MobileWidgetName>
            {/* Save status dot — non-intrusive */}
            {saveStatus === 'saving' && <Loader2 style={{ width: 14, height: 14, color: theme.colors.text.tertiary, animation: 'spin 1s linear infinite' }} />}
            {saveStatus === 'saved' && <Check style={{ width: 14, height: 14, color: theme.colors.success.fg }} />}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <MobileCopyBtn
              $copied={copied}
              onClick={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(embedUrl).catch(() => {});
                }
              }}
            >
              {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
            </MobileCopyBtn>
          </MobileTopBar>

          <MobileArtboard>
            <MobileDotGrid />
            <MobileWidgetScale>
              <WidgetDisplay widget={editingWidget} />
            </MobileWidgetScale>
          </MobileArtboard>

          <MobileSectionTabs>
            {sections.map(s => (
              <MobileSectionTab
                key={s.key}
                $active={mobileSection === s.key && !s.disabled}
                $disabled={s.disabled}
                disabled={s.disabled}
                aria-disabled={s.disabled}
                onClick={() => openSection(s.key, s.disabled)}
              >
                {s.icon}
                {s.label}
              </MobileSectionTab>
            ))}
          </MobileSectionTabs>

          <BottomSheet
            open={sheetOpen}
            onClose={closeSheet}
            title={mobileSection ?? ''}
            capitalizeTitle
          >
            {mobileSection && (
              <CustomizationPanel
                widget={editingWidget}
                onSettingsChange={(settings) => {
                  if (!editingWidget) return;
                  const updated = editingWidget.updateSettings(settings as CalendarSettings | ClockSettings | BoardSettings);
                  setEditingWidget(updated);
                }}
                visibleSection={mobileSection}
                widgetCount={widgets.length}
                widgetLimit={3}
                onUpgrade={() => openUpgrade()}
              />
            )}
          </BottomSheet>
        </MobileEditorWrap>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', background: theme.colors.background.elevated }}>
        {/* Editor top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px 0 48px', paddingRight: 310, height: 68, paddingTop: 15, background: theme.colors.background.elevated, flexShrink: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={handleEditorBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px',
              border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, background: theme.colors.background.elevated,
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: theme.colors.text.body, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} /> Back
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: theme.colors.accent, letterSpacing: '-0.02em' }}>
              {editingWidgetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
            {/* Save status — mirrors Figma/Notion auto-save indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 10px', borderRadius: 8,
              background: saveStatus === 'error' ? 'rgba(220,40,40,0.08)' : 'rgba(0,0,0,0.04)',
              color: saveStatus === 'error' ? '#F49B8B' : saveStatus === 'saved' ? '#16A34A' : '#888',
              fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
              opacity: saveStatus === 'idle' ? 0 : 1,
              transition: 'opacity ${({ theme }) => theme.transitions.medium}, color ${({ theme }) => theme.transitions.medium}, background ${({ theme }) => theme.transitions.medium}',
              minWidth: 84, justifyContent: 'center',
            }}>
              {saveStatus === 'saving' && (<><Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> Saving…</>)}
              {saveStatus === 'saved' && (<><Check style={{ width: 12, height: 12 }} /> Saved</>)}
              {saveStatus === 'error' && (<><Cloud style={{ width: 12, height: 12 }} /> Retry…</>)}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
          {/* Status + Upgrade — right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {planLoading ? null : (
              <PlanUsageCard
                mode={isPro ? 'pro' : 'free'}
                $size="compact"
                used={widgets.length}
                limit={3}
                onUpgrade={() => openUpgrade()}
                onManage={() => navigate('/settings')}
              />
            )}
          </div>
        </div>

        {/* Editor body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Artboard */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
              #F8F8F7`,
            margin: '12px 12px 24px 48px',
            borderRadius: 20,
            border: `1px solid ${theme.colors.border.hairline}`,
          }}>
            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px', pointerEvents: 'none', opacity: 0.6,
            }} />

            {/* Zoom controls removed — fixed at 120% */}

            {/* Widget */}
            <div style={{
              transform: `scale(${studioZoom}) translateY(-32px)`, transformOrigin: 'center center',
              transition: 'transform ${({ theme }) => theme.transitions.fast}',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.08)) drop-shadow(0 2px 6px rgba(0,0,0,0.04))',
            }}>
              <WidgetDisplay widget={editingWidget} />
            </div>

            {/* Floating toolbar — bottom center */}
            <div style={{
              position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${theme.colors.border.hairline}`, borderRadius: 16,
              padding: '10px 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <input readOnly value={embedUrl} style={{
                width: 240, height: 34, padding: '0 12px', border: 'none', borderRadius: 8,
                background: 'rgba(0,0,0,0.04)', fontSize: 11, fontFamily: 'monospace', color: theme.colors.text.hint,
                outline: 'none',
              }} onClick={e => (e.target as HTMLInputElement).select()} />
              <SharedButton
                $variant={copied ? 'successSoft' : 'slate'}
                $size="md"
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(embedUrl).catch(() => {});
                  }
                }}
              >
                {copied ? <><Check /> Copied!</> : <><Copy /> Copy</>}
              </SharedButton>
            </div>
          </div>

          {/* Customization panel */}
          <div style={{
            width: 300, flexShrink: 0, overflow: 'auto',
            background: theme.colors.background.elevated,
          }}>
            <CustomizationPanel
              widget={editingWidget}
              onSettingsChange={(settings) => {
                if (!editingWidget) return;
                const updated = editingWidget.updateSettings(settings as CalendarSettings | ClockSettings | BoardSettings);
                setEditingWidget(updated);
              }}
              widgetCount={widgets.length}
              widgetLimit={3}
              onUpgrade={() => openUpgrade()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Page>
      <TopNav activeLink="studio" />
      <EmailVerificationBanner />
      <DowngradeBanner isPro={isPro} status={plan.status} endsAt={plan.currentPeriodEnd} />

      {purchasedProductId && (
        <div style={{
          margin: '12px 48px 0',
          padding: '14px 18px',
          borderRadius: 12,
          border: '1px solid rgba(34, 197, 94, 0.25)',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F7EE 100%)',
          color: theme.colors.success.dark,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap' as const,
        }}>
          <span style={{ flex: 1, minWidth: 220 }}>
            <strong>✓ Purchase confirmed.</strong> A download link was emailed to you
            {user?.email ? <> at <strong>{user.email}</strong></> : null}.
            {!isRegistered && <> Wrong email? <a href="mailto:support@peachyplanner.com" style={{ color: theme.colors.success.dark, fontWeight: 600 }}>Contact support</a>.</>}
          </span>
          {!isRegistered && (
            <button
              onClick={() => navigate(`/login?returnTo=${encodeURIComponent('/studio?view=purchases')}`)}
              style={{
                background: theme.colors.success.dark, color: theme.colors.text.inverse, border: 'none', borderRadius: 8,
                padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Create account to save this purchase
            </button>
          )}
          <button
            onClick={() => {
              setPurchasedProductId(null);
              const next = new URLSearchParams(searchParams);
              next.delete('purchased');
              setSearchParams(next, { replace: true });
            }}
            style={{
              background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer',
              color: theme.colors.success.dark, lineHeight: 1, padding: 4,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <Container>
        {/* Welcome */}
        <div style={{
          display: 'flex',
          flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 0,
          marginBottom: 32,
          marginTop: 8,
        }}>
          <div>
            <WelcomeH1>Welcome 👋</WelcomeH1>
            <WelcomeSub>Manage your widgets and templates</WelcomeSub>
          </div>
          {planLoading ? null : (
            <PlanUsageCard
              mode={isPro ? 'pro' : 'free'}
              $size="wide"
              used={widgets.length}
              limit={3}
              onUpgrade={() => openUpgrade()}
              onManage={() => navigate('/settings')}
            />
          )}
        </div>

        {/* Tab bar */}
        <TabBarWrap>
          <SegmentGroup>
            <Segment $active={tab === 'widgets'} onClick={() => setTab('widgets')}>Widgets</Segment>
            <Segment $active={tab === 'templates'} onClick={() => setTab('templates')}>Templates</Segment>
          </SegmentGroup>
        </TabBarWrap>

        {/* ── Widgets Tab ── */}
        {tab === 'widgets' && (
          <>
            {/* Create new widget — gradient banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%)',
                border: '1.5px solid rgba(200,195,230,0.3)',
                borderRadius: 16,
                padding: isMobile ? '24px 20px' : '32px 32px',
                display: 'flex',
                flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                gap: isMobile ? 16 : 0,
                marginBottom: 32,
              }}
            >
              <div>
                <BannerTitle>Create new widget</BannerTitle>
                <BannerSub>Browse styles, customize and embed in Notion</BannerSub>
              </div>
              <BannerCta $fullWidth={isMobile} onClick={() => navigate('/widgets')}>
                <Plus /> Browse widgets
              </BannerCta>
            </div>

            {/* Your widgets */}
            <SectionRow style={{ marginTop: 18 }}>
              <SectionTitle>Your widgets <SectionCount>{widgets.length}</SectionCount></SectionTitle>
            </SectionRow>

            {!loading && widgets.length === 0 ? (
              <EmptyCard onClick={() => navigate('/widgets')}>
                <EmptyCircle><Plus /></EmptyCircle>
                <EmptyStateTitle>No widgets yet</EmptyStateTitle>
                <EmptyStateSub>Create your first widget from the gallery above</EmptyStateSub>
              </EmptyCard>
            ) : (
              <WidgetGrid>
                {widgets.map((w, i) => (
                  <WidgetCard key={w.id} $i={i}>
                    <WidgetPreviewWrap onClick={() => handleEdit(w)}>
                      <Tag style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>{w.type === 'calendar' ? 'calendar' : w.type === 'clock' ? 'clock' : 'board'}</Tag>
                      <WidgetPreview type={w.type} style={w.style} savedSettings={w.settings} />
                    </WidgetPreviewWrap>
                    <WidgetBottom>
                      <WidgetName>{w.name}</WidgetName>
                      <WidgetActions>
                        <SharedButton $variant="primary" $size="sm" onClick={() => handleEdit(w)}><Pencil /> Edit</SharedButton>
                        <SharedButton
                          $variant={copiedWidgetId === w.id ? 'successSoft' : 'outline'}
                          $size="sm"
                          $iconOnly
                          aria-label={copiedWidgetId === w.id ? 'Copied' : 'Copy embed URL'}
                          title={copiedWidgetId === w.id ? 'Copied!' : 'Copy embed URL'}
                          onClick={() => {
                            if (!w.embed_url) return;
                            setCopiedWidgetId(w.id);
                            setTimeout(() => setCopiedWidgetId(null), 2000);
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(w.embed_url).catch(() => {});
                            }
                          }}
                        >
                          {copiedWidgetId === w.id ? <Check /> : <Copy />}
                        </SharedButton>
                        <SharedButton
                          $variant="danger"
                          $size="sm"
                          $iconOnly
                          aria-label="Delete widget"
                          style={{ marginLeft: 'auto' }}
                          onClick={() => setDeleteTarget(w)}
                        >
                          <Trash2 />
                        </SharedButton>
                      </WidgetActions>
                    </WidgetBottom>
                  </WidgetCard>
                ))}
              </WidgetGrid>
            )}
          </>
        )}

        {/* ── Templates Tab ── */}
        {tab === 'templates' && (
          <>
            {/* Browse banner — top */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(252,235,225,0.45) 0%, rgba(255,245,235,0.4) 30%, rgba(237,228,255,0.35) 70%, rgba(232,237,255,0.4) 100%)',
              border: '1.5px solid rgba(220,200,210,0.25)', borderRadius: 16,
              padding: isMobile ? '24px 20px' : '32px 32px',
              display: 'flex',
              flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? 16 : 0,
              marginBottom: 32,
            }}>
              <div>
                <BannerTitle>Browse template shop</BannerTitle>
                <BannerSub>Notion planners, trackers & productivity systems</BannerSub>
              </div>
              <BannerCta $fullWidth={isMobile} onClick={() => navigate('/templates')}>
                <ArrowRight /> Browse
              </BannerCta>
            </div>

            {/* Purchases — below */}
            <SectionRow>
              <SectionTitle>My Purchases <SectionCount>{PURCHASES.length}</SectionCount></SectionTitle>
            </SectionRow>

            {PURCHASES.length === 0 ? (
              <EmptyCard onClick={() => navigate('/templates')}>
                <EmptyCircle><Download /></EmptyCircle>
                <p style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary, margin: '0 0 4px' }}>No purchases yet</p>
                <p style={{ fontSize: 13, color: theme.colors.text.tertiary, margin: 0 }}>Browse the shop to find planners for Notion</p>
              </EmptyCard>
            ) : (
              <>
                {PURCHASES.map(p => (
                  <PurchaseCard key={p.id} onClick={() => navigate(`/templates/${p.slug}`)}>
                    <PurchaseImg><img src={p.image} alt={p.name} /></PurchaseImg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: theme.colors.text.tertiary, marginTop: 2 }}>{p.order} · {p.date}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary, marginRight: 8 }}>{p.price}</div>
                    <SharedButton $variant="secondary" $size="sm" onClick={(e) => { e.stopPropagation(); }}><Download /> Download</SharedButton>
                  </PurchaseCard>
                ))}
              </>
            )}
          </>
        )}
      </Container>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        eyebrow="Delete widget"
        eyebrowTone="danger"
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : 'Delete widget?'}
        size="sm"
        hideClose
      >
        <DeleteModalText>
          The embed URL will stop working immediately. This can&apos;t be undone.
        </DeleteModalText>
        <ModalFooter>
          <SharedButton
            type="button"
            $variant="outline"
            $size="lg"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </SharedButton>
          <SharedButton
            type="button"
            $variant="dangerStrong"
            $size="lg"
            onClick={() => {
              if (deleteTarget) {
                handleDelete(deleteTarget.id);
                setDeleteTarget(null);
              }
            }}
          >
            Delete
          </SharedButton>
        </ModalFooter>
      </Modal>

      <Toast open={copiedWidgetId !== null} onClose={() => setCopiedWidgetId(null)} tone="success">
        Embed code copied
      </Toast>

      {/* Upgrade modal is rendered globally via UpgradeModalProvider (see App.tsx). */}
    </Page>
  );
};
