# Testimonial Widget Script

Injectable JavaScript script for testimonial collection on any website.

## Building

```bash
npm install
npm run build
```

This will create `dist/testimonial-script.js` which is served by the backend at `/script.js`.

## Usage

Website owners can integrate the script by adding this tag to their HTML:

```html
<script src="http://localhost:3000/script.js" data-site-id="your-site-id"></script>
```

## Features

- **Shadow DOM**: Isolated styling to prevent conflicts
- **Dynamic Configuration**: Loads site configuration from backend
- **Video Recording**: Browser-based video testimonial recording
- **Text Forms**: Text testimonial submission
- **Multiple Flow Types**: Modal, drawer, or iframe page
- **Event Tracking**: Tracks all user interactions
- **Theme Customization**: Applies theme from dashboard configuration

## Development

Watch mode for development:
```bash
npm run watch
```

