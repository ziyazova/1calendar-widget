import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from './presentation/themes/theme';

import { LandingPage } from './presentation/pages/LandingPage';
import { StudioPage } from './presentation/pages/StudioPage';
import { WidgetStudioPage } from './presentation/pages/WidgetStudioPage';
import { TemplatesPage } from './presentation/pages/TemplatesPage';
import { CalendarEmbedPage } from './presentation/pages/CalendarEmbedPage';
import { ClockEmbedPage } from './presentation/pages/ClockEmbedPage';
import { BoardEmbedPage } from './presentation/pages/BoardEmbedPage';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';

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
  }
`;

function App() {
  const diContainer = DIContainer.getInstance();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/widgets" element={<WidgetStudioPage />} />
            <Route path="/studio" element={<StudioPage diContainer={diContainer} />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
            <Route path="/embed/clock" element={<ClockEmbedPage />} />
            <Route path="/embed/board" element={<BoardEmbedPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
