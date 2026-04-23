import React, { useState, useId } from 'react';
import styled from 'styled-components';
import {
  inputSizeTokens,
  inputStateTokens,
  inputTextTokens,
  InputSize,
  InputState,
} from '../../themes/inputTokens';

export type { InputSize, InputState };

type FormFieldState = Exclude<InputState, 'focused'>;

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  helper?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  state?: FormFieldState;
  $size?: InputSize;
}

const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${inputTextTokens.labelGap};
  font-family: inherit;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const LabelText = styled.label`
  font-size: ${inputTextTokens.labelFontSize};
  font-weight: ${inputTextTokens.labelFontWeight};
  color: ${inputTextTokens.labelColor};
  letter-spacing: -0.01em;
`;

const HintText = styled.span`
  font-size: ${inputTextTokens.hintFontSize};
  font-weight: ${inputTextTokens.hintFontWeight};
  color: ${inputTextTokens.hintColor};
  letter-spacing: -0.01em;
`;

const FieldShell = styled.div<{ $state: InputState; $size: InputSize; $hasIcon: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: ${({ $size }) => inputSizeTokens[$size].height};
  padding: 0;
  border-radius: ${({ $size }) => inputSizeTokens[$size].radius};
  background: ${({ $state }) => inputStateTokens[$state].bg};
  border: ${({ $state }) => inputStateTokens[$state].border};
  box-shadow: ${({ $state }) => inputStateTokens[$state].shadow};
  transition: ${inputTextTokens.transition};
`;

const LeadingIcon = styled.span<{ $state: InputState; $size: InputSize }>`
  position: absolute;
  left: ${({ $size }) => inputSizeTokens[$size].iconLeft};
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $state }) => inputStateTokens[$state].iconColor};
  pointer-events: none;
  transition: ${inputTextTokens.transition};

  svg {
    width: ${({ $size }) => inputSizeTokens[$size].iconSize};
    height: ${({ $size }) => inputSizeTokens[$size].iconSize};
  }
`;

const TrailingAction = styled.span<{ $state: InputState; $size: InputSize }>`
  position: absolute;
  right: ${({ $size }) => inputSizeTokens[$size].iconLeft};
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  color: ${({ $state }) => inputStateTokens[$state].iconColor};

  svg {
    width: ${({ $size }) => inputSizeTokens[$size].iconSize};
    height: ${({ $size }) => inputSizeTokens[$size].iconSize};
  }
`;

const BareInput = styled.input<{ $size: InputSize; $hasIcon: boolean; $hasTrailing: boolean; $state: InputState }>`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ $state }) => inputStateTokens[$state].fg};
  font-family: inherit;
  font-size: ${({ $size }) => inputSizeTokens[$size].fontSize};
  letter-spacing: -0.01em;
  padding-left: ${({ $size, $hasIcon }) => $hasIcon ? inputSizeTokens[$size].iconPadding.split(' ')[3] : inputSizeTokens[$size].padding.split(' ')[1]};
  padding-right: ${({ $size, $hasTrailing }) => $hasTrailing ? inputSizeTokens[$size].iconPadding.split(' ')[3] : inputSizeTokens[$size].padding.split(' ')[1]};

  &::placeholder {
    color: ${inputTextTokens.placeholder};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const HelperText = styled.span<{ $state: FormFieldState }>`
  display: inline-flex;
  align-items: center;
  gap: ${inputTextTokens.helperGap};
  font-size: ${inputTextTokens.helperFontSize};
  letter-spacing: -0.01em;
  color: ${({ $state }) =>
    $state === 'error' ? inputTextTokens.helperErrorColor :
    $state === 'success' ? inputTextTokens.helperSuccessColor :
    inputTextTokens.helperColor};

  svg { width: 14px; height: 14px; flex-shrink: 0; }
`;

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, hint, helper, icon, trailing, state = 'default', $size = 'lg', id, disabled, onFocus, onBlur, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [focused, setFocused] = useState(false);

  const resolvedState: InputState = disabled
    ? 'disabled'
    : state === 'default' && focused
      ? 'focused'
      : state;

  return (
    <FieldRoot>
      {(label || hint) && (
        <LabelRow>
          {label ? <LabelText htmlFor={fieldId}>{label}</LabelText> : <span />}
          {hint && <HintText>{hint}</HintText>}
        </LabelRow>
      )}
      <FieldShell $state={resolvedState} $size={$size} $hasIcon={Boolean(icon)}>
        {icon && <LeadingIcon $state={resolvedState} $size={$size}>{icon}</LeadingIcon>}
        <BareInput
          ref={ref}
          id={fieldId}
          disabled={disabled}
          $size={$size}
          $hasIcon={Boolean(icon)}
          $hasTrailing={Boolean(trailing)}
          $state={resolvedState}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        {trailing && <TrailingAction $state={resolvedState} $size={$size}>{trailing}</TrailingAction>}
      </FieldShell>
      {helper && <HelperText $state={state === 'default' ? 'default' : state}>{helper}</HelperText>}
    </FieldRoot>
  );
});
