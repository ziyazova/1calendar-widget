import styled from 'styled-components';
import { studioText, StudioTextStyle } from '../../themes/studioTypography';

/**
 * StudioText — typography for the internal app UI (Studio / Dashboard /
 * Settings / Sidebar). See `studioTypography.ts` for the 8 presets and
 * when each applies.
 *
 *   <StudioText $variant="pageTitle" as="h1">Welcome back</StudioText>
 *   <StudioText $variant="cardTitle">My Widget</StudioText>
 *   <StudioText $variant="menuItem" as="span">Templates</StudioText>
 *
 * Use the public-site `<Text>` for landing/templates/login instead —
 * the two systems intentionally run different type scales.
 */

export type { StudioTextStyle };

interface StudioTextProps {
  $variant: StudioTextStyle;
}

export const StudioText = styled.div<StudioTextProps>`
  ${({ $variant }) => studioText($variant)}
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;
