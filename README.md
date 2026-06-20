# Digital Invitation Builder - Phase 1

A complete static website invitation builder with no database, no backend. Everything runs on client-side HTML, CSS, JavaScript, and JSON.

## 📋 Project Structure

```
project/
├── index.html                    # Landing page / Home
├── invitation.html               # Dynamic invitation display
├── admin/
│   └── index.html               # Admin dashboard (Phase 2)
├── data/
│   ├── config.json              # Application configuration
│   └── invitation.json          # Main invitation data
├── templates/
│   ├── wedding.json             # Wedding event template
│   ├── engagement.json          # Engagement event template
│   ├── birthday.json            # Birthday event template
│   ├── housewarming.json        # Housewarming event template
│   ├── babyshower.json          # Baby shower event template
│   ├── corporate.json           # Corporate event template
│   └── custom.json              # Custom event template
├── js/
│   ├── language-manager.js      # Multilingual content handling
│   ├── data-loader.js           # JSON data loading
│   ├── rendering-engine.js      # Dynamic HTML generation
│   └── theme-manager.js         # Theme and styling
├── css/
│   └── (styles are inline in HTML for Phase 1)
├── images/                      # Gallery images
├── uploads/                     # User uploaded files (Phase 2)
└── audio/                       # Background music files
```

## 🚀 Quick Start

### Option 1: Local Development
1. Clone or download the repository
2. Open `index.html` in a browser
3. Click "View Invitation" to see the invitation
4. All data is loaded from `data/invitation.json`

### Option 2: Deploy to Netlify
```bash
# Upload all files to Netlify
# Or connect your Git repository to Netlify for auto-deployment
```

### Option 3: Deploy to Shared Hosting (cPanel, Hostinger, GoDaddy, Namecheap)
1. Upload all files to your hosting via FTP
2. Ensure file permissions are set correctly (644 for files, 755 for directories)
3. Access via your domain

## 📝 File Descriptions

### index.html
- Landing page with feature overview
- Links to invitation and admin dashboard
- Beautiful introduction with animated particles

### invitation.html
- Main invitation display page
- Dynamically loads content from `data/invitation.json`
- Supports multiple events, gallery, and RSVP
- Language switcher (English/Tamil)
- Theme toggle (Dark/Light mode)

### data/config.json
Configuration file containing:
- App metadata (name, version)
- Supported languages
- Supported event types
- Default theme colors and fonts

### data/invitation.json
Main data file containing:
- Event metadata (couple names, monograms)
- Main event details (date, time, venue, description)
- Multiple additional events
- Gallery configuration with images
- Music configuration
- Theme colors and fonts
- Language settings

### templates/*.json
Event type templates defining:
- Template metadata
- Template fields and structure
- Field types (multiLanguage, date, time, object, array, etc.)
- Labels in both English and Tamil

### js/language-manager.js
Handles:
- Language switching (English/Tamil)
- Multilingual content rendering
- LocalStorage persistence
- Date/time formatting per language
- Fallback to default language

**Key Methods:**
```javascript
languageManager.setLanguage(lang)        // Set language
languageManager.getText(content)         // Get translated text
languageManager.formatDate(dateString)   // Format date per language
languageManager.formatTime(timeString)   // Format time
```

### js/data-loader.js
Manages JSON data loading:
- Loads config.json
- Loads invitation.json
- Loads event templates
- Caches loaded data
- Provides methods to access specific data

**Key Methods:**
```javascript
await dataLoader.loadConfig()           // Load configuration
await dataLoader.loadInvitation()       // Load invitation data
await dataLoader.loadTemplate(type)     // Load specific template
await dataLoader.getEvent(eventId)      // Get event by ID
await dataLoader.getAllEvents()         // Get all events
await dataLoader.getGalleryImages()     // Get gallery images
```

### js/rendering-engine.js
Dynamically generates HTML:
- Renders complete invitation from JSON
- Renders individual sections (header, events, gallery, RSVP)
- Handles multilingual content
- Integrates with language and theme managers

**Key Methods:**
```javascript
await renderingEngine.render(containerId)        // Render full invitation
renderingEngine.renderHeader(invitation)         // Render header
renderingEngine.renderEventSection(event)        // Render event
renderingEngine.renderGallery(gallery)          // Render gallery
```

### js/theme-manager.js
Manages theming:
- Dark/Light mode toggle
- CSS custom properties for colors and fonts
- LocalStorage persistence
- Dynamic theme updates

**Key Methods:**
```javascript
await themeManager.applyTheme()          // Apply theme
themeManager.toggleDarkMode()            // Toggle dark/light mode
themeManager.updateColors(colorConfig)   // Update colors
themeManager.updateFonts(fontConfig)     // Update fonts
```

## 🌐 Language Support

The invitation builder supports English and Tamil:

### How Multilingual Content Works

All text fields use JSON objects with language keys:

```json
{
  "firstName": {
    "en": "Ramanan",
    "ta": "ரமணன்"
  }
}
```

The `LanguageManager` automatically:
- Detects user's preferred language
- Falls back to English if translation missing
- Formats dates/times per language
- Stores preference in localStorage

### Switching Languages

Users can click the 🌐 button in the top-right to toggle between English and Tamil.

## 🎨 Theme System

### Colors
All colors are stored as CSS custom properties:
- `--primary-color`: Main accent color (#C8A96E)
- `--secondary-color`: Secondary accent (#D4849A)
- `--background-color`: Background (#080D1C)
- `--surface-color`: Card background (#0D1530)
- `--text-color`: Text color (#F2DFA0)

### Fonts
- `--font-heading`: 'Playfair Display' (serif)
- `--font-body`: 'Cormorant Garamond' (serif)
- `--font-accent`: 'Great Vibes' (cursive)

### Theme Modes
- **Dark Mode** (default): Rich, elegant dark theme
- **Light Mode**: Clean, bright variant

Users can toggle themes with the ☀️/🌙 button in top-right.

## 📊 Data Structure

### invitation.json Schema

```json
{
  "eventId": "unique-event-id",
  "eventType": "wedding|engagement|birthday|housewarming|babyshower|corporate|custom",
  "couple": {
    "firstName": { "en": "...", "ta": "..." },
    "secondName": { "en": "...", "ta": "..." },
    "monogramFirst": "R",
    "monogramSecond": "N"
  },
  "mainEvent": {
    "name": { "en": "...", "ta": "..." },
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "meridiem": "AM|PM",
    "venue": {
      "name": { "en": "...", "ta": "..." },
      "address": { "en": "...", "ta": "..." },
      "googleMapsUrl": "https://..."
    },
    "description": { "en": "...", "ta": "..." }
  },
  "events": [
    {
      "id": "event-id",
      "name": { "en": "...", "ta": "..." },
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "meridiem": "AM|PM",
      "venue": { ... },
      "description": { "en": "...", "ta": "..." }
    }
  ],
  "gallery": {
    "enabled": true,
    "images": [
      {
        "url": "images/image1.jpg",
        "caption": { "en": "...", "ta": "..." },
        "type": "jpg|png|webp|gif"
      }
    ]
  },
  "music": {
    "enabled": true,
    "audioUrl": "audio.mp3",
    "autoplay": false,
    "loop": true
  },
  "theme": {
    "colors": {
      "primary": "#C8A96E",
      "secondary": "#D4849A",
      "background": "#080D1C",
      "surface": "#0D1530",
      "text": "#F2DFA0"
    },
    "fonts": {
      "heading": "'Playfair Display', serif",
      "body": "'Cormorant Garamond', serif",
      "accent": "'Great Vibes', cursive"
    },
    "backgroundImage": ""
  },
  "language": "en|ta",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

## 🔧 How to Customize

### Change Invitation Content
1. Edit `data/invitation.json`
2. Update couple names, dates, venues
3. Refresh `invitation.html` in browser
4. Changes apply instantly

### Add Gallery Images
1. Add image files to `images/` folder
2. Update `gallery.images` array in `data/invitation.json`
3. Include image URL, caption (English & Tamil), and type

### Change Theme
1. Edit `theme` section in `data/invitation.json`
2. Modify colors (hex format)
3. Change fonts (Google Fonts names)
4. Changes apply immediately

### Add New Events
1. Add objects to `events` array in `data/invitation.json`
2. Each event needs: name, date, time, venue, description
3. All fields should have English and Tamil translations

## 🚀 Deployment Checklist

- [ ] Update `data/invitation.json` with your event data
- [ ] Add gallery images to `images/` folder
- [ ] Update theme colors in `data/invitation.json`
- [ ] Test on mobile, tablet, desktop
- [ ] Test both English and Tamil
- [ ] Test dark and light modes
- [ ] Upload to hosting (FTP)
- [ ] Test on production URL
- [ ] Share invitation URL with guests

## 🔐 Security Notes

- All data is stored locally in JSON files
- No personal information is sent to external servers
- Gallery images are hosted locally
- Theme configuration is in JSON only

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚙️ Technical Stack - Phase 1

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid
- **JavaScript**: ES6+, Async/Await
- **JSON**: Data storage
- **Google Fonts**: Typography
- **LocalStorage**: Preferences persistence

## 🎯 Phase 1 Completion

✅ Complete folder structure created
✅ JSON configuration system
✅ Data loader module
✅ Multilingual support (English/Tamil)
✅ Dynamic rendering engine
✅ Theme management (Dark/Light mode)
✅ Language switching
✅ Responsive design
✅ Landing page
✅ Invitation display page
✅ All 7 event type templates

## 📈 Phase 2 (Coming)

- [ ] Admin dashboard with visual editor
- [ ] Edit event data in browser
- [ ] Add/remove events
- [ ] Upload gallery images
- [ ] Customize theme colors
- [ ] Export/publish functionality
- [ ] Wishes wall with Netlify Forms
- [ ] Music player integration
- [ ] More animations and effects

## 📄 License

This project is provided as-is for personal and commercial use.

## 💡 Support

For issues or questions, refer to the code comments or restructure your `data/invitation.json` file according to the schema provided.

---

**Built with ❤️ for beautiful celebrations**
