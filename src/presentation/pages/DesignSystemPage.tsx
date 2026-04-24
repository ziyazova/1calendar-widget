import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  Button,
  FilterChip,
  FilterRow,
  Segment,
  SegmentGroup,
  AccountPill,
  AccountDropdown,
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
  Tag,
  OverlayBadge,
  PlanBadge,
  Footer,
  TemplateMockupCard,
  TemplateMockupImage,
  Switch,
  ToggleTabs,
  ToggleRow,
  ToggleLabel,
  Input,
  FormField,
  PlanUsageCard,
  CopyButton,
  Modal,
  ModalFooter,
  GradientBanner,
  BannerBody,
  BannerText,
} from '../components/shared';
import { labelVariantTokens } from '../themes/labelTokens';
import type { LabelVariant } from '../components/shared';
import {
  BannerIcon, BannerTitle, BannerActions,
  ToastShell, ToastIconBubble, ToastMessage,
  ConsentBannerWrap, ConsentBannerIcon, ConsentBannerMessage, ConsentBannerPrivacyLink, ConsentBannerActions,
  InfoBanner, InfoBannerIcon, InfoBannerBody, InfoBannerTitle, InfoBannerSub,
} from '../components/shared';
import {
  EmailVerificationBar,
  EmailVerificationIcon,
  EmailVerificationBody,
  EmailVerificationTitle,
  EmailVerificationSub,
  EmailVerificationActions,
  EmailVerificationResendBtn,
  EmailVerificationCloseBtn,
} from '../components/shared/EmailVerificationBanner';
import {
  Plus, Trash2, Copy, ArrowRight,
  Settings, Sparkles,
  LogOut, Home, Mail, Lock, Eye, EyeOff, Check,
  Cookie, X, Clock, BadgePercent, Link2, BadgeCheck,
  Palette, Pencil, ShieldCheck,
  Calendar as CalIcon, Image as ImgIcon, FileText, LayoutGrid,
} from 'lucide-react';
import {
  buttonVariantTokens,
  buttonSizeTokens,
  ButtonVariant,
  ButtonSize,
} from '../themes/buttonTokens';
import { filterChipSize } from '../themes/filterChipTokens';
import { TopNav } from '../components/layout/TopNav';
import { BigFooter } from '../components/landing/BigFooter';

/* ═══ Mirror imports ═══
 * These are the REAL prod components, rendered in the showcase so that
 * editing any of them in the source file updates both prod and this page.
 * No local re-implementations — single source of truth. */
import {
  EmptyBox, EmptyCircle, EmptyTitle, EmptyHint,
  CreateCard, CreateIconWrap, CreateCardText, CreateCardTitle, CreateCardHint,
  BigCard, BigCardPreview, BigCardLabel, BigCardBottom, BigCardName, BigCardActions,
} from '../components/dashboard/DashboardViews';
import {
  MobileArtboard, MobileDotGrid,
  MobileSectionTabs, MobileSectionTab,
  WidgetCard, WidgetPreviewWrap, WidgetBottom, WidgetName, WidgetActions,
} from './StudioPage';
import {
  FigmaColorRow, ColorSwatch, HexInput, PresetGroup, ColorOption,
} from '../components/ui/ColorPicker';
import {
  widgetColors, backgroundColors, accentColors,
} from '../themes/colors';

/**
 * DesignSystemPage — live showcase rendered straight from tokens.
 *
 * Reads `buttonTokens.ts` + `filterChipTokens.ts` directly. Changing a token
 * updates both this page AND every real use-site in the app — so this page is
 * a trustworthy preview of what users will see.
 *
 * Route: `/dev` (dev-only, `/dev/v2` is kept as an alias for old bookmarks).
 * See App.tsx.
 */

const ALL_VARIANTS: ButtonVariant[] = Object.keys(buttonVariantTokens) as ButtonVariant[];
const ALL_SIZES: ButtonSize[] = Object.keys(buttonSizeTokens) as ButtonSize[];

/* Mirror of `theme.typography.sizes` used by the Typography showcase.
   Kept here so the DS reads the same order as the token file. */
const TYPOGRAPHY_SIZES: Record<string, string> = {
  '2xs': '10px',
  xs: '11px',
  sm: '12px',
  md: '13px',
  base: '14px',
  lg: '15px',
  xl: '16px',
  '2xl': '18px',
  '3xl': '20px',
  '4xl': '22px',
  '5xl': '26px',
  '6xl': '28px',
  '7xl': '32px',
  '8xl': '40px',
};

/* What each size is actually used for in the app — sourced from the
   inline comments in `theme.ts`. */
const TYPOGRAPHY_USAGE: Record<string, string> = {
  '2xs': 'CardBadge · MobileSectionTab',
  xs: 'Pro pill · OverlayBadge',
  sm: 'captions · muted labels',
  md: 'small body · buttons · filter chips',
  base: 'default body · CTA label',
  lg: 'emphasised body · SectionTitle sm',
  xl: 'link text · navbar items',
  '2xl': 'section headlines',
  '3xl': 'SectionTitle',
  '4xl': 'large section',
  '5xl': 'mobile page title',
  '6xl': 'welcome h1',
  '7xl': 'hero · page title',
  '8xl': 'landing hero',
};

/* Mirror of `theme.typography.letterSpacing`. */
const TYPOGRAPHY_LETTER_SPACING: Array<{
  name: string;
  value: string;
  usage: string;
}> = [
  { name: 'widest', value: '0.06em', usage: 'UPPERCASE pills · micro-tabs' },
  { name: 'normal', value: '0', usage: 'default · captions · muted labels' },
  { name: 'loose', value: '-0.005em', usage: 'small headlines · SectionTitle' },
  { name: 'tight', value: '-0.01em', usage: 'body emphasis · inline links' },
  { name: 'tighter', value: '-0.02em', usage: 'H2 · large section titles' },
  { name: 'tightest', value: '-0.03em', usage: 'hero · page title · H1' },
];

/* App typography presets — one common system used across Dashboard,
   Studio, Shop, Sidebar, Settings. Source: `studioTypography.ts`.
   `usedIn` lists all zones each preset applies to — some overlap
   (same preset serves multiple zones), some are zone-specific. */
type AppTextSpec = {
  name: string;
  variant: 'pageTitle' | 'sectionTitle' | 'cardTitle' | 'cardTitleSm' | 'menuItem' | 'body' | 'caption' | 'micro';
  usedIn: string[];
  size: keyof typeof TYPOGRAPHY_SIZES;
  weight: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight: 'tight' | 'snug' | 'normal' | 'relaxed';
  letterSpacing: 'widest' | 'normal' | 'loose' | 'tight' | 'tighter' | 'tightest';
  sample: string;
};

const WEIGHT_VALUES = { normal: 400, medium: 500, semibold: 600, bold: 700 } as const;
const LINE_HEIGHT_VALUES = { tight: 1.2, snug: 1.3, normal: 1.5, relaxed: 1.6 } as const;
const LETTER_SPACING_VALUES = {
  widest: '0.06em',
  normal: '0',
  loose: '-0.005em',
  tight: '-0.01em',
  tighter: '-0.02em',
  tightest: '-0.03em',
} as const;

const LANDING_TEXT_STYLES: Array<{
  name: string;
  variant: string;
  helper: 'textStyle' | 'Text';
  size: keyof typeof TYPOGRAPHY_SIZES;
  weight: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight: 'tight' | 'snug' | 'normal' | 'relaxed';
  letterSpacing: 'widest' | 'normal' | 'loose' | 'tight' | 'tighter' | 'tightest';
  sample: string;
  uppercase?: boolean;
  usedIn: string[];
}> = [
  {
    name: 'Display',
    variant: 'display',
    helper: 'textStyle',
    size: '8xl',
    weight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tightest',
    sample: 'Big ideas',
    usedIn: ['Landing hero'],
  },
  {
    name: 'H1 · Page title',
    variant: 'h1',
    helper: 'textStyle',
    size: '7xl',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'tightest',
    sample: 'Widgets that live in your Notion',
    usedIn: ['Landing', 'Auth', 'Welcome hero'],
  },
  {
    name: 'H2 · Section',
    variant: 'h2',
    helper: 'textStyle',
    size: '4xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tighter',
    sample: 'Choose your plan',
    usedIn: ['Landing sections', 'Pricing', 'FAQ'],
  },
  {
    name: 'H3 · Card title',
    variant: 'h3',
    helper: 'textStyle',
    size: '2xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
    sample: 'Calendar Collage',
    usedIn: ['Feature card', 'Testimonial title'],
  },
  {
    name: 'Body L',
    variant: 'bodyL',
    helper: 'textStyle',
    size: 'lg',
    weight: 'normal',
    lineHeight: 'relaxed',
    letterSpacing: 'normal',
    sample: 'Widgets that live right inside your Notion pages.',
    usedIn: ['Landing lead', 'Hero subtext'],
  },
  {
    name: 'Body',
    variant: 'body',
    helper: 'textStyle',
    size: 'base',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'loose',
    sample: 'Customize every pixel, save, and embed — takes under a minute.',
    usedIn: ['Landing paragraph', 'FAQ answer'],
  },
  {
    name: 'Button',
    variant: 'button',
    helper: 'textStyle',
    size: 'base',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'loose',
    sample: 'Get started',
    usedIn: ['Shared <Button>'],
  },
  {
    name: 'Caption',
    variant: 'caption',
    helper: 'textStyle',
    size: 'sm',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    sample: 'No credit card required',
    usedIn: ['Footer · Helper · Form hint'],
  },
  {
    name: 'Micro · Pill',
    variant: 'micro',
    helper: 'textStyle',
    size: 'xs',
    weight: 'semibold',
    lineHeight: 'tight',
    letterSpacing: 'widest',
    sample: 'Popular',
    uppercase: true,
    usedIn: ['Pro / Popular pill', 'Tag chip'],
  },
];

const STUDIO_TEXT_STYLES: AppTextSpec[] = [
  {
    name: 'Page title',
    variant: 'pageTitle',
    usedIn: ['Dashboard', 'Settings', 'Shop'],
    size: '6xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tightest',
    sample: 'Welcome back',
  },
  {
    name: 'Section title',
    variant: 'sectionTitle',
    usedIn: ['Dashboard', 'Studio', 'Settings'],
    size: '2xl',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tighter',
    sample: 'My widgets',
  },
  {
    name: 'Card title',
    variant: 'cardTitle',
    usedIn: ['Dashboard', 'Shop'],
    size: 'base',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
    sample: 'Weekly Planner',
  },
  {
    name: 'Card title · sm',
    variant: 'cardTitleSm',
    usedIn: ['Studio', 'Sidebar'],
    size: 'md',
    weight: 'semibold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
    sample: 'Modern Grid',
  },
  {
    name: 'Menu item',
    variant: 'menuItem',
    usedIn: ['Sidebar'],
    size: 'md',
    weight: 'medium',
    lineHeight: 'normal',
    letterSpacing: 'tight',
    sample: 'Templates',
  },
  {
    name: 'Body',
    variant: 'body',
    usedIn: ['Studio', 'Shop', 'Dashboard (modals)'],
    size: 'base',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'loose',
    sample: 'Are you sure you want to delete this widget?',
  },
  {
    name: 'Caption',
    variant: 'caption',
    usedIn: ['Dashboard', 'Studio', 'Shop', 'Sidebar'],
    size: 'sm',
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    sample: 'Mar 22, 2026 · #PY-1042',
  },
  {
    name: 'Micro',
    variant: 'micro',
    usedIn: ['Studio (tabs)', 'Sidebar (labels)', 'Shop (chips)'],
    size: 'xs',
    weight: 'medium',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    sample: 'Customize',
  },
];

export const DesignSystemPage: React.FC = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState<string>('all');
  const [showRawTokens, setShowRawTokens] = useState<boolean>(false);

  /* Live modal demos — each key opens the matching <Modal> instance below. */
  type ModalKey =
    | null
    | 'deleteWidget'
    | 'nameWidget'
    | 'deleteAccount'
    | 'changePassword'
    | 'resetPassword'
    | 'upgrade';
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const closeModal = () => setOpenModal(null);

  /* Local form state for demo modals. */
  const [demoWidgetName, setDemoWidgetName] = useState('');
  const [demoDeleteConfirm, setDemoDeleteConfirm] = useState('');
  const [demoResetEmail, setDemoResetEmail] = useState('');
  const [demoResetSent, setDemoResetSent] = useState(false);
  const [demoPwSuccess, setDemoPwSuccess] = useState(false);

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

      {/* ─────── Typography ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Typography</SectionTitle>
          <SectionMeta>
            Type scale, fonts, and weights — all driven by <code>theme.typography.*</code>.
            Use the token name (e.g. <code>theme.typography.sizes.base</code>) instead
            of raw <code>px</code> values so a global bump stays one line.
          </SectionMeta>
        </SectionHeader>

        <SubTitle>Fonts</SubTitle>
        <FontFamilyRow>
          <FontFamilyTile>
            <FontFamilyName>primary</FontFamilyName>
            <FontFamilyStack>Inter · system fallback</FontFamilyStack>
            <FontFamilySample $mono={false}>
              The quick brown fox jumps over the lazy dog · 1234567890
            </FontFamilySample>
          </FontFamilyTile>
          <FontFamilyTile>
            <FontFamilyName>mono</FontFamilyName>
            <FontFamilyStack>JetBrains Mono · system fallback</FontFamilyStack>
            <FontFamilySample $mono>
              const tokens = theme.typography; // 0O1Il
            </FontFamilySample>
          </FontFamilyTile>
        </FontFamilyRow>

        <SubTitle style={{ marginTop: 32 }}>App / Studio typography</SubTitle>
        <SectionMeta style={{ marginBottom: 20, fontSize: 13 }}>
          8 semantic recipes that power Dashboard, Studio, Shop, Sidebar, and Settings.
          Compact, dense, UI-chrome. Source: <code>studioTypography.ts</code>.
        </SectionMeta>
        <TextStyleUsageHint>
          <code>{'<StudioText $variant="pageTitle">Welcome</StudioText>'}</code>
          <span>or</span>
          <code>{'${studioText(\'pageTitle\')}'}</code>
          <span>inside a styled component.</span>
        </TextStyleUsageHint>
        <TextStyleList>
          {STUDIO_TEXT_STYLES.map((s) => (
            <TextStyleTile key={s.name}>
              <TextStyleMeta>
                <TextStyleName>{s.name}</TextStyleName>
                <TextStyleCode>studioText(&apos;{s.variant}&apos;)</TextStyleCode>
                <TextStyleSpec>
                  <SpecPill>{TYPOGRAPHY_SIZES[s.size]}</SpecPill>
                  <SpecPill>{WEIGHT_VALUES[s.weight]}</SpecPill>
                  <SpecPill>lh {LINE_HEIGHT_VALUES[s.lineHeight]}</SpecPill>
                  <SpecPill>{LETTER_SPACING_VALUES[s.letterSpacing]}</SpecPill>
                </TextStyleSpec>
                <TextStyleZones>
                  <TextStyleZonesLabel>Used in</TextStyleZonesLabel>
                  {s.usedIn.map((z) => (
                    <TextStyleZonePill key={z}>{z}</TextStyleZonePill>
                  ))}
                </TextStyleZones>
              </TextStyleMeta>
              <TextStyleSample
                style={{
                  fontSize: TYPOGRAPHY_SIZES[s.size],
                  fontWeight: WEIGHT_VALUES[s.weight],
                  lineHeight: LINE_HEIGHT_VALUES[s.lineHeight],
                  letterSpacing: LETTER_SPACING_VALUES[s.letterSpacing],
                }}
              >
                {s.sample}
              </TextStyleSample>
            </TextStyleTile>
          ))}
        </TextStyleList>

        <SubTitle style={{ marginTop: 40 }}>Landing / marketing typography</SubTitle>
        <SectionMeta style={{ marginBottom: 20, fontSize: 13 }}>
          9 editorial recipes for public-facing pages — larger, more dramatic.
          Used in Landing, Templates detail hero, Login / auth screens.
          Source: <code>textStyleTokens.ts</code>.
        </SectionMeta>
        <TextStyleUsageHint>
          <code>{'<Text $variant="h1">Welcome</Text>'}</code>
          <span>or</span>
          <code>{'${textStyle(\'h1\')}'}</code>
          <span>inside a styled component.</span>
        </TextStyleUsageHint>
        <TextStyleList>
          {LANDING_TEXT_STYLES.map((s) => (
            <TextStyleTile key={s.name}>
              <TextStyleMeta>
                <TextStyleName>{s.name}</TextStyleName>
                <TextStyleCode>textStyle(&apos;{s.variant}&apos;)</TextStyleCode>
                <TextStyleSpec>
                  <SpecPill>{TYPOGRAPHY_SIZES[s.size]}</SpecPill>
                  <SpecPill>{WEIGHT_VALUES[s.weight]}</SpecPill>
                  <SpecPill>lh {LINE_HEIGHT_VALUES[s.lineHeight]}</SpecPill>
                  <SpecPill>{LETTER_SPACING_VALUES[s.letterSpacing]}</SpecPill>
                  {s.uppercase && <SpecPill>UPPERCASE</SpecPill>}
                </TextStyleSpec>
                <TextStyleZones>
                  <TextStyleZonesLabel>Used in</TextStyleZonesLabel>
                  {s.usedIn.map((z) => (
                    <TextStyleZonePill key={z}>{z}</TextStyleZonePill>
                  ))}
                </TextStyleZones>
              </TextStyleMeta>
              <TextStyleSample
                style={{
                  fontSize: TYPOGRAPHY_SIZES[s.size],
                  fontWeight: WEIGHT_VALUES[s.weight],
                  lineHeight: LINE_HEIGHT_VALUES[s.lineHeight],
                  letterSpacing: LETTER_SPACING_VALUES[s.letterSpacing],
                  textTransform: s.uppercase ? 'uppercase' : 'none',
                }}
              >
                {s.sample}
              </TextStyleSample>
            </TextStyleTile>
          ))}
        </TextStyleList>

        <SubTitle style={{ marginTop: 40 }}>Line heights</SubTitle>
        <LineHeightRow>
          {([
            { name: 'tight', value: 1.2 },
            { name: 'snug', value: 1.3 },
            { name: 'normal', value: 1.5 },
            { name: 'relaxed', value: 1.6 },
          ] as const).map((lh) => (
            <LineHeightTile key={lh.name} title={`theme.typography.lineHeights.${lh.name}`}>
              <LineHeightName>lineHeights.{lh.name} · {lh.value}</LineHeightName>
              <LineHeightSample style={{ lineHeight: lh.value }}>
                Line one of sample text.<br />
                Line two shows the vertical rhythm of this line-height token
                when wrapped across multiple lines.
              </LineHeightSample>
            </LineHeightTile>
          ))}
        </LineHeightRow>

        <RawTokensToggle
          type="button"
          onClick={() => setShowRawTokens((v) => !v)}
          aria-expanded={showRawTokens}
        >
          {showRawTokens ? '▴ Hide raw tokens' : '▾ Show raw tokens'}
          <RawTokensHint>
            {showRawTokens ? 'sizes · weights · letterSpacing' : 'for edge cases when presets don\'t fit'}
          </RawTokensHint>
        </RawTokensToggle>

        {showRawTokens && (
          <>
        <SubTitle style={{ marginTop: 24 }}>Size scale</SubTitle>
        <TypeScaleTable>
          {(Object.entries(TYPOGRAPHY_SIZES) as [string, string][]).map(([name, px]) => (
            <TypeScaleRow key={name}>
              <TypeScaleName title={`theme.typography.sizes.${name}`}>
                sizes.{name}
              </TypeScaleName>
              <TypeScaleValue>{px}</TypeScaleValue>
              <TypeScaleSample style={{ fontSize: px }}>
                The quick brown fox
              </TypeScaleSample>
              <TypeScaleUsage>{TYPOGRAPHY_USAGE[name] ?? ''}</TypeScaleUsage>
            </TypeScaleRow>
          ))}
        </TypeScaleTable>

        <SubTitle style={{ marginTop: 32 }}>Weights</SubTitle>
        <WeightRow>
          {([
            { name: 'normal', weight: 400 },
            { name: 'medium', weight: 500 },
            { name: 'semibold', weight: 600 },
            { name: 'bold', weight: 700 },
          ] as const).map((w) => (
            <WeightTile key={w.name} title={`theme.typography.weights.${w.name}`}>
              <WeightSample style={{ fontWeight: w.weight }}>Ag</WeightSample>
              <WeightName>weights.{w.name}</WeightName>
              <WeightValue>{w.weight}</WeightValue>
            </WeightTile>
          ))}
        </WeightRow>

        <SubTitle style={{ marginTop: 32 }}>Letter spacing</SubTitle>
        <LetterSpacingRow>
          {TYPOGRAPHY_LETTER_SPACING.map((ls) => (
            <LetterSpacingTile key={ls.name} title={`theme.typography.letterSpacing.${ls.name}`}>
              <LetterSpacingHeader>
                <LetterSpacingName>letterSpacing.{ls.name}</LetterSpacingName>
                <LetterSpacingValue>{ls.value}</LetterSpacingValue>
              </LetterSpacingHeader>
              <LetterSpacingSample
                style={{
                  letterSpacing: ls.value,
                  textTransform: ls.name === 'widest' ? 'uppercase' : 'none',
                }}
              >
                {ls.name === 'widest' ? 'Popular' : 'Typography'}
              </LetterSpacingSample>
              <LetterSpacingUsage>{ls.usage}</LetterSpacingUsage>
            </LetterSpacingTile>
          ))}
        </LetterSpacingRow>
          </>
        )}
      </Section>

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
            <CopyButton value="https://1calendar-widget.vercel.app/embed/calendar?c=DEMO" $size="md" />
            <Button $variant="danger" $size="md" $iconOnly aria-label="Delete"><Trash2 /></Button>
            <Button $variant="primary" $size="md" disabled>disabled</Button>
          </Row>
        </SurfaceCard>
      </Section>

      {/* ─────── Copy action ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Copy action</SectionTitle>
          <SectionMeta>
            Click a button — outline flips to successSoft + Check icon for 2s, then reverts.
            Shared <code>&lt;CopyButton value=&quot;…&quot; /&gt;</code> · used across embed copy,
            widget cards, purchase receipts.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <VariantLabel>Icon only (sm / md / lg)</VariantLabel>
          <Row>
            <CopyButton value="https://1calendar-widget.vercel.app/embed/calendar?c=DEMO" $size="sm" />
            <CopyButton value="https://1calendar-widget.vercel.app/embed/calendar?c=DEMO" $size="md" />
            <CopyButton value="https://1calendar-widget.vercel.app/embed/calendar?c=DEMO" $size="lg" />
          </Row>

          <VariantLabel style={{ marginTop: 20 }}>With label</VariantLabel>
          <Row>
            <CopyButton
              value="https://1calendar-widget.vercel.app/embed/calendar?c=DEMO"
              $size="md"
              $iconOnly={false}
              label="Copy embed URL"
              copiedLabel="Copied!"
            />
            <CopyButton
              value="PEACHY2026"
              $size="md"
              $iconOnly={false}
              label="Copy access code"
            />
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
            <AccountDropdown style={{ position: 'static', animation: 'none' }}>
              <DropdownUserRow>
                <PeachAvatar $size={44} $fontSize={15}>GU</PeachAvatar>
                <DropdownUserText>
                  <DropdownName>Guest User</DropdownName>
                  <DropdownEmail>guest@peachy.studio</DropdownEmail>
                </DropdownUserText>
              </DropdownUserRow>
              <DropdownDivider />
              <Button $variant="accent" $size="xl" $fullWidth style={{ justifyContent: 'space-between', padding: '0 16px' }}>
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
            </AccountDropdown>

            <AccountDropdown style={{ position: 'static', animation: 'none' }}>
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
            </AccountDropdown>
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

      {/* ─────── Mobile tab bar ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Mobile tab bar</SectionTitle>
          <SectionMeta>
            The 4-tab bar that sits at the bottom of Studio on mobile (≤768px):{' '}
            <strong>Style · Content · Color · Layout</strong>. Icon + 11px
            semibold label · 48px tall · rounded 12px · active gets{' '}
            <code>state.activeWash</code> + <code>state.active</code> colour.
            Disabled tabs use <code>text.muted</code>. Sits under the{' '}
            <code>MobileArtboard</code> (gradient + dot grid). See{' '}
            <code>MobileSectionTabs</code> in <code>StudioPage.tsx</code>.
          </SectionMeta>
        </SectionHeader>
        {/* Bare mirror — no SurfaceCard chrome. Phone-viewport sizing is the
            only DS-specific style; everything else (MobileArtboard gradient
            + margin + border + dot grid overlay, MobileSectionTabs bottom bar
            + tab look) comes straight from StudioPage.tsx. */}
        <div style={{ maxWidth: 360, height: 320, display: 'flex', flexDirection: 'column', background: theme.colors.background.elevated, borderRadius: theme.radii.lg }}>
          <MobileArtboard>
            <MobileDotGrid />
            <span style={{ position: 'relative', zIndex: 1, fontSize: 12, color: theme.colors.text.hint, letterSpacing: '-0.01em' }}>widget preview</span>
          </MobileArtboard>
          <MobileSectionTabs>
            <MobileSectionTab $active={false} type="button"><Sparkles />Style</MobileSectionTab>
            <MobileSectionTab $active={true} type="button"><FileText />Content</MobileSectionTab>
            <MobileSectionTab $active={false} type="button"><Palette />Color</MobileSectionTab>
            <MobileSectionTab $active={false} type="button"><LayoutGrid />Layout</MobileSectionTab>
          </MobileSectionTabs>
        </div>
      </Section>

      {/* ─────── Color picker ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Color picker · swatches</SectionTitle>
          <SectionMeta>
            The grey pill row used in Studio's Customize panel: colored{' '}
            <code>ColorSwatch</code> (opens full picker on click) · mono{' '}
            <code>HexInput</code> · <code>PresetGroup</code> with tap-to-apply{' '}
            <code>ColorOption</code> chips. Imported directly from{' '}
            <code>ColorPicker.tsx</code> — editing the source updates Studio
            and this showcase together. Presets come from{' '}
            <code>themes/colors.ts</code>.
          </SectionMeta>
        </SectionHeader>

        {/* Studio's Customize panel is ~280px wide — cap rows there so the
            showcase matches the real proportions. */}
        <div style={{ maxWidth: 280 }}>
          <SectionMeta style={{ marginBottom: 10 }}>
            <strong>Primary color</strong> · picker + 3 widget color presets
          </SectionMeta>
          <FigmaColorRow>
            <ColorSwatch $color={widgetColors[1]} />
            <HexInput readOnly value={widgetColors[1].replace('#', '')} />
            <PresetGroup>
              {widgetColors.map((c, i) => (
                <ColorOption key={c} $color={c} $selected={i === 1} type="button" aria-label={c} />
              ))}
            </PresetGroup>
          </FigmaColorRow>

          <SectionMeta style={{ marginTop: 24, marginBottom: 10 }}>
            <strong>Background</strong> · picker + 3 background presets
          </SectionMeta>
          <FigmaColorRow>
            <ColorSwatch $color={backgroundColors[0]} />
            <HexInput readOnly value={backgroundColors[0].replace('#', '')} />
            <PresetGroup>
              {backgroundColors.map((c, i) => (
                <ColorOption key={c} $color={c} $selected={i === 0} type="button" aria-label={c} />
              ))}
            </PresetGroup>
          </FigmaColorRow>

          <SectionMeta style={{ marginTop: 24, marginBottom: 10 }}>
            <strong>Accent</strong> · picker + 3 soft accent presets
          </SectionMeta>
          <FigmaColorRow>
            <ColorSwatch $color={accentColors[1]} />
            <HexInput readOnly value={accentColors[1].replace('#', '')} />
            <PresetGroup>
              {accentColors.map((c, i) => (
                <ColorOption key={c} $color={c} $selected={i === 1} type="button" aria-label={c} />
              ))}
            </PresetGroup>
          </FigmaColorRow>
        </div>
      </Section>

      {/* ─────── Widget card ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Widget card</SectionTitle>
          <SectionMeta>
            Four variants used across Studio + Dashboard:{' '}
            <strong>Saved — Dashboard</strong> (Edit + Delete),{' '}
            <strong>Saved — Studio</strong> (Edit + Copy embed + Delete),{' '}
            <strong>Empty state</strong> (first-widget invite), and{' '}
            <strong>Shortcut</strong> (gradient quick-access tile).
          </SectionMeta>
        </SectionHeader>

        {/* No SurfaceCard wrappers — each variant renders bare, on the page
            background, exactly like it does inside the real Dashboard/Studio
            <Section>. Capped at 884px = real Dashboard content width
            (Container max-width 980px minus 2×48px padding) so the cards
            render at the same proportions as in production. */}
        <div style={{ maxWidth: 884 }}>
          <SectionMeta style={{ marginBottom: 10 }}>
            <strong>1a. Saved widget — Dashboard grid</strong> ·{' '}
            <code>BigCard</code> in <code>DashboardViews.tsx</code>. Edit
            (outline) + Delete (dangerStrong) only.
          </SectionMeta>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          <BigCard $index={0}>
            <BigCardPreview style={{ background: 'linear-gradient(135deg, #E8EDFF, #EEF1F5)' }}>
              <BigCardLabel>Calendar</BigCardLabel>
              <span style={{ color: '#8E8E93', fontSize: 13 }}>widget preview</span>
            </BigCardPreview>
            <BigCardBottom>
              <BigCardName>Classic Calendar</BigCardName>
              <BigCardActions>
                <Button $variant="outline" $size="sm"><Pencil /> Edit</Button>
                <Button $variant="dangerStrong" $size="sm" $iconOnly aria-label="Delete"><Trash2 /></Button>
              </BigCardActions>
            </BigCardBottom>
          </BigCard>
          <BigCard $index={1}>
            <BigCardPreview style={{ background: 'linear-gradient(135deg, #FFE8DE, #FFF1EA)' }}>
              <BigCardLabel>Clock</BigCardLabel>
              <span style={{ color: '#8E8E93', fontSize: 13 }}>widget preview</span>
            </BigCardPreview>
            <BigCardBottom>
              <BigCardName>Dreamy Clock</BigCardName>
              <BigCardActions>
                <Button $variant="outline" $size="sm"><Pencil /> Edit</Button>
                <Button $variant="dangerStrong" $size="sm" $iconOnly aria-label="Delete"><Trash2 /></Button>
              </BigCardActions>
            </BigCardBottom>
          </BigCard>
        </div>

        <SectionMeta style={{ marginTop: 28, marginBottom: 10 }}>
          <strong>1b. Saved widget — Studio grid</strong> ·{' '}
          <code>WidgetCard</code> in <code>StudioPage.tsx</code>. Edit
          (primary) + <strong>Copy embed URL</strong> (outline → successSoft ✓
          on click) + Delete (danger, pushed right via{' '}
          <code>marginLeft: auto</code>).
        </SectionMeta>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          <WidgetCard $i={0}>
            <WidgetPreviewWrap style={{ background: 'linear-gradient(135deg, #E8EDFF, #EEF1F5)' }}>
              <OverlayBadge $tone="accent">Calendar</OverlayBadge>
              <span style={{ color: '#8E8E93', fontSize: 13 }}>widget preview</span>
            </WidgetPreviewWrap>
            <WidgetBottom>
              <WidgetName>Classic Calendar</WidgetName>
              <WidgetActions>
                <Button $variant="primary" $size="sm"><Pencil /> Edit</Button>
                <Button $variant="outline" $size="sm" $iconOnly aria-label="Copy embed URL" title="Copy embed URL"><Copy /></Button>
                <Button $variant="danger" $size="sm" $iconOnly aria-label="Delete" style={{ marginLeft: 'auto' }}><Trash2 /></Button>
              </WidgetActions>
            </WidgetBottom>
          </WidgetCard>
          <WidgetCard $i={1}>
            <WidgetPreviewWrap style={{ background: 'linear-gradient(135deg, #FFE8DE, #FFF1EA)' }}>
              <OverlayBadge $tone="accent">Clock</OverlayBadge>
              <span style={{ color: '#8E8E93', fontSize: 13 }}>widget preview</span>
            </WidgetPreviewWrap>
            <WidgetBottom>
              <WidgetName>Dreamy Clock</WidgetName>
              <WidgetActions>
                <Button $variant="primary" $size="sm"><Pencil /> Edit</Button>
                <Button $variant="successSoft" $size="sm" $iconOnly aria-label="Copied" title="Copied!"><Check /></Button>
                <Button $variant="danger" $size="sm" $iconOnly aria-label="Delete" style={{ marginLeft: 'auto' }}><Trash2 /></Button>
              </WidgetActions>
            </WidgetBottom>
          </WidgetCard>
        </div>

        <SectionMeta style={{ marginTop: 28, marginBottom: 10 }}>
          <strong>2. Empty state</strong> — rendered bare just like in the real
          Dashboard <code>&lt;Section&gt;</code>, no extra surface wrapper. When
          a user has zero saved widgets, this appears in place of the widget grid.
        </SectionMeta>
        <EmptyBox>
          <EmptyCircle><Sparkles /></EmptyCircle>
          <EmptyTitle>Create your first widget</EmptyTitle>
          <EmptyHint>Browse widget styles and customize</EmptyHint>
        </EmptyBox>

        <SectionMeta style={{ marginTop: 28, marginBottom: 10 }}>
          <strong>3. Shortcut</strong> — exactly the grid layout prod uses on
          the Dashboard overview:{' '}
          <code>{"<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>"}</code>.
          No SurfaceCard wrapper.
        </SectionMeta>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <CreateCard $bg="linear-gradient(135deg, rgba(237,228,255,0.5) 0%, rgba(232,237,255,0.35) 100%)">
            <CreateIconWrap $color="#6366F1"><CalIcon /></CreateIconWrap>
            <CreateCardText>
              <CreateCardTitle>Explore Widgets</CreateCardTitle>
              <CreateCardHint>Browse and customize styles</CreateCardHint>
            </CreateCardText>
          </CreateCard>
          <CreateCard $bg="linear-gradient(135deg, rgba(255,240,245,0.5) 0%, rgba(252,228,236,0.35) 100%)">
            <CreateIconWrap $color="#EC4899"><ImgIcon /></CreateIconWrap>
            <CreateCardText>
              <CreateCardTitle>My Templates</CreateCardTitle>
              <CreateCardHint>Purchases and downloads</CreateCardHint>
            </CreateCardText>
          </CreateCard>
        </div>
        </div>
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

          <VariantLabel style={{ marginTop: 24 }}>Tag — inline metadata chip (subtle, lowercase)</VariantLabel>
          <Row>
            <Tag>Productivity</Tag>
            <Tag>Notion</Tag>
            <Tag>Planners</Tag>
            <Tag>Student</Tag>
          </Row>

          <VariantLabel style={{ marginTop: 24 }}>OverlayBadge — glass chip on card art (top-left)</VariantLabel>
          <SectionMeta style={{ marginBottom: 12, fontSize: 13 }}>
            Two tones: <code>neutral</code> (dark text, used for template "New" /
            "Popular" markers) and <code>accent</code> (indigo + semibold, used
            for widget-type tags on <code>/studio</code> and <code>/widgets</code>
            — "Calendar", "Clock", "Board").
          </SectionMeta>
          <Row>
            <div style={{ position: 'relative', width: 180, height: 100, borderRadius: 12, background: 'linear-gradient(135deg, #E8D5FF, #FFD0E8)' }}>
              <OverlayBadge>New</OverlayBadge>
            </div>
            <div style={{ position: 'relative', width: 180, height: 100, borderRadius: 12, background: 'linear-gradient(135deg, #D5E5FF, #E8FFE8)' }}>
              <OverlayBadge>Popular</OverlayBadge>
            </div>
            <div style={{ position: 'relative', width: 180, height: 100, borderRadius: 12, background: '#FAFAF9' }}>
              <OverlayBadge $tone="accent">Calendar</OverlayBadge>
            </div>
            <div style={{ position: 'relative', width: 180, height: 100, borderRadius: 12, background: '#FAFAF9' }}>
              <OverlayBadge $tone="accent">Clock</OverlayBadge>
            </div>
            <div style={{ position: 'relative', width: 180, height: 100, borderRadius: 12, background: '#FAFAF9' }}>
              <OverlayBadge $tone="accent">Board</OverlayBadge>
            </div>
          </Row>
        </SurfaceCard>
      </Section>

      {/* ─────── Modals — live demos (1-to-1 with production) ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Modals</SectionTitle>
          <SectionMeta>
            Every dialog that ships on the site — click to open the real modal.
            All use the shared <code>&lt;Modal&gt;</code> shell with identical spacing,
            radii, and button patterns. Forms live inside, close on ESC / backdrop click.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <Row>
            <Button $variant="outline" $size="md" onClick={() => setOpenModal('deleteWidget')}>
              <Trash2 /> Delete widget
            </Button>
            <Button $variant="outline" $size="md" onClick={() => { setDemoWidgetName(''); setOpenModal('nameWidget'); }}>
              <Plus /> Name your widget
            </Button>
            <Button $variant="outline" $size="md" onClick={() => { setDemoPwSuccess(false); setOpenModal('changePassword'); }}>
              <Lock /> Change password
            </Button>
            <Button $variant="outline" $size="md" onClick={() => { setDemoResetSent(false); setDemoResetEmail(''); setOpenModal('resetPassword'); }}>
              <Mail /> Reset password
            </Button>
            <Button $variant="outline" $size="md" onClick={() => { setDemoDeleteConfirm(''); setOpenModal('deleteAccount'); }}>
              <Trash2 /> Delete account
            </Button>
            <Button $variant="accent" $size="md" onClick={() => setOpenModal('upgrade')}>
              <Sparkles /> Upgrade to Pro
            </Button>
          </Row>
        </SurfaceCard>
      </Section>

      {/* ─────── Modal instances — rendered once at page level ─────── */}

      {/* 1. Delete widget — StudioPage */}
      <Modal
        open={openModal === 'deleteWidget'}
        onClose={closeModal}
        eyebrow="Delete widget"
        eyebrowTone="danger"
        title='Delete "Content calendar"?'
        size="sm"
        hideClose
      >
        <ModalBodyText>
          The embed URL will stop working immediately. This can&apos;t be undone.
        </ModalBodyText>
        <ModalFooter>
          <Button type="button" $variant="outline" $size="lg" onClick={closeModal}>Cancel</Button>
          <Button type="button" $variant="dangerStrong" $size="lg" onClick={closeModal}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* 2. Name your widget — WidgetStudioPage */}
      <Modal
        open={openModal === 'nameWidget'}
        onClose={closeModal}
        eyebrow="New calendar"
        title="Name your widget"
        size="sm"
        hideClose
      >
        <ModalTextInput
          autoFocus
          value={demoWidgetName}
          onChange={(e) => setDemoWidgetName(e.target.value)}
          placeholder="Classic Calendar"
        />
        <ModalFooter>
          <Button type="button" $variant="outline" $size="lg" onClick={closeModal}>Cancel</Button>
          <Button type="button" $variant="primary" $size="lg" onClick={closeModal}>Create &amp; Edit</Button>
        </ModalFooter>
      </Modal>

      {/* 3. Change password — SettingsPage (shows success state on "save") */}
      <Modal
        open={openModal === 'changePassword'}
        onClose={closeModal}
        eyebrow="Account security"
        title={demoPwSuccess ? 'Password updated' : 'Change password'}
        size="sm"
        hideClose
      >
        {demoPwSuccess ? (
          <>
            <ModalBodyText>
              You can use your new password the next time you sign in with email.
              Other devices where you were signed in have been logged out.
            </ModalBodyText>
            <Button $variant="primary" $size="lg" $fullWidth onClick={closeModal}>Done</Button>
          </>
        ) : (
          <>
            <ModalBodyText>Choose a strong password you haven&apos;t used before.</ModalBodyText>
            <ModalInputRow>
              <ModalTextInput type="password" placeholder="Current password" />
            </ModalInputRow>
            <ModalInputRow>
              <ModalTextInput type="password" placeholder="New password" />
            </ModalInputRow>
            <ModalInputRow>
              <ModalTextInput type="password" placeholder="Confirm new password" />
            </ModalInputRow>
            <ModalFooter>
              <Button type="button" $variant="outline" $size="lg" onClick={closeModal}>Cancel</Button>
              <Button type="button" $variant="primary" $size="lg" onClick={() => setDemoPwSuccess(true)}>Save password</Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* 4. Reset password — LoginPage (inline helper instead of banner) */}
      <Modal
        open={openModal === 'resetPassword'}
        onClose={closeModal}
        eyebrow="Account recovery"
        title={demoResetSent ? 'Check your email' : 'Reset your password'}
        size="sm"
        hideClose
      >
        {demoResetSent ? (
          <>
            <ModalBodyText>
              If an account exists for <strong>{demoResetEmail || 'you@peachy.studio'}</strong>, we sent a password reset link.
              Click the link in the email to set a new password.
            </ModalBodyText>
            <ModalFooter>
              <Button $variant="primary" $size="lg" $fullWidth onClick={closeModal}>Done</Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalTextInput
              type="email"
              placeholder="you@peachy.studio"
              value={demoResetEmail}
              onChange={(e) => setDemoResetEmail(e.target.value)}
              autoFocus
            />
            <ModalHint>
              Signed up with Google? Use{' '}
              <Button type="button" $variant="link" $size="sm" onClick={closeModal}>Continue with Google</Button>{' '}
              on the login page.
            </ModalHint>
            <ModalFooter>
              <Button type="button" $variant="outline" $size="lg" onClick={closeModal}>Cancel</Button>
              <Button type="button" $variant="primary" $size="lg" onClick={() => setDemoResetSent(true)}>Send reset link</Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* 5. Delete account — SettingsPage (type-to-confirm) */}
      <Modal
        open={openModal === 'deleteAccount'}
        onClose={closeModal}
        eyebrow="Danger zone"
        eyebrowTone="danger"
        title="Delete account?"
        size="sm"
        hideClose
      >
        <ModalBodyText>
          We&apos;ll permanently remove your profile and all saved widgets.
          You can always sign up again later with the same email.
          To confirm, please type <strong>delete</strong> below.
        </ModalBodyText>
        <ModalTextInput
          type="text"
          autoFocus
          value={demoDeleteConfirm}
          onChange={(e) => setDemoDeleteConfirm(e.target.value)}
          placeholder='Type "delete" to confirm'
        />
        <ModalFooter>
          <Button type="button" $variant="outline" $size="lg" onClick={closeModal}>Cancel</Button>
          <Button
            type="button"
            $variant="dangerStrong"
            $size="lg"
            disabled={demoDeleteConfirm.trim().toLowerCase() !== 'delete'}
            onClick={closeModal}
          >
            Delete forever
          </Button>
        </ModalFooter>
      </Modal>

      {/* 6. Upgrade to Pro — simplified inline (real one lives in UpgradeModal.tsx) */}
      <Modal
        open={openModal === 'upgrade'}
        onClose={closeModal}
        eyebrow="Peachy Pro"
        title="Upgrade to Pro"
        subtitle="Unlimited widgets, priority support, and every template."
        size="md"
        hideClose
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <UpgradeBullet><Check /> Unlimited saved widgets</UpgradeBullet>
          <UpgradeBullet><Check /> Every template included</UpgradeBullet>
          <UpgradeBullet><Check /> Priority support · early features</UpgradeBullet>
        </div>
        <ModalFooter>
          <Button type="button" $variant="ghost" $size="lg" onClick={closeModal}>Maybe later</Button>
          <Button type="button" $variant="accent" $size="lg" onClick={closeModal}>
            <Sparkles /> Upgrade — $4.99/mo
          </Button>
        </ModalFooter>
      </Modal>

      {/* ─────── Colors · gradients · glass ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Colors · gradients · glass</SectionTitle>
          <SectionMeta>
            Every swatch below comes straight from <code>theme.ts</code>.
            Edit a token → the whole app updates. Hex is shown so you can
            eyeball; semantic name is what you reach for in code.
          </SectionMeta>
        </SectionHeader>

        <SubTitle>Brand · accent</SubTitle>
        <SwatchGrid>
          <Swatch $bg="#6366F1"><SwName>accent</SwName><SwHex>#6366F1</SwHex></Swatch>
          <Swatch $bg="#4F46E5"><SwName>brand.indigoDark</SwName><SwHex>#4F46E5</SwHex></Swatch>
        </SwatchGrid>

        <SubTitle style={{ marginTop: 24 }}>Text</SubTitle>
        <SwatchGrid>
          <Swatch $bg="#1F1F1F"><SwName>text.primary</SwName><SwHex>#1F1F1F</SwHex></Swatch>
          <Swatch $bg="#555555"><SwName>text.body</SwName><SwHex>#555555</SwHex></Swatch>
          <Swatch $bg="#777777"><SwName>text.hint</SwName><SwHex>#777777</SwHex></Swatch>
          <Swatch $bg="#8E8E93"><SwName>text.tertiary</SwName><SwHex>#8E8E93</SwHex></Swatch>
          <Swatch $bg="#C7C7CC"><SwName>text.muted</SwName><SwHex>#C7C7CC</SwHex></Swatch>
          <Swatch $bg="#FFFFFF" $light><SwName>text.inverse</SwName><SwHex>#FFFFFF</SwHex></Swatch>
        </SwatchGrid>

        <SubTitle style={{ marginTop: 24 }}>Background · surface</SubTitle>
        <SwatchGrid>
          <Swatch $bg="#FFFFFF" $light><SwName>background.elevated</SwName><SwHex>#FFFFFF</SwHex></Swatch>
          <Swatch $bg="#FAFAFA" $light><SwName>background.surfaceAlt</SwName><SwHex>#FAFAFA</SwHex></Swatch>
          <Swatch $bg="#F5F5F5" $light><SwName>background.surfaceMuted</SwName><SwHex>#F5F5F5</SwHex></Swatch>
          <Swatch $bg="#F2F2F7" $light><SwName>background.surface</SwName><SwHex>#F2F2F7</SwHex></Swatch>
        </SwatchGrid>

        <SubTitle style={{ marginTop: 24 }}>Semantic · status</SubTitle>
        <SwatchGrid>
          <Swatch $bg="#3384F4"><SwName>state.active</SwName><SwHex>#3384F4</SwHex></Swatch>
          <Swatch $bg="#22C55E"><SwName>success.base</SwName><SwHex>#22C55E</SwHex></Swatch>
          <Swatch $bg="#16A34A"><SwName>success.fg</SwName><SwHex>#16A34A</SwHex></Swatch>
          <Swatch $bg="#15803D"><SwName>success.dark</SwName><SwHex>#15803D</SwHex></Swatch>
          <Swatch $bg="#92400E"><SwName>warning.text</SwName><SwHex>#92400E</SwHex></Swatch>
          <Swatch $bg="#F49B8B"><SwName>danger.soft</SwName><SwHex>#F49B8B</SwHex></Swatch>
          <Swatch $bg="#DC2828"><SwName>danger.strong</SwName><SwHex>#DC2828</SwHex></Swatch>
        </SwatchGrid>

        <SubTitle style={{ marginTop: 24 }}>Peach · warm palette</SubTitle>
        <SectionMeta style={{ fontSize: 12, marginBottom: 12 }}>
          Only for <code>/widgets</code> landing (WidgetStudioPage).
          Do NOT use in app-internal UI.
        </SectionMeta>
        <SwatchGrid>
          <Swatch $bg="#2B2320"><SwName>peach.deep</SwName><SwHex>#2B2320</SwHex></Swatch>
          <Swatch $bg="#9B9790"><SwName>peach.muted</SwName><SwHex>#9B9790</SwHex></Swatch>
          <Swatch $bg="#B5B1A9"><SwName>peach.hint</SwName><SwHex>#B5B1A9</SwHex></Swatch>
        </SwatchGrid>

        <SubTitle style={{ marginTop: 24 }}>Gradients</SubTitle>
        <GradientGrid>
          <GradSwatch $bg="linear-gradient(135deg, #6366F1, #818CF8)"><SwNameLight>gradients.indigo</SwNameLight></GradSwatch>
          <GradSwatch $bg="linear-gradient(135deg, #3384F4, #5BA0F7)"><SwNameLight>gradients.blue</SwNameLight></GradSwatch>
          <GradSwatch $bg="linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%), #FFF"><SwNameDark>gradients.softBanner</SwNameDark></GradSwatch>
          <GradSwatch $bg="linear-gradient(150deg, rgba(237, 228, 255, 0.7) 0%, rgba(232, 237, 255, 0.65) 25%, rgba(238, 234, 255, 0.6) 50%, rgba(245, 235, 250, 0.65) 75%, rgba(255, 240, 245, 0.7) 100%), #FFF"><SwNameDark>gradients.softBannerLarge</SwNameDark></GradSwatch>
          <GradSwatch $bg="linear-gradient(135deg, #FFD4BE 0%, #FDB8AE 45%, #F8A2B0 100%)"><SwNameLight>gradients.avatarPeach</SwNameLight></GradSwatch>
        </GradientGrid>

        <SubTitle style={{ marginTop: 24 }}>Glass surface</SubTitle>
        <SectionMeta style={{ fontSize: 12, marginBottom: 12 }}>
          Semi-transparent white + <code>backdrop-filter: blur(20px)</code>.
          Used for the cookie banner and floating toolbars.
        </SectionMeta>
        <GlassCheckerboard>
          <GlassSwatch $bg="rgba(255, 255, 255, 0.94)"><SwNameDark>background.glassBright</SwNameDark><SwHexDark>rgba(255,255,255,.94) + blur</SwHexDark></GlassSwatch>
        </GlassCheckerboard>
      </Section>

      {/* ─────── Radii ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Radii</SectionTitle>
          <SectionMeta>
            Corner-rounding scale. All multiples of 4, except <code>full</code>
            (for pills / avatars). One edit in <code>theme.radii</code>
            rounds the whole site to match. Source: <code>theme.ts</code>.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <RadiiGrid>
            <RadiusTile $r="4px"><RadiusName>radii.xs</RadiusName><RadiusPx>4px</RadiusPx></RadiusTile>
            <RadiusTile $r="8px"><RadiusName>radii.sm</RadiusName><RadiusPx>8px</RadiusPx></RadiusTile>
            <RadiusTile $r="12px"><RadiusName>radii.md</RadiusName><RadiusPx>12px · default</RadiusPx></RadiusTile>
            <RadiusTile $r="16px"><RadiusName>radii.lg</RadiusName><RadiusPx>16px · cards</RadiusPx></RadiusTile>
            <RadiusTile $r="20px"><RadiusName>radii.xl</RadiusName><RadiusPx>20px · large cards</RadiusPx></RadiusTile>
            <RadiusTile $r="24px"><RadiusName>radii[&apos;2xl&apos;]</RadiusName><RadiusPx>24px · hero</RadiusPx></RadiusTile>
            <RadiusTile $r="28px"><RadiusName>radii[&apos;3xl&apos;]</RadiusName><RadiusPx>28px · carousel</RadiusPx></RadiusTile>
            <RadiusTile $r="9999px"><RadiusName>radii.full</RadiusName><RadiusPx>pill · avatar</RadiusPx></RadiusTile>
          </RadiiGrid>
        </SurfaceCard>
      </Section>

      {/* ─────── Shadows ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Shadows</SectionTitle>
          <SectionMeta>
            Elevation scale. From hairline to modal overlay.
            Edit <code>theme.shadows.*</code> to restyle every shadow on the site.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <ShadowGrid>
            <ShadowTile $s="0 0.5px 1px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.03)"><ShadowName>form</ShadowName><ShadowHint>inputs · pills</ShadowHint></ShadowTile>
            <ShadowTile $s="0 1px 2px rgba(0, 0, 0, 0.02)"><ShadowName>cardFlat</ShadowName><ShadowHint>flat sections</ShadowHint></ShadowTile>
            <ShadowTile $s="0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.02)"><ShadowName>subtle</ShadowName><ShadowHint>light elevation</ShadowHint></ShadowTile>
            <ShadowTile $s="0 2px 12px rgba(0, 0, 0, 0.03)"><ShadowName>card</ShadowName><ShadowHint>default card</ShadowHint></ShadowTile>
            <ShadowTile $s="0 4px 20px rgba(0, 0, 0, 0.05)"><ShadowName>cardHover</ShadowName><ShadowHint>card · hover</ShadowHint></ShadowTile>
            <ShadowTile $s="0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)"><ShadowName>tab</ShadowName><ShadowHint>segment tabs</ShadowHint></ShadowTile>
            <ShadowTile $s="0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.02)"><ShadowName>medium</ShadowName><ShadowHint>mid elevation</ShadowHint></ShadowTile>
            <ShadowTile $s="0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)"><ShadowName>popover</ShadowName><ShadowHint>dropdowns</ShadowHint></ShadowTile>
            <ShadowTile $s="0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)"><ShadowName>floating</ShadowName><ShadowHint>toolbars · cookie</ShadowHint></ShadowTile>
            <ShadowTile $s="0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.04)"><ShadowName>heavy</ShadowName><ShadowHint>strong elevation</ShadowHint></ShadowTile>
            <ShadowTile $s="0 32px 80px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06)"><ShadowName>modal</ShadowName><ShadowHint>dialogs</ShadowHint></ShadowTile>
            <ShadowTile $s="0 -8px 40px rgba(0, 0, 0, 0.1)"><ShadowName>sheet</ShadowName><ShadowHint>mobile drawer (up)</ShadowHint></ShadowTile>
            <ShadowTile $s="0 0 0 3px rgba(51, 132, 244, 0.1)"><ShadowName>focusBlue</ShadowName><ShadowHint>input focus ring</ShadowHint></ShadowTile>
          </ShadowGrid>

          <VariantLabel style={{ marginTop: 24 }}>Color-tinted (for accent buttons / brand CTAs)</VariantLabel>
          <ShadowGrid>
            <ShadowTile $s="0 1px 4px rgba(99, 102, 241, 0.25)"><ShadowName>accentShadow.sm</ShadowName><ShadowHint>indigo · sm</ShadowHint></ShadowTile>
            <ShadowTile $s="0 2px 8px rgba(99, 102, 241, 0.25)"><ShadowName>accentShadow.md</ShadowName><ShadowHint>indigo · md</ShadowHint></ShadowTile>
            <ShadowTile $s="0 8px 24px rgba(99, 102, 241, 0.35)"><ShadowName>accentShadow.lg</ShadowName><ShadowHint>indigo · lg</ShadowHint></ShadowTile>
            <ShadowTile $s="0 2px 8px rgba(51, 132, 244, 0.3)"><ShadowName>blueShadow.md</ShadowName><ShadowHint>state.active glow</ShadowHint></ShadowTile>
            <ShadowTile $s="0 2px 8px rgba(34, 197, 94, 0.3)"><ShadowName>successShadow.md</ShadowName><ShadowHint>success glow</ShadowHint></ShadowTile>
          </ShadowGrid>
        </SurfaceCard>
      </Section>

      {/* ─────── Transitions ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Transitions</SectionTitle>
          <SectionMeta>
            Motion timings. Hover a tile to see its curve — each box
            nudges + colour-shifts with the named transition. Keep timings
            consistent: pick the closest preset instead of writing custom.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <TransitionGrid>
            <TransitionTile $t="0.15s ease"><TransitionName>fast</TransitionName><TransitionHint>0.15s ease · micro hover</TransitionHint></TransitionTile>
            <TransitionTile $t="0.2s ease"><TransitionName>medium</TransitionName><TransitionHint>0.2s ease · mid hover</TransitionHint></TransitionTile>
            <TransitionTile $t="0.25s ease"><TransitionName>base</TransitionName><TransitionHint>0.25s ease · default</TransitionHint></TransitionTile>
            <TransitionTile $t="0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"><TransitionName>smooth</TransitionName><TransitionHint>0.35s · gentle slide</TransitionHint></TransitionTile>
            <TransitionTile $t="0.28s cubic-bezier(0.22, 1, 0.36, 1)"><TransitionName>spring</TransitionName><TransitionHint>0.28s spring · punchy pop</TransitionHint></TransitionTile>
          </TransitionGrid>
        </SurfaceCard>
      </Section>

      {/* ─────── Surfaces, panels & composition ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Surfaces, panels &amp; composition</SectionTitle>
          <SectionMeta>
            Floating + inline surfaces that sit on top of the page — cookie
            consent, email verification, soft upsell banners, toast. All
            token-driven; edit <code>theme.colors.*</code> or per-component
            tokens to restyle site-wide.
          </SectionMeta>
        </SectionHeader>
        <SurfaceCard>
          <VariantLabel>Cookie consent — floating, slide-up (from <code>ConsentBanner.tsx</code>)</VariantLabel>
          {/* Rendered inline for preview — the real banner uses position:fixed
              and auto-hides via localStorage once accepted. Styled bits
              imported directly from ConsentBanner.tsx — 1-to-1 mirror. */}
          <ConsentBannerWrap role="dialog" aria-label="Cookie consent preview" style={{ position: 'static', transform: 'none', left: 'auto', bottom: 'auto', animation: 'none' }}>
            <ConsentBannerIcon><Cookie /></ConsentBannerIcon>
            <ConsentBannerMessage>
              We use cookies to keep you signed in and save your preferences. By continuing,
              you agree to our <ConsentBannerPrivacyLink to="/privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</ConsentBannerPrivacyLink>.
            </ConsentBannerMessage>
            <ConsentBannerActions>
              <Button $variant="primary" $size="sm">Accept</Button>
            </ConsentBannerActions>
          </ConsentBannerWrap>

          <VariantLabel style={{ marginTop: 28 }}>Email verification — amber card (<code>EmailVerificationBanner.tsx</code>)</VariantLabel>
          <EmailVerificationBar role="status">
            <EmailVerificationIcon><ShieldCheck /></EmailVerificationIcon>
            <EmailVerificationBody>
              <EmailVerificationTitle>Verify your email</EmailVerificationTitle>
              <EmailVerificationSub>Needed to save widgets and publish embeds.</EmailVerificationSub>
            </EmailVerificationBody>
            <EmailVerificationActions>
              <EmailVerificationResendBtn type="button">Resend link</EmailVerificationResendBtn>
              <EmailVerificationCloseBtn type="button" aria-label="Dismiss">
                <X />
              </EmailVerificationCloseBtn>
            </EmailVerificationActions>
          </EmailVerificationBar>

          <VariantLabel style={{ marginTop: 28 }}>
            Subtle · indigo — primary upsell row
          </VariantLabel>
          <GradientBanner $tone="indigo">
            <BannerIcon $tone="indigo" $emphasis="subtle"><Sparkles /></BannerIcon>
            <BannerBody>
              <BannerTitle>Go unlimited with Peachy Pro</BannerTitle>
              <BannerText>You've reached the free limit · 3 of 3 used</BannerText>
            </BannerBody>
            <BannerActions>
              <Button $variant="ghost" $size="sm">Later</Button>
              <Button $variant="accent" $size="sm"><Sparkles /> Upgrade</Button>
            </BannerActions>
          </GradientBanner>

          <VariantLabel style={{ marginTop: 24 }}>
            Strong · indigo — hero CTA banner
          </VariantLabel>
          <GradientBanner $tone="indigo" $emphasis="strong">
            <BannerIcon $tone="indigo" $emphasis="strong"><BadgePercent /></BannerIcon>
            <BannerBody>
              <BannerTitle>Annual billing — save 20%</BannerTitle>
              <BannerText>$80/year instead of $108 · cancel anytime</BannerText>
            </BannerBody>
            <BannerActions>
              <Button $variant="ghost" $size="sm">Not now</Button>
              <Button $variant="primary" $size="sm">Switch plan</Button>
            </BannerActions>
          </GradientBanner>

          <VariantLabel style={{ marginTop: 24 }}>
            Info rows — neutral white card, colored icon only ·{' '}
            <code>InfoBanner.tsx</code>
          </VariantLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoBanner>
              <InfoBannerIcon $tone="blue"><Link2 /></InfoBannerIcon>
              <InfoBannerBody>
                <InfoBannerTitle>Embed code copied</InfoBannerTitle>
                <InfoBannerSub>Paste into Notion with /embed</InfoBannerSub>
              </InfoBannerBody>
            </InfoBanner>
            <InfoBanner>
              <InfoBannerIcon $tone="sage"><Check /></InfoBannerIcon>
              <InfoBannerBody>
                <InfoBannerTitle>Widget saved</InfoBannerTitle>
                <InfoBannerSub>Synced to your account</InfoBannerSub>
              </InfoBannerBody>
            </InfoBanner>
            <InfoBanner>
              <InfoBannerIcon $tone="mute"><Clock /></InfoBannerIcon>
              <InfoBannerBody>
                <InfoBannerTitle>Heads up, Notion caches for ~5 min</InfoBannerTitle>
                <InfoBannerSub>Changes may take a moment to appear in your page</InfoBannerSub>
              </InfoBannerBody>
            </InfoBanner>
          </div>

          <VariantLabel style={{ marginTop: 28 }}>Toast — transient success pill (used in Studio on copy)</VariantLabel>
          {/* Rendered inline for preview — the real toast uses position:fixed. */}
          <ToastShell $tone="success" style={{ position: 'static', transform: 'none', left: 'auto', bottom: 'auto' }}>
            <ToastIconBubble $tone="success"><Check /></ToastIconBubble>
            <ToastMessage>Embed URL copied</ToastMessage>
          </ToastShell>
        </SurfaceCard>
      </Section>

      {/* ─────── Layout: Site chrome ─────── */}
      <Section>
        <SectionHeader>
          <SectionTitle>Site chrome — TopNav + footers</SectionTitle>
          <SectionMeta>
            <code>components/layout/TopNav.tsx</code> auto-renders on every page;
            <code>components/landing/BigFooter.tsx</code> is the primary site footer;
            <code>shared/Footer.tsx</code> is the minimal footer used on legal/auth pages.
          </SectionMeta>
        </SectionHeader>

        {/* TopNav preview — shown in a bounded frame so the fixed nav
            doesn't overlay the showcase. */}
        <div style={{ position: 'relative', height: 96, marginBottom: 24, border: `1px solid ${theme.colors.border.hairline}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(0)' }}>
            <TopNav activeLink="studio" logoSub="Studio" />
          </div>
        </div>

        <SubTitle>BigFooter — primary site footer</SubTitle>
        <SurfaceCard style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <BigFooter onNavigate={() => { /* preview — no nav */ }} noDivider />
        </SurfaceCard>

        <SubTitle>Footer — minimal (auth / legal pages)</SubTitle>
        <SurfaceCard style={{ padding: 0, overflow: 'hidden' }}>
          <Footer />
        </SurfaceCard>
      </Section>

      {/* Product cards are not showcased here: they auto-render from
          `src/presentation/data/templates.ts` via the shared
          `TemplateMockupCard` primitive. To add a new product, add one
          entry to that file — it appears on landing, /templates,
          Related rail, and the detail carousel with zero extra work. */}

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
    successSoft: 'Soft sage · reversible confirm (Copied)',
    link: 'Underline on hover',
  };
  return blurbs[v] || '';
}

const FormControlsDemo: React.FC = () => {
  const [dayGrid, setDayGrid] = useState(true);
  const [weekStart, setWeekStart] = useState<'monday' | 'sunday'>('monday');
  const [urlText, setUrlText] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [embedWidth, setEmbedWidth] = useState(420);
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

      <VariantLabel style={{ marginTop: 20 }}>Native Select — used in CustomizationPanel + sort dropdowns</VariantLabel>
      <DemoSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="alpha">A → Z</option>
      </DemoSelect>

      <VariantLabel style={{ marginTop: 20 }}>Range slider — used for embed width / height</VariantLabel>
      <ToggleRow as="div">
        <ToggleLabel>Width · <code style={{ fontFamily: 'inherit' }}>{embedWidth}px</code></ToggleLabel>
        <DemoRange
          type="range"
          min={200}
          max={800}
          step={10}
          value={embedWidth}
          onChange={(e) => setEmbedWidth(Number(e.target.value))}
        />
      </ToggleRow>

      <VariantLabel style={{ marginTop: 20 }}>Divider — section separator (via <code>DropdownDivider</code> or hairline rule)</VariantLabel>
      <DemoDivider />

      <VariantLabel style={{ marginTop: 20 }}>Not built as shared yet</VariantLabel>
      <MissingList>
        <li><strong>Textarea</strong> — only used in dev-tooling (<code>ClaudeFeedback</code>). If user-facing feedback/comments land, add a shared <code>&lt;Textarea&gt;</code> then.</li>
        <li><strong>Checkbox</strong> — we ship <code>&lt;Switch&gt;</code> everywhere instead. If a multi-select list needs checkboxes, add one to <code>shared/</code>.</li>
      </MissingList>
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
  background: ${({ theme }) => theme.colors.background.elevated};
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
  border-radius: ${({ theme }) => theme.radii.sm};
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
    border-radius: ${({ theme }) => theme.radii.sm};
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

/* ── Typography showcase ──
   Reads live from theme.typography so a token change updates the page
   without editing this file. */
const FontFamilyRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const FontFamilyTile = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const FontFamilyName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 0;
`;

const FontFamilyStack = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 4px 0 16px;
`;

const FontFamilySample = styled.div<{ $mono: boolean }>`
  font-family: ${({ $mono, theme }) =>
    $mono ? theme.typography.fonts.mono : theme.typography.fonts.primary};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  letter-spacing: ${({ $mono }) => ($mono ? '0' : '-0.01em')};
`;

const TypeScaleTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeScaleRow = styled.div`
  display: grid;
  grid-template-columns: 72px 72px minmax(0, 1fr) 260px;
  align-items: baseline;
  gap: 20px;
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

  &:first-child {
    border-top: none;
  }

  @media (max-width: 860px) {
    grid-template-columns: 64px 64px minmax(0, 1fr);
    & > :nth-child(4) { display: none; }
  }
`;

const TypeScaleName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
`;

const TypeScaleValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TypeScaleSample = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.15;
  letter-spacing: -0.01em;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const TypeScaleUsage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
`;

/* ── Text style recipes ── */
const TextStyleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextStyleTile = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  padding: 18px 20px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TextStyleMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const TextStyleName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.005em;
`;

const TextStyleUsageHint = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};

  code {
    font-family: ${({ theme }) => theme.typography.fonts.mono};
    font-size: 11px;
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 3px 8px;
    border-radius: ${({ theme }) => theme.radii.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const TextStyleCode = styled.div`
  margin-top: 6px;
  display: inline-block;
  padding: 4px 10px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.primary};
  width: fit-content;
`;

const TextStyleSpec = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
`;

const SpecPill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TextStyleZones = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
`;

const TextStyleZonesLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-right: 4px;
`;

const TextStyleZonePill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.body};
  letter-spacing: 0.02em;
`;

/* ── Modal demo helpers ── */
const ModalBodyText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;
  margin: 0 0 16px;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
  }
`;

const ModalInputRow = styled.div`
  margin-bottom: 12px;
`;

/* Mirror of the production `NameModalInput` in WidgetStudioPage.tsx.
   Keep these two in sync — same 46px height, same focus ring. */
const ModalTextInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  outline: none;
  box-sizing: border-box;
  transition: border-color ${({ theme }) => theme.transitions.fast}, background ${({ theme }) => theme.transitions.fast};

  &::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const ModalHint = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;
  margin: 12px 0 0;
`;

/* ── Color swatches (palette / gradients / glass showcase) ── */
const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 10px;
`;

const Swatch = styled.div<{ $bg: string; $light?: boolean }>`
  padding: 14px 14px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  color: ${({ $light, theme }) => ($light ? theme.colors.text.primary : theme.colors.text.inverse)};
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SwName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
`;

const SwHex = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 10px;
  opacity: 0.75;
  margin-top: 2px;
  letter-spacing: 0;
`;

const SwNameLight = styled(SwName)`
  color: ${({ theme }) => theme.colors.text.inverse};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
`;

const SwNameDark = styled(SwName)`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SwHexDark = styled(SwHex)`
  color: ${({ theme }) => theme.colors.text.body};
`;

const GradientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const GradSwatch = styled.div<{ $bg: string }>`
  padding: 20px 16px 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

/* Checkered bg so semi-transparent glass is visibly transparent. */
const GlassCheckerboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.background.surfaceAlt};
  background-image:
    linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(236, 72, 153, 0.12) 50%, rgba(255, 214, 196, 0.14) 100%),
    repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%);
  background-size: cover, 24px 24px;
`;

const GlassSwatch = styled.div<{ $bg: string }>`
  padding: 18px 16px 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $bg }) => $bg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

/* ── Surfaces & panels previews ── */
/* ── Form elements — additional primitives ── */
const DemoSelect = styled.select`
  height: 40px;
  padding: 0 36px 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const DemoRange = styled.input`
  flex: 1;
  max-width: 220px;
  height: 4px;
  appearance: none;
  background: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.full};
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.colors.accentShadow.sm};
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: none;
    border-radius: ${({ theme }) => theme.radii.full};
    background: ${({ theme }) => theme.colors.accent};
    cursor: pointer;
  }
`;

const DemoDivider = styled.hr`
  height: 1px;
  border: none;
  background: ${({ theme }) => theme.colors.border.light};
  margin: 4px 0;
`;

const MissingList = styled.ul`
  margin: 0;
  padding: 10px 14px;
  list-style: disc;
  padding-left: 28px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;

  li + li { margin-top: 6px; }

  code {
    font-family: ${({ theme }) => theme.typography.fonts.mono};
    font-size: 11px;
    background: ${({ theme }) => theme.colors.background.elevated};
    padding: 1px 5px;
    border-radius: ${({ theme }) => theme.radii.xs};
  }
`;

/* NOTE: Widget card / Empty state / Shortcut / Mobile tab bar showcases
 * import their styled-components directly from prod (DashboardViews.tsx +
 * StudioPage.tsx) — see the top-of-file "Mirror imports" block. No local
 * re-implementations here. Edit the source files to change the look. */

/* ── Transitions showcase ── */
const TransitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const TransitionTile = styled.div<{ $t: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(236, 72, 153, 0.05));
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: ${({ $t }) => `transform ${$t}, background ${$t}, box-shadow ${$t}`};

  &:hover {
    transform: translateY(-3px) scale(1.02);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(236, 72, 153, 0.10));
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const TransitionName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TransitionHint = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

/* ── Shadows showcase ── */
const ShadowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  padding: 8px;
`;

const ShadowTile = styled.div<{ $s: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100px;
  padding: 14px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ $s }) => $s};
`;

const ShadowName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ShadowHint = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

/* ── Radii showcase ── */
const RadiiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const RadiusTile = styled.div<{ $r: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(236, 72, 153, 0.08));
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ $r }) => $r};
`;

const RadiusName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RadiusPx = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

const UpgradeBullet = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }
`;

const RawTokensToggle = styled.button`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 28px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px dashed ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast}, border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const RawTokensHint = styled.span`
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
`;

const TextStyleSample = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 0;
  overflow-wrap: anywhere;
`;

const WeightRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const WeightTile = styled.div`
  padding: 18px 16px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
`;

const WeightSample = styled.div`
  font-size: 40px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin-bottom: 10px;
`;

const WeightName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
`;

const WeightValue = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: 2px;
`;

const LineHeightRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const LineHeightTile = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const LineHeightName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
  margin-bottom: 10px;
`;

const LineHeightSample = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.01em;
`;

const LetterSpacingRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

const LetterSpacingTile = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LetterSpacingHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const LetterSpacingName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.body};
`;

const LetterSpacingValue = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const LetterSpacingSample = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
`;

const LetterSpacingUsage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
`;

/* Sub-section label inside a Section — e.g. "BigFooter — primary",
   "Footer — minimal", size-preset names for Template mockup cards. */
const SubTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.text.body};
  margin: 0 0 10px;
`;

/* ── Template mockup documentation rows ──
   Each row is "what / where / props / code" on the left, visual preview
   on the right. Collapses vertically on narrow viewports. */
const MockupRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(200px, 440px);
  gap: 28px;
  align-items: start;
  padding: 20px 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const MockupMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const MockupName = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.01em;
`;

const MockupWhere = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;

  code {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    padding: 1px 5px;
    border-radius: ${({ theme }) => theme.radii.xs};
    font-size: 12px;
  }
`;

const MockupProps = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  letter-spacing: 0;
`;

const MockupCode = styled.pre`
  margin: 4px 0 0;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: ${({ theme }) => theme.typography.fonts.mono};
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre;
  overflow-x: auto;
`;

const MockupPreview = styled.div`
  width: 100%;
  justify-self: end;

  @media (max-width: 860px) {
    justify-self: start;
  }
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
    border-radius: ${({ theme }) => theme.radii.xs};
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
  border-radius: ${({ theme }) => theme.radii.lg};

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
    border-radius: ${({ theme }) => theme.radii.xs};
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
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: border-color ${({ theme }) => theme.transitions.fast}, box-shadow ${({ theme }) => theme.transitions.fast}, transform ${({ theme }) => theme.transitions.fast};

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
  border-radius: ${({ theme }) => theme.radii.lg};

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
    border-radius: ${({ theme }) => theme.radii.xs};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
