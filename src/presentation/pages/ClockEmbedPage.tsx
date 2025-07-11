import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DIContainer } from '../../infrastructure/di/DIContainer';
import { Widget } from '../../domain/entities/Widget';
import { ClockWidget } from '../components/widgets/ClockWidget';

const EmbedContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
`;

export const ClockEmbedPage: React.FC = () => {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const diContainer = DIContainer.getInstance();

      // Try to load widget from URL
      const widgetFromUrl = diContainer.loadWidgetFromUrlUseCase.execute(window.location.href);

      if (widgetFromUrl && widgetFromUrl.type === 'clock') {
        setWidget(widgetFromUrl);
      } else {
        // Create default clock widget if no config in URL
        diContainer.createWidgetUseCase.execute('clock')
          .then(defaultWidget => setWidget(defaultWidget))
          .catch(err => setError('Failed to create clock widget'));
      }
    } catch (err) {
      setError('Failed to load clock widget');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <EmbedContainer>
        <ErrorMessage>Loading clock...</ErrorMessage>
      </EmbedContainer>
    );
  }

  if (error || !widget) {
    return (
      <EmbedContainer>
        <ErrorMessage>{error || 'Clock widget not found'}</ErrorMessage>
      </EmbedContainer>
    );
  }

  return (
    <EmbedContainer>
      <ClockWidget widget={widget} />
    </EmbedContainer>
  );
}; 