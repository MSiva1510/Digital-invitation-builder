# Deployment Guide - Digital Invitation Builder

This guide covers deploying your invitation website to various hosting platforms.

---

## 🚀 Quick Deploy Checklist

Before deploying anywhere, ensure:
- [ ] `data/invitation.json` is updated with your event details
- [ ] Gallery images are in `images/` folder
- [ ] `data/config.json` matches your requirements
- [ ] All event templates are present
- [ ] Tested locally in browser
- [ ] Tested on mobile device

---

## 📋 Table of Contents

1. [Netlify](#netlify)
2. [Cloudflare Pages](#cloudflare-pages)
3. [Vercel](#vercel)
4. [Hostinger (cPanel)](#hostinger-cpanel)
5. [GoDaddy](#godaddy)
6. [Namecheap](#namecheap)
7. [AWS S3 + CloudFront](#aws-s3--cloudfront)
8. [GitHub Pages](#github-pages)

---

## Netlify

### Option 1: Drag & Drop (Easiest)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Create a free account
3. Drag and drop your project folder
4. Your site will be live in seconds!

**Pros:**
- Instant deployment
- Free HTTPS
- Custom domain support
- Continuous deployment from GitHub

### Option 2: GitHub Integration

1. Push your project to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Connect GitHub to Netlify
   - Go to Netlify
   - Click "New site from Git"
   - Select GitHub and authorize
   - Select your repository
   - Click Deploy

3. Your site updates automatically on every push!

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Or watch for changes
netlify deploy --prod --dir=. --watch
```

**Custom Domain:**
- Netlify Dashboard → Site Settings → Domain Management
- Add your domain (CNAME/DNS)

---

## Cloudflare Pages

### Setup Steps

1. Push code to GitHub (as shown in Netlify Option 2)

2. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)

3. Sign up with free account

4. Click "Create a project"

5. Select GitHub repository

6. Build settings:
   - Build command: (leave empty - it's static)
   - Build output directory: `.` (or `/`)

7. Click "Save and Deploy"

**Benefits:**
- Unlimited free deployments
- Global CDN
- DDoS protection
- No build step required (perfect for static)

---

## Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### GitHub Integration

1. Connect GitHub account to Vercel
2. Select repository
3. Click "Deploy"
4. Automatic deployments on every push

**Note:** Vercel is optimized for Node.js, but works fine with static sites.

---

## Hostinger (cPanel)

### Via FTP

1. **Get FTP Credentials**
   - Log in to Hostinger control panel
   - Go to Files → FTP Accounts
   - Create new FTP user or use default
   - Note: hostname, username, password

2. **Download FTP Client**
   - Windows: FileZilla, WinSCP
   - Mac: Cyberduck, Transmit
   - Linux: FileZilla

3. **Connect via FTP**
   - Open FTP client
   - Enter hostname, username, password
   - Connect

4. **Upload Files**
   ```
   Navigate to: /public_html/
   
   Upload all files and folders:
   - index.html
   - invitation.html
   - admin/
   - data/
   - js/
   - css/
   - images/
   - templates/
   - uploads/
   ```

5. **Set Permissions**
   - Files: 644 (rw-r--r--)
   - Folders: 755 (rwxr-xr-x)

6. **Access Your Site**
   - Your domain URL (should be live immediately)

### Via File Manager (cPanel)

1. Log in to cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Upload all files and folders
5. Right-click folders → Change Permissions to 755
6. Right-click files → Change Permissions to 644

### Configure SSL Certificate (Free)

1. In cPanel, go to AutoSSL
2. Click Install SSL certificate
3. Choose your domain
4. Click Install
5. Verify certificate is active

### Important Notes

- Always upload to `public_html` (or your site's root)
- Data folder should be `public_html/data/`
- Images should be `public_html/images/`
- JS files should be `public_html/js/`
- Permissions: 644 for files, 755 for folders

---

## GoDaddy

### Method 1: cPanel Interface

1. Log in to GoDaddy account
2. Go to Hosting → Manage
3. Click cPanel icon
4. Navigate to File Manager
5. Open `public_html` folder
6. Upload all project files (see Hostinger instructions above)

### Method 2: Via FTP

1. Go to GoDaddy → Hosting → Manage
2. Look for "FTP Information"
3. Use those credentials with FileZilla or similar
4. Connect and upload to `public_html`

### SSL Certificate

- GoDaddy includes free Let's Encrypt SSL
- Usually auto-installed
- Check: Settings → SSL/TLS Certificates

---

## Namecheap

### Via cPanel

1. Log in to Namecheap
2. Go to My Hosting → Manage
3. Click cPanel
4. Open File Manager
5. Navigate to `public_html`
6. Upload all files (same as Hostinger)

### Via FTP

1. Get FTP info from cPanel
2. Use FileZilla or similar
3. Upload to `public_html`

### Free SSL (AutoSSL)

- Included with most plans
- Auto-installed by cPanel
- Verify it's active in cPanel

---

## AWS S3 + CloudFront

### S3 Setup

1. Create AWS Account
2. Go to S3 service
3. Create bucket
   - Name: `invitation-builder-yourdomain`
   - Region: Closest to you
   - Block Public Access: Unchecked

4. Upload files
   - Click "Upload"
   - Select all files and folders
   - Upload

5. Enable Static Website Hosting
   - Bucket Properties
   - Static Website Hosting
   - Index document: `index.html`
   - Error document: `index.html`

6. Make files public
   - Bucket Policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```

### CloudFront Distribution

1. Go to CloudFront
2. Create Distribution
3. Origin Domain: Your S3 bucket website endpoint
4. Default root object: `index.html`
5. Create Distribution
6. Wait for deployment (5-10 minutes)

### Connect Custom Domain

1. In Route53, create record
2. Point to CloudFront distribution
3. Wait for DNS propagation (24-48 hours)

---

## GitHub Pages

### Free Static Hosting

1. Create GitHub repository
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Go to Repository Settings
3. Scroll to Pages section
4. Select "Deploy from a branch"
5. Select "main" branch
6. Save

7. Your site will be live at:
   - `https://yourusername.github.io/repo-name`

### Custom Domain

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Add DNS records:
   - Type: A
   - Name: @
   - Value: 185.199.108.153

3. In GitHub Pages Settings
4. Add custom domain
5. Enable HTTPS
6. Wait for verification

---

## 🔄 Updating After Deployment

### Make Changes Locally

```bash
# Edit data/invitation.json
# or update images

# Test locally
# Open index.html in browser
```

### Redeploy

**If using Netlify/GitHub:**
```bash
git add .
git commit -m "Update invitation content"
git push origin main
# Site updates automatically!
```

**If using FTP/cPanel:**
1. Connect via FTP
2. Delete old files
3. Upload new files
4. Test in browser

**If using Netlify Drag & Drop:**
1. Go to Netlify
2. Drag new project folder
3. Done!

---

## 📊 Performance Tips

### Image Optimization

```bash
# Convert to WebP for better compression
# Use ImageMagick or online tools
mogrify -format webp *.jpg

# Optimize PNG files
optipng images/*.png

# WebP is supported by all modern browsers
```

### Caching Headers

For cPanel/Hostinger, add `.htaccess`:

```apache
# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/x-javascript
</IfModule>

# Cache browser
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/gif "access plus 1 month"
</IfModule>
```

### Cloudflare Configuration

Use Cloudflare free tier for:
- Automatic GZIP compression
- Image optimization
- Global CDN
- DDoS protection

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] No sensitive data in JSON files
- [ ] File permissions set correctly (644/755)
- [ ] .gitignore includes sensitive files
- [ ] No API keys in code
- [ ] Regular backups of data folder

---

## 📱 Testing After Deployment

1. **Desktop**
   - Chrome, Firefox, Safari
   - Test all pages
   - Check console for errors

2. **Mobile**
   - iPhone Safari
   - Android Chrome
   - Test touch interactions
   - Test layout

3. **Features**
   - Language switcher (English/Tamil)
   - Theme toggle (Dark/Light)
   - Gallery images load
   - Maps links work
   - RSVP buttons functional

4. **Performance**
   - Check loading time
   - Check image sizes
   - Check for 404 errors
   - Use Google PageSpeed

---

## Troubleshooting

### 404 Error - Files Not Found
- Check file paths in JSON
- Ensure all files uploaded
- Check folder structure matches

### Images Not Loading
- Verify image paths in `data/invitation.json`
- Check images/ folder exists
- Verify file permissions

### Styling Not Applied
- Check CSS loading in browser DevTools
- Ensure js/ folder uploaded
- Clear browser cache

### HTTPS Not Working
- Wait 24-48 hours for cert renewal
- Check SSL status in hosting control panel
- Force HTTPS in .htaccess:
  ```apache
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  ```

### JSON Not Updating
- Clear browser cache (Ctrl+Shift+Del)
- Check file was uploaded correctly
- Verify JSON syntax is valid

---

## Recommended Hosting by Use Case

| Platform | Best For | Price | Setup Time |
|----------|----------|-------|-----------|
| **Netlify** | Developers, CI/CD | Free | 2 min |
| **Cloudflare Pages** | Performance, Global | Free | 5 min |
| **Vercel** | Modern projects | Free | 5 min |
| **GitHub Pages** | Open source | Free | 10 min |
| **Hostinger** | Beginners, .com | $3-5/mo | 20 min |
| **GoDaddy** | All-in-one | $5-10/mo | 30 min |
| **Namecheap** | Value | $3-8/mo | 20 min |
| **AWS S3** | Scalability | ~$1/mo | 30 min |

---

## Final Checklist

- [ ] Site accessible at your domain
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Links work (internal and external)
- [ ] Language switcher works
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Loading time < 3 seconds
- [ ] SSL certificate active (HTTPS)

---

## Support

For hosting-specific issues:
- **Netlify Support:** [netlify.com/support](https://netlify.com/support)
- **Cloudflare Help:** [support.cloudflare.com](https://support.cloudflare.com)
- **Hostinger Help:** [hostinger.com/support](https://hostinger.com/support)
- **GoDaddy Support:** [godaddy.com/help](https://godaddy.com/help)

---

**Your invitation is now live! 🎉**
