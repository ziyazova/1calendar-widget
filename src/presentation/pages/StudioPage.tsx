import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Copy, Check, Pencil, Trash2, Plus, Download, ExternalLink, LogOut, Settings, ArrowRight, Link as LinkIcon, Save as SaveIcon, Cloud, Loader2 } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';
import { TopNav } from '../components/layout/TopNav';
import { EmailVerificationBanner } from '../components/shared/EmailVerificationBanner';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';
import { useAuth } from '../context/AuthContext';
import { useUpgradeModal } from '../context/UpgradeModalContext';
import { WidgetStorageService, type SavedWidget } from '../../infrastructure/services/WidgetStorageService';
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

  @media (max-width: 768px) { padding: 32px 24px 32px; }
`;

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* Tab bar */
const TabBar = styled.div`
  display: inline-flex;
  gap: 4px;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 28px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 600 : 500};
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  background: ${({ $active }) => $active ? '#fff' : 'transparent'};
  color: ${({ $active }) => $active ? '#1F1F1F' : '#888'};
  box-shadow: ${({ $active }) => $active ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none'};

  &:hover { color: #1F1F1F; }
`;

/* Section headers */
const SectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.02em;
  margin: 0;
`;

const SectionCount = styled.span`
  font-weight: 400;
  color: #999;
  margin-left: 6px;
  font-size: 16px;
`;

const SectionLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #999;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  &:hover { color: #1F1F1F; }
  svg { width: 12px; height: 12px; }
`;

/* Widget cards */
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const WidgetCard = styled.div<{ $i: number }>`
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  overflow: hidden;
  animation: ${cardAppear} 0.35s ease ${({ $i }) => 0.04 + $i * 0.03}s both;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
`;

const WidgetPreviewWrap = styled.div`
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #FAFAF9;
  cursor: pointer;
  position: relative;
`;

const WidgetLabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 600;
  color: #6366F1;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 6px;
  z-index: 1;
`;

const WidgetBottom = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,0.04);
`;

const WidgetName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1F1F1F;
`;

const WidgetActions = styled.div`
  display: flex;
  gap: 6px;
`;

const Btn = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${({ $primary, $danger }) => $primary ? '#1F1F1F' : $danger ? 'rgba(220,40,40,0.2)' : 'rgba(0,0,0,0.1)'};
  background: ${({ $primary }) => $primary ? '#1F1F1F' : 'transparent'};
  color: ${({ $primary, $danger }) => $primary ? '#fff' : $danger ? '#DC2828' : '#666'};
  &:hover { opacity: 0.85; }
  svg { width: 14px; height: 14px; }
`;

/* Empty state */
const EmptyCard = styled.div`
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 56px 24px;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(0,0,0,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
`;

const EmptyCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EDE4FF, #E0E8FF);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  svg { width: 24px; height: 24px; color: #6366F1; }
`;

const BrowseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.4) 40%, rgba(245,235,250,0.45) 100%);
  color: #6366F1;
  border: 1.5px solid rgba(200,195,230,0.3);
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 24px;
  &:hover { border-color: rgba(99,102,241,0.3); background: linear-gradient(135deg, rgba(237,228,255,0.65) 0%, rgba(232,237,255,0.55) 40%, rgba(245,235,250,0.6) 100%); }
  svg { width: 16px; height: 16px; }
`;

/* Purchase cards */
const PurchaseCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: rgba(0,0,0,0.1); box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
  & + & { margin-top: 8px; }
`;

const PurchaseImg = styled.div`
  width: 56px; height: 56px; border-radius: 10px; overflow: hidden; background: #F5F5F5; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
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

/* ── Component ── */

type StudioTab = 'widgets' | 'templates';

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRegistered, isGuest, user } = useAuth();
  const [tab, setTab] = useState<StudioTab>('widgets');
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [loading, setLoading] = useState(true);

  const { open: openUpgrade } = useUpgradeModal();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  // Editing state
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingWidgetKey, setEditingWidgetKey] = useState<string>('');
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editingWidgetName, setEditingWidgetName] = useState<string>('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
      Logger.error('StudioPage', 'Auto-save failed', err);
      setSaveStatus('error');
      savedStatusTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [isRegistered, editingWidgetId, editingWidgetKey]);

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
    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', background: '#fff' }}>
        {/* Editor top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px 0 48px', paddingRight: 310, height: 68, paddingTop: 15, background: '#fff', flexShrink: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={handleEditorBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px',
              border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, background: '#fff',
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: '#555', cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} /> Back
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#6366F1', letterSpacing: '-0.02em' }}>
              {editingWidgetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </span>
            {/* Save status — mirrors Figma/Notion auto-save indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 10px', borderRadius: 8,
              background: saveStatus === 'error' ? 'rgba(220,40,40,0.08)' : 'rgba(0,0,0,0.04)',
              color: saveStatus === 'error' ? '#DC2828' : saveStatus === 'saved' ? '#16A34A' : '#888',
              fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
              opacity: saveStatus === 'idle' ? 0 : 1,
              transition: 'opacity 0.2s ease, color 0.2s ease, background 0.2s ease',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Circular progress ring */}
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="12" cy="12" r="9" fill="none" stroke="#EBEBEB" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="9" fill="none"
                  stroke={widgets.length >= 3 ? '#DC2828' : '#6366F1'}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${Math.min((widgets.length / 3), 1) * 56.5} 56.5`}
                  style={{ transition: 'stroke-dasharray 0.3s' }}
                />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#999', whiteSpace: 'nowrap' as const }}>{widgets.length}/3</span>
            </div>
            <button onClick={() => openUpgrade()} style={{
              display: 'flex', alignItems: 'center', gap: 5, height: 34, padding: '0 16px',
              border: 'none', borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: '#fff', cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
            }}>
              Upgrade now
            </button>
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
            border: '1px solid rgba(0,0,0,0.06)',
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
              transition: 'transform 0.15s ease',
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
              border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16,
              padding: '10px 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <input readOnly value={embedUrl} style={{
                width: 240, height: 34, padding: '0 12px', border: 'none', borderRadius: 8,
                background: 'rgba(0,0,0,0.04)', fontSize: 11, fontFamily: 'monospace', color: '#777',
                outline: 'none',
              }} onClick={e => (e.target as HTMLInputElement).select()} />
              <button onClick={() => { navigator.clipboard.writeText(embedUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }} style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 18px',
                border: 'none', borderRadius: 10,
                background: copied ? '#22C55E' : 'linear-gradient(135deg, #3384F4, #5BA0F7)',
                color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer', boxShadow: copied ? '0 2px 8px rgba(34,197,94,0.3)' : '0 2px 8px rgba(51,132,244,0.3)',
                transition: 'all 0.15s',
              }}>
                {copied ? <><Check style={{ width: 14, height: 14 }} /> Copied!</> : <><Copy style={{ width: 14, height: 14 }} /> Copy</>}
              </button>
            </div>
          </div>

          {/* Customization panel */}
          <div style={{
            width: 300, flexShrink: 0, overflow: 'auto',
            background: '#fff',
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

      <Container>
        {/* Welcome */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, marginTop: 8 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
              Welcome 👋
            </h1>
            <p style={{ fontSize: 15, color: '#999', margin: 0 }}>Manage your widgets and templates</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: '#FAFAFA', borderRadius: 14, padding: '10px 16px',
            border: '1px solid rgba(0,0,0,0.06)', marginTop: 2,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="12" cy="12" r="9" fill="none" stroke="#EBEBEB" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="9" fill="none"
                  stroke={widgets.length >= 3 ? '#DC2828' : '#6366F1'}
                  strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${Math.min((widgets.length / 3), 1) * 56.5} 56.5`}
                  style={{ transition: 'stroke-dasharray 0.3s' }}
                />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#888', whiteSpace: 'nowrap' as const }}>{widgets.length} of 3 widgets</span>
            </div>
            <button onClick={() => openUpgrade()} style={{
              fontSize: 14, fontWeight: 600, color: '#fff',
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              padding: '10px 28px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap' as const, transition: 'all 0.15s',
              boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
            }}>
              Upgrade now
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <TabBar>
          <Tab $active={tab === 'widgets'} onClick={() => setTab('widgets')}>Widgets</Tab>
          <Tab $active={tab === 'templates'} onClick={() => setTab('templates')}>Templates</Tab>
        </TabBar>

        {/* ── Widgets Tab ── */}
        {tab === 'widgets' && (
          <>
            {/* Create new widget — gradient banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%)',
                border: '1.5px solid rgba(200,195,230,0.3)',
                borderRadius: 16,
                padding: '32px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 32,
              }}
            >
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em' }}>Create new widget</div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Browse styles, customize and embed in Notion</div>
              </div>
              <button onClick={() => navigate('/widgets')} style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px',
                border: 'none', borderRadius: 12,
                background: '#1F1F1F', color: '#fff', fontSize: 14, fontWeight: 600,
                fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'all 0.15s',
              }}><Plus style={{ width: 16, height: 16 }} /> Browse widgets</button>
            </div>

            {/* Your widgets */}
            <SectionRow style={{ marginTop: 18 }}>
              <SectionTitle>Your widgets <SectionCount>{widgets.length}</SectionCount></SectionTitle>
            </SectionRow>

            {!loading && widgets.length === 0 ? (
              <EmptyCard onClick={() => navigate('/widgets')}>
                <EmptyCircle><Plus /></EmptyCircle>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1F1F', margin: '0 0 4px' }}>No widgets yet</p>
                <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Create your first widget from the gallery above</p>
              </EmptyCard>
            ) : (
              <WidgetGrid>
                {widgets.map((w, i) => (
                  <WidgetCard key={w.id} $i={i}>
                    <WidgetPreviewWrap onClick={() => handleEdit(w)}>
                      <WidgetLabel>{w.type === 'calendar' ? 'Calendar' : w.type === 'clock' ? 'Clock' : 'Board'}</WidgetLabel>
                      <WidgetPreview type={w.type} style={w.style} savedSettings={w.settings} />
                    </WidgetPreviewWrap>
                    <WidgetBottom>
                      <WidgetName>{w.name}</WidgetName>
                      <WidgetActions>
                        <Btn $primary onClick={() => handleEdit(w)}><Pencil /> Edit</Btn>
                        <Btn $danger onClick={() => handleDelete(w.id)}><Trash2 /></Btn>
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
              border: '1.5px solid rgba(220,200,210,0.25)', borderRadius: 16, padding: '32px 32px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32,
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1F1F1F', letterSpacing: '-0.02em' }}>Browse template shop</div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 6 }}>Notion planners, trackers & productivity systems</div>
              </div>
              <button onClick={() => navigate('/templates')} style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px',
                border: 'none', borderRadius: 12,
                background: '#1F1F1F', color: '#fff', fontSize: 14, fontWeight: 600,
                fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}><ArrowRight style={{ width: 16, height: 16 }} /> Browse</button>
            </div>

            {/* Purchases — below */}
            <SectionRow>
              <SectionTitle>My Purchases <SectionCount>{PURCHASES.length}</SectionCount></SectionTitle>
            </SectionRow>

            {PURCHASES.length === 0 ? (
              <EmptyCard onClick={() => navigate('/templates')}>
                <EmptyCircle><Download /></EmptyCircle>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1F1F', margin: '0 0 4px' }}>No purchases yet</p>
                <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Browse the shop to find planners for Notion</p>
              </EmptyCard>
            ) : (
              <>
                {PURCHASES.map(p => (
                  <PurchaseCard key={p.id} onClick={() => navigate(`/templates/${p.slug}`)}>
                    <PurchaseImg><img src={p.image} alt={p.name} /></PurchaseImg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1F1F' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{p.order} · {p.date}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1F1F', marginRight: 8 }}>{p.price}</div>
                    <Btn onClick={(e) => { e.stopPropagation(); }}><Download /> Download</Btn>
                  </PurchaseCard>
                ))}
              </>
            )}
          </>
        )}
      </Container>

      {/* Upgrade modal is rendered globally via UpgradeModalProvider (see App.tsx). */}
    </Page>
  );
};
