# Widget Studio

A lightweight, customizable widget collection for embedding in Notion and other platforms.

## Features

- 📅 **Calendar Widget** - Beautiful, customizable calendar
- 🎨 **Live Customization** - Real-time styling adjustments
- 🔗 **Easy Embedding** - One-click copy embed URLs
- 📱 **Responsive Design** - Works on all devices
- 🎛️ **No Dependencies** - Pure vanilla JavaScript

## Structure

```
1calendar-widget/
├── index.html              # Main application
├── embed.html              # Embed page for iframes
├── assets/
│   ├── css/
│   │   ├── styles.css      # Global styles
│   │   └── components/
│   │       ├── sidebar.css      # Sidebar navigation
│   │       ├── customization.css # Customization panel
│   │       └── calendar.css      # Calendar component
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   └── components/
│   │       └── calendar.js      # Calendar widget
│   └── icons/
│       └── copy.svg        # Copy icon
└── README.md
```

## Usage

1. **Development**: Open `index.html` in your browser
2. **Customization**: Use the right panel to customize widget appearance
3. **Embedding**: Click "Copy Embed URL" to get the iframe URL
4. **Notion Integration**: Paste the URL into a Notion embed block

## Current Widgets

### Calendar
- Navigate between months
- Highlights current date
- Customizable background, opacity, and border radius
- Responsive design

## Future Widgets

- 📊 Charts
- 🌤️ Weather
- 📝 Notes
- And more...

## License

Open source - feel free to use and modify! 