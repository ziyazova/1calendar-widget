import styled from 'styled-components';
import { inputTokens, inputLabelTokens } from '../../themes/inputTokens';

export const Input = styled.input`
  height: ${inputTokens.height};
  padding: ${inputTokens.padding};
  border: ${inputTokens.border};
  border-radius: ${inputTokens.radius};
  background: ${inputTokens.bg};
  color: ${inputTokens.color};
  font-size: ${inputTokens.fontSize};
  font-family: inherit;
  transition: ${inputTokens.transition};
  outline: none;

  &:hover {
    border-color: ${inputTokens.borderHover};
  }

  &:focus {
    border-color: ${inputTokens.borderFocus};
    box-shadow: ${inputTokens.focusRing};
  }

  &::placeholder {
    color: ${inputTokens.placeholder};
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const InputLabel = styled.label`
  display: block;
  font-size: ${inputLabelTokens.fontSize};
  font-weight: ${inputLabelTokens.fontWeight};
  letter-spacing: ${inputLabelTokens.letterSpacing};
  text-transform: ${inputLabelTokens.textTransform};
  color: ${inputLabelTokens.color};
  margin-bottom: ${inputLabelTokens.marginBottom};
`;
