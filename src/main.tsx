import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Logger } from './infrastructure/services/Logger'

window.onerror = (message, source, lineno, colno, error) => {
  Logger.error('Global', 'Unhandled error', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  Logger.error('Global', 'Unhandled promise rejection', event.reason);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 