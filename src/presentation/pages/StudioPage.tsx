import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Copy, Check, Pencil, Trash2, Plus, Download, ExternalLink, LogOut, Settings, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';
import { TopNav } from '../components/layout/TopNav';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel } from '../components/ui/forms/CustomizationPanel';
import { useAuth } from '../context/AuthContext';
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
  max-width: 980px;
  margin: 0 auto;
  padding: 32px 48px 64px;

  @media (max-width: 768px) { padding: 24px 16px 32px; }
`;

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* Tab bar */
const TabBar = styled.div`
  display: flex;
  background: #F5F5F5;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => $active ? '#fff' : 'transparent'};
  color: ${({ $active }) => $active ? '#1F1F1F' : '#999'};
  box-shadow: ${({ $active }) => $active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'};

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
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

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
  aspect-ratio: 3 / 2;
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
  font-weight: 500;
  color: #555;
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
  gap: 8px;
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #1F1F1F, #333);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,0,0,0.18); }
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
  transform: scale(0.32);
  transform-origin: center center;
  pointer-events: none;
`;

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

const PURCHASES = [
  { id: 'p1', name: 'Weekly Planner', price: 'Free', date: 'Mar 22, 2026', order: '#PY-1042', image: '/template-main.png', slug: 'weekly-planner' },
  { id: 'p2', name: 'Life OS Template', price: '$7.99', date: 'Mar 20, 2026', order: '#PY-1038', image: '/template-main.png', slug: 'life-os' },
  { id: 'p3', name: 'Student Planner', price: '$3.99', date: 'Mar 15, 2026', order: '#PY-1025', image: '/template-main.png', slug: 'student-planner' },
];

const WidgetPreview: React.FC<{ type: string; style: string }> = ({ type, style }) => {
  if (type === 'calendar') {
    const s = new CalendarSettings({ style: style as CalendarSettings['style'] });
    switch (style) {
      case 'classic': return <PreviewScale><ClassicCalendar settings={s} /></PreviewScale>;
      case 'collage': return <PreviewScale><CollageCalendar settings={s} /></PreviewScale>;
      case 'typewriter': return <PreviewScale><TypewriterCalendar settings={s} /></PreviewScale>;
      default: return <PreviewScale><ModernGridZoomFixed settings={s} /></PreviewScale>;
    }
  }
  if (type === 'clock') {
    const s = new ClockSettings({ style: style as ClockSettings['style'] });
    const tc = getContrastColor(s.backgroundColor);
    switch (style) {
      case 'flower': return <PreviewScale><FlowerClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
      case 'dreamy': return <PreviewScale><DreamyClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
      default: return <PreviewScale><ClassicClock settings={s} time={PREVIEW_TIME} textColor={tc} /></PreviewScale>;
    }
  }
  if (type === 'board') {
    const s = new BoardSettings({ layout: style as BoardSettings['layout'] });
    return <PreviewScale><InspirationBoard settings={s} /></PreviewScale>;
  }
  return null;
};

/* ── Component ── */

type StudioTab = 'widgets' | 'templates';

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const navigate = useNavigate();
  const { isRegistered, user } = useAuth();
  const [tab, setTab] = useState<StudioTab>('widgets');
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingWidgetKey, setEditingWidgetKey] = useState<string>('');
  const [editorOpen, setEditorOpen] = useState(false);

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

  const handleEdit = async (w: SavedWidget) => {
    try {
      const widget = await diContainer.createWidgetUseCase.execute(w.type);
      let updated;
      if (w.type === 'calendar') {
        updated = widget.updateSettings(new CalendarSettings({ style: w.style as CalendarSettings['style'] }));
      } else if (w.type === 'clock') {
        updated = widget.updateSettings(new ClockSettings({ style: w.style as ClockSettings['style'] }));
      } else {
        updated = widget.updateSettings(new BoardSettings({ layout: w.style as BoardSettings['layout'] }));
      }
      setEditingWidget(updated);
      setEditingWidgetKey(`${w.type}-${w.style}`);
      setEditorOpen(true);
    } catch (err) {
      Logger.error('StudioPage', 'Failed to load widget for editing', err);
    }
  };

  // If editing, show editor (full screen with artboard)
  if (editorOpen && editingWidget) {
    const embedUrl = diContainer.getWidgetEmbedUrlUseCase.execute(editingWidget);
    return (
      <Page>
        <TopNav activeLink="studio" />
        <Container style={{ maxWidth: 1200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Btn onClick={() => setEditorOpen(false)}>Back</Btn>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Edit Widget</h2>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, background: '#FAFAF9', borderRadius: 16, border: '1px solid rgba(0,0,0,0.06)', padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <WidgetDisplay widget={editingWidget} />
            </div>
            <div style={{ width: 300, flexShrink: 0 }}>
              <CustomizationPanel
                widget={editingWidget}
                onSettingsChange={(settings) => {
                  if (!editingWidget) return;
                  const updated = editingWidget.updateSettings(settings as CalendarSettings | ClockSettings | BoardSettings);
                  setEditingWidget(updated);
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input readOnly value={embedUrl} style={{ flex: 1, height: 36, padding: '0 12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: '#666', background: '#FAFAFA' }} />
            <Btn $primary onClick={() => { navigator.clipboard.writeText(embedUrl); }}><Copy /> Copy</Btn>
          </div>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <TopNav activeLink="studio" />

      <Container>
        {/* Tab bar */}
        <TabBar>
          <Tab $active={tab === 'widgets'} onClick={() => setTab('widgets')}>Widgets</Tab>
          <Tab $active={tab === 'templates'} onClick={() => setTab('templates')}>Templates</Tab>
        </TabBar>

        {/* ── Widgets Tab ── */}
        {tab === 'widgets' && (
          <>
            <SectionRow>
              <SectionTitle>Your widgets <SectionCount>{widgets.length}</SectionCount></SectionTitle>
              <Btn $primary onClick={() => navigate('/widgets')}>
                <Plus /> Browse widgets
              </Btn>
            </SectionRow>

            {!loading && widgets.length === 0 ? (
              <EmptyCard onClick={() => navigate('/widgets')}>
                <EmptyCircle><Plus /></EmptyCircle>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1F1F', margin: '0 0 4px' }}>Create your first widget</p>
                <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Browse widget styles and customize for your Notion</p>
              </EmptyCard>
            ) : (
              <WidgetGrid>
                {widgets.map((w, i) => (
                  <WidgetCard key={w.id} $i={i}>
                    <WidgetPreviewWrap onClick={() => handleEdit(w)}>
                      <WidgetLabel>{w.type === 'calendar' ? 'Calendar' : w.type === 'clock' ? 'Clock' : 'Board'}</WidgetLabel>
                      <WidgetPreview type={w.type} style={w.style} />
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
            <SectionRow>
              <SectionTitle>My Templates <SectionCount>{PURCHASES.length}</SectionCount></SectionTitle>
            </SectionRow>

            {PURCHASES.length === 0 ? (
              <EmptyCard onClick={() => navigate('/templates')}>
                <EmptyCircle><Download /></EmptyCircle>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1F1F1F', margin: '0 0 4px' }}>No templates yet</p>
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

            <BrowseBtn onClick={() => navigate('/templates')}>
              Browse template shop <ArrowRight />
            </BrowseBtn>
          </>
        )}
      </Container>
    </Page>
  );
};
