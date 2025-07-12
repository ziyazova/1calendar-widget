import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './presentation/themes/theme';
import { GlobalStyles } from './presentation/components/layout/GlobalStyles';

// Import pages
import { LandingPage } from './presentation/pages/LandingPage';
import { StudioPage } from './presentation/pages/StudioPage';
import { CalendarEmbedPage } from './presentation/pages/CalendarEmbedPage';
import { ClockEmbedPage } from './presentation/pages/ClockEmbedPage';
import { WeatherEmbedPage } from './presentation/pages/WeatherEmbedPage';
import { TestingGroundPage } from './presentation/pages/TestingGroundPage';

// Dependency injection container
import { DIContainer } from './infrastructure/di/DIContainer';

function App() {
  // Initialize DI container
  const diContainer = DIContainer.getInstance();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router basename="/">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Studio workspace */}
          <Route path="/studio" element={<StudioPage diContainer={diContainer} />} />

          {/* Widget embed routes */}
          <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
          <Route path="/embed/clock" element={<ClockEmbedPage />} />
          <Route path="/embed/weather" element={<WeatherEmbedPage />} />

          {/* Testing ground for iframe testing */}
          <Route path="/test" element={<TestingGroundPage />} />

          {/* Catch-all redirects to landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 