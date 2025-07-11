// Main Application
class WidgetApp {
  constructor() {
    this.currentWidget = 'calendar';
    this.widgets = {
      calendar: {
        name: 'Calendar',
        icon: '📅',
        component: null
      }
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadWidget(this.currentWidget);
  }

  setupEventListeners() {
    // Copy embed URL button
    const copyBtn = document.getElementById('copyEmbedBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyEmbedUrl());
    }

    // Sidebar navigation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('sidebar-item')) {
        const widgetId = e.target.dataset.widget;
        if (widgetId) {
          this.switchWidget(widgetId);
        }
      }
    });
  }

  switchWidget(widgetId) {
    if (this.currentWidget === widgetId) return;

    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-widget="${widgetId}"]`).classList.add('active');

    // Update header title
    const titleElement = document.getElementById('appTitle');
    if (titleElement) {
      titleElement.textContent = this.widgets[widgetId].name;
    }

    // Load widget
    this.currentWidget = widgetId;
    this.loadWidget(widgetId);
  }

  loadWidget(widgetId) {
    const widgetDisplay = document.getElementById('widgetDisplay');
    const customizationPanel = document.getElementById('customizationPanel');

    if (!widgetDisplay || !customizationPanel) return;

    // Clear current content
    widgetDisplay.innerHTML = '';
    customizationPanel.innerHTML = '';

    // Load widget based on type
    switch (widgetId) {
      case 'calendar':
        this.loadCalendarWidget(widgetDisplay, customizationPanel);
        break;
      default:
        widgetDisplay.innerHTML = '<p>Widget not found</p>';
    }
  }

  loadCalendarWidget(container, customizationContainer) {
    // Load calendar component
    if (window.CalendarWidget) {
      this.widgets.calendar.component = new window.CalendarWidget(container, customizationContainer);
    }
  }

  copyEmbedUrl() {
    const currentWidget = this.widgets[this.currentWidget];
    if (!currentWidget.component || !currentWidget.component.getEmbedUrl) {
      console.error('Current widget does not support embedding');
      return;
    }

    const embedUrl = currentWidget.component.getEmbedUrl();

    // Copy to clipboard
    navigator.clipboard.writeText(embedUrl).then(() => {
      this.showCopyFeedback();
    }).catch(err => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = embedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showCopyFeedback();
    });
  }

  showCopyFeedback() {
    const copyBtn = document.getElementById('copyEmbedBtn');
    if (!copyBtn) return;

    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Copied!
    `;
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('copied');
    }, 2000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WidgetApp();
}); 