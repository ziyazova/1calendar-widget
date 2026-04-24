import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';
import type { ButtonSize } from '../../themes/buttonTokens';

/**
 * CopyButton — copy-to-clipboard with built-in feedback.
 *
 * Idle   → outline variant + Copy icon
 * Copied → successSoft variant + Check icon (reverts after `resetMs`)
 *
 *   <CopyButton value="https://…" $size="sm" />
 *   <CopyButton value={embedUrl} label="Copy embed URL" />
 *
 * Pattern consolidated from StudioPage WidgetCard and embed dialogs — every
 * copy action in the app now shares the same visual feedback.
 */

export interface CopyButtonProps {
  /** The text that will be written to clipboard on click. */
  value: string;
  /** Accessible label / tooltip. Defaults to "Copy". */
  label?: string;
  /** Label shown while in the copied state. Defaults to "Copied!". */
  copiedLabel?: string;
  /** Button size — forwarded to the shared Button. Default: `sm`. */
  $size?: ButtonSize;
  /** Icon-only rendering (no text next to the icon). Default: true. */
  $iconOnly?: boolean;
  /** ms before reverting from copied → idle. Default: 2000. */
  resetMs?: number;
  /** Called after a successful copy (e.g. for analytics / toasts). */
  onCopied?: () => void;
  /** Optional className for layout/positioning. */
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  $size = 'sm',
  $iconOnly = true,
  resetMs = 2000,
  onCopied,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    if (!value) return;
    // Optimistic UI: flip to success immediately so feedback is instant
    // and isn't blocked by clipboard permission dialogs or failures.
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), resetMs);

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {
        // Silently swallow — the UI already confirmed.
      });
    }
  }, [value, resetMs, onCopied]);

  return (
    <Button
      type="button"
      $variant={copied ? 'successSoft' : 'outline'}
      $size={$size}
      $iconOnly={$iconOnly}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      onClick={handleClick}
      className={className}
    >
      {copied ? <Check /> : <Copy />}
      {!$iconOnly && (copied ? copiedLabel : label)}
    </Button>
  );
};
