import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; current: string; branches: string[] }
  | { kind: 'switching'; to: string }
  | { kind: 'error'; message: string };

const BRANCH_LABEL: Record<string, { emoji: string; title: string; subtitle: string }> = {
  main: {
    emoji: '🌿',
    title: 'main',
    subtitle: 'stable / prod',
  },
  'design-experiment': {
    emoji: '🧪',
    title: 'design-experiment',
    subtitle: 'Claude-design sandbox',
  },
};

export function BranchSwitcher() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  const load = async () => {
    try {
      const res = await fetch('/__branch');
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setState({ kind: 'ready', current: data.current, branches: data.branches });
    } catch {
      // Dev endpoint not available — silent, component just won't render.
      setState({ kind: 'error', message: 'dev server not reachable' });
    }
  };

  useEffect(() => {
    load();
  }, []);


  const switchTo = async (branch: string) => {
    setState({ kind: 'switching', to: branch });
    try {
      const res = await fetch('/__branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Most common: uncommitted changes. Show the git error so she sees why.
        setState({
          kind: 'error',
          message: data.error || 'checkout failed',
        });
        return;
      }
      // Vite will HMR on file changes; forcing a reload ensures a clean state.
      window.location.reload();
    } catch (err) {
      setState({ kind: 'error', message: String(err) });
    }
  };

  if (state.kind === 'loading' || state.kind === 'error' && state.message === 'dev server not reachable') {
    return null;
  }

  return (
    <Bar data-branch-switcher>
      <Brand>
        <span style={{ fontSize: 14 }}>🎨</span>
        Branch
      </Brand>

      <Tabs>
        {(['main', 'design-experiment'] as const).map((b) => {
          const info = BRANCH_LABEL[b];
          const isActive =
            state.kind === 'ready' ? state.current === b : state.kind === 'switching' ? false : false;
          const isTargetSwitching = state.kind === 'switching' && state.to === b;

          return (
            <Tab
              key={b}
              $active={isActive}
              disabled={state.kind === 'switching'}
              onClick={() => {
                if (!isActive) switchTo(b);
              }}
            >
              <TabEmoji>{info.emoji}</TabEmoji>
              <TabText>
                <TabTitle>
                  {info.title}
                  {isActive && <ActiveDot />}
                  {isTargetSwitching && <Spinner />}
                </TabTitle>
                <TabSub>{info.subtitle}</TabSub>
              </TabText>
            </Tab>
          );
        })}
      </Tabs>

      {state.kind === 'error' && state.message !== 'dev server not reachable' && (
        <ErrorChip
          onClick={() => {
            load();
          }}
          title={state.message}
        >
          ⚠ {state.message.length > 80 ? state.message.slice(0, 77) + '…' : state.message}
          <ErrorDismiss>✕</ErrorDismiss>
        </ErrorChip>
      )}
    </Bar>
  );
}

const slideIn = keyframes`
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Bar = styled.div`
  position: fixed;
  top: 88px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  background: linear-gradient(180deg, #1F1F1F 0%, #2B2520 100%);
  color: #fff;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  z-index: 2147483645;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 220px;
  animation: ${slideIn} 0.25s ease-out;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px 6px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.06)')};
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.08)' : 'transparent')};
  color: #fff;
  cursor: ${({ $active, disabled }) => ($active || disabled ? 'default' : 'pointer')};
  font-family: inherit;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  flex: 1;
  min-width: 0;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)')};
    border-color: rgba(255, 255, 255, 0.14);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const TabEmoji = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const TabText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  min-width: 0;
`;

const TabTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.005em;
`;

const TabSub = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.06em;
`;

const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
`;

const Spinner = styled.span`
  width: 10px;
  height: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const ErrorChip = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px;
  margin-top: 4px;
  background: rgba(220, 60, 60, 0.18);
  border: 1px solid rgba(220, 60, 60, 0.3);
  color: #FFB3B3;
  border-radius: 6px;
  font-family: inherit;
  font-size: 10.5px;
  line-height: 1.3;
  cursor: pointer;
  text-align: left;
  word-break: break-word;
`;

const ErrorDismiss = styled.span`
  opacity: 0.6;
`;
