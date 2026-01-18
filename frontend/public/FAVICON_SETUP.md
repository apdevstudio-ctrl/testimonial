# Favicon Setup Guide

To complete the favicon setup, add the following image files to `/frontend/public/`:

## Required Favicon Files:

1. **favicon.ico** - Main favicon (16x16, 32x32, 48x48)
2. **icon.svg** - SVG favicon (scalable)
3. **icon-16x16.png** - 16x16 PNG
4. **icon-32x32.png** - 32x32 PNG
5. **icon-192x192.png** - 192x192 PNG (for Android)
6. **icon-512x512.png** - 512x512 PNG (for Android)
7. **apple-touch-icon.png** - 180x180 PNG (for iOS)
8. **og-image.jpg** - 1200x630 JPG (for Open Graph/social sharing)

## Steps:

1. Create or download your TestiFlow logo images in the sizes above
2. Place all files in the `frontend/public/` directory
3. The metadata is already configured in `app/layout.tsx`

## Quick Online Tools:

- **Favicon Generator**: https://realfavicongenerator.net/
- **Image Resizer**: https://www.iloveimg.com/resize-image

## Note:

The favicon files are referenced in `app/layout.tsx` metadata configuration. Once you add the actual image files, they will automatically be used by the browser.

