import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  FilterChip,
  FilterRow,
  Segment,
  SegmentGroup,
  AccountPill,
  PeachAvatar,
  PillChevron,
  DropdownUserRow,
  DropdownUserText,
  DropdownName,
  DropdownEmail,
  DropdownDivider,
  DropdownSpacer,
  DropdownMenuGroup,
  ProPlanRow,
  ProPlanLabel,
  ProManageLink,
  UpgradeInner,
  UpgradePrice,
  Label,
  PlanBadge,
  Switch,
  ToggleTabs,
  ToggleRow,
  ToggleLabel,
  Input,
  FormField,
  PlanUsageCard,
} from '../components/shared';
import { labelVariantTokens } from '../themes/labelTokens';
import type { LabelVariant } from '../components/shared';
import {
  Plus, Trash2, Copy, ArrowRight,
  Settings, Sparkles,
  LogOut, Home, Mail, Lock, Eye, EyeOff, Check,
} from 'lucide-react';
import {
  buttonVariantTokens,
  buttonSizeTokens,
  ButtonVariant,
  ButtonSize,
} from '../themes/buttonTokens';
import { filterChipSize } from '../themes/filterChipTokens';

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

  return (
    <Page>
      <Hero>
        <Pill>Live preview · Token-driven</Pill>
        <H1>Design system</H1>
        <Lead>
          Every element below is rendered straight from the token files.
          Edit a token → this page and every use-site update together.
        </Lead>
      </Hero>

      {/* ─────── Buttons ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Buttons · variants</SectionTitle>
          <SectionMeta>
            {ALL_VARIANTS.length} variants at <code>md</code> · <code>buttonTokens.ts</code>.
          </SectionMeta>
        </SectionHeader>

        <VariantGallery>
          {ALL_VARIANTS.map((v) => (
            <VariantTile key={v}>
              <Button $variant={v} $size="md">{v === 'link' ? 'link' : 'Button'}</Button>
              <VariantTileMeta>
                <VariantName>{v}</VariantName>
                <VariantMeta>{variantBlurb(v)}</VariantMeta>
              </VariantTileMeta>
            </VariantTile>
          ))}
        </VariantGallery>
      </Section>

      {/* ─────── Sizes ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Sizes</SectionTitle>
          <SectionMeta>
            {ALL_SIZES.length} sizes · primary variant shown · <code>buttonSizeTokens</code>.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <SizeRow>
            {ALL_SIZES.map((s) => (
              <SizeCol key={s}>
                <Button $variant="primary" $size={s}>Button</Button>
                <SizeCaption>
                  <b>{s}</b> · {buttonSizeTokens[s].height}
                  <br />
                  <small>{sizeUsage(s)}</small>
                </SizeCaption>
              </SizeCol>
            ))}
          </SizeRow>
        </SurfaceCard>
      </Section>

      {/* ─────── Options ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Options</SectionTitle>
          <SectionMeta>Icons · pill · icon-only · disabled.</SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <Row>
            <Button $variant="primary" $size="md"><Plus /> Create</Button>
            <Button $variant="outline" $size="md">Continue <ArrowRight /></Button>
            <Button $variant="accent" $size="md" $pill>pill</Button>
            <Button $variant="outline" $size="md" $iconOnly aria-label="Copy"><Copy /></Button>
            <Button $variant="danger" $size="md" $iconOnly aria-label="Delete"><Trash2 /></Button>
            <Button $variant="primary" $size="md" disabled>disabled</Button>
          </Row>
        </SurfaceCard>
      </Section>


      {/* ─────── Filter chips ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Filter chips</SectionTitle>
          <SectionMeta>
            Selectable pills — {filterChipSize.height} tall, <code>$shape="rect"|"pill"</code> · <code>filterChipTokens.ts</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <VariantLabel>$shape="rect" — default · 10px radius</VariantLabel>
          <FilterRow>
            {['all', 'planners', 'student', 'wellness', 'finance', 'focus'].map((c) => (
              <FilterChip
                key={`rect-${c}`}
                $active={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>

          <VariantLabel style={{ marginTop: 20 }}>$shape="pill" — 999px radius</VariantLabel>
          <FilterRow>
            {['all', 'planners', 'student', 'wellness', 'finance', 'focus'].map((c) => (
              <FilterChip
                key={`pill-${c}`}
                $shape="pill"
                $active={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterRow>
        </SurfaceCard>
      </Section>

      {/* ─────── Segmented tabs ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Segmented tabs</SectionTitle>
          <SectionMeta>
            Tab-switch · active = paper tile on neutral · <code>segmentTokens.ts</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <SegmentDemo />
        </SurfaceCard>
      </Section>

      {/* ─────── Dashboard account menu ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Dashboard account menu</SectionTitle>
          <SectionMeta>
            Top-nav pill + dropdown (free / pro states) · <code>AccountMenu.tsx</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <VariantLabel>Trigger pill — idle &amp; opened</VariantLabel>
          <Row style={{ gap: 24, marginBottom: 16 }}>
            <AccountPill $open={false} type="button">
              <PeachAvatar $size={30} $fontSize={11}>GU</PeachAvatar>
              Dashboard
              <PillChevron $open={false} />
            </AccountPill>
            <AccountPill $open={true} type="button">
              <PeachAvatar $size={30} $fontSize={11}>GU</PeachAvatar>
              Dashboard
              <PillChevron $open={true} />
            </AccountPill>
          </Row>

          <VariantLabel style={{ marginTop: 24 }}>Dropdown — free plan · Upgrade CTA</VariantLabel>
          <Row style={{ gap: 32, flexWrap: 'wrap' }}>
            <StaticDropdown>
              <DropdownUserRow>
                <PeachAvatar $size={44} $fontSize={15}>GU</PeachAvatar>
                <DropdownUserText>
                  <DropdownName>Guest User</DropdownName>
                  <DropdownEmail>guest@peachy.studio</DropdownEmail>
                </DropdownUserText>
              </DropdownUserRow>
              <DropdownDivider />
              <Button $variant="accent" $size="xl" $fullWidth style={{ justifyContent: 'space-between' }}>
                <UpgradeInner>
                  <Sparkles fill="currentColor" strokeWidth={1.5} />
                  Upgrade to Pro
                </UpgradeInner>
                <UpgradePrice>$4/mo</UpgradePrice>
              </Button>
              <DropdownSpacer />
              <DropdownMenuGroup>
                <Button $variant="ghost" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                  <Home /> Dashboard
                </Button>
                <Button $variant="ghost" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                  <Settings /> Settings
                </Button>
              </DropdownMenuGroup>
              <DropdownDivider />
              <Button $variant="ghostDanger" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                <LogOut /> Log out
              </Button>
            </StaticDropdown>

            <StaticDropdown>
              <DropdownUserRow>
                <PeachAvatar $size={44} $fontSize={15}>GU</PeachAvatar>
                <DropdownUserText>
                  <DropdownName>Guest User</DropdownName>
                  <DropdownEmail>guest@peachy.studio</DropdownEmail>
                </DropdownUserText>
              </DropdownUserRow>
              <DropdownDivider />
              <ProPlanRow>
                <ProPlanLabel>
                  <Sparkles fill="currentColor" strokeWidth={1.5} />
                  Pro plan
                </ProPlanLabel>
                <ProManageLink onClick={(e) => e.preventDefault()}>Manage</ProManageLink>
              </ProPlanRow>
              <DropdownSpacer />
              <DropdownMenuGroup>
                <Button $variant="ghost" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                  <Home /> Dashboard
                </Button>
                <Button $variant="ghost" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                  <Settings /> Settings
                </Button>
              </DropdownMenuGroup>
              <DropdownDivider />
              <Button $variant="ghostDanger" $size="md" $fullWidth style={{ justifyContent: 'flex-start', gap: 12 }}>
                <LogOut /> Log out
              </Button>
            </StaticDropdown>
          </Row>
        </SurfaceCard>
      </Section>

      {/* ─────── Plan usage card ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Plan usage card</SectionTitle>
          <SectionMeta>
            Usage ring + Upgrade/Manage — Studio header + widgets row ·{' '}
            <code>PlanUsageCard.tsx</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <VariantLabel>Free · wide (under widgets row)</VariantLabel>
          <Row>
            <PlanUsageCard mode="free" $size="wide" used={9} limit={3} onUpgrade={() => {}} />
          </Row>

          <VariantLabel style={{ marginTop: 20 }}>Free · compact (top bar)</VariantLabel>
          <Row>
            <PlanUsageCard mode="free" $size="compact" used={9} limit={3} onUpgrade={() => {}} />
          </Row>

          <VariantLabel style={{ marginTop: 20 }}>Pro · wide (active plan)</VariantLabel>
          <Row>
            <PlanUsageCard mode="pro" $size="wide" onManage={() => {}} />
          </Row>

          <VariantLabel style={{ marginTop: 20 }}>Pro · compact</VariantLabel>
          <Row>
            <PlanUsageCard mode="pro" $size="compact" onManage={() => {}} />
          </Row>
        </SurfaceCard>
      </Section>

      {/* ─────── Form controls ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Form controls</SectionTitle>
          <SectionMeta>
            Switch · ToggleTabs · Input — used in CustomizationPanel ·{' '}
            <code>toggleTokens.ts</code> · <code>inputTokens.ts</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <FormControlsDemo />
        </SurfaceCard>
      </Section>

      {/* ─────── Labels & badges ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Labels &amp; badges</SectionTitle>
          <SectionMeta>
            Tier / state tags — Pro, Free, New, Limited, Popular, Neutral · <code>labelTokens.ts</code>.
          </SectionMeta>
        </SectionHeader>

        <SurfaceCard>
          <VariantLabel>$variant — 6 tier tints</VariantLabel>
          <Row>
            {(Object.keys(labelVariantTokens) as LabelVariant[]).map((v) => (
              <Label key={v} $variant={v} style={v === 'popular' ? { position: 'static' } : undefined}>
                {v}
              </Label>
            ))}
          </Row>

          <VariantLabel style={{ marginTop: 24 }}>PlanBadge — compact gradient chip (Pro / Free)</VariantLabel>
          <Row>
            <PlanBadge $pro>Pro</PlanBadge>
            <PlanBadge>Free</PlanBadge>
          </Row>
        </SurfaceCard>
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

/* ── size-usage legend — where each size actually lives in the app ── */
function sizeUsage(s: ButtonSize): string {
  const m: Record<ButtonSize, string> = {
    sm: 'cards · filters · inline',
    md: 'toolbars · modals',
    lg: 'primary forms · cards',
    xl: 'hero · auth · full-width',
  };
  return m[s];
}

/* ── variant blurbs ── */
function variantBlurb(v: ButtonVariant): string {
  const blurbs: Record<ButtonVariant, string> = {
    primary: 'Default dark CTA · carved depth',
    accent: 'Indigo gradient · Pro/Upgrade',
    upgrade: 'Outlined indigo · inline upgrade',
    slate: 'Slate-warm neutral · editorial CTA (replaces blue)',
    secondary: 'Notion paper · neutral CTA',
    outline: 'Transparent + border',
    ghost: 'Minimal · nav / menu / inline',
    ghostDanger: 'Borderless destructive · menu log out',
    danger: 'Muted wine · reversible destructive',
    dangerStrong: 'Saturated red · irreversible',
    success: 'Emerald · confirm / saved',
    link: 'Underline on hover',
  };
  return blurbs[v] || '';
}

const FormControlsDemo: React.FC = () => {
  const [dayGrid, setDayGrid] = useState(true);
  const [weekStart, setWeekStart] = useState<'monday' | 'sunday'>('monday');
  const [urlText, setUrlText] = useState('');
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 460 }}>
      <VariantLabel>Switch — on/off toggle</VariantLabel>
      <ToggleRow>
        <ToggleLabel>Day grid</ToggleLabel>
        <Switch checked={dayGrid} onChange={setDayGrid} aria-label="Day grid" />
      </ToggleRow>

      <VariantLabel style={{ marginTop: 12 }}>ToggleTabs — 2-choice sliding</VariantLabel>
      <ToggleRow as="div">
        <ToggleLabel>Week start</ToggleLabel>
        <ToggleTabs<'monday' | 'sunday'>
          value={weekStart}
          options={['monday', 'sunday']}
          labels={['Mon', 'Sun']}
          onChange={setWeekStart}
        />
      </ToggleRow>

      <VariantLabel style={{ marginTop: 12 }}>Input — panel text field (34px)</VariantLabel>
      <Input
        type="text"
        placeholder="https://..."
        value={urlText}
        onChange={(e) => setUrlText(e.target.value)}
      />

      <VariantLabel style={{ marginTop: 20 }}>FormField — 5 states (44px)</VariantLabel>
      <FormField
        label="Email"
        hint="Optional"
        helper="We'll never share your email."
        icon={<Mail />}
        placeholder="you@peachy.studio"
      />
      <FormField
        label="Password"
        icon={<Lock />}
        type={showPw ? 'text' : 'password'}
        defaultValue="supersecret"
        trailing={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'inline-flex' }}
          >
            {showPw ? <EyeOff /> : <Eye />}
          </button>
        }
      />
      <FormField
        label="Email"
        state="error"
        icon={<Mail />}
        defaultValue="not-an-email"
        helper="Please enter a valid email address."
      />
      <FormField
        label="Email"
        state="success"
        icon={<Mail />}
        defaultValue="hello@peachy.studio"
        helper="Email verified."
        trailing={<Check />}
      />
      <FormField
        label="Email"
        disabled
        icon={<Lock />}
        defaultValue="locked@peachy.studio"
        helper="Managed by SSO — contact admin to change."
      />
    </div>
  );
};

const SegmentDemo: React.FC = () => {
  const [tab, setTab] = useState<'widgets' | 'templates'>('widgets');
  return (
    <SegmentGroup>
      <Segment $active={tab === 'widgets'} onClick={() => setTab('widgets')}>Widgets</Segment>
      <Segment $active={tab === 'templates'} onClick={() => setTab('templates')}>Templates</Segment>
    </SegmentGroup>
  );
};

/* ─────── Layout ─────── */

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background.page};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  padding: 64px 48px 140px;

  @media (max-width: 900px) {
    padding: 40px 20px 80px;
  }
`;

const Hero = styled.header`
  max-width: 1100px;
  margin: 0 auto 80px;
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
  margin-bottom: 20px;

  code {
    font-family: inherit;
    background: transparent;
    padding: 0;
  }
`;

const H1 = styled.h1`
  font-size: 52px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  line-height: 1.05;

  @media (max-width: 900px) {
    font-size: 36px;
  }
`;

const Lead = styled.p`
  font-size: 15px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text.body};
  max-width: 640px;
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
  margin: 0 auto 80px;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 6px;
`;

const SectionMeta = styled.div`
  font-size: 15px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text.body};
  max-width: 640px;

  code {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 5px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

/* Surface card — used to group related demos (Options, Sizes, each Pattern).
   Gives every block a clean, bounded shape so the page stops feeling like a
   loose stream of rows. */
const SurfaceCard = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 16px;

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const StaticDropdown = styled.div`
  width: 240px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.floating};
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const VariantLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 0 10px;

  code {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
    letter-spacing: 0;
    text-transform: none;
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    padding: 1px 5px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
  }
`;

/* ── Variant gallery (clean grid of one-per-variant buttons) ── */

const VariantGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
`;

const VariantTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 20px 18px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 14px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }
`;

const VariantTileMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const VariantName = styled.div`
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const VariantMeta = styled.div`
  font-size: 11px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

/* ── Size row (all 4 sizes across one baseline) ── */

const SizeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 32px 40px;
`;

const SizeCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const SizeCaption = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.tertiary};

  b {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  small {
    font-size: 11px;
  }
`;

/* ── Tips ── */

const Tip = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 18px 22px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 12px;

  & + & { margin-top: 10px; }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const TipKey = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const TipVal = styled.div`
  font-size: 13px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text.body};

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
