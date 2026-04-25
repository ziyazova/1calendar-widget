import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { PageWrapper, BackButton, FilterRow, FilterChip, TemplateMockupCard, TemplateMockupImage } from '@/presentation/components/shared';
import { BigFooter } from '@/presentation/components/landing/BigFooter';
import { fadeUp } from '@/presentation/themes/animations';
import { TEMPLATES, CATEGORIES, type Category } from '@/presentation/data/templates';


/* ── Header ── */
const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  /* 24px bottom padding owns the chips → cards gap so it stays consistent
     whether or not the conditional <SubRow> renders below the chips. */
  padding: 48px 48px 24px;
  animation: ${fadeUp} 0.25s ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 24px 24px 16px; }
`;


const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  margin: 0 0 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  /* 40px gap between subtitle and the FilterRow chips below. */
  margin: 0 0 40px;
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
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surface};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.medium};
  letter-spacing: -0.01em;

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.border.medium};
    background: ${({ theme }) => theme.colors.background.elevated};
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
  background: ${({ $active, theme }) => $active ? theme.colors.state.activeWash : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.state.active : theme.colors.text.tertiary};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.weights.medium : theme.typography.weights.normal};
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ $active, theme }) => $active ? theme.colors.state.active : theme.colors.text.primary};
    background: ${({ $active, theme }) => $active ? theme.colors.state.activeWash : 'rgba(0, 0, 0, 0.02)'};
  }
`;

/* ── Grid ── */
const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  /* Top padding is 0 — the Header's bottom padding owns the chips → cards
     gap so it stays consistent regardless of the optional <SubRow>. */
  padding: 0 48px 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px 60px;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const TemplateCardWrap = styled.div`
  cursor: pointer;
  animation: ${fadeUp} 0.25s ease both;
`;


const CardMeta = styled.div`
  padding: 10px 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px 4px 0;
  }
`;

const CardTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes.md};
  }
`;

const Price = styled.span<{ $free: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ $free, theme }) => $free ? theme.colors.success.base : theme.colors.text.tertiary};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
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
        <BackButton onClick={() => navigate(-1 as any)} label="Back" />
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
            <TemplateCardWrap key={template.id} style={{ animationDelay: `${i * 0.04}s` }} onClick={() => navigate(`/templates/${template.id}`)}>
              <TemplateMockupCard $size="grid" $interactive>
                <TemplateMockupImage $size="grid" src={template.image} alt={template.title} />
              </TemplateMockupCard>
              <CardMeta>
                <CardTitle>{template.title}</CardTitle>
                <Price $free={template.price === 'Free'}>{template.price}</Price>
              </CardMeta>
            </TemplateCardWrap>
          ))
        )}
      </Grid>

      <BigFooter onNavigate={(path) => navigate(path)} />
    </PageWrapper>
  );
};
