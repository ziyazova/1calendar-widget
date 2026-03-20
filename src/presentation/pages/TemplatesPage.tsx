import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, BackButton, FilterRow, FilterChip, Footer } from '@/presentation/components/shared';
import { fadeUp } from '@/presentation/themes/animations';

type Category = 'all' | 'planners' | 'productivity' | 'health' | 'student';

interface Template {
  id: string;
  title: string;
  category: Category[];
  sub?: string;
  price: string;
  badge?: string;
  gradient: string;
  image: string;
}

const TEMPLATES: Template[] = [
  { id: '1', title: 'Weekly Planner', category: ['planners'], price: 'Free', badge: 'Popular', gradient: 'linear-gradient(135deg, #E8EDFF 0%, #F0E6FF 100%)', image: '/template-main.png' },
  { id: '2', title: 'Monthly Dashboard', category: ['productivity'], price: '$4.99', gradient: 'linear-gradient(135deg, #FFE8E0 0%, #FFD6E8 100%)', image: '/template-main.png' },
  { id: '3', title: 'Student Planner', category: ['student'], price: '$3.99', gradient: 'linear-gradient(135deg, #E0F4E8 0%, #D6F0FF 100%)', image: '/template-main.png' },
  { id: '4', title: 'Finance Tracker', category: ['productivity'], price: 'Free', gradient: 'linear-gradient(135deg, #E0F4E8 0%, #D1FAE5 100%)', image: '/template-main.png' },
  { id: '5', title: 'OKR Template', category: ['productivity'], price: 'Free', badge: 'New', gradient: 'linear-gradient(135deg, #FFF8E0 0%, #FFEED6 100%)', image: '/template-main.png' },
  { id: '6', title: 'Life OS Template', category: ['planners', 'productivity'], price: '$7.99', badge: 'Best seller', gradient: 'linear-gradient(135deg, #E0E8FF 0%, #E0F0FF 100%)', image: '/template-main.png' },
  { id: '7', title: 'Budget Tracker', category: ['productivity'], price: '$2.99', gradient: 'linear-gradient(135deg, #E8FFE0 0%, #E0FFE8 100%)', image: '/template-main.png' },
  { id: '8', title: 'Meal Planner', category: ['planners', 'health'], price: 'Free', gradient: 'linear-gradient(135deg, #F0E0FF 0%, #FFE0F0 100%)', image: '/template-main.png' },
  { id: '9', title: 'Habit Tracker', category: ['health'], price: 'Free', gradient: 'linear-gradient(135deg, #E0FFE8 0%, #E8EDFF 100%)', image: '/template-main.png' },
  { id: '10', title: 'Mood Journal', category: ['health'], price: '$2.99', gradient: 'linear-gradient(135deg, #FFE0F0 0%, #E8EDFF 100%)', image: '/template-main.png' },
  { id: '11', title: 'Project Roadmap', category: ['productivity'], price: '$1.99', gradient: 'linear-gradient(135deg, #F5F5F4 0%, #E8E8E6 100%)', image: '/template-main.png' },
  { id: '12', title: 'Reading List', category: ['student'], price: 'Free', gradient: 'linear-gradient(135deg, #E0E8FF 0%, #F0E6FF 100%)', image: '/template-main.png' },
];

const CATEGORIES: { key: Category; label: string; title: string; subtitle: string; subs: { key: string; label: string }[] }[] = [
  { key: 'all', label: 'All', title: 'Templates', subtitle: 'Notion templates, planners, trackers & more', subs: [] },
  { key: 'planners', label: 'Life Planners', title: 'Life Planners', subtitle: 'Weekly, monthly and custom planners', subs: [] },
  { key: 'productivity', label: 'Productivity Systems', title: 'Productivity Systems', subtitle: 'OKRs, roadmaps and goal setting', subs: [] },
  { key: 'health', label: 'Health & Wellness', title: 'Health & Wellness', subtitle: 'Meal planning, fitness and wellness', subs: [] },
  { key: 'student', label: 'Student Planner', title: 'Student Planner', subtitle: 'Academic planners and study tools', subs: [] },
];


/* ── Header ── */
const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 0;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 768px) { padding: 32px 24px 0; }
`;


const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1F1F1F;
  letter-spacing: -0.03em;
  margin: 0 0 6px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: #9A9A9A;
  margin: 0 0 28px;
  letter-spacing: -0.01em;
`;

/* ── Search ── */
const SearchWrap = styled.div`
  position: relative;
  margin-bottom: 16px;
  max-width: 360px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #ABABAB;
  display: flex;
  svg { width: 15px; height: 15px; }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px 0 40px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1F1F1F;
  background: #FAFAFA;
  outline: none;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  &::placeholder { color: #ABABAB; }
  &:focus {
    border-color: rgba(0, 0, 0, 0.16);
    background: #ffffff;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 36px 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px 20px;
  }

  @media (max-width: 768px) {
    padding: 24px 24px 60px;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Card = styled.div`
  cursor: pointer;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const CardInner = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transform: scale(1.19);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const CardImage = styled.div<{ $gradient: string }>`
  width: 100%;
  aspect-ratio: 288 / 228;
  position: relative;
  border-radius: 24px;
  overflow: clip;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);

  &:hover ${CardInner} {
    transform: scale(1.24);
  }

  @media (max-width: 768px) {
    border-radius: 16px;
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
  padding: 10px 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 8px 4px 0;
  }
`;

const CardTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F1F1F;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Price = styled.span<{ $free: boolean }>`
  font-size: 13px;
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


export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (catParam) {
      const match = CATEGORIES.find(c => c.key === catParam || c.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === catParam);
      if (match) setActiveCategory(match.key);
    }
  }, [catParam]);

  const filtered = TEMPLATES.filter(t => {
    if (activeCategory !== 'all' && !t.category.includes(activeCategory)) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCatConfig = CATEGORIES.find(c => c.key === activeCategory);

  return (
    <PageWrapper>
      <TopNav activeLink="templates" logoSub="Templates" />

      <Header>
        <BackButton onClick={() => navigate('/')} />
        <PageTitle>{activeCatConfig?.title || 'Templates'}</PageTitle>
        <PageSubtitle>{activeCatConfig?.subtitle || ''}</PageSubtitle>
        {/* TODO: unhide search when ready
        <SearchWrap>
          <SearchIcon><Search /></SearchIcon>
          <SearchInput
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrap>
        */}
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
                <CardInner src={template.image} alt={template.title} />
              </CardImage>
              <CardMeta>
                <CardTitle>{template.title}</CardTitle>
                <Price $free={template.price === 'Free'}>{template.price}</Price>
              </CardMeta>
            </Card>
          ))
        )}
      </Grid>

      <Footer left="Peachy Studio" right="Widgets · Planners · Templates" />
    </PageWrapper>
  );
};
