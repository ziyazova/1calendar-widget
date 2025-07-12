
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './presentation/themes/theme';

import { LandingPage } from './presentation/pages/LandingPage';
import { StudioPage } from './presentation/pages/StudioPage';
import { CalendarEmbedPage } from './presentation/pages/CalendarEmbedPage';
import { ClockEmbedPage } from './presentation/pages/ClockEmbedPage';
import { WeatherEmbedPage } from './presentation/pages/WeatherEmbedPage';
import { TestEmbedPage } from './presentation/pages/TestEmbedPage';
import { TestingGroundPage } from './presentation/pages/TestingGroundPage';

import { DIContainer } from './infrastructure/di/DIContainer';

function App() {
  const diContainer = DIContainer.getInstance();

  return (
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/studio" element={<StudioPage diContainer={diContainer} />} />

          <Route path="/embed/calendar" element={<CalendarEmbedPage />} />
          <Route path="/embed/clock" element={<ClockEmbedPage />} />
          <Route path="/embed/weather" element={<WeatherEmbedPage />} />
          <Route path="/embed/test" element={<TestEmbedPage />} />

          <Route path="/test" element={<TestingGroundPage />} />

          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 