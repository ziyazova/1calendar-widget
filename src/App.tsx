import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './presentation/themes/theme';

import { LandingPage } from './presentation/pages/LandingPage';
import { StudioPage } from './presentation/pages/StudioPage';
import { CalendarEmbedPage } from './presentation/pages/CalendarEmbedPage';
import { ClockEmbedPage } from './presentation/pages/ClockEmbedPage';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';

import { DIContainer } from './infrastructure/di/DIContainer';

function App() {
  const diContainer = DIContainer.getInstance();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Router basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/studio" element={<StudioPage diContainer={diContainer} />} />
            <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
            <Route path="/embed/clock" element={<ClockEmbedPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;