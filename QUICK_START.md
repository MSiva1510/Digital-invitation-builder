# Quick Start Guide

Get your invitation live in 5 minutes!

---

## ⚡ 5-Minute Setup

### Step 1: Prepare Your Data (2 min)

Open `data/invitation.json` in a text editor and update:

```json
{
  "couple": {
    "firstName": { "en": "YOUR NAME", "ta": "உங்கள் பெயர்" },
    "secondName": { "en": "PARTNER NAME", "ta": "இணை பெயர்" },
    "monogramFirst": "X",
    "monogramSecond": "Y"
  },
  "mainEvent": {
    "name": { "en": "Your Event Name", "ta": "உங்கள் நிகழ்வு" },
    "date": "2026-06-15",        // YYYY-MM-DD
    "time": "18:00",             // HH:MM
    "venue": {
      "name": { "en": "Venue Name", "ta": "இடபெயர்" },
      "address": { "en": "City Address", "ta": "நகர முகவரி" },
      "googleMapsUrl": "https://maps.google.com/?q=Venue+Name"
    }
  }
}
```

**Save the file.**

### Step 2: Add Images (1 min)

1. Create `images/` folder (if not exists)
2. Add your photos (JPG, PNG, WEBP)
3. Update `invitation.json` gallery section:

```json
"gallery": {
  "enabled": true,
  "images": [
    {
      "url": "images/photo1.jpg",
      "caption": { "en": "Pre-Wedding", "ta": "திருமணத்திற்கு முன்" },
      "type": "jpg"
    }
  ]
}
```

### Step 3: Deploy (2 min)

Choose ONE option:

#### Option A: Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your project folder
3. Done! Site is live with HTTPS

#### Option B: FTP to Hosting
1. Connect via FTP (FileZilla, Cyberduck)
2. Upload all files to `public_html/`
3. Access via your domain

#### Option C: GitHub + Netlify
1. Push to GitHub
2. Connect to Netlify
3. Auto-deploys on every push

---

## 🎨 Quick Customization

### Change Colors

In `data/invitation.json`:

```json
"theme": {
  "colors": {
    "primary": "#C8A96E",      // Main color (hex)
    "secondary": "#D4849A",    // Accent color
    "background": "#080D1C",   // Background (dark)
    "surface": "#0D1530",      // Card background
    "text": "#F2DFA0"          // Text color
  }
}
```

**Use hex color codes from:**
- [Color Picker](https://htmlcolorcodes.com)
- [Coolors.co](https://coolors.co)
- [Material Design Colors](https://material.io/resources/color/)

### Change Fonts

In `data/invitation.json`:

```json
"fonts": {
  "heading": "'Playfair Display', serif",
  "body": "'Cormorant Garamond', serif",
  "accent": "'Great Vibes', cursive"
}
```

**Available Google Fonts:**
- Headings: Playfair Display, Bodoni Moda, Lora
- Body: Cormorant Garamond, Montserrat, Open Sans
- Accent: Great Vibes, Pacifico, Caveat, Dancing Script

### Add Events

In `data/invitation.json`, add to `events` array:

```json
"events": [
  {
    "id": "event-2",
    "name": { "en": "Reception", "ta": "விருந்து" },
    "date": "2026-06-15",
    "time": "20:00",
    "venue": {
      "name": { "en": "Same Venue", "ta": "அதே இடம்" },
      "address": { "en": "Address", "ta": "முகவரி" },
      "googleMapsUrl": "https://maps.google.com/?q=..."
    },
    "description": { "en": "Join us...", "ta": "சேர்ந்து கொள்ளுங்கள்" }
  }
]
```

---

## 🌐 Language Support

The invitation automatically supports:
- **English** (en)
- **Tamil** (ta)

Users click 🌐 button to switch languages.

**All text fields use this format:**

```json
"name": {
  "en": "English text",
  "ta": "Tamil text"
}
```

---

## 📱 Testing

### Test Locally

1. Open `index.html` in browser
2. Click "View Invitation"
3. Test:
   - [ ] All text displays
   - [ ] Images load
   - [ ] 🌐 Language button works
   - [ ] ☀️ Theme toggle works
   - [ ] Mobile responsive
   - [ ] All links work

### Test After Deployment

1. Visit your live URL
2. Test same checklist
3. Test on mobile device
4. Share with friends

---

## 🔧 Troubleshooting

### Issue: Invitation page blank
**Solution:**
1. Check browser console (F12)
2. Verify `data/invitation.json` exists
3. Check JSON syntax at [jsonlint.com](https://jsonlint.com)
4. Check file paths

### Issue: Images not loading
**Solution:**
1. Verify images in `images/` folder
2. Check paths in `invitation.json`
3. Verify file names match exactly
4. Check file permissions (644)

### Issue: Text doesn't show
**Solution:**
1. Check JSON has both "en" and "ta" keys
2. Verify no special characters breaking JSON
3. Clear browser cache (Ctrl+Shift+Del)
4. Try incognito window

### Issue: Styles look wrong
**Solution:**
1. Hard refresh page (Ctrl+F5)
2. Clear browser cache
3. Check CSS loading in DevTools Network tab
4. Verify no CSS errors in console

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **README.md** | Main documentation |
| **DEPLOYMENT.md** | Deploy to any hosting |
| **CUSTOMIZATION.md** | Color schemes, fonts, snippets |
| **FILE_STRUCTURE.md** | Complete file organization |
| **QUICK_START.md** | This file! Quick setup |

---

## 💾 File Checklist

Before deploying, verify you have:

- [ ] `index.html` (landing page)
- [ ] `invitation.html` (main page)
- [ ] `data/config.json` (configuration)
- [ ] `data/invitation.json` (event data) ⭐ EDIT THIS
- [ ] `js/language-manager.js` (language support)
- [ ] `js/data-loader.js` (data loading)
- [ ] `js/rendering-engine.js` (rendering)
- [ ] `js/theme-manager.js` (theming)
- [ ] `templates/wedding.json` (event templates)
- [ ] `templates/engagement.json`
- [ ] `templates/birthday.json`
- [ ] `templates/housewarming.json`
- [ ] `templates/babyshower.json`
- [ ] `templates/corporate.json`
- [ ] `templates/custom.json`
- [ ] `admin/index.html` (admin panel stub)
- [ ] `.gitignore` (git configuration)
- [ ] `images/` folder with photos ⭐ ADD YOUR PHOTOS
- [ ] `audio/` folder (optional) 🎵 OPTIONAL

---

## 🚀 Deployment Hosts Ranked

### Free Options
1. **Netlify** ⭐⭐⭐⭐⭐ (Easiest)
   - Drag & drop
   - Free HTTPS
   - Auto-deploys
   - Custom domain

2. **Cloudflare Pages** ⭐⭐⭐⭐⭐
   - Very fast
   - Free tier
   - Global CDN
   - Easy GitHub setup

3. **GitHub Pages** ⭐⭐⭐⭐
   - Free forever
   - GitHub integration
   - Custom domain support
   - No build step

### Paid Options (Budget)
- **Hostinger**: $3-5/month
- **Namecheap**: $3-8/month
- **GoDaddy**: $5-10/month

### Recommended for Beginners
**Netlify** - Can be live in 60 seconds!

---

## 📞 Common Questions

### Q: Can I use my own domain?
**A:** Yes! All platforms support custom domains.

### Q: Is SSL/HTTPS included?
**A:** Yes! All platforms provide free HTTPS.

### Q: Can guests RSVP?
**A:** Phase 1 has RSVP button design. Phase 2 adds form integration.

### Q: Can I track who opens the invitation?
**A:** Not in Phase 1. Coming in Phase 3 with analytics.

### Q: Can guests leave wishes/comments?
**A:** Coming in Phase 3 with wishes wall feature.

### Q: Do I need a database?
**A:** No! Everything is in JSON files (static).

### Q: Can I use music?
**A:** Yes! Music enabled in `invitation.json`. Autoplay can be disabled.

### Q: Will it work on all devices?
**A:** Yes! Fully responsive design tested on all devices.

### Q: Can I have multiple invitations?
**A:** Yes! Create different `invitation.json` files or branches.

---

## ⚡ Power User Tips

### Tip 1: Keep Backups
```bash
cp data/invitation.json data/invitation-backup.json
```

### Tip 2: Version Control
```bash
git init
git add .
git commit -m "Initial invitation"
```

### Tip 3: Test on Mobile
Use browser DevTools:
- F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- Test on iPhone, Android sizes

### Tip 4: Optimize Images
```bash
# Compress before uploading
jpegoptim --size=100k *.jpg
optipng -o2 *.png
```

### Tip 5: Monitor Performance
- Check Google PageSpeed Insights
- Target > 90 score
- Compress images if needed

---

## 🎓 Next Steps

### After Deploying
1. ✅ Share URL with guests
2. ✅ Test all features
3. ✅ Monitor performance
4. ✅ Gather feedback
5. ✅ Plan Phase 2 features

### Planned Features (Phase 2)
- [ ] Visual admin dashboard
- [ ] Edit data in browser
- [ ] Upload images in dashboard
- [ ] Color picker for themes
- [ ] Export/import functionality

### Planned Features (Phase 3)
- [ ] Wishes wall
- [ ] Guest RSVP tracking
- [ ] Email notifications
- [ ] QR code generation
- [ ] Analytics dashboard

---

## 🎉 You're Ready!

Your invitation website is ready to deploy!

### Quick Checklist
- [ ] Updated `data/invitation.json` with your details
- [ ] Added images to `images/` folder
- [ ] Tested `index.html` locally
- [ ] Chose hosting platform
- [ ] Deployed successfully
- [ ] Shared with guests

**Time to celebrate! 🥳**

---

## 📞 Need Help?

### Check These First
1. **JSON Syntax:** [jsonlint.com](https://jsonlint.com)
2. **Color Codes:** [htmlcolorcodes.com](https://htmlcolorcodes.com)
3. **Browser Console:** F12 → Console tab
4. **Network Issues:** F12 → Network tab

### Documentation
- README.md - Complete guide
- DEPLOYMENT.md - Hosting guides
- CUSTOMIZATION.md - Snippets
- FILE_STRUCTURE.md - File organization

### Contact Hosting Support
- Netlify: [netlify.com/support](https://netlify.com/support)
- Hostinger: [hostinger.com/support](https://hostinger.com/support)
- GoDaddy: [godaddy.com/help](https://godaddy.com/help)

---

**Happy inviting! Your beautiful invitation is just minutes away! 💌**
