import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, Layout, Download, ExternalLink, Pencil, Trash2, LogOut } from 'lucide-react';
import type { DashboardView } from '../ui/sidebar/Sidebar';
import { useAuth } from '@/presentation/context/AuthContext';
import { WidgetStorageService, type SavedWidget } from '@/infrastructure/services/WidgetStorageService';

/* ── Shared ── */

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 32px;

  @media (max-width: 768px) {
    padding: 24px 16px;
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing['4']};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: ${({ theme }) => theme.spacing['5']};
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  height: 32px;
  padding: 0 14px;
  background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.04)'};
  color: ${({ $active }) => $active ? '#fff' : '#6B6B6B'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.button};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

const ChipCount = styled.span`
  font-size: 10px;
  opacity: 0.6;
`;

/* ── Widget Card ── */

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: inherit;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  &:hover ${CardOverlay} { opacity: 1; }
`;

const CardPreview = styled.div`
  height: 140px;
  background: ${({ theme }) => theme.colors.background.surface};
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    display: block;
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardInfo = styled.div`
  padding: ${({ theme }) => theme.spacing['3']} ${({ theme }) => theme.spacing['4']};
`;

const CardName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CardMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

const OverlayBtn = styled.button<{ $danger?: boolean }>`
  height: 34px;
  padding: 0 14px;
  background: ${({ $danger }) => $danger ? 'rgba(220, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger }) => $danger ? '#fff' : '#1F1F1F'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  svg { width: 13px; height: 13px; }

  &:hover { transform: scale(1.04); }
`;

const AddCard = styled.div`
  background: ${({ theme }) => theme.colors.background.surface};
  border: 2px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 172px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transition: all 0.15s ease;

  svg { width: 22px; height: 22px; }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const AddLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
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

/* ── Data ── */

type WidgetFilter = 'all' | 'calendar' | 'clock' | 'board';
const FILTERS: { key: WidgetFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'calendar', label: 'Calendars' },
  { key: 'clock', label: 'Clocks' },
  { key: 'board', label: 'Boards' },
];

const WIDGET_IMAGES: Record<string, string> = {
  calendar: '/widget-calendar.png',
  clock: '/widget-clock.png',
  board: '/template-main.png',
};

const PURCHASES = [
  { id: 'p1', name: 'Weekly Planner', price: 'Free', date: 'Mar 22, 2026', order: '#PY-1042', image: '/template-main.png' },
  { id: 'p2', name: 'Life OS Template', price: '$7.99', date: 'Mar 20, 2026', order: '#PY-1038', image: '/template-main.png' },
  { id: 'p3', name: 'Student Planner', price: '$3.99', date: 'Mar 15, 2026', order: '#PY-1025', image: '/template-main.png' },
];

const iconForType = (type: string) => {
  if (type === 'Calendar') return <Calendar />;
  if (type === 'Clock') return <Clock />;
  return <Layout />;
};

/* ── Views ── */

const MyWidgetsView: React.FC = () => {
  const navigate = useNavigate();
  const { isRegistered } = useAuth();
  const [filter, setFilter] = useState<WidgetFilter>('all');
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

  const filtered = filter === 'all' ? widgets : widgets.filter(w => w.type === filter);
  const counts = FILTERS.map(f => ({
    ...f,
    count: f.key === 'all' ? widgets.length : widgets.filter(w => w.type === f.key).length,
  }));

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Container>
      <Title>My Widgets</Title>
      <Subtitle>{loading ? 'Loading...' : `${filtered.length} widgets`}</Subtitle>
      <FilterRow>
        {counts.map(f => (
          <FilterChip key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label} <ChipCount>{f.count}</ChipCount>
          </FilterChip>
        ))}
      </FilterRow>
      <Grid>
        <AddCard onClick={() => navigate('/widgets')}>
          <Plus />
          <AddLabel>New Widget</AddLabel>
        </AddCard>
        {filtered.map(w => (
          <Card key={w.id}>
            <CardPreview>
              <img src={WIDGET_IMAGES[w.type] || '/template-main.png'} alt={w.name} />
              <CardBadge>{w.style}</CardBadge>
              <CardOverlay>
                <OverlayBtn onClick={() => navigate('/studio')}><Pencil /> Edit</OverlayBtn>
                <OverlayBtn $danger onClick={() => handleDelete(w.id)}><Trash2 /></OverlayBtn>
              </CardOverlay>
            </CardPreview>
            <CardInfo>
              <CardName>{w.name}</CardName>
              <CardMeta>{w.type} · {formatDate(w.created_at)}</CardMeta>
            </CardInfo>
          </Card>
        ))}
      </Grid>
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
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ view }) => {
  switch (view) {
    case 'my-widgets': return <MyWidgetsView />;
    case 'templates': return <TemplatesView />;
    case 'purchases': return <PurchasesView />;
    case 'profile': return <ProfileView />;
    default: return null;
  }
};
