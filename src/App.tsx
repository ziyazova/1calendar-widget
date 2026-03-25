import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from './presentation/themes/theme';

import { LandingPage } from './presentation/pages/LandingPage';
import { StudioPage } from './presentation/pages/StudioPage';
import { WidgetStudioPage } from './presentation/pages/WidgetStudioPage';
import { TemplatesPage } from './presentation/pages/TemplatesPage';
import { TemplateDetailPage } from './presentation/pages/TemplateDetailPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { CheckoutPage } from './presentation/pages/CheckoutPage';
import { CalendarEmbedPage } from './presentation/pages/CalendarEmbedPage';
import { ClockEmbedPage } from './presentation/pages/ClockEmbedPage';
import { BoardEmbedPage } from './presentation/pages/BoardEmbedPage';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { DebugOverlay } from './presentation/components/debug/DebugOverlay';
import { DesignSystemPage } from './presentation/pages/DesignSystemPage';
import { PageTransition } from './presentation/components/shared/PageTransition';
import { CartProvider } from './presentation/context/CartContext';
import { AuthProvider } from './presentation/context/AuthContext';

import { DIContainer } from './infrastructure/di/DIContainer';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  *:focus-visible {
    outline: 2px solid #3384F4;
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const diContainer = DIContainer.getInstance();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
        <CartProvider>
          <Router basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <DebugOverlay />
            <PageTransition>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/widgets" element={<WidgetStudioPage />} />
                <Route path="/studio" element={<StudioPage diContainer={diContainer} />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/templates/:id" element={<TemplateDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
                <Route path="/embed/clock" element={<ClockEmbedPage />} />
                <Route path="/embed/board" element={<BoardEmbedPage />} />
                <Route path="/dev" element={<DesignSystemPage />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </PageTransition>
          </Router>
        </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
