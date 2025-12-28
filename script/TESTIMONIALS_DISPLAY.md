# Displaying Testimonials on Your Website

After users submit testimonials, you can display them on your website using the testimonial script. There are two ways to display testimonials:

## Method 1: Using the Widget Instance

If you've already initialized the widget, you can use the `displayTestimonials` method:

```html
<!-- Include the script -->
<script src="http://localhost:3000/script.js" data-site-id="your-site-id"></script>

<!-- Create a container for testimonials -->
<div id="testimonials-container"></div>

<script>
  // Wait for the widget to initialize
  window.addEventListener('load', async () => {
    // Get the widget instance (if auto-initialized)
    // Or create a new instance
    const widget = new window.TestimonialWidget('your-site-id', 'http://localhost:3000');
    
    // Wait for config to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Display testimonials
    await widget.displayTestimonials('testimonials-container', {
      layout: 'grid',        // 'grid', 'carousel', or 'list'
      limit: 6,              // Number of testimonials to show
      showRating: true,      // Show star ratings
      showAuthor: true       // Show author info
    });
  });
</script>
```

## Method 2: Using the Standalone Function

You can also use the standalone `displayTestimonials` function without initializing the full widget:

```html
<!-- Include the script -->
<script src="http://localhost:3000/script.js" data-site-id="your-site-id"></script>

<!-- Create a container for testimonials -->
<div id="testimonials-container"></div>

<script>
  window.addEventListener('load', async () => {
    await window.displayTestimonials('your-site-id', 'testimonials-container', {
      layout: 'carousel',    // 'grid', 'carousel', or 'list'
      limit: 10,             // Number of testimonials to show
      showRating: true,       // Show star ratings
      showAuthor: true,      // Show author info
      apiUrl: 'http://localhost:3000'  // Optional: API URL
    });
  });
</script>
```

## Layout Options

### Grid Layout
Displays testimonials in a responsive grid:
```javascript
{ layout: 'grid' }
```

### Carousel Layout
Displays testimonials in a horizontal scrolling carousel:
```javascript
{ layout: 'carousel' }
```

### List Layout
Displays testimonials in a vertical list:
```javascript
{ layout: 'list' }
```

## Options

- `layout` (string): Display layout - 'grid', 'carousel', or 'list' (default: 'grid')
- `limit` (number): Maximum number of testimonials to display (default: all)
- `showRating` (boolean): Show star ratings (default: true)
- `showAuthor` (boolean): Show author information (default: true)
- `apiUrl` (string): API URL (optional, auto-detected from script source)

## Example: Full Page Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>What Our Customers Say</h1>
  
  <!-- Testimonials Container -->
  <div id="testimonials-container"></div>
  
  <!-- Include Testimonial Script -->
  <script src="http://localhost:3000/script.js" data-site-id="your-site-id"></script>
  
  <script>
    // Display testimonials when page loads
    window.addEventListener('load', async () => {
      await window.displayTestimonials('your-site-id', 'testimonials-container', {
        layout: 'grid',
        limit: 6,
        showRating: true,
        showAuthor: true
      });
    });
  </script>
</body>
</html>
```

## Notes

- Only **published** testimonials are displayed
- Testimonials are automatically styled to match your site's theme
- Video testimonials will display as playable video players
- Text testimonials will display as formatted text
- If no testimonials are available, a friendly message is shown

