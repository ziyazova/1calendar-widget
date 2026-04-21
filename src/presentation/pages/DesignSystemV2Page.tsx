import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, FilterChip, FilterRow } from '../components/shared';
import {
  Plus, Trash2, Download, Check, ArrowRight, ArrowLeft,
  Settings, Sparkles, X, Copy, Pencil,
} from 'lucide-react';
import {
  buttonVariantTokens,
  buttonSizeTokens,
  ButtonVariant,
  ButtonSize,
} from '../themes/buttonTokens';
import { filterChipSizeTokens } from '../themes/filterChipTokens';

/**
 * DesignSystemV2Page — live showcase rendered straight from tokens.
 *
 * Reads `buttonTokens.ts` + `filterChipTokens.ts` directly. Changing a token
 * updates both this page AND every real use-site in the app — so this page is
 * a trustworthy preview of what users will see.
 *
 * Route: `/dev/v2` (dev-only). See App.tsx.
 */

const ALL_VARIANTS: ButtonVariant[] = Object.keys(buttonVariantTokens) as ButtonVariant[];
const ALL_SIZES: ButtonSize[] = Object.keys(buttonSizeTokens) as ButtonSize[];

export const DesignSystemV2Page: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [filterSm, setFilterSm] = useState<string>('all');

  return (
    <Page>
      <Hero>
        <Pill>DS v2 · Token-driven · Live preview</Pill>
        <H1>Design system</H1>
        <Lead>
          Every button and chip here is rendered from
          <code> src/presentation/themes/buttonTokens.ts</code> and
          <code> filterChipTokens.ts</code>. Change a value there → this
          page + entire app update together.
        </Lead>
      </Hero>

      {/* ─────── Buttons ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Buttons</SectionTitle>
          <SectionMeta>
            {ALL_VARIANTS.length} variants × {ALL_SIZES.length} sizes — from{' '}
            <code>buttonTokens.ts</code>
          </SectionMeta>
        </SectionHeader>

        <Matrix>
          <MatrixHead>
            <MatrixCell />
            {ALL_SIZES.map((s) => (
              <MatrixCell key={s}>
                <SizeLabel>{s}</SizeLabel>
                <SizeMeta>
                  {buttonSizeTokens[s].height} · {buttonSizeTokens[s].radius}r
                </SizeMeta>
              </MatrixCell>
            ))}
          </MatrixHead>

          {ALL_VARIANTS.map((v) => (
            <MatrixRow key={v}>
              <VariantCell>
                <VariantName>{v}</VariantName>
                <VariantMeta>{variantBlurb(v)}</VariantMeta>
              </VariantCell>
              {ALL_SIZES.map((s) => (
                <MatrixCell key={s}>
                  <Button $variant={v} $size={s}>
                    {v === 'link' ? 'link' : 'Button'}
                  </Button>
                </MatrixCell>
              ))}
            </MatrixRow>
          ))}
        </Matrix>

        <SubSection>
          <SubTitle>With icons</SubTitle>
          <Row>
            <Button $variant="primary" $size="md"><Plus /> Create</Button>
            <Button $variant="accent" $size="md"><Sparkles /> Upgrade</Button>
            <Button $variant="secondary" $size="md"><Settings /> Settings</Button>
            <Button $variant="blue" $size="md"><Download /> Export</Button>
            <Button $variant="success" $size="md"><Check /> Saved</Button>
            <Button $variant="danger" $size="md"><Trash2 /> Remove</Button>
            <Button $variant="dangerStrong" $size="md"><Trash2 /> Delete forever</Button>
            <Button $variant="outline" $size="md">Continue <ArrowRight /></Button>
          </Row>
        </SubSection>

        <SubSection>
          <SubTitle>Modifiers</SubTitle>
          <Row>
            <Button $variant="primary" $size="md" $fullWidth>fullWidth</Button>
          </Row>
          <Spacer />
          <Row>
            <Button $variant="accent" $size="md" $pill>pill</Button>
            <Button $variant="secondary" $size="md" $pill>pill secondary</Button>
          </Row>
          <Spacer />
          <Row>
            <Button $variant="primary" $size="sm" $iconOnly aria-label="Edit"><Settings /></Button>
            <Button $variant="secondary" $size="md" $iconOnly aria-label="Edit"><Settings /></Button>
            <Button $variant="danger" $size="lg" $iconOnly aria-label="Delete"><Trash2 /></Button>
          </Row>
          <Spacer />
          <Row>
            <Button $variant="primary" $size="md" disabled>disabled</Button>
            <Button $variant="accent" $size="md" disabled>disabled</Button>
            <Button $variant="outline" $size="md" disabled>disabled</Button>
          </Row>
        </SubSection>
      </Section>

      {/* ─────── Patterns ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Patterns</SectionTitle>
          <SectionMeta>
            Real-world usage — how variants come together in the product.
          </SectionMeta>
        </SectionHeader>

        {/* Upgrade */}
        <SubSection>
          <SubTitle>Upgrade — outlined with sparkle</SubTitle>
          <PatternMeta>
            Lighter-weight alternative to filled <code>accent</code>. For inline
            spots, toolbars, and cards. Pair with <code>&lt;Sparkles /&gt;</code>.
          </PatternMeta>
          <Row>
            <Button $variant="upgrade" $size="sm"><Sparkles /> Upgrade</Button>
            <Button $variant="upgrade" $size="md"><Sparkles /> Upgrade to Pro</Button>
            <Button $variant="upgrade" $size="lg"><Sparkles /> Upgrade to Pro — $9/mo</Button>
          </Row>
        </SubSection>

        {/* Back */}
        <SubSection>
          <SubTitle>Back — navigation</SubTitle>
          <PatternMeta>
            Top-of-page back links. Default = <code>outline</code> with label.
            Dense toolbars use icon-only.
          </PatternMeta>
          <Row>
            <Button $variant="outline" $size="sm"><ArrowLeft /> Templates</Button>
            <Button $variant="outline" $size="sm" $iconOnly aria-label="Back"><ArrowLeft /></Button>
          </Row>
        </SubSection>

        {/* Close */}
        <SubSection>
          <SubTitle>Close (×) — modals & drawers</SubTitle>
          <PatternMeta>
            Icon-only <code>ghost</code> dismiss. Sits top-right of any overlay surface.
          </PatternMeta>
          <Row>
            <Button $variant="ghost" $size="sm" $iconOnly aria-label="Close"><X /></Button>
            <Button $variant="ghost" $size="md" $iconOnly aria-label="Close"><X /></Button>
            <Button $variant="outline" $size="sm" $iconOnly aria-label="Close"><X /></Button>
          </Row>
        </SubSection>

        {/* Ghost nav */}
        <SubSection>
          <SubTitle>Ghost — nav items</SubTitle>
          <PatternMeta>
            Sidebar / top-nav links. No bg at rest, subtle hover tint.
          </PatternMeta>
          <Row>
            <Button $variant="ghost" $size="md">Dashboard</Button>
            <Button $variant="ghost" $size="md">Templates</Button>
            <Button $variant="ghost" $size="md">My Widgets</Button>
          </Row>
        </SubSection>

        {/* Link */}
        <SubSection>
          <SubTitle>Link — refined underline</SubTitle>
          <PatternMeta>
            Inline text-style buttons. Underline appears on hover with 3px
            offset / 1.5px thickness.
          </PatternMeta>
          <Row>
            <Button $variant="link">Forgot password?</Button>
            <Button $variant="link">Learn more</Button>
            <Button $variant="link">Resend email</Button>
          </Row>
        </SubSection>

        {/* Card actions */}
        <SubSection>
          <SubTitle>Card actions — Customize &amp; Copy</SubTitle>
          <PatternMeta>
            Dense action row on cards (e.g. widget / template thumbs).
            Customize = <code>primary sm</code>. Copy = <code>ghost sm iconOnly</code> (with ✓ feedback on click).
          </PatternMeta>
          <Row>
            <Button $variant="primary" $size="sm"><Pencil /> Customize</Button>
            <CopyButtonDemo />
            <Button $variant="danger" $size="sm" $iconOnly aria-label="Delete"><Trash2 /></Button>
          </Row>
        </SubSection>

        {/* Real-world CTAs */}
        <SubSection>
          <SubTitle>Real-world CTAs</SubTitle>
          <PatternMeta>
            Straight-from-app examples — check that your edits read well in context.
          </PatternMeta>
          <Row>
            <Button $variant="primary" $size="lg">Sign in</Button>
            <Button $variant="upgrade" $size="lg"><Sparkles /> Upgrade to Pro — $9/mo</Button>
            <Button $variant="secondary" $size="lg"><GoogleIcon /> Continue with Google</Button>
          </Row>
        </SubSection>
      </Section>

      {/* ─────── Filter chips ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Filter chips</SectionTitle>
          <SectionMeta>
            Tab-like selectable pills — from <code>filterChipTokens.ts</code>
          </SectionMeta>
        </SectionHeader>

        <SubSection>
          <SubTitle>
            Size <code>md</code> ({filterChipSizeTokens.md.height})
          </SubTitle>
          <FilterRow>
            {['all', 'planners', 'student', 'wellness', 'finance', 'focus'].map((c) => (
              <FilterChip
                key={c}
                $active={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>
        </SubSection>

        <SubSection>
          <SubTitle>
            Size <code>sm</code> ({filterChipSizeTokens.sm.height})
          </SubTitle>
          <FilterRow>
            {['all', 'calendar', 'clocks', 'boards', 'buttons'].map((c) => (
              <FilterChip
                key={c}
                $active={filterSm === c}
                $size="sm"
                onClick={() => setFilterSm(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>
        </SubSection>
      </Section>

      {/* ─────── How to edit ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>How to change anything</SectionTitle>
        </SectionHeader>

        <Tip>
          <TipKey>Change a button color / gradient / shadow</TipKey>
          <TipVal>
            <code>src/presentation/themes/buttonTokens.ts</code> → find the variant (e.g.
            <code> accent</code>) → edit <code>base.bg</code>, <code>hover.bg</code>,
            <code> active.bg</code>. Save. App updates instantly.
          </TipVal>
        </Tip>
        <Tip>
          <TipKey>Resize all buttons of a size</TipKey>
          <TipVal>
            <code>buttonSizeTokens.md.height</code> — bump the px value. All{' '}
            <code>$size="md"</code> buttons site-wide follow.
          </TipVal>
        </Tip>
        <Tip>
          <TipKey>Add a new variant</TipKey>
          <TipVal>
            1. Add its name to <code>ButtonVariant</code> type.
            2. Add an entry in <code>buttonVariantTokens</code>.
            3. (optional) Add to <code>emphasisVariants</code> if it's a filled CTA.
            No CSS to write in Button.tsx.
          </TipVal>
        </Tip>
        <Tip>
          <TipKey>Recolor active filter chips</TipKey>
          <TipVal>
            <code>filterChipTokens.active.bg</code> + <code>.fg</code>. Hover:
            <code> activeHover</code>.
          </TipVal>
        </Tip>
      </Section>
    </Page>
  );
};

/* ── variant blurbs ── */
function variantBlurb(v: ButtonVariant): string {
  const blurbs: Record<ButtonVariant, string> = {
    primary: 'Default dark CTA · carved depth',
    accent: 'Indigo gradient · Pro/Upgrade',
    upgrade: 'Outlined indigo · inline upgrade',
    blue: 'Sky blue solid · copy/share',
    secondary: 'Notion paper · neutral CTA',
    outline: 'Transparent + border',
    ghost: 'Minimal · nav / inline actions',
    danger: 'Muted wine · reversible destructive',
    dangerStrong: 'Saturated red · irreversible',
    success: 'Emerald · confirm / saved',
    link: 'Underline on hover',
  };
  return blurbs[v] || '';
}

/* ── Copy button with ✓ feedback ── */
const CopyButtonDemo: React.FC = () => {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      $variant="ghost"
      $size="sm"
      $iconOnly
      aria-label={copied ? 'Copied' : 'Copy embed URL'}
      onClick={() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
};

/* ── Google G logo (for "Continue with Google") ── */
const GoogleIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

/* ─────── Layout ─────── */

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  padding: 48px 48px 120px;

  @media (max-width: 900px) {
    padding: 32px 24px 80px;
  }
`;

const Hero = styled.header`
  max-width: 1100px;
  margin: 0 auto 64px;
`;

const Pill = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.text.body};
  margin-bottom: 16px;

  code {
    font-family: inherit;
    background: transparent;
    padding: 0;
  }
`;

const H1 = styled.h1`
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.05;

  @media (max-width: 900px) {
    font-size: 36px;
  }
`;

const Lead = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.body};
  max-width: 720px;
  margin: 0;

  code {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 6px;
    border-radius: 6px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto 72px;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
`;

const SectionMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.tertiary};

  code {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 5px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SubSection = styled.div`
  margin-top: 32px;
`;

const SubTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 12px;

  code {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 12px;
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    padding: 1px 5px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text.primary};
    text-transform: none;
    letter-spacing: 0;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const PatternMeta = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: -4px 0 14px;
  max-width: 640px;

  code {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 12px;
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 5px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Spacer = styled.div`
  height: 16px;
`;

/* ── Variant × size matrix ── */

const Matrix = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 16px;
  overflow-x: auto;
`;

const MatrixHead = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(5, minmax(140px, 1fr));
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const MatrixRow = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(5, minmax(140px, 1fr));
  gap: 16px;
  align-items: center;
`;

const MatrixCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 60px;
`;

const VariantCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const VariantName = styled.div`
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const VariantMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SizeLabel = styled.div`
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SizeMeta = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-family: ui-monospace, SFMono-Regular, monospace;
`;

/* ── Tips ── */

const Tip = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 12px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

const TipKey = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TipVal = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.body};

  code {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 12px;
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 5px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
