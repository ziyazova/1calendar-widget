import styled from 'styled-components';
import { textStyle, TextStyle } from '../../themes/textStyleTokens';

/**
 * Text — semantic typography component driven by `textStyleTokens.ts`.
 *
 *   <Text $variant="h1">Welcome</Text>
 *   <Text $variant="body" as="p">A paragraph…</Text>
 *   <Text $variant="caption" as="span">Meta</Text>
 *
 * Variants: display / h1 / h2 / h3 / bodyL / body / button / caption / micro
 *
 * Editing a recipe in `textStyleTokens.ts` updates every site-wide usage.
 * Safe to adopt piecemeal — existing hand-tuned typography keeps working.
 */

export type { TextStyle };

interface TextProps {
  $variant: TextStyle;
}

export const Text = styled.div<TextProps>`
  ${({ $variant }) => textStyle($variant)}
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;
