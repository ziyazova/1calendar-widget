import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './presentation/themes/theme';
import { GlobalStyles } from './presentation/components/layout/GlobalStyles';

// Import pages
import { DashboardPage } from './presentation/pages/DashboardPage';
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
      <Router>
        <Routes>
          {/* Main dashboard */}
          <Route path="/" element={<DashboardPage diContainer={diContainer} />} />

          {/* Widget embed routes */}
          <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
          <Route path="/embed/clock" element={<ClockEmbedPage />} />
          <Route path="/embed/weather" element={<WeatherEmbedPage />} />

          {/* Testing ground for iframe testing */}
          <Route path="/test" element={<TestingGroundPage />} />

          {/* Catch-all */}
          <Route path="*" element={<DashboardPage diContainer={diContainer} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 