# How to Use the Testimonial Widget Script

## 🚀 Quick Start (Simplest Method)

Just add this single line before `</body>` in your HTML:

```html
<script 
    src="https://testimonial-frontend-soz6.vercel.app/script.js" 
    data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
</script>
```

**That's it!** The widget will automatically:
- ✅ Add a "Give Testimonial" button (configured in your dashboard)
- ✅ Load your site configuration
- ✅ Handle testimonial submissions

---

## 📋 Two Ways to Use It

### Method 1: Auto-Initialization (Recommended)

The script automatically initializes when the page loads:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome</h1>
    
    <!-- Add script before closing </body> tag -->
    <script 
        src="https://testimonial-frontend-soz6.vercel.app/script.js" 
        data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
    </script>
</body>
</html>
```

**Features:**
- Button appears automatically (if enabled in dashboard)
- No JavaScript code needed
- Works immediately

---

### Method 2: Manual Initialization (Advanced)

If you want to control when it loads or display testimonials manually:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome</h1>
    
    <!-- Container for displaying testimonials -->
    <div id="testimonials"></div>
    
    <!-- Load the script -->
    <script 
        src="https://testimonial-frontend-soz6.vercel.app/script.js" 
        data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
    </script>
    
    <script>
        // Wait for script to load, then display testimonials
        window.addEventListener('load', async () => {
            // Wait a bit for widget to initialize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check if widget is available
            if (window.TestimonialWidget) {
                const widget = new window.TestimonialWidget(
                    '78aa25ae-fe26-441a-b709-31320479433b',
                    'https://testimonial-frontend-soz6.vercel.app'
                );
                
                // Display testimonials
                await widget.displayTestimonials('testimonials', {
                    layout: 'grid',      // 'grid', 'list', or 'carousel'
                    limit: 6,            // Number of testimonials to show
                    showRating: true,    // Show star ratings
                    showAuthor: true     // Show author info
                });
            }
        });
    </script>
</body>
</html>
```

---

## ⚙️ Configuration Options

All configuration is done in your **dashboard**, not in code:

- **Button appearance** (color, position, text, size)
- **Testimonial form** (fields, layout, styling)
- **Display settings** (grid/list/carousel, number of testimonials)
- **Theme** (colors, fonts, border radius)

Visit your dashboard to customize these settings!

---

## 📍 Button Positions

The button position is set in your dashboard:
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

---

## 🎨 Display Testimonials

To show testimonials on your page, use:

```javascript
// After widget loads
const widget = new window.TestimonialWidget(
    'your-site-id',
    'https://testimonial-frontend-soz6.vercel.app'
);

// Display in a container
await widget.displayTestimonials('container-id', {
    layout: 'grid',        // 'grid', 'list', or 'carousel'
    limit: 6,              // Max testimonials to show
    showRating: true,      // Show star ratings
    showAuthor: true       // Show author name/avatar
});
```

**HTML:**
```html
<div id="container-id"></div>
```

---

## 🔍 Troubleshooting

### Button not appearing?
- Check dashboard: Is button enabled?
- Open browser console (F12) for errors
- Verify script loaded: Check Network tab

### Testimonials not showing?
- Make sure testimonials are **published** in dashboard
- Check container ID matches in HTML
- Wait a few seconds after page load

### CORS errors?
- The script has CORS enabled
- Make sure you're using the correct URL

### Script blocked by CSP (Content Security Policy)?
If you see "blocked:csp" error, add this meta tag to your HTML `<head>`:

```html
<head>
    <meta http-equiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; 
                   connect-src 'self' https://testimonial-frontend-soz6.vercel.app;">
</head>
```

**For server-level CSP (Apache/Nginx/Node.js):**
- Apache: `Header set Content-Security-Policy "script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; connect-src 'self' https://testimonial-frontend-soz6.vercel.app;"`
- Nginx: `add_header Content-Security-Policy "script-src 'self' 'unsafe-inline' https://testimonial-frontend-soz6.vercel.app; connect-src 'self' https://testimonial-frontend-soz6.vercel.app;";`

---

## 📝 Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website with Testimonials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        #testimonials {
            margin: 40px 0;
        }
    </style>
</head>
<body>
    <h1>Welcome to Our Website</h1>
    <p>Check out what our customers say!</p>
    
    <!-- Testimonials will appear here -->
    <h2>Customer Testimonials</h2>
    <div id="testimonials">
        <p>Loading testimonials...</p>
    </div>
    
    <!-- Testimonial Widget Script -->
    <script 
        src="https://testimonial-frontend-soz6.vercel.app/script.js" 
        data-site-id="78aa25ae-fe26-441a-b709-31320479433b">
    </script>
    
    <script>
        // Display testimonials after page loads
        window.addEventListener('load', async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (window.TestimonialWidget) {
                const widget = new window.TestimonialWidget(
                    '78aa25ae-fe26-441a-b709-31320479433b',
                    'https://testimonial-frontend-soz6.vercel.app'
                );
                
                await widget.displayTestimonials('testimonials', {
                    layout: 'grid',
                    limit: 6,
                    showRating: true,
                    showAuthor: true
                });
            }
        });
    </script>
</body>
</html>
```

---

## ✅ Next Steps

1. **Test the button**: Click it and submit a testimonial
2. **Publish testimonials**: Go to dashboard → Testimonials → Publish
3. **Customize**: Change colors, button text, form fields in dashboard
4. **Add to your site**: Copy the script tag to your real website!

---

## 🆘 Need Help?

- Check browser console (F12) for errors
- Verify your site ID in the dashboard
- Make sure script URL is correct
- Testimonials must be **published** to appear

