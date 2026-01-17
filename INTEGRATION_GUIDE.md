# Testimonial Widget - Integration Guide

Complete guide for integrating the testimonial widget script into any website.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Complete Example](#complete-example)
3. [Button Only Setup](#button-only-setup)
4. [Display Testimonials](#display-testimonials)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

Add this single line before `</body>` in your HTML:

```html
<script 
    src="https://testimonial-frontend-soz6.vercel.app/script.js" 
    data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
</script>
```

**What you get:**
- ✅ "Give Testimonial" button appears automatically
- ✅ Users can submit testimonials
- ✅ All configuration done in dashboard

---

## 📝 Complete Example (Button + Display)

Complete working example with button and testimonials display:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    
    <!-- CSP: Add this if your site uses Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; 
                   connect-src 'self' https://testimonial-frontend-soz6.vercel.app;">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        #testimonials-container {
            margin: 40px 0;
        }
    </style>
</head>
<body>
    <h1>Welcome to Our Website</h1>
    
    <!-- Testimonials will display here -->
    <h2>What Our Customers Say</h2>
    <div id="testimonials-container"></div>
    
    <!-- Load Testimonial Script -->
    <script 
        src="https://testimonial-frontend-soz6.vercel.app/script.js" 
        data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
    </script>
    
    <!-- Display Testimonials -->
    <script>
        let widgetInstance = null;
        let isDisplaying = false;
        
        async function displayTestimonials() {
            if (isDisplaying) return;
            isDisplaying = true;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                if (!window.TestimonialWidget) {
                    setTimeout(displayTestimonials, 2000);
                    isDisplaying = false;
                    return;
                }
                
                const container = document.getElementById('testimonials-container');
                if (container) container.innerHTML = '';
                
                if (!widgetInstance) {
                    widgetInstance = new window.TestimonialWidget(
                        '78aa25ae-fe26-441a-b709-31320479433b',
                        'https://testimonial-frontend-soz6.vercel.app'
                    );
                }
                
                await widgetInstance.displayTestimonials('testimonials-container', {
                    layout: 'grid',      // 'grid', 'list', or 'carousel'
                    limit: 6,            // Number to show
                    showRating: true,    // Show ratings
                    showAuthor: true     // Show author info
                });
            } catch (error) {
                console.error('Error displaying testimonials:', error);
            } finally {
                isDisplaying = false;
            }
        }
        
        window.addEventListener('load', displayTestimonials, { once: true });
    </script>
</body>
</html>
```

---

## 🎯 Button Only Setup

If you only want the submission button (no display):

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    
    <!-- CSP: Only if your site uses CSP -->
    <meta http-equiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; 
                   connect-src 'self' https://testimonial-frontend-soz6.vercel.app;">
</head>
<body>
    <h1>Welcome</h1>
    <p>Click the button to leave a testimonial!</p>
    
    <!-- Just add the script tag - button appears automatically -->
    <script 
        src="https://testimonial-frontend-soz6.vercel.app/script.js" 
        data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
    </script>
</body>
</html>
```

---

## 📺 Display Testimonials Options

### Layout Types

**Grid Layout (Default):**
```javascript
await widgetInstance.displayTestimonials('container-id', {
    layout: 'grid',
    limit: 6,
    showRating: true,
    showAuthor: true
});
```

**List Layout:**
```javascript
await widgetInstance.displayTestimonials('container-id', {
    layout: 'list',
    limit: 10,
    showRating: true,
    showAuthor: true
});
```

**Carousel Layout:**
```javascript
await widgetInstance.displayTestimonials('container-id', {
    layout: 'carousel',
    limit: 5,
    showRating: true,
    showAuthor: true
});
```

---

## 🔧 Configuration

All customization is done in your **Dashboard**, not in code:

- **Button**: Position, color, text, size, shape
- **Form**: Fields, layout, styling
- **Theme**: Colors, fonts, border radius
- **Display**: Grid/list/carousel settings

Visit your dashboard to customize!

---

## ❗ Troubleshooting

### Script blocked by CSP?

If you see "blocked:csp" error, add this meta tag to your `<head>`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; 
               connect-src 'self' https://testimonial-frontend-soz6.vercel.app;">
```

### Button not appearing?

1. Check dashboard: Is button enabled?
2. Check browser console (F12) for errors
3. Verify script loaded in Network tab

### Testimonials not showing?

1. **Publish testimonials** in dashboard first
2. Check container ID matches in HTML
3. Wait a few seconds after page load
4. Check browser console for errors

### Duplicate testimonials?

Make sure to:
- Clear container before displaying: `container.innerHTML = '';`
- Use `isDisplaying` flag to prevent multiple calls
- Use `{ once: true }` on event listeners

---

## 📞 Need Help?

- Check browser console (F12) for detailed errors
- Verify your Site ID in the dashboard
- Make sure script URL is correct
- Testimonials must be **published** to appear

---

## 🔗 Quick Reference

**Script URL:**
```
https://testimonial-frontend-soz6.vercel.app/script.js
```

**Your Site ID:**
```
78aa25ae-fe26-441a-b709-31320479433b
```

**Dashboard:**
```
https://testimonial-frontend-soz6.vercel.app
```

