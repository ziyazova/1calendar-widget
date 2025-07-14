import React, { useEffect, useState } from 'react';

export const EmbedController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data === 'object' && event.data) {
        if (event.data.type === 'show-loader') setLoading(true);
        if (event.data.type === 'hide-loader') setLoading(false);
      }
    }
    function handleCustomEvent(e: CustomEvent) {
      if (e.detail === 'show-loader') setLoading(true);
      if (e.detail === 'hide-loader') setLoading(false);
    }
    window.addEventListener('message', handleMessage);
    window.addEventListener('embed-loader', handleCustomEvent as EventListener);

    let fallback: number | null = null;
    if (loading) {
      fallback = window.setTimeout(() => setLoading(false), 10000);
    }
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('embed-loader', handleCustomEvent as EventListener);
      if (fallback) clearTimeout(fallback);
    };
  }, [loading]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка…</div>;
  }
  return <>{children}</>;
}; 