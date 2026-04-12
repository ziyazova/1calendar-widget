import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, BackButton, FilterRow, FilterChip } from '@/presentation/components/shared';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { fadeUp } from '@/presentation/themes/animations';
import { TEMPLATES, CATEGORIES, type Category } from '@/presentation/data/templates';


/* ── Header ── */
const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 48px 0;
  animation: ${fadeUp} 0.25s ease both;

  @media (max-width: 768px) { padding: 24px 24px 0; }
`;


const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 6px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.tertiary};
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
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  svg { width: 15px; height: 15px; }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px 0 40px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surface};
  outline: none;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
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
  color: ${({ $active, theme }) => $active ? '#3384F4' : theme.colors.text.tertiary};
  border-radius: ${({ theme }) => theme.radii.sm};
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
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 20px;
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
  animation: ${fadeUp} 0.25s ease both;
`;

const CardInner = styled.img`
  position: absolute;
  inset: 0;
  width: 80%;
  height: 80%;
  margin: auto;
  object-fit: contain;
  object-position: center center;
  transform: scale(1);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
`;

const CardImage = styled.div<{ $gradient: string }>`
  width: 100%;
  aspect-ratio: 288 / 228;
  position: relative;
  border-radius: ${({ theme }) => theme.radii['2xl']};
  overflow: clip;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  background: linear-gradient(180deg, #FAFAFC 0%, #F6F6FA 50%, #F0F0F8 100%);

  &:hover ${CardInner} {
    transform: scale(1.06);
  }

  @media (max-width: 768px) {
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.text.primary};
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
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Price = styled.span<{ $free: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $free, theme }) => $free ? '#22C55E' : theme.colors.text.tertiary};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
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
            <Card key={template.id} style={{ animationDelay: `${i * 0.04}s` }} onClick={() => navigate(`/templates/${template.id}`)}>
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

      <BigFooter onNavigate={(path) => navigate(path)} />
    </PageWrapper>
  );
};
