import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

type Category = 'all' | 'planners' | 'dashboards' | 'trackers' | 'journals' | 'finance' | 'productivity' | 'health' | 'goals';

interface Template {
  id: string;
  title: string;
  category: Category[];
  sub?: string;
  price: string;
  badge?: string;
  gradient: string;
}

const TEMPLATES: Template[] = [
  { id: '1', title: 'Weekly Planner', category: ['planners'], price: 'Free', badge: 'Popular', gradient: 'linear-gradient(135deg, #E8EDFF 0%, #F0E6FF 100%)' },
  { id: '2', title: 'Monthly Dashboard', category: ['dashboards'], price: '$4.99', gradient: 'linear-gradient(135deg, #FFE8E0 0%, #FFD6E8 100%)' },
  { id: '3', title: 'Student Planner', category: ['planners'], price: '$3.99', gradient: 'linear-gradient(135deg, #E0F4E8 0%, #D6F0FF 100%)' },
  { id: '4', title: 'Finance Tracker', category: ['finance', 'trackers'], price: 'Free', gradient: 'linear-gradient(135deg, #E0F4E8 0%, #D1FAE5 100%)' },
  { id: '5', title: 'OKR Template', category: ['goals', 'productivity'], price: 'Free', badge: 'New', gradient: 'linear-gradient(135deg, #FFF8E0 0%, #FFEED6 100%)' },
  { id: '6', title: 'Life OS Template', category: ['dashboards', 'productivity'], price: '$7.99', badge: 'Best seller', gradient: 'linear-gradient(135deg, #E0E8FF 0%, #E0F0FF 100%)' },
  { id: '7', title: 'Budget Tracker', category: ['trackers', 'finance'], price: '$2.99', gradient: 'linear-gradient(135deg, #E8FFE0 0%, #E0FFE8 100%)' },
  { id: '8', title: 'Meal Planner', category: ['planners', 'health'], price: 'Free', gradient: 'linear-gradient(135deg, #F0E0FF 0%, #FFE0F0 100%)' },
  { id: '9', title: 'Habit Tracker', category: ['trackers'], price: 'Free', gradient: 'linear-gradient(135deg, #E0FFE8 0%, #E8EDFF 100%)' },
  { id: '10', title: 'Mood Journal', category: ['journals'], price: '$2.99', gradient: 'linear-gradient(135deg, #FFE0F0 0%, #E8EDFF 100%)' },
  { id: '11', title: 'Project Roadmap', category: ['productivity'], price: '$1.99', gradient: 'linear-gradient(135deg, #F5F5F4 0%, #E8E8E6 100%)' },
  { id: '12', title: 'Reading List', category: ['trackers', 'journals'], price: 'Free', gradient: 'linear-gradient(135deg, #E0E8FF 0%, #F0E6FF 100%)' },
];

const CATEGORIES: { key: Category; label: string; title: string; subtitle: string; subs: { key: string; label: string }[] }[] = [
  { key: 'all', label: 'All', title: 'Templates', subtitle: 'Notion templates, planners, trackers & more', subs: [] },
  { key: 'planners', label: 'Planners', title: 'Planners', subtitle: 'Weekly, monthly and custom planners', subs: [] },
  { key: 'dashboards', label: 'Dashboards', title: 'Dashboards', subtitle: 'All-in-one life and work dashboards', subs: [] },
  { key: 'trackers', label: 'Trackers', title: 'Trackers', subtitle: 'Track habits, budgets, reading and more', subs: [] },
  { key: 'journals', label: 'Journals', title: 'Journals', subtitle: 'Mood journals, gratitude logs and reflections', subs: [] },
  { key: 'finance', label: 'Finance', title: 'Finance', subtitle: 'Budget trackers and financial planning', subs: [] },
  { key: 'productivity', label: 'Productivity', title: 'Productivity', subtitle: 'OKRs, roadmaps and goal setting', subs: [] },
  { key: 'health', label: 'Health', title: 'Health & Wellness', subtitle: 'Meal planning, fitness and wellness', subs: [] },
  { key: 'goals', label: 'Goals', title: 'Goals', subtitle: 'Goal setting and progress tracking', subs: [] },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

/* ── Header ── */
const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 0;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) { padding: 32px 24px 0; }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #9A9A9A;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 16px;
  transition: color 0.15s ease;
  &:hover { color: #1F1F1F; }
  svg { width: 13px; height: 13px; }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 6px;
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  margin: 0 0 28px;
  letter-spacing: -0.01em;
`;

/* ── Filters ── */
const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  height: 32px;
  padding: 0 16px;
  border: none;
  background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.04)'};
  color: ${({ $active }) => $active ? '#ffffff' : '#6B6B6B'};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => $active ? '#1F1F1F' : 'rgba(0, 0, 0, 0.08)'};
    color: ${({ $active }) => $active ? '#ffffff' : '#1F1F1F'};
  }
`;

const SubRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const SubChip = styled.button<{ $active: boolean }>`
  height: 28px;
  padding: 0 14px;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.08)' : 'transparent'};
  color: ${({ $active }) => $active ? '#3384F4' : '#9A9A9A'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ $active }) => $active ? '#3384F4' : '#1F1F1F'};
    background: ${({ $active }) => $active ? 'rgba(51, 132, 244, 0.08)' : 'rgba(0, 0, 0, 0.02)'};
  }
`;

/* ── Grid ── */
const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 48px 80px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px 20px;

  @media (max-width: 768px) {
    padding: 24px 24px 60px;
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  cursor: pointer;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  &:hover .card-preview {
    transform: translateY(-3px);
  }
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
`;

const CardImage = styled.div<{ $gradient: string }>`
  aspect-ratio: 4 / 3;
  background: ${({ $gradient }) => $gradient};
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover ${CardInner} {
    transform: scale(1.04);
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #1F1F1F;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
`;

const CardMeta = styled.div`
  padding: 10px 2px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;
`;

const Price = styled.span<{ $free: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $free }) => $free ? '#22C55E' : '#9A9A9A'};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: #9A9A9A;
  font-size: 14px;
`;

/* ── Footer ── */
const Footer = styled.footer`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #ABABAB;
  letter-spacing: -0.01em;
`;

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const filtered = TEMPLATES.filter(t => {
    if (activeCategory !== 'all' && !t.category.includes(activeCategory)) return false;
    return true;
  });

  const activeCatConfig = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <Page>
      <TopNav activeLink="templates" logoSub="Templates" />

      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft /> Home
        </BackButton>
        <PageTitle>{activeCatConfig?.title || 'Templates'}</PageTitle>
        <PageSubtitle>{activeCatConfig?.subtitle || ''}</PageSubtitle>
        <FilterRow>
          {CATEGORIES.map(cat => (
            <FilterChip
              key={cat.key}
              $active={activeCategory === cat.key}
              onClick={() => { setActiveCategory(cat.key); setActiveSub(null); }}
            >
              {cat.label}
            </FilterChip>
          ))}
        </FilterRow>
        {activeCatConfig && activeCatConfig.subs.length > 0 && (
          <SubRow>
            <SubChip $active={activeSub === null} onClick={() => setActiveSub(null)}>All</SubChip>
            {activeCatConfig.subs.map(sub => (
              <SubChip
                key={sub.key}
                $active={activeSub === sub.key}
                onClick={() => setActiveSub(activeSub === sub.key ? null : sub.key)}
              >
                {sub.label}
              </SubChip>
            ))}
          </SubRow>
        )}
      </Header>

      <Grid>
        {filtered.length === 0 ? (
          <EmptyState>No templates in this category yet</EmptyState>
        ) : (
          filtered.map((template, i) => (
            <Card key={template.id} style={{ animationDelay: `${i * 0.04}s` }}>
              <CardImage className="card-preview" $gradient={template.gradient}>
                <CardInner />
                {template.badge && <CardBadge>{template.badge}</CardBadge>}
              </CardImage>
              <CardMeta>
                <CardTitle>{template.title}</CardTitle>
                <Price $free={template.price === 'Free'}>{template.price}</Price>
              </CardMeta>
            </Card>
          ))
        )}
      </Grid>

      <Footer>
        <FooterText>Peachy Studio</FooterText>
        <FooterText>Widgets &middot; Planners &middot; Templates</FooterText>
      </Footer>
    </Page>
  );
};
