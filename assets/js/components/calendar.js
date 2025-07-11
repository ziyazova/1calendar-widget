// Calendar Widget Component
class CalendarWidget {
  constructor(container, customizationContainer) {
    this.container = container;
    this.customizationContainer = customizationContainer;
    this.currentDate = new Date();
    this.settings = {
      bgColor: '#ffffff',
      opacity: 15,
      borderRadius: 24
    };

    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.init();
  }

  init() {
    this.render();
    this.setupCustomization();
    this.loadSettings();
  }

  render() {
    this.container.innerHTML = `
      <div class="calendar-container" id="calendarContainer">
        <div class="calendar-header">
          <div class="nav-buttons">
            <button id="prevMonth">←</button>
          </div>
          <h2 id="monthLabel"></h2>
          <div class="nav-buttons">
            <button id="nextMonth">→</button>
          </div>
        </div>
        <div class="weekdays">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div class="days" id="calendarDays"></div>
      </div>
    `;

    this.setupEventListeners();
    this.generateCalendar();
  }

  setupEventListeners() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.changeMonth(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.changeMonth(1));
    }
  }

  setupCustomization() {
    this.customizationContainer.innerHTML = `
      <div class="customization-panel">
        <div class="customization-header">
          <h3 class="customization-title">Calendar Settings</h3>
          <p class="customization-subtitle">Customize your calendar appearance</p>
        </div>
        
        <div class="customization-section">
          <h4 class="section-title">Background</h4>
          <div class="control-group">
            <label class="control-label">
              Background Color
              <span class="control-value" id="bgColorValue">${this.settings.bgColor}</span>
            </label>
            <input type="color" id="bgColorPicker" class="color-picker" value="${this.settings.bgColor}">
          </div>
          <div class="control-group">
            <label class="control-label">
              Opacity
              <span class="control-value" id="opacityValue">${this.settings.opacity}%</span>
            </label>
            <input type="range" id="opacitySlider" class="range-slider" min="0" max="100" value="${this.settings.opacity}">
          </div>
        </div>
        
        <div class="customization-section">
          <h4 class="section-title">Shape</h4>
          <div class="control-group">
            <label class="control-label">
              Border Radius
              <span class="control-value" id="borderRadiusValue">${this.settings.borderRadius}px</span>
            </label>
            <input type="range" id="borderRadiusSlider" class="range-slider" min="0" max="50" value="${this.settings.borderRadius}">
          </div>
        </div>
      </div>
    `;

    this.setupCustomizationEvents();
  }

  setupCustomizationEvents() {
    const bgColorPicker = document.getElementById('bgColorPicker');
    const opacitySlider = document.getElementById('opacitySlider');
    const borderRadiusSlider = document.getElementById('borderRadiusSlider');

    if (bgColorPicker) {
      bgColorPicker.addEventListener('input', (e) => {
        this.settings.bgColor = e.target.value;
        document.getElementById('bgColorValue').textContent = e.target.value;
        this.updateStyles();
      });
    }

    if (opacitySlider) {
      opacitySlider.addEventListener('input', (e) => {
        this.settings.opacity = e.target.value;
        document.getElementById('opacityValue').textContent = e.target.value + '%';
        this.updateStyles();
      });
    }

    if (borderRadiusSlider) {
      borderRadiusSlider.addEventListener('input', (e) => {
        this.settings.borderRadius = e.target.value;
        document.getElementById('borderRadiusValue').textContent = e.target.value + 'px';
        this.updateStyles();
      });
    }
  }

  updateStyles() {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) return;

    const rgb = this.hexToRgb(this.settings.bgColor);
    const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.settings.opacity / 100})`;

    calendarContainer.style.background = backgroundColor;
    calendarContainer.style.borderRadius = `${this.settings.borderRadius}px`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalDays = lastDay.getDate();

    const monthLabel = document.getElementById('monthLabel');
    const calendarDays = document.getElementById('calendarDays');

    if (!monthLabel || !calendarDays) return;

    monthLabel.textContent = this.monthNames[month].toUpperCase() + ' ' + year;
    calendarDays.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      calendarDays.innerHTML += '<div class="empty"></div>';
    }

    // Add days of the month
    for (let d = 1; d <= totalDays; d++) {
      const isToday = (d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear());
      calendarDays.innerHTML += `<div class="${isToday ? 'today' : ''}">${d}</div>`;
    }
  }

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.generateCalendar();
  }

  loadSettings() {
    // Load settings from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get('config');

    if (config) {
      try {
        const decodedConfig = atob(config);
        const settings = JSON.parse(decodedConfig);

        if (settings.bgColor) this.settings.bgColor = settings.bgColor;
        if (settings.opacity) this.settings.opacity = settings.opacity;
        if (settings.borderRadius) this.settings.borderRadius = settings.borderRadius;

        this.updateCustomizationUI();
        this.updateStyles();
      } catch (e) {
        console.log('Could not load settings from URL');
      }
    }
  }

  updateCustomizationUI() {
    const bgColorPicker = document.getElementById('bgColorPicker');
    const opacitySlider = document.getElementById('opacitySlider');
    const borderRadiusSlider = document.getElementById('borderRadiusSlider');

    if (bgColorPicker) {
      bgColorPicker.value = this.settings.bgColor;
      document.getElementById('bgColorValue').textContent = this.settings.bgColor;
    }

    if (opacitySlider) {
      opacitySlider.value = this.settings.opacity;
      document.getElementById('opacityValue').textContent = this.settings.opacity + '%';
    }

    if (borderRadiusSlider) {
      borderRadiusSlider.value = this.settings.borderRadius;
      document.getElementById('borderRadiusValue').textContent = this.settings.borderRadius + 'px';
    }
  }

  getEmbedUrl() {
    const settings = {
      bgColor: this.settings.bgColor,
      opacity: this.settings.opacity,
      borderRadius: this.settings.borderRadius,
      widget: 'calendar'
    };

    const settingsString = JSON.stringify(settings);
    const base64Settings = btoa(settingsString);

    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    return `${baseUrl}embed.html?config=${base64Settings}`;
  }
}

// Make CalendarWidget available globally
window.CalendarWidget = CalendarWidget; 