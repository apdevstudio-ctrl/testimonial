'use client';

import { useState } from 'react';
import { Copy, Check, Code, FileText, Settings, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';

export default function IntegrationGuidePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://testiflow.site';
  const exampleSiteId = 'your-site-id-here';

  const quickStartCode = `<script 
    src="${baseUrl}/script.js" 
    data-site-id="${exampleSiteId}">
</script>`;

  const completeExampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    
    <!-- CSP: Add this if your site uses Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' ${baseUrl}; 
                   connect-src 'self' ${baseUrl};">
    
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
        src="${baseUrl}/script.js" 
        data-site-id="${exampleSiteId}">
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
                        '${exampleSiteId}',
                        '${baseUrl}'
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
</html>`;

  const buttonOnlyCode = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    
    <!-- CSP: Only if your site uses CSP -->
    <meta http-equiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' ${baseUrl}; 
                   connect-src 'self' ${baseUrl};">
</head>
<body>
    <h1>Welcome</h1>
    <p>Click the button to leave a testimonial!</p>
    
    <!-- Just add the script tag - button appears automatically -->
    <script 
        src="${baseUrl}/script.js" 
        data-site-id="${exampleSiteId}">
    </script>
</body>
</html>`;

  const cspMetaTag = `<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' ${baseUrl}; 
               connect-src 'self' ${baseUrl};">`;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Integration Guide</h1>
        <p className="text-lg text-gray-600">
          Complete guide for integrating the TestiFlow testimonial widget into your website
        </p>
      </div>

      {/* Quick Start */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Quick Start</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Add this single line before <code className="bg-gray-100 px-2 py-1 rounded">&lt;/body&gt;</code> in your HTML:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 relative">
          <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">{quickStartCode}</code>
          <Button
            onClick={() => copyToClipboard(quickStartCode, 'quickstart')}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copiedSection === 'quickstart' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 font-medium mb-2">What you get:</p>
          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>"Give Testimonial" button appears automatically</li>
            <li>Users can submit testimonials</li>
            <li>All configuration done in dashboard</li>
          </ul>
        </div>
      </Card>

      {/* Complete Example */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Complete Example (Button + Display)</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Complete working example with button and testimonials display:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 relative">
          <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">{completeExampleCode}</code>
          <Button
            onClick={() => copyToClipboard(completeExampleCode, 'complete')}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copiedSection === 'complete' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* Button Only */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Button Only Setup</h2>
        </div>
        <p className="text-gray-600 mb-4">
          If you only want the submission button (no display):
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 relative">
          <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">{buttonOnlyCode}</code>
          <Button
            onClick={() => copyToClipboard(buttonOnlyCode, 'buttononly')}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copiedSection === 'buttononly' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>

      {/* Display Options */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Display Testimonials Options</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Grid Layout (Default)</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
{`await widgetInstance.displayTestimonials('container-id', {
    layout: 'grid',
    limit: 6,
    showRating: true,
    showAuthor: true
});`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">List Layout</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
{`await widgetInstance.displayTestimonials('container-id', {
    layout: 'list',
    limit: 10,
    showRating: true,
    showAuthor: true
});`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Carousel Layout</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
{`await widgetInstance.displayTestimonials('container-id', {
    layout: 'carousel',
    limit: 5,
    showRating: true,
    showAuthor: true
});`}
              </code>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration */}
      <Card className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration</h2>
        <p className="text-gray-600 mb-4">
          All customization is done in your <strong>Dashboard</strong>, not in code:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Button:</strong> Position, color, text, size, shape</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Form:</strong> Fields, layout, styling</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Theme:</strong> Colors, fonts, border radius</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-1">•</span>
            <span><strong>Display:</strong> Component style, grid/list/carousel settings</span>
          </li>
        </ul>
        <p className="text-gray-600 mt-4">
          Visit your dashboard to customize!
        </p>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Troubleshooting</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Script blocked by CSP?</h3>
            <p className="text-gray-600 mb-2">
              If you see "blocked:csp" error, add this meta tag to your <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code>:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
              <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">{cspMetaTag}</code>
              <Button
                onClick={() => copyToClipboard(cspMetaTag, 'csp')}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                {copiedSection === 'csp' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Button not appearing?</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Check dashboard: Is button enabled?</li>
              <li>Check browser console (F12) for errors</li>
              <li>Verify script loaded in Network tab</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Testimonials not showing?</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li><strong>Publish testimonials</strong> in dashboard first</li>
              <li>Check container ID matches in HTML</li>
              <li>Wait a few seconds after page load</li>
              <li>Check browser console for errors</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Duplicate testimonials?</h3>
            <p className="text-gray-700 mb-2">Make sure to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Clear container before displaying: <code className="bg-gray-100 px-1 rounded">container.innerHTML = '';</code></li>
              <li>Use <code className="bg-gray-100 px-1 rounded">isDisplaying</code> flag to prevent multiple calls</li>
              <li>Use <code className="bg-gray-100 px-1 rounded">{'{ once: true }'}</code> on event listeners</li>
            </ul>
          </div>
        </div>
      </Card>


    </div>
  );
}

