import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import styled, { keyframes, useTheme } from 'styled-components';
import { Copy, Check, Pencil, Trash2, Plus, Download, ExternalLink, LogOut, Settings, ArrowRight, Link as LinkIcon, Save as SaveIcon, Cloud, Loader2, Type, Palette, LayoutDashboard, Wand2, ChevronLeft, ChevronDown } from 'lucide-react';
import { Logger } from '../../infrastructure/services/Logger';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { CalendarSettings } from '../../domain/value-objects/CalendarSettings';
import { ClockSettings } from '../../domain/value-objects/ClockSettings';
import { BoardSettings } from '../../domain/value-objects/BoardSettings';
import { TopNav } from '../components/layout/TopNav';
import { EmailVerificationBanner } from '../components/shared/EmailVerificationBanner';
import { Button as SharedButton, BottomSheet, Segment, SegmentGroup, PlanUsageCard, Modal, ModalFooter, Tag, Toast, ToastShell, ToastIconBubble, ToastMessage, FilterChip, FilterRow } from '@/presentation/components/shared';
import { PurchaseListItem, usePurchases } from '@/presentation/components/dashboard/PurchaseList';
import {
  /* Single source of truth for empty-state visuals — see DS showcase. */
  EmptyBox as DashEmptyBox,
  EmptyCircle as DashEmptyCircle,
  EmptyTitle as DashEmptyTitle,
  EmptyHint as DashEmptyHint,
} from '@/presentation/components/dashboard/DashboardViews';
import { WidgetDisplay } from '../components/layout/WidgetDisplay';
import { CustomizationPanel, type PanelSection } from '../components/ui/forms/CustomizationPanel';
import { useAuth } from '../context/AuthContext';
import { useUpgradeModal } from '../context/UpgradeModalContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { WidgetStorageService, WidgetTierError, type SavedWidget } from '../../infrastructure/services/WidgetStorageService';
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 32px 24px 32px; }
`;

const cardAppear = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TabBarWrap = styled.div`
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 24px;

    /* Mobile — stretch the SegmentGroup to full width and split its
     * children evenly so it reads as the section switcher. The default
     * inline-flex group sat on the left and lost attention to the
     * PlanUsageCard above. Per "не понятно что переключатель"
     * (c_2026-04-29). */
    & > div {
      display: flex;
      width: 100%;

      & > button {
        flex: 1;
      }
    }
  }
`;

/* Section headers. $noFiltersBelow signals that the next sibling is the
 * widget grid (no SavedControlsRow in between) — phone mode gets +4px
 * extra bottom margin so the title-to-cards gap reads consistent with
 * the title-to-filters gap (20px) when filters ARE shown. */
const SectionRow = styled.div<{ $noFiltersBelow?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Drop the section header down 4px on phone so the title clears the
     * Welcome subtitle by a touch — visually separates the two stacks. */
    margin-top: 4px;
    margin-bottom: ${({ $noFiltersBelow }) => ($noFiltersBelow ? '16px' : '12px')};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes['6xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;

  /* Phone — section title sits BELOW Welcome H1 (24/sectionHeadline)
   * in the visual hierarchy, so it should read smaller. 4xl = 22 stays
   * just under the 24 welcome heading. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    gap: 6px;
  }
`;

const SectionCount = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

/* Filter dropdown + sort toggle above "Your widgets" — only rendered
 * when the user has 6+ saved widgets. Desktop spreads them apart
 * (filter left, sort right). Phone groups them on the left so the two
 * matched-pair pills read as a single compact toolbar instead of being
 * stretched across the full row. */
const SavedControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  /* margin-top collapses with SectionRow's margin-bottom to the larger
   * of the two, so 24 here = 24px gap (SectionRow's 16 is absorbed). */
  margin-top: 24px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: flex-start;
    gap: 8px;
    margin-top: 20px;
    margin-bottom: 16px;

    ${FilterRow} {
      mask-image: none;
      -webkit-mask-image: none;
      overflow: visible;
    }

    ${FilterRow} [data-active='true'] {
      background: ${({ theme }) => theme.colors.background.surfaceAlt};
      color: ${({ theme }) => theme.colors.text.primary};
      border: 1px solid ${({ theme }) => theme.colors.border.medium};
    }
    ${FilterRow} [data-active='true']:hover {
      background: ${({ theme }) => theme.colors.background.surfaceMuted};
      color: ${({ theme }) => theme.colors.text.primary};
      border: 1px solid ${({ theme }) => theme.colors.border.medium};
    }
  }
`;

/* Filter dropdown — same compact pill as the sort toggle, but opens a
 * small popover with category options. Used instead of a row of chips
 * so the filter and sort controls read as a matching pair (single small
 * pill + small pill with chevron). */
const FilterDropdownWrap = styled.div`
  position: relative;
`;

const FilterDropdownBtn = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background: transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.body};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    border-color: ${({ theme }) => theme.colors.border.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  }
`;

const FilterDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  min-width: 140px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow:
    0 1px 2px rgba(26, 22, 19, 0.04),
    0 8px 24px -6px rgba(26, 22, 19, 0.10);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FilterDropdownItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 10px;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background.surfaceAlt : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.primary : theme.colors.text.body};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  letter-spacing: -0.01em;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  transition: background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/* Minimal sort toggle — single text-style button that flips between
 * Newest and Oldest. Reads as a quiet trailing label, not a competing
 * control next to the filter dropdown. Small chevron rotates to convey
 * direction. Inspired by Linear / Notion's compact sort affordances. */
const SortToggleBtn = styled.button<{ $direction: 'desc' | 'asc' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background: transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.body};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    border-color: ${({ theme }) => theme.colors.border.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
    transform: rotate(${({ $direction }) => ($direction === 'desc' ? '0deg' : '180deg')});
  }
`;

/* Widget cards. Mobile/tablet adaptation mirrors the /widgets gallery
   (WidgetGalleryGrid in WidgetStudioPage.tsx) so saved widgets and
   browse widgets feel like the same surface across the app:
     >md     → 3 columns
     ≤md     → 2 columns (16/20 gap, align-items: start)
     ≤600    → 1 column (full-width cards) */
const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  /* Tablet narrow (769–900) — 3-column grid feels squeezed; drop to 2.
   * Cards capped at 380px per column so the visual size of each tile
   * stays constant from ~780 up through 900 (user note: "с 780 до 900
   * пусть не меняются") instead of growing 60px wider as the viewport
   * stretches. Grid centers within the page so the empty room appears
   * symmetrically on both sides rather than reading as a left-bias. */
  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 380px));
    justify-content: center;
    column-gap: 16px;
    row-gap: 20px;
    align-items: start;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
    row-gap: 20px;
    align-items: start;
  }

  @media (max-width: 499px) {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 20px;
  }
`;

export const WidgetCard = styled.div<{ $i: number }>`
  background: #fff;
  border: 1.5px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  animation: ${cardAppear} 0.35s ease ${({ $i }) => 0.04 + $i * 0.03}s both;
  transition: all ${({ theme }) => theme.transitions.medium};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.hairlineHover};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }

  /* Mobile/tablet — match /widgets gallery card chrome
     (WidgetGalleryCardWrap): surfaceAlt fill + mobileCard shadow so
     saved-widget tiles read as the same surface as the browse-widget
     gallery. Hover-pulse disabled — on phone hover triggers on tap. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: ${({ theme }) => theme.colors.background.surfaceAlt};
    box-shadow: ${({ theme }) => theme.shadows.mobileCard};
    width: 100%;

    &:hover {
      transform: none;
      box-shadow: ${({ theme }) => theme.shadows.mobileCard};
    }

    /* Tag (calendar/clock/board) — slightly smaller on mobile per
     * "лейблы чуть меньше по размеру" (c_2026 tablet pass). */
    ${Tag} {
      padding: 4px 10px;
      font-size: ${({ theme }) => theme.typography.sizes.xs};
    }
  }

  /* 1-в-ряд (≤679) — Tag stays small but with 3/9 padding. At full-
     width the tag should read as a quiet category marker. */
  @media (max-width: 679px) {
    ${Tag} {
      padding: 3px 9px;
      font-size: ${({ theme }) => theme.typography.sizes.xs};
    }
  }

  /* Compact 3-col range (769-1100) — narrow cards (≈211-330px) and a
     scaled-down preview need a smaller tag too, otherwise the label
     reads as oversized against the shrunk thumbnail. Mirrors the
     /widgets compact-range Tag override. xs (11px) with 3/10 padding. */
  @media (min-width: 769px) and (max-width: 1100px) {
    ${Tag} {
      padding: 3px 10px;
      font-size: ${({ theme }) => theme.typography.sizes.xs};
    }
  }

  /* Phone-tablet 2-col range (500–680) — cards are narrow enough that
     the calendar/clock/board Tag inside the preview crowds the small
     thumbnail and competes with the widget name. Hide it for a cleaner
     read; name + actions still convey identity. Per "у карточек нет
     лейблов и название виджетов отдельно строка а кнопки отдельно". */
  @media (min-width: 500px) and (max-width: 680px) {
    ${Tag} {
      display: none;
    }
  }
`;

export const WidgetPreviewWrap = styled.div`
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  cursor: pointer;
  position: relative;
`;

export const WidgetBottom = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,0.04);

  /* Compact 3-col range (901-1100) — at the narrow end the inline row
     "Name | Edit Copy Delete" gets cramped: Edit button text wraps or
     the actions row pushes the name out of view. Stack the name above
     a full-width actions row instead. Range starts at 901 (not 769) so
     the 2-col grid at 769-900 keeps its inline row layout — the wider
     2-col cards have plenty of room for "Name | actions" on one line.
     Per "766-900 пусть лейаут не меняется, кнопки в одну линию с именем". */
  @media (min-width: 901px) and (max-width: 1100px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 12px 12px;
  }

  /* Phone-tablet 2-col range (500–680) — same column layout: name on
     its own line, actions on the next. Per "название виджетов
     отдельно строка а кнопки отдельно". */
  @media (min-width: 500px) and (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 12px 12px;
  }
`;

export const WidgetName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const WidgetActions = styled.div`
  display: flex;
  gap: 6px;
`;

/* Body copy for the Delete confirmation Modal. Mirrors the pattern used
   in SettingsPage so both confirmation dialogs read identically. */
const DeleteModalText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.body};
  line-height: 1.5;
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
  }
`;

/* Empty state */
const EmptyCard = styled.div`
  border: 1.5px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 56px 24px;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  &:hover { border-color: ${({ theme }) => theme.colors.border.hairlineHover}; box-shadow: ${({ theme }) => theme.shadows.cardHover}; }
`;

const EmptyCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients.avatarPeach};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  svg { width: 24px; height: 24px; color: ${({ theme }) => theme.colors.accent}; }
`;

/* ── Welcome + banner typography (replaces inline styles below) ── */
const WelcomeH1 = styled.h1`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin: 0 0 6px;

  @media (min-width: calc(${({ theme }) => theme.breakpoints.md} + 1px))
    and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 32px;
  }

  /* Force Apple Color Emoji for the wave 👋 across platforms — keeps the
     iOS-style glyph in Welcome regardless of OS emoji font. */
  .emoji {
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
    font-style: normal;
    font-weight: normal;
  }

  /* Phone — bumped to 28 so Welcome reads as the dominant heading on
   * dashboard and outranks "Your widgets" (22) below it. */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    line-height: 1.15;
  }
`;

const WelcomeSub = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;

  /* Phone — sectionBody (15/400/1.5). */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.mobile.sectionBody.size};
    line-height: ${({ theme }) => theme.typography.mobile.sectionBody.lineHeight};
  }
`;

/* Big gradient hero banner used at the top of the Dashboard widgets tab.
   Holds <BannerTitle>/<BannerSub> on the left and <BannerCta> on the right.
   Single source — edit here, the DS showcase mirrors live. */
export const BannerSurface = styled.div<{ $mobile?: boolean }>`
  background: linear-gradient(135deg, rgba(237,228,255,0.6) 0%, rgba(232,237,255,0.5) 40%, rgba(245,235,250,0.55) 100%);
  border: 1.5px solid rgba(200,195,230,0.3);
  border-radius: 16px;
  padding: ${({ $mobile }) => ($mobile ? '24px 20px' : '32px 32px')};
  display: flex;
  flex-direction: ${({ $mobile }) => ($mobile ? 'column' : 'row')};
  align-items: ${({ $mobile }) => ($mobile ? 'stretch' : 'center')};
  justify-content: space-between;
  gap: ${({ $mobile }) => ($mobile ? '16px' : '0')};
  margin-bottom: 56px;
`;

export const BannerTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

export const BannerSub = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.hint};
  margin-top: 6px;
`;

export const BannerCta = styled.button<{ $fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  svg { width: 16px; height: 16px; }
`;

const EmptyStateTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px;
`;

const EmptyStateSub = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0;
`;

/* Purchase card styled bits live in components/dashboard/PurchaseList.tsx
   — shared between this page's "My Purchases" section and the dedicated
   /studio (account → Purchases) view. Single source of truth. */

/* ── Mobile editor (≤768) ── */
const MobileEditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: #fff;
  overflow: hidden;
`;

const MobileTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
`;

const MobileBackBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.body};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  svg { width: 18px; height: 18px; }
`;

const MobileWidgetName = styled.div`
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  cursor: text;
  /* Pencil affordance — kept very quiet (low opacity, small size) so it
     doesn't compete with the name itself; the name colour stays the
     hero. Lifts to full opacity on hover/active for clear feedback. */
  svg {
    width: 11px;
    height: 11px;
    color: ${({ theme }) => theme.colors.text.tertiary};
    opacity: 0.45;
    flex-shrink: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }
  &:hover svg, &:active svg { opacity: 1; }
`;

/* Inline rename input — styled to look like the static name (same font,
   weight, accent colour) so the transition tap → edit is seamless. */
const MobileWidgetNameInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.colors.border.hairlineHover};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.surfaceAlt};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
  text-align: center;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`;

/* Right slot in MobileTopBar — same width as MobileBackBtn so the
   centered MobileWidgetName visually sits in the true middle. Holds
   the save-status icon (saving/saved). */
const MobileTopBarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 36px;
  flex-shrink: 0;
`;

/* Floating embed-URL form pinned to the TOP of MobileArtboard — mirrors
   the desktop bottom toolbar (input readOnly + Copy) so mobile users
   get the same one-tap-to-copy affordance without crowding the topbar.
   Centered with a max-width cap so on tablet-ish viewports it doesn't
   stretch edge-to-edge; sits ~18px below the artboard top so it has a
   little breathing room from the back button row. */
const MobileEmbedBar = styled.div`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 6px 6px 6px 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04);
  z-index: 5;
`;

const MobileEmbedInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 11px;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.text.hint};
  outline: none;
`;

const MobileEmbedCopyBtn = styled.button<{ $copied: boolean }>`
  display: flex; align-items: center; justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: ${({ $copied, theme }) => $copied ? theme.colors.success.base : theme.colors.gradients.blue};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: background ${({ theme }) => theme.transitions.fast};
  svg { width: 12px; height: 12px; }
`;

export const MobileArtboard = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  margin: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
    ${({ theme }) => theme.colors.background.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MobileDotGrid = styled.div`
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.5;
`;

export const MobileWidgetScale = styled.div`
  transform: scale(0.7);
  transform-origin: center center;
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.08)) drop-shadow(0 2px 6px rgba(0,0,0,0.04));
`;

/* Desktop+tablet artboard. Default desktop kept identical to the
 * earlier inline style (margin 12/12/24/48). On tablet (769–1024) the
 * studio paddings shrink and the artboard widens — per "паддинги
 * студии чуть меньше, артборд чуть шире на планшете". */
export const DesktopArtboard = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 132, 244, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
    #F8F8F7;
  margin: 12px 12px 24px 48px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border.hairline};

  @media (min-width: 769px) and (max-width: 1024px) {
    margin: 8px 8px 16px 16px;
  }
`;

/* Desktop+tablet widget scale. $zoom is the React-state zoom (default
 * 1.2). On tablet the widget renders 20% smaller than the same zoom
 * value — per "виджет на 20 процентов меньше на планшете". */
export const DesktopWidgetScale = styled.div<{ $zoom: number }>`
  transform: scale(${({ $zoom }) => $zoom}) translateY(-32px);
  transform-origin: center center;
  transition: transform 0.15s ease;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.08)) drop-shadow(0 2px 6px rgba(0,0,0,0.04));

  @media (min-width: 769px) and (max-width: 1024px) {
    transform: scale(${({ $zoom }) => $zoom * 0.8}) translateY(-32px);
  }
`;

/* Customization panel wrap — desktop 300, tablet 272 (was 240, bumped
 * +32 per "панель дизайнерскую шире чуть на планшете"). */
export const DesktopPanelWrap = styled.div`
  width: 300px;
  flex-shrink: 0;
  overflow: auto;
  background: ${({ theme }) => theme.colors.background.elevated};

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 272px;
  }
`;

/* Studio editor top bar — desktop's 48 left + 310 right padding aligns
 * Back/name with the artboard's 48 left margin and the 300 panel on
 * the right. On tablet the artboard's left margin shrinks to 16 and
 * the panel narrows to 240, so the top bar follows: Back/name lock
 * to the artboard's left edge and the PlanUsageCard hugs the panel's
 * left edge. Per "Back/Collage Calendar к левой части артборда" +
 * "Upgrade now к правой части артборда". */
export const EditorTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 310px 0 48px;
  height: 68px;
  background: ${({ theme }) => theme.colors.background.elevated};
  flex-shrink: 0;
  z-index: 10;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 15px 280px 0 16px;
  }
`;

export const MobileSectionTabs = styled.div`
  display: flex;
  gap: 6px;
  padding: 8px 20px calc(8px + env(safe-area-inset-bottom));
  background: ${({ theme }) => theme.colors.background.elevated};
  border-top: 1px solid ${({ theme }) => theme.colors.border.hairline};
  flex-shrink: 0;
  /* Sit ABOVE the BottomSheet (z-index 40) so the sheet's slide-in
     animation passes BEHIND the nav instead of briefly covering it. */
  position: relative;
  z-index: 41;
`;

export const MobileSectionTab = styled.button<{ $active: boolean; $disabled?: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px;
  height: 52px;
  border: none;
  /* Active state is colour-only — icon + label flip to accent, no card
     highlight behind. Disabled = muted text + opacity for "unavailable". */
  background: transparent;
  color: ${({ $active, $disabled, theme }) =>
    $disabled ? theme.colors.text.muted : $active ? theme.colors.accent : theme.colors.text.hint};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.01em;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast}, opacity ${({ theme }) => theme.transitions.fast};
  padding: 0;
  svg { width: 18px; height: 18px; stroke-width: 1.75; }
`;

/* Board widget is a tall portrait camera frame (340×604 design size)
 * that doesn't fit the 4:3 card preview at the same scale as Calendar
 * /Clock. Instead of a fixed transform, give it a sized container at
 * 94% (6% smaller than full bounds, per user "чуть меньше еще на 6%"). */
const BoardPreviewFit = styled.div`
  width: 94%;
  height: 94%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
`;

/* Board variant of DesktopWidgetScale — bypasses the transform: scale
 * + filter: drop-shadow that DesktopWidgetScale applies, since the
 * InspirationBoard ResizeObserver already auto-fits to its container.
 * Wrapping it in a transform: scale($zoom = 1.2) blew up the 340×604
 * design size beyond the artboard bounds. */
const BoardEditorFit = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.08)) drop-shadow(0 2px 6px rgba(0,0,0,0.04));
`;

/* Preview helpers */
const PreviewScale = styled.div`
  transform: scale(0.55);
  transform-origin: center center;
  pointer-events: none;

  /* Compact 3-col range (769-1100) — cards drop to ~211-330px wide
     and the default 0.55 preview crowds the surface. Scale down 30%
     (0.55 → 0.385) so the widget reads as a thumbnail with breathing
     room around it, matching the visual weight at wider viewports. */
  @media (min-width: 769px) and (max-width: 1100px) {
    transform: scale(0.385);
  }

  /* 769–900 — 2-col grid + another +8% bump on top so the widget
   * inside the wider card reads as a confident thumbnail. 0.385
   * × 1.08 × 1.08 ≈ 0.449. */
  @media (min-width: 769px) and (max-width: 900px) {
    transform: scale(0.449);
  }

  /* 500–680 — phone-tablet 2-col tier. Cards drop the Tag and stack
   * name/actions, so the preview can shrink 10% from the default 0.55
   * to feel proportional inside a narrower card. 0.55 × 0.9 ≈ 0.495. */
  @media (min-width: 500px) and (max-width: 680px) {
    transform: scale(0.495);
  }
`;

const PREVIEW_TIME = new Date(2026, 2, 25, 10, 42, 15);

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
    return <BoardPreviewFit><InspirationBoard settings={s} /></BoardPreviewFit>;
  }
  return null;
};

/* ── Downgrade banner ── */
// Shown after the user clicks "Cancel" in Polar's portal but before the
// current period ends — Pro features still work, but they need to know
// access lapses on the renewal date so the upgrade prompt doesn't feel
// like it appeared out of nowhere.

const DowngradeBannerWrap = styled.div`
  max-width: 1200px;
  margin: 12px auto 0;
  padding: 0 48px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) { padding: 0 24px; }
`;

const DowngradeBannerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.warning.bg};
  border: 1px solid ${({ theme }) => theme.colors.warning.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.warning.text};
  letter-spacing: -0.005em;
  flex-wrap: wrap;
`;

const DowngradeBanner: React.FC<{
  isPro: boolean;
  status: string | null;
  endsAt: string | null;
}> = ({ isPro, status, endsAt }) => {
  if (!isPro || status !== 'canceled' || !endsAt) return null;
  const d = new Date(endsAt);
  if (Number.isNaN(d.getTime())) return null;
  const formatted = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <DowngradeBannerWrap>
      <DowngradeBannerInner>
        <span>
          <strong>Pro ends {formatted}.</strong>{' '}
          After that, editing is locked until you renew. Existing widgets keep working — embeds won't break.
        </span>
        <a
          href="/settings#subscription"
          style={{
            color: '#92400E', fontWeight: 600, textDecoration: 'none',
            borderBottom: '1px solid currentColor', paddingBottom: 1,
          }}
        >
          Manage in Settings →
        </a>
      </DowngradeBannerInner>
    </DowngradeBannerWrap>
  );
};

/* ── Component ── */

type StudioTab = 'widgets' | 'purchases';

export const StudioPage: React.FC<StudioPageProps> = ({ diContainer }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRegistered, isGuest, user, plan, isPro, planLoading } = useAuth();
  // `?purchased=<polarProductId>` lands here from Polar after a successful
  // template checkout. Show a banner + optional signup CTA for guests.
  const [purchasedProductId, setPurchasedProductId] = useState<string | null>(() => searchParams.get('purchased'));
  /* Tab state synced with URL ?tab=. Lets the navbar dropdown deep-link
     directly into a tab (e.g. /studio?tab=purchases from the Purchases
     menu item). Defaults to 'widgets' when the param is missing or
     unrecognised. */
  const [tab, setTab] = useState<StudioTab>(() => {
    const t = searchParams.get('tab');
    return t === 'purchases' ? 'purchases' : 'widgets';
  });
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  /* Real purchases — same hook + same item component as the dedicated
     /studio (account → Purchases) view, so the dashboard's "My
     Purchases" section auto-mirrors the source list. */
  const { purchases } = usePurchases();
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [mobileSection, setMobileSection] = useState<PanelSection>(null);

  const { open: openUpgrade } = useUpgradeModal();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  // Editing state
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingWidgetKey, setEditingWidgetKey] = useState<string>('');
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editingWidgetName, setEditingWidgetName] = useState<string>('');
  /* True while the user is inline-renaming the widget on the mobile
     editor's top bar. Tap the name (or pencil) → input; Enter/blur
     commits, Escape reverts. The auto-save effect on editingWidgetName
     handles persistence — no extra wiring needed here. */
  const [renamingName, setRenamingName] = useState(false);
  const renameDraftRef = useRef<string>('');
  /* Editor state. URL is a mirror — /studio when editor is open,
     /dashboard when it's closed — but the source of truth stays in
     this state so click handlers update synchronously without racing
     with the route change. Two effects below keep URL ↔ state in
     sync (one for outgoing changes, one for direct URL access). */
  const [editorOpen, setEditorOpen] = useState(location.pathname === '/studio');
  const [copied, setCopied] = useState(false);
  const [copiedWidgetId, setCopiedWidgetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedWidget | null>(null);
  const [studioZoom, setStudioZoom] = useState(1.2);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  /* Filter + sort for "Your widgets" — only surfaces in the UI when the
   * user has 6+ saved widgets (below that the section reads as a small
   * grid where chips and a sorter would be visual noise). Keys mirror
   * SavedWidget.type so filtering is direct. */
  type SavedFilter = 'all' | 'calendar' | 'clock' | 'board';
  type SavedSort = 'newest' | 'oldest';
  const [savedFilter, setSavedFilter] = useState<SavedFilter>('all');
  const [savedSort, setSavedSort] = useState<SavedSort>('newest');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  /* Close the filter dropdown when the user clicks outside of it. */
  useEffect(() => {
    if (!filterMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!filterMenuRef.current?.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [filterMenuOpen]);

  /* Apply filter + sort to the saved widgets list. Memoised so the grid
   * only re-renders when the underlying data or controls actually change.
   * Sort compares created_at ISO strings lexicographically (chronological). */
  const visibleWidgets = useMemo(() => {
    const list = savedFilter === 'all'
      ? widgets
      : widgets.filter(w => w.type === savedFilter);
    return [...list].sort((a, b) => {
      const ta = a.created_at || '';
      const tb = b.created_at || '';
      return savedSort === 'oldest' ? ta.localeCompare(tb) : tb.localeCompare(ta);
    });
  }, [widgets, savedFilter, savedSort]);
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

  // Sync tab state with the ?tab= URL param. Lets the navbar dropdown
  // (Purchases item → /dashboard?tab=purchases) deep-link directly into
  // a tab even when the user is already on /dashboard.
  useEffect(() => {
    const t = searchParams.get('tab');
    const next: StudioTab = t === 'purchases' ? 'purchases' : 'widgets';
    setTab(prev => (prev === next ? prev : next));
  }, [searchParams]);

  // No guard for /studio without editingWidget — the render condition
  // (`if (editorOpen && editingWidget)`) already falls through to the
  // dashboard view in that case. An aggressive redirect here was
  // racing with handleEdit's batched setEditingWidget + navigate and
  // bouncing the editor before it could mount.

  // Handle incoming newWidget (from /widgets Customize) and editWidget
  // (from dashboard Edit click) via location.state — both routes mount
  // a fresh StudioPage instance, so passing the payload through router
  // state is the only way to survive the remount.
  useEffect(() => {
    const state = location.state as {
      newWidget?: { name: string; type: string; style: string };
      editWidget?: SavedWidget;
    } | null;

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
          navigate('/studio', { replace: true });
        } catch (err) {
          Logger.error('StudioPage', 'Failed to create widget from nav state', err);
        }
      })();
      return;
    }

    if (state?.editWidget) {
      const w = state.editWidget;
      window.history.replaceState({}, '');
      (async () => {
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
          // Mark as already-saved so the debounced auto-save doesn't re-fire on open.
          lastSavedRef.current = JSON.stringify(serializeSettings(updated)) + '|' + w.name;
          setEditorOpen(true);
        } catch (err) {
          Logger.error('StudioPage', 'Failed to load widget for editing', err);
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
      // Server-side tier enforcement blocked the write — either the free
      // user hit the 3-widget cap racing past the client check, or they
      // tried to save a Pro-only style. Open the upgrade modal instead of
      // showing a generic error toast.
      if (err instanceof WidgetTierError) {
        Logger.info('StudioPage', 'Save blocked by tier policy', err.message);
        setSaveStatus('idle');
        openUpgrade();
        return;
      }
      Logger.error('StudioPage', 'Auto-save failed', err);
      setSaveStatus('error');
      savedStatusTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [isRegistered, editingWidgetId, editingWidgetKey, openUpgrade]);

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

  /* Edit handler — pushes the widget through location.state so the
     /dashboard → /studio navigation survives React Router's component
     remount (each <Route> mounts its own StudioPage instance, so state
     set here would be lost otherwise). The mount-time effect below
     reads location.state.editWidget and hydrates the editor. Was the
     "needs two clicks" bug — first click set local state in the
     /dashboard instance which got unmounted on navigate; second click
     hit the already-mounted /studio instance so it worked. */
  const handleEdit = (w: SavedWidget) => {
    navigate('/studio', { state: { editWidget: w } });
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
    navigate('/dashboard');
  };

  // If editing, show full-screen editor (Figma-style artboard)
  if (editorOpen && editingWidget) {
    const embedUrl = diContainer.getWidgetEmbedUrlUseCase.execute(editingWidget);
    // copied state is declared at component level

    // ── Mobile editor (≤768): stacked layout + bottom sheet panel ──
    // Desktop code below stays intact. Mobile path duplicates state usage
    // but uses a completely separate JSX tree to avoid cross-viewport CSS risk.
    if (isMobile) {
      const calStyle = editingWidget.type === 'calendar' ? (editingWidget.settings as CalendarSettings).style : '';
      const clkStyle = editingWidget.type === 'clock' ? (editingWidget.settings as ClockSettings).style : '';
      const isBoardW = editingWidget.type === 'board';
      const isCollageW = calStyle === 'collage' || calStyle === 'typewriter' || clkStyle === 'flower';
      const isFlowerW = clkStyle === 'flower';

      // Panel sections — all four tabs are always shown in the bottom bar
      // for visual consistency; tabs unavailable for this widget type are
      // rendered greyed-out and do not open the sheet on tap.
      const sections: { key: Exclude<PanelSection, null>; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
        { key: 'style', label: 'Style', icon: <Wand2 />, disabled: !(isFlowerW || isBoardW) },
        { key: 'content', label: 'Content', icon: <Type /> },
        { key: 'color', label: 'Color', icon: <Palette />, disabled: isBoardW },
        { key: 'layout', label: 'Layout', icon: <LayoutDashboard />, disabled: isCollageW || isBoardW },
      ];

      const sheetOpen = mobileSection !== null;
      const openSection = (s: Exclude<PanelSection, null>, disabled?: boolean) => {
        if (disabled) return;
        setMobileSection(prev => prev === s ? null : s);
      };
      const closeSheet = () => setMobileSection(null);

      return (
        <MobileEditorWrap>
          <MobileTopBar>
            <MobileBackBtn onClick={handleEditorBack} aria-label="Back">
              <ChevronLeft />
            </MobileBackBtn>
            {renamingName ? (
              <MobileWidgetNameInput
                autoFocus
                value={editingWidgetName}
                onChange={e => setEditingWidgetName(e.target.value)}
                onFocus={e => {
                  renameDraftRef.current = editingWidgetName;
                  e.currentTarget.select();
                }}
                onBlur={() => {
                  if (!editingWidgetName.trim()) setEditingWidgetName(renameDraftRef.current || 'Untitled Widget');
                  setRenamingName(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); }
                  if (e.key === 'Escape') { setEditingWidgetName(renameDraftRef.current); setRenamingName(false); }
                }}
              />
            ) : (
              <MobileWidgetName onClick={() => setRenamingName(true)} role="button" aria-label="Rename widget">
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {editingWidgetName || editingWidgetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
                <Pencil />
              </MobileWidgetName>
            )}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <MobileTopBarRight>
              {saveStatus === 'saving' && <Loader2 style={{ width: 14, height: 14, color: theme.colors.text.tertiary, animation: 'spin 1s linear infinite' }} />}
              {saveStatus === 'saved' && <Check style={{ width: 14, height: 14, color: theme.colors.success.fg }} />}
            </MobileTopBarRight>
          </MobileTopBar>

          <MobileArtboard>
            <MobileDotGrid />
            <MobileEmbedBar>
              <MobileEmbedInput
                readOnly
                value={embedUrl}
                onClick={e => (e.target as HTMLInputElement).select()}
              />
              <MobileEmbedCopyBtn
                $copied={copied}
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(embedUrl).catch(() => {});
                  }
                }}
              >
                {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
              </MobileEmbedCopyBtn>
            </MobileEmbedBar>
            <MobileWidgetScale>
              <WidgetDisplay widget={editingWidget} />
            </MobileWidgetScale>
          </MobileArtboard>

          <MobileSectionTabs>
            {sections.map(s => (
              <MobileSectionTab
                key={s.key}
                $active={mobileSection === s.key && !s.disabled}
                $disabled={s.disabled}
                disabled={s.disabled}
                aria-disabled={s.disabled}
                onClick={() => openSection(s.key, s.disabled)}
              >
                {s.icon}
                {s.label}
              </MobileSectionTab>
            ))}
          </MobileSectionTabs>

          <BottomSheet
            open={sheetOpen}
            onClose={closeSheet}
            title={mobileSection ?? ''}
            capitalizeTitle
            /* Sit ABOVE the persistent MobileSectionTabs (48px tab + 8px top
               + 8px bottom padding + safe-area) so navigation stays visible. */
            bottomOffset="calc(68px + env(safe-area-inset-bottom))"
          >
            {mobileSection && (
              <CustomizationPanel
                widget={editingWidget}
                onSettingsChange={(settings) => {
                  if (!editingWidget) return;
                  const updated = editingWidget.updateSettings(settings as CalendarSettings | ClockSettings | BoardSettings);
                  setEditingWidget(updated);
                }}
                visibleSection={mobileSection}
                widgetCount={widgets.length}
                widgetLimit={3}
                onUpgrade={() => openUpgrade()}
              />
            )}
          </BottomSheet>
        </MobileEditorWrap>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', background: theme.colors.background.elevated }}>
        {/* Editor top bar */}
        <EditorTopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={handleEditorBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px',
              border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, background: theme.colors.background.elevated,
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit', color: theme.colors.text.body, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} /> Back
            </button>
            {/* Editable widget name — same rename pattern as the mobile
                top bar (tap → input, Enter/blur commits, Esc reverts).
                Auto-save effect on editingWidgetName picks up the change. */}
            {renamingName ? (
              <input
                autoFocus
                value={editingWidgetName}
                onChange={e => setEditingWidgetName(e.target.value)}
                onFocus={e => {
                  renameDraftRef.current = editingWidgetName;
                  e.currentTarget.select();
                }}
                onBlur={() => {
                  if (!editingWidgetName.trim()) setEditingWidgetName(renameDraftRef.current || 'Untitled Widget');
                  setRenamingName(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); }
                  if (e.key === 'Escape') { setEditingWidgetName(renameDraftRef.current); setRenamingName(false); }
                }}
                style={{
                  height: 30, padding: '0 10px',
                  fontSize: 15, fontWeight: 600, color: theme.colors.accent, letterSpacing: '-0.02em',
                  fontFamily: 'inherit',
                  border: `1px solid ${theme.colors.state.active}`, borderRadius: 8,
                  background: theme.colors.background.surfaceAlt, outline: 'none', minWidth: 180,
                }}
              />
            ) : (
              <span
                onClick={() => setRenamingName(true)}
                role="button"
                aria-label="Rename widget"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 15, fontWeight: 600, color: theme.colors.accent, letterSpacing: '-0.02em',
                  cursor: 'text', padding: '4px 0',
                  whiteSpace: 'nowrap',
                }}
                className="rename-target"
              >
                <span style={{ whiteSpace: 'nowrap' }}>{editingWidgetName || editingWidgetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                <Pencil
                  style={{
                    width: 11, height: 11, color: theme.colors.text.tertiary,
                    opacity: 0.45, transition: 'opacity 0.15s',
                  }}
                  className="rename-pencil"
                />
              </span>
            )}
            <style>{`.rename-target:hover .rename-pencil { opacity: 1 !important; }`}</style>
            {/* Save status — mirrors Figma/Notion auto-save indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 28, padding: '0 10px', borderRadius: 8,
              background: saveStatus === 'error' ? 'rgba(220,40,40,0.08)' : 'rgba(0,0,0,0.04)',
              color: saveStatus === 'error' ? '#F49B8B' : saveStatus === 'saved' ? '#16A34A' : '#888',
              fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
              opacity: saveStatus === 'idle' ? 0 : 1,
              transition: 'opacity ${({ theme }) => theme.transitions.medium}, color ${({ theme }) => theme.transitions.medium}, background ${({ theme }) => theme.transitions.medium}',
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
            {planLoading ? null : (
              <PlanUsageCard
                mode={isPro ? 'pro' : 'free'}
                $size="compact"
                used={widgets.length}
                limit={3}
                onUpgrade={() => openUpgrade()}
                onManage={() => navigate('/settings')}
              />
            )}
          </div>
        </EditorTopBar>

        {/* Editor body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Artboard */}
          <DesktopArtboard>
            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px', pointerEvents: 'none', opacity: 0.6,
            }} />

            {/* Zoom controls removed — fixed at 120% */}

            {/* Widget — flex parent centers horizontally; translateY(-32px)
                lifts it slightly above the geometric center so the bottom
                Copy toolbar doesn't crowd it. Board widget bypasses the
                DesktopWidgetScale transform (which would multiply its
                340×604 design size by zoom and overflow the artboard) —
                its own ResizeObserver auto-scales to fit. */}
            {editingWidget.type === 'board' ? (
              <BoardEditorFit>
                <WidgetDisplay widget={editingWidget} />
              </BoardEditorFit>
            ) : (
              <DesktopWidgetScale $zoom={studioZoom}>
                <WidgetDisplay widget={editingWidget} />
              </DesktopWidgetScale>
            )}

            {/* Floating toolbar — bottom center */}
            <div style={{
              position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${theme.colors.border.hairline}`, borderRadius: 16,
              padding: '10px 16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <input readOnly value={embedUrl} style={{
                width: 240, height: 34, padding: '0 12px', border: 'none', borderRadius: 8,
                background: 'rgba(0,0,0,0.04)', fontSize: 11, fontFamily: 'monospace', color: theme.colors.text.hint,
                outline: 'none',
              }} onClick={e => (e.target as HTMLInputElement).select()} />
              <SharedButton
                $variant={copied ? 'successSoft' : 'slate'}
                $size="md"
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(embedUrl).catch(() => {});
                  }
                }}
              >
                {copied ? <><Check /> Copied!</> : <><Copy /> Copy</>}
              </SharedButton>
            </div>
          </DesktopArtboard>

          {/* Customization panel */}
          <DesktopPanelWrap>
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
          </DesktopPanelWrap>
        </div>
        {/* Custom-positioned toast for editor mode — centered over the
            artboard column (viewport center minus half the 300px sidebar).
            Uses ToastShell/Icon/Message tokens so visuals stay in sync
            with the shared <Toast>. */}
        {copied && (
          <ToastShell
            $tone="success"
            $position="top"
            role="status"
            aria-live="polite"
            style={{
              left: 'calc(50% - 150px)',
              top: 22,
            }}
          >
            <ToastIconBubble $tone="success"><Check /></ToastIconBubble>
            <ToastMessage>Embed code copied</ToastMessage>
          </ToastShell>
        )}
      </div>
    );
  }

  return (
    <Page>
      <TopNav activeLink={editorOpen ? 'studio' : 'dashboard'} />
      <EmailVerificationBanner />
      <DowngradeBanner isPro={isPro} status={plan.status} endsAt={plan.currentPeriodEnd} />

      {purchasedProductId && (
        <div style={{
          margin: '12px 48px 0',
          padding: '14px 18px',
          borderRadius: 12,
          border: '1px solid rgba(34, 197, 94, 0.25)',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F7EE 100%)',
          color: theme.colors.success.dark,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap' as const,
        }}>
          <span style={{ flex: 1, minWidth: 220 }}>
            <strong>✓ Purchase confirmed.</strong> A download link was emailed to you
            {user?.email ? <> at <strong>{user.email}</strong></> : null}.
            {!isRegistered && <> Wrong email? <a href="mailto:support@peachyplanner.com" style={{ color: theme.colors.success.dark, fontWeight: 600 }}>Contact support</a>.</>}
          </span>
          {!isRegistered && (
            <button
              onClick={() => navigate(`/login?returnTo=${encodeURIComponent('/dashboard?tab=purchases')}`)}
              style={{
                background: theme.colors.success.dark, color: theme.colors.text.inverse, border: 'none', borderRadius: 8,
                padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Create account to save this purchase
            </button>
          )}
          <button
            onClick={() => {
              setPurchasedProductId(null);
              const next = new URLSearchParams(searchParams);
              next.delete('purchased');
              setSearchParams(next, { replace: true });
            }}
            style={{
              background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer',
              color: theme.colors.success.dark, lineHeight: 1, padding: 4,
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <Container>
        {/* Welcome — desktop: H1 + plan pill share a row, subtitle below.
            Mobile: H1 → Subtitle → Plan card stacked. Per "Manage your
            widgets and templates должно быть под Welcome" (c_2026-04-29). */}
        {isMobile ? (
          <div style={{ marginBottom: 24, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <WelcomeH1>Welcome <span className="emoji" aria-hidden="true">👋</span></WelcomeH1>
              <WelcomeSub>Manage your widgets and templates</WelcomeSub>
            </div>
            {/* Mobile uses the inline text variant — even the compact
                206px pill (ring + "3/3" + Upgrade) read as "много места
                занимает а инфы не дает" on phone. Inline collapses the
                whole status to a single line:
                  • Free under limit: "Free plan · 2 left"
                  • Free at limit:    "You've reached your limit · Upgrade to add more →"
                  • Pro:              "Peachy Pro"
                Desktop keeps the wide pill — see the else branch below.
                (c_2026-04-29) */}
            {planLoading ? null : (
              <PlanUsageCard
                mode={isPro ? 'pro' : 'free'}
                $size="inline"
                used={widgets.length}
                limit={3}
                onUpgrade={() => openUpgrade()}
                onManage={() => navigate('/settings')}
              />
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 32, marginTop: 24 }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0,
            }}>
              <WelcomeH1>Welcome <span className="emoji" aria-hidden="true">👋</span></WelcomeH1>
              {planLoading ? null : (
                <PlanUsageCard
                  mode={isPro ? 'pro' : 'free'}
                  $size="wide"
                  used={widgets.length}
                  limit={3}
                  onUpgrade={() => openUpgrade()}
                  onManage={() => navigate('/settings')}
                />
              )}
            </div>
            <WelcomeSub>Manage your widgets and templates</WelcomeSub>
          </div>
        )}

        {/* Tab bar */}
        <TabBarWrap>
          <SegmentGroup>
            <Segment $active={tab === 'widgets'} onClick={() => setTab('widgets')}>Widgets</Segment>
            <Segment $active={tab === 'purchases'} onClick={() => setTab('purchases')}>Purchases</Segment>
          </SegmentGroup>
        </TabBarWrap>

        {/* ── Widgets Tab ── */}
        {tab === 'widgets' && (
          <>
            {/* Create new widget — gradient banner. Uses <BannerSurface>
                token, single source of truth (also rendered live in DS). */}
            <BannerSurface $mobile={isMobile}>
              <div>
                <BannerTitle>Create new widget</BannerTitle>
                <BannerSub>Browse styles, customize and embed in Notion</BannerSub>
              </div>
              <BannerCta $fullWidth={isMobile} onClick={() => navigate('/widgets')}>
                <Plus /> Browse widgets
              </BannerCta>
            </BannerSurface>

            {/* Your widgets */}
            <SectionRow $noFiltersBelow={widgets.length < 6 || new Set(widgets.map(w => w.type)).size < 2}>
              <SectionTitle>Your widgets <SectionCount>{widgets.length}</SectionCount></SectionTitle>
            </SectionRow>

            {/* Filter + sort controls — show only when 6+ widgets AND
              the user has at least 2 different widget types. With one
              type the chips would be redundant (everything matches "All"
              + that one type). With <6 widgets the grid is small enough
              that filters add visual noise instead of speed. */}
            {widgets.length >= 6 && new Set(widgets.map(w => w.type)).size >= 2 && (() => {
              const FILTER_OPTIONS = ([
                { key: 'all', label: 'All' },
                { key: 'calendar', label: 'Calendars' },
                { key: 'clock', label: 'Clocks' },
                { key: 'board', label: 'Boards' },
              ] as const).filter(f => f.key === 'all' || widgets.some(w => w.type === f.key));
              const activeLabel = FILTER_OPTIONS.find(f => f.key === savedFilter)?.label ?? 'All';
              return (
                <SavedControlsRow>
                  <FilterDropdownWrap ref={filterMenuRef}>
                    <FilterDropdownBtn
                      $open={filterMenuOpen}
                      onClick={() => setFilterMenuOpen(o => !o)}
                      aria-haspopup="menu"
                      aria-expanded={filterMenuOpen}
                    >
                      {activeLabel}
                      <ChevronDown />
                    </FilterDropdownBtn>
                    {filterMenuOpen && (
                      <FilterDropdownMenu role="menu">
                        {FILTER_OPTIONS.map(f => (
                          <FilterDropdownItem
                            key={f.key}
                            $active={savedFilter === f.key}
                            onClick={() => {
                              setSavedFilter(f.key);
                              setFilterMenuOpen(false);
                            }}
                            role="menuitem"
                          >
                            {f.label}
                            {savedFilter === f.key && <Check />}
                          </FilterDropdownItem>
                        ))}
                      </FilterDropdownMenu>
                    )}
                  </FilterDropdownWrap>
                  <SortToggleBtn
                    $direction={savedSort === 'newest' ? 'desc' : 'asc'}
                    onClick={() => setSavedSort(savedSort === 'newest' ? 'oldest' : 'newest')}
                    aria-label={`Sort by ${savedSort === 'newest' ? 'newest' : 'oldest'} first`}
                  >
                    {savedSort === 'newest' ? 'Newest' : 'Oldest'}
                    <ChevronDown />
                  </SortToggleBtn>
                </SavedControlsRow>
              );
            })()}

            {!loading && widgets.length === 0 ? (
              <DashEmptyBox onClick={() => navigate('/widgets')}>
                <DashEmptyCircle><Plus /></DashEmptyCircle>
                <DashEmptyTitle>No widgets yet</DashEmptyTitle>
                <DashEmptyHint>Create your first widget from the gallery above</DashEmptyHint>
              </DashEmptyBox>
            ) : visibleWidgets.length === 0 ? (
              <DashEmptyBox onClick={() => setSavedFilter('all')}>
                <DashEmptyCircle><Plus /></DashEmptyCircle>
                <DashEmptyTitle>No widgets in this category</DashEmptyTitle>
                <DashEmptyHint>Tap to clear the filter</DashEmptyHint>
              </DashEmptyBox>
            ) : (
              <WidgetGrid>
                {visibleWidgets.map((w, i) => (
                  <WidgetCard key={w.id} $i={i}>
                    <WidgetPreviewWrap onClick={() => handleEdit(w)}>
                      <Tag
                        $kind={w.type === 'calendar' ? 'calendar' : w.type === 'clock' ? 'clock' : 'board'}
                        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                      >
                        {w.type === 'calendar' ? 'calendar' : w.type === 'clock' ? 'clock' : 'board'}
                      </Tag>
                      <WidgetPreview type={w.type} style={w.style} savedSettings={w.settings} />
                    </WidgetPreviewWrap>
                    <WidgetBottom>
                      <WidgetName>{w.name}</WidgetName>
                      <WidgetActions>
                        <SharedButton $variant="outline" $size="sm" onClick={() => handleEdit(w)}><Pencil /> Edit</SharedButton>
                        <SharedButton
                          $variant={copiedWidgetId === w.id ? 'successSoft' : 'outline'}
                          $size="sm"
                          $iconOnly
                          aria-label={copiedWidgetId === w.id ? 'Copied' : 'Copy embed URL'}
                          title={copiedWidgetId === w.id ? 'Copied!' : 'Copy embed URL'}
                          onClick={async () => {
                            // Prefer the persisted embed_url; fall back to
                            // generating one on the fly from the saved
                            // settings so newly-saved widgets (where the
                            // DB column may not have flushed yet) still copy.
                            let url = w.embed_url || '';
                            if (!url) {
                              try {
                                const widget = await diContainer.createWidgetUseCase.execute(w.type);
                                const s = (w.settings || {}) as Record<string, unknown>;
                                let updated;
                                if (w.type === 'calendar') {
                                  updated = widget.updateSettings(new CalendarSettings({ ...s, style: w.style as CalendarSettings['style'] }));
                                } else if (w.type === 'clock') {
                                  updated = widget.updateSettings(new ClockSettings({ ...s, style: w.style as ClockSettings['style'] }));
                                } else {
                                  updated = widget.updateSettings(new BoardSettings({ ...s, layout: w.style as BoardSettings['layout'] }));
                                }
                                url = diContainer.getWidgetEmbedUrlUseCase.execute(updated);
                              } catch (err) {
                                Logger.error('StudioPage', 'Failed to generate embed URL', err);
                                return;
                              }
                            }
                            setCopiedWidgetId(w.id);
                            setTimeout(() => setCopiedWidgetId(null), 2000);
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(url).catch(() => {});
                            }
                          }}
                        >
                          {copiedWidgetId === w.id ? <Check /> : <Copy />}
                        </SharedButton>
                        <SharedButton
                          $variant="danger"
                          $size="sm"
                          $iconOnly
                          aria-label="Delete widget"
                          style={{ marginLeft: 'auto' }}
                          onClick={() => setDeleteTarget(w)}
                        >
                          <Trash2 />
                        </SharedButton>
                      </WidgetActions>
                    </WidgetBottom>
                  </WidgetCard>
                ))}
              </WidgetGrid>
            )}
          </>
        )}

        {/* ── Purchases Tab ── */}
        {tab === 'purchases' && (
          <>
            {/* Browse banner — top */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(252,235,225,0.45) 0%, rgba(255,245,235,0.4) 30%, rgba(237,228,255,0.35) 70%, rgba(232,237,255,0.4) 100%)',
              border: '1.5px solid rgba(220,200,210,0.25)', borderRadius: 16,
              padding: isMobile ? '24px 20px' : '32px 32px',
              display: 'flex',
              flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? 16 : 0,
              marginBottom: 56,
            }}>
              <div>
                <BannerTitle>Browse template shop</BannerTitle>
                <BannerSub>Notion planners, trackers & productivity systems</BannerSub>
              </div>
              <BannerCta $fullWidth={isMobile} onClick={() => navigate('/templates')}>
                <ArrowRight /> Browse
              </BannerCta>
            </div>

            {/* Purchases — driven by shared usePurchases() hook + the
                shared <PurchaseListItem>, so this section automatically
                mirrors the dedicated /studio (account → Purchases) view.
                #purchases anchor lets the dropdown shortcut scroll here. */}
            <SectionRow id="purchases">
              <SectionTitle>My Purchases <SectionCount>{purchases.length}</SectionCount></SectionTitle>
            </SectionRow>

            {purchases.length === 0 ? (
              <DashEmptyBox onClick={() => navigate('/templates')}>
                <DashEmptyCircle><Download /></DashEmptyCircle>
                <DashEmptyTitle>No purchases yet</DashEmptyTitle>
                <DashEmptyHint>Browse the shop to find planners for Notion</DashEmptyHint>
              </DashEmptyBox>
            ) : (
              <>
                {purchases.map(p => (
                  <PurchaseListItem key={p.id} purchase={p} />
                ))}
              </>
            )}
          </>
        )}
      </Container>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        eyebrow="Delete widget"
        eyebrowTone="danger"
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : 'Delete widget?'}
        size="sm"
        hideClose
      >
        <DeleteModalText>
          The embed URL will stop working immediately. This can&apos;t be undone.
        </DeleteModalText>
        <ModalFooter>
          <SharedButton
            type="button"
            $variant="outline"
            $size="lg"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </SharedButton>
          <SharedButton
            type="button"
            $variant="dangerStrong"
            $size="lg"
            onClick={() => {
              if (deleteTarget) {
                handleDelete(deleteTarget.id);
                setDeleteTarget(null);
              }
            }}
          >
            Delete
          </SharedButton>
        </ModalFooter>
      </Modal>

      {/* Single toast that fires for both flows: editor-header Copy button
          (`copied` state) and the per-row copy button on widgets list
          (`copiedWidgetId`). Whichever flips true wins. */}
      <Toast
        open={copiedWidgetId !== null || copied}
        onClose={() => { setCopiedWidgetId(null); setCopied(false); }}
        tone="success"
      >
        Embed code copied
      </Toast>

      {/* Upgrade modal is rendered globally via UpgradeModalProvider (see App.tsx). */}
    </Page>
  );
};
