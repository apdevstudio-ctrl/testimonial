'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Move, Palette, Layout, Eye, EyeOff, FileEdit, Save, Globe, Copy, Check, ExternalLink, Grid } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import FormDesigner from './FormDesigner';
import TestimonialPageBuilder from './TestimonialPageBuilder';
import TestimonialDisplayBuilder from './TestimonialDisplayBuilder';
import { useToast } from '@/components/ui/Toast';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[];
  min?: number;
  max?: number;
}

interface FormDesign {
  fields: FormField[];
  layout: 'single' | 'two-column' | 'three-column';
  showHeader: boolean;
  headerText: string;
  headerSubtext?: string;
  showFooter: boolean;
  footerText?: string;
  submitButtonText: string;
  submitButtonPosition: 'left' | 'center' | 'right' | 'full';
}

interface Site {
  button: {
    enabled: boolean;
    type: 'floating' | 'inline';
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    text: string;
    backgroundColor: string;
    textColor: string;
    shape: 'rounded' | 'square' | 'pill';
    size: 'small' | 'medium' | 'large';
    visibility: {
      hideOnMobile: boolean;
      hideOnDesktop: boolean;
      hideAfterSubmission: boolean;
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    buttonStyle: 'filled' | 'outlined' | 'text';
  };
  enabledFeatures: {
    videoTestimonial: boolean;
    textTestimonial: boolean;
  };
  flowType: 'modal' | 'drawer' | 'page';
  formDesign?: FormDesign;
  pageDesign?: {
    hero: {
      enabled: boolean;
      title: string;
      subtitle: string;
      backgroundType: 'color' | 'gradient' | 'image';
      backgroundColor: string;
      backgroundGradient: string;
      backgroundImage?: string;
      textColor: string;
      alignment: 'left' | 'center' | 'right';
      padding: 'small' | 'medium' | 'large';
    };
    content: {
      showBeforeForm: boolean;
      beforeFormText: string;
      showAfterForm: boolean;
      afterFormText: string;
    };
    pageTheme: {
      backgroundColor: string;
      textColor: string;
      containerMaxWidth: string;
      containerPadding: string;
    };
  };
  testimonialDisplay?: {
    layout: 'grid' | 'carousel' | 'list';
    itemsPerRow?: number;
    limit?: number;
    showRating: boolean;
    showAuthor: boolean;
    showVideo: boolean;
    cardStyle: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
      padding: string;
      shadow: 'none' | 'small' | 'medium' | 'large';
    };
    authorStyle: {
      showAvatar: boolean;
      avatarSize: string;
      showCompany: boolean;
      showPosition: boolean;
      textColor: string;
    };
    ratingStyle: {
      starColor: string;
      emptyStarColor: string;
      size: 'small' | 'medium' | 'large';
    };
    spacing: {
      gap: string;
      margin: string;
    };
  };
}

interface VisualBuilderProps {
  site: Site & { siteId?: string; _id?: string };
  onUpdate: (updates: Partial<Site>) => void;
}

const defaultFormDesign: FormDesign = {
  fields: [
    { id: '1', type: 'text', label: 'Name', name: 'author[name]', placeholder: 'Enter your name', required: true, visible: true, order: 1 },
    { id: '2', type: 'email', label: 'Email', name: 'author[email]', placeholder: 'Enter your email', required: true, visible: true, order: 2 },
    { id: '3', type: 'textarea', label: 'Testimonial', name: 'text', placeholder: 'Share your experience...', required: true, visible: true, order: 3 },
    { id: '4', type: 'number', label: 'Rating', name: 'rating', placeholder: '1-5', required: false, visible: true, order: 4, min: 1, max: 5 },
  ],
  layout: 'single',
  showHeader: true,
  headerText: 'Share Your Testimonial',
  headerSubtext: 'We value your feedback',
  showFooter: false,
  submitButtonText: 'Submit Testimonial',
  submitButtonPosition: 'full',
};

export default function VisualBuilder({ site, onUpdate }: VisualBuilderProps) {
  const defaultConfig: Site = {
    button: {
      enabled: site.button?.enabled ?? true,
      type: site.button?.type ?? 'floating',
      position: site.button?.position ?? 'bottom-right',
      text: site.button?.text || 'Give Testimonial',
      backgroundColor: site.button?.backgroundColor || '#007bff',
      textColor: site.button?.textColor || '#ffffff',
      shape: site.button?.shape ?? 'rounded',
      size: site.button?.size ?? 'medium',
      visibility: site.button?.visibility || {
        hideOnMobile: false,
        hideOnDesktop: false,
        hideAfterSubmission: false,
      },
    },
    theme: {
      primaryColor: site.theme?.primaryColor || '#007bff',
      secondaryColor: site.theme?.secondaryColor || '#6c757d',
      fontFamily: site.theme?.fontFamily || 'inherit',
      borderRadius: site.theme?.borderRadius || '8px',
      buttonStyle: site.theme?.buttonStyle || 'filled',
    },
    enabledFeatures: {
      videoTestimonial: site.enabledFeatures?.videoTestimonial ?? true,
      textTestimonial: site.enabledFeatures?.textTestimonial ?? true,
    },
    flowType: site.flowType || 'modal',
    formDesign: site.formDesign || defaultFormDesign,
    pageDesign: site.pageDesign,
  };

  const [previewConfig, setPreviewConfig] = useState<Site>(defaultConfig);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [activeSection, setActiveSection] = useState<'button' | 'theme' | 'form' | 'designer' | 'page' | 'display'>('button');
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<Site>>({});
  const { showToast } = useToast();

  useEffect(() => {
    const updatedConfig: Site = {
      button: {
        enabled: site.button?.enabled ?? true,
        type: site.button?.type ?? 'floating',
        position: site.button?.position ?? 'bottom-right',
        text: site.button?.text || 'Give Testimonial',
        backgroundColor: site.button?.backgroundColor || '#007bff',
        textColor: site.button?.textColor || '#ffffff',
        shape: site.button?.shape ?? 'rounded',
        size: site.button?.size ?? 'medium',
        visibility: site.button?.visibility || {
          hideOnMobile: false,
          hideOnDesktop: false,
          hideAfterSubmission: false,
        },
      },
      theme: {
        primaryColor: site.theme?.primaryColor || '#007bff',
        secondaryColor: site.theme?.secondaryColor || '#6c757d',
        fontFamily: site.theme?.fontFamily || 'inherit',
        borderRadius: site.theme?.borderRadius || '8px',
        buttonStyle: site.theme?.buttonStyle || 'filled',
      },
      enabledFeatures: {
        videoTestimonial: site.enabledFeatures?.videoTestimonial ?? true,
        textTestimonial: site.enabledFeatures?.textTestimonial ?? true,
      },
      flowType: site.flowType || 'modal',
      formDesign: site.formDesign || defaultFormDesign,
    };
    setPreviewConfig(updatedConfig);
  }, [site]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((updates: Partial<Site>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };
    setIsSaving(true);

    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(pendingUpdatesRef.current);
      pendingUpdatesRef.current = {};
      setTimeout(() => setIsSaving(false), 300);
    }, 800);
  }, [onUpdate]);

  const updatePreview = useCallback((updates: Partial<Site>) => {
    // Update local state immediately for live preview
    setPreviewConfig((prev) => {
      const newConfig: Site = {
        ...prev,
        button: { ...prev.button },
        theme: { ...prev.theme },
        enabledFeatures: { ...prev.enabledFeatures },
      };
      
      if (updates.button) {
        newConfig.button = { ...prev.button, ...updates.button };
      }
      if (updates.theme) {
        newConfig.theme = { ...prev.theme, ...updates.theme };
      }
      if (updates.enabledFeatures) {
        newConfig.enabledFeatures = { ...prev.enabledFeatures, ...updates.enabledFeatures };
      }
      if (updates.flowType !== undefined) {
        newConfig.flowType = updates.flowType;
      }
      if (updates.formDesign) {
        newConfig.formDesign = updates.formDesign;
      }
      
      return newConfig;
    });
    
    // Debounce the save
    debouncedSave(updates);
  }, [debouncedSave]);

  // Compute button styles - recalculated on every render for live updates
  const getButtonStyles = (): React.CSSProperties => {
    // Ensure we always have default values
    const button = previewConfig?.button || {
      enabled: true,
      position: 'bottom-right',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      shape: 'rounded',
      size: 'medium',
      text: 'Give Testimonial',
    };
    const theme = previewConfig?.theme || {
      buttonStyle: 'filled',
      fontFamily: 'inherit',
    };
    
    // Default styles if config is missing
    if (!previewConfig?.button || !previewConfig?.theme) {
      return {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        zIndex: 10000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto',
      };
    }
    
    const sizeMap: Record<string, string> = { 
      small: '36px', 
      medium: '44px', 
      large: '52px' 
    };
    const borderRadiusMap: Record<string, string> = { 
      rounded: '8px', 
      square: '0px', 
      pill: '9999px' 
    };
    
    const positionStyles: Record<string, React.CSSProperties> = {
      'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto' },
      'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto' },
      'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
      'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto' },
    };

    const bgColor = button.backgroundColor || '#007bff';
    const textColor = button.textColor || '#ffffff';
    const position = button.position || 'bottom-right';
    const shape = button.shape || 'rounded';
    const size = button.size || 'medium';

    // For 'text' style, use the backgroundColor as the text color and transparent background
    // But ensure it's always visible - if text style, use bgColor for text, white/light bg
    const finalBgColor = theme.buttonStyle === 'text' ? 'transparent' : bgColor;
    const finalTextColor = theme.buttonStyle === 'text' ? bgColor : textColor;
    const finalBorder = theme.buttonStyle === 'outlined' ? `2px solid ${bgColor}` : 'none';

    return {
      position: 'absolute',
      ...positionStyles[position],
      backgroundColor: finalBgColor,
      color: finalTextColor,
      border: finalBorder,
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: theme.fontFamily || 'inherit',
      borderRadius: borderRadiusMap[shape],
      cursor: 'pointer',
      boxShadow: theme.buttonStyle === 'text' ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 10000,
      minHeight: sizeMap[size],
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
      visibility: 'visible',
      opacity: 1,
      margin: 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSection('button')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'button'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Move className="h-4 w-4" />
          Button
        </button>
        <button
          onClick={() => setActiveSection('theme')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'theme'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="h-4 w-4" />
          Theme
        </button>
        <button
          onClick={() => setActiveSection('form')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'form'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="h-4 w-4" />
          Form
        </button>
        <button
          onClick={() => setActiveSection('designer')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'designer'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileEdit className="h-4 w-4" />
          Form Designer
        </button>
        <button
          onClick={() => setActiveSection('page')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'page'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe className="h-4 w-4" />
          Testimonial Page
        </button>
        <button
          onClick={() => setActiveSection('display')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'display'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Grid className="h-4 w-4" />
          Display Settings
        </button>
        {isSaving && (
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <Save className="h-4 w-4 animate-pulse" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Show Form Designer when active */}
      {activeSection === 'designer' && (
        <FormDesigner
          formDesign={previewConfig.formDesign || defaultFormDesign}
          theme={previewConfig.theme}
          onUpdate={(formDesign) => {
            updatePreview({ formDesign });
          }}
        />
      )}

      {/* Testimonial Display Builder */}
      {activeSection === 'display' && (
        <TestimonialDisplayBuilder
          displayConfig={previewConfig.testimonialDisplay || {
            layout: 'grid',
            itemsPerRow: 3,
            limit: 6,
            showRating: true,
            showAuthor: true,
            showVideo: true,
            cardStyle: {
              backgroundColor: '#ffffff',
              textColor: '#111827',
              borderColor: '#e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              shadow: 'medium',
            },
            authorStyle: {
              showAvatar: true,
              avatarSize: '48px',
              showCompany: true,
              showPosition: true,
              textColor: '#111827',
            },
            ratingStyle: {
              starColor: '#fbbf24',
              emptyStarColor: '#d1d5db',
              size: 'medium',
            },
            spacing: {
              gap: '24px',
              margin: '0',
            },
          }}
          theme={previewConfig.theme}
          onUpdate={(testimonialDisplay) => {
            updatePreview({ testimonialDisplay });
          }}
        />
      )}

      {/* Testimonial Page Builder */}
      {activeSection === 'page' && (
        <>
          <TestimonialPageBuilder
            pageDesign={previewConfig.pageDesign || {
              hero: {
                enabled: true,
                title: 'Share Your Testimonial',
                subtitle: 'We\'d love to hear about your experience!',
                backgroundType: 'gradient',
                backgroundColor: '#667eea',
                backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff',
                alignment: 'center',
                padding: 'large',
              },
              content: {
                showBeforeForm: false,
                beforeFormText: '',
                showAfterForm: false,
                afterFormText: '',
              },
              pageTheme: {
                backgroundColor: '#f9fafb',
                textColor: '#111827',
                containerMaxWidth: '800px',
                containerPadding: '40px',
              },
            }}
            theme={previewConfig.theme}
            onUpdate={(pageDesign) => {
              updatePreview({ pageDesign });
            }}
          />
          
          {/* Page URL and Embed Code Section */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Integration</h3>
            <div className="space-y-4">
              {/* Page URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page URL</label>
                <div className="flex gap-2">
                  <Input
                    value={site.siteId ? `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')}/testimonial-form/${site.siteId}` : 'Loading...'}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = site.siteId ? `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')}/testimonial-form/${site.siteId}` : '';
                      if (url) {
                        window.open(url, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2">
                  <code className="text-sm text-gray-800 font-mono break-all">
                    {site.siteId ? `<iframe src="${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')}/testimonial-form/${site.siteId}" width="100%" height="800" frameborder="0"></iframe>` : 'Loading...'}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const embedCode = site.siteId ? `<iframe src="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/testimonial-form/${site.siteId}" width="100%" height="800" frameborder="0"></iframe>` : '';
                    if (embedCode) {
                      navigator.clipboard.writeText(embedCode);
                      setCopiedCode('embed');
                      showToast('Embed code copied to clipboard!', 'success');
                      setTimeout(() => setCopiedCode(null), 2000);
                    }
                  }}
                >
                  {copiedCode === 'embed' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Embed Code
                    </>
                  )}
                </Button>
              </div>

              {/* Direct Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Direct Link</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2">
                  <code className="text-sm text-gray-800 font-mono break-all">
                    {site.siteId ? `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')}/testimonial-form/${site.siteId}` : 'Loading...'}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = site.siteId ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/testimonial-form/${site.siteId}` : '';
                    if (link) {
                      navigator.clipboard.writeText(link);
                      setCopiedCode('link');
                      showToast('Link copied to clipboard!', 'success');
                      setTimeout(() => setCopiedCode(null), 2000);
                    }
                  }}
                >
                  {copiedCode === 'link' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Show other sections when not designer, page, or display */}
      {activeSection !== 'designer' && activeSection !== 'page' && activeSection !== 'display' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Button Controls */}
            {activeSection === 'button' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Button Text"
                    value={previewConfig.button.text}
                    onChange={(e) => updatePreview({
                      button: { ...previewConfig.button, text: e.target.value }
                    })}
                  />
                  
                  <Select
                    label="Position"
                    value={previewConfig.button.position}
                    onChange={(e) => updatePreview({
                      button: { ...previewConfig.button, position: e.target.value as any }
                    })}
                    options={[
                      { value: 'bottom-right', label: 'Bottom Right' },
                      { value: 'bottom-left', label: 'Bottom Left' },
                      { value: 'top-right', label: 'Top Right' },
                      { value: 'top-left', label: 'Top Left' },
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={previewConfig.button.backgroundColor}
                          onChange={(e) => updatePreview({
                            button: { ...previewConfig.button, backgroundColor: e.target.value }
                          })}
                          className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={previewConfig.button.backgroundColor}
                          onChange={(e) => updatePreview({
                            button: { ...previewConfig.button, backgroundColor: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={previewConfig.button.textColor}
                          onChange={(e) => updatePreview({
                            button: { ...previewConfig.button, textColor: e.target.value }
                          })}
                          className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={previewConfig.button.textColor}
                          onChange={(e) => updatePreview({
                            button: { ...previewConfig.button, textColor: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Select
                    label="Shape"
                    value={previewConfig.button.shape}
                    onChange={(e) => updatePreview({
                      button: { ...previewConfig.button, shape: e.target.value as any }
                    })}
                    options={[
                      { value: 'rounded', label: 'Rounded' },
                      { value: 'square', label: 'Square' },
                      { value: 'pill', label: 'Pill' },
                    ]}
                  />

                  <Select
                    label="Size"
                    value={previewConfig.button.size}
                    onChange={(e) => updatePreview({
                      button: { ...previewConfig.button, size: e.target.value as any }
                    })}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' },
                    ]}
                  />

                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={previewConfig.button.enabled}
                      onChange={(e) => updatePreview({
                        button: { ...previewConfig.button, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Button</span>
                  </label>
                </div>
              </Card>
            )}

            {/* Theme Controls */}
            {activeSection === 'theme' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={previewConfig.theme.primaryColor}
                        onChange={(e) => updatePreview({
                          theme: { ...previewConfig.theme, primaryColor: e.target.value }
                        })}
                        className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <Input
                        value={previewConfig.theme.primaryColor}
                        onChange={(e) => updatePreview({
                          theme: { ...previewConfig.theme, primaryColor: e.target.value }
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={previewConfig.theme.secondaryColor}
                        onChange={(e) => updatePreview({
                          theme: { ...previewConfig.theme, secondaryColor: e.target.value }
                        })}
                        className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <Input
                        value={previewConfig.theme.secondaryColor}
                        onChange={(e) => updatePreview({
                          theme: { ...previewConfig.theme, secondaryColor: e.target.value }
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Input
                    label="Font Family"
                    value={previewConfig.theme.fontFamily}
                    onChange={(e) => updatePreview({
                      theme: { ...previewConfig.theme, fontFamily: e.target.value }
                    })}
                    placeholder="Inter, sans-serif"
                  />

                  <Input
                    label="Border Radius"
                    value={previewConfig.theme.borderRadius}
                    onChange={(e) => updatePreview({
                      theme: { ...previewConfig.theme, borderRadius: e.target.value }
                    })}
                    placeholder="8px"
                  />

                  <Select
                    label="Button Style"
                    value={previewConfig.theme.buttonStyle}
                    onChange={(e) => updatePreview({
                      theme: { ...previewConfig.theme, buttonStyle: e.target.value as any }
                    })}
                    options={[
                      { value: 'filled', label: 'Filled' },
                      { value: 'outlined', label: 'Outlined' },
                      { value: 'text', label: 'Text' },
                    ]}
                  />
                </div>
              </Card>
            )}

            {/* Form Controls */}
            {activeSection === 'form' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
                <div className="space-y-4">
                  <Select
                    label="Flow Type"
                    value={previewConfig.flowType}
                    onChange={(e) => updatePreview({ flowType: e.target.value as any })}
                    options={[
                      { value: 'modal', label: 'Modal' },
                      { value: 'drawer', label: 'Drawer' },
                      { value: 'page', label: 'Page (iframe)' },
                    ]}
                  />

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Enabled Features</label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={previewConfig.enabledFeatures.videoTestimonial}
                        onChange={(e) => updatePreview({
                          enabledFeatures: { ...previewConfig.enabledFeatures, videoTestimonial: e.target.checked }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Video Testimonials</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={previewConfig.enabledFeatures.textTestimonial}
                        onChange={(e) => updatePreview({
                          enabledFeatures: { ...previewConfig.enabledFeatures, textTestimonial: e.target.checked }
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Text Testimonials</span>
                    </label>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Preview Pane */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobilePreview(!showMobilePreview)}
                >
                  {showMobilePreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Desktop
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Mobile
                    </>
                  )}
                </Button>
              </div>

              {/* Preview Container */}
              <div
                className={`relative border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white ${
                  showMobilePreview ? 'max-w-sm mx-auto' : 'w-full'
                }`}
                style={{ 
                  minHeight: '600px', 
                  height: showMobilePreview ? '600px' : 'auto',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {/* Simulated Website Content */}
                <div className="p-8" style={{ minHeight: '100%' }}>
                  <div className="mb-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Sample website content</p>
                    </div>
                  </div>
                </div>

                {/* Preview Button - Always render for debugging */}
                <button
                  style={getButtonStyles()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModalPreview(!showModalPreview);
                  }}
                  type="button"
                  className="testimonial-preview-button"
                >
                  {previewConfig?.button?.text || 'Give Testimonial'}
                </button>

                {/* Preview Modal/Drawer Overlay */}
                {showModalPreview && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4"
                    style={{ fontFamily: previewConfig.theme.fontFamily }}
                    onClick={() => setShowModalPreview(false)}
                  >
                    <div
                      className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative my-8"
                      style={{
                        borderRadius: previewConfig.theme.borderRadius,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setShowModalPreview(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                      >
                        ×
                      </button>
                      
                      {previewConfig.formDesign?.showHeader && (
                        <div className="mb-6 text-center">
                          <h4
                            className="text-2xl font-bold mb-2"
                            style={{ color: previewConfig.theme.primaryColor }}
                          >
                            {previewConfig.formDesign?.headerText || 'Share Your Testimonial'}
                          </h4>
                          {previewConfig.formDesign?.headerSubtext && (
                            <p className="text-gray-600">{previewConfig.formDesign.headerSubtext}</p>
                          )}
                        </div>
                      )}

                      {previewConfig.enabledFeatures.videoTestimonial && previewConfig.enabledFeatures.textTestimonial && (
                        <div className="mb-6 space-y-3">
                          <button
                            className="w-full py-3 rounded-lg text-white font-medium transition-transform hover:scale-105"
                            style={{
                              backgroundColor: previewConfig.theme.primaryColor,
                              borderRadius: previewConfig.theme.borderRadius,
                            }}
                          >
                            Video Testimonial
                          </button>
                          <button
                            className="w-full py-3 rounded-lg text-white font-medium transition-transform hover:scale-105"
                            style={{
                              backgroundColor: previewConfig.theme.primaryColor,
                              borderRadius: previewConfig.theme.borderRadius,
                            }}
                          >
                            Text Testimonial
                          </button>
                        </div>
                      )}

                      {previewConfig.formDesign && previewConfig.enabledFeatures.textTestimonial && (
                        <form
                          className={`space-y-4 ${
                            previewConfig.formDesign.layout === 'two-column' ? 'grid grid-cols-2 gap-4' :
                            previewConfig.formDesign.layout === 'three-column' ? 'grid grid-cols-3 gap-4' :
                            'flex flex-col'
                          }`}
                        >
                          {previewConfig.formDesign.fields
                            .filter((f: any) => f.visible)
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((field: any) => (
                              <div key={field.id} className={previewConfig.formDesign!.layout === 'single' ? 'w-full' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                  <textarea
                                    placeholder={field.placeholder}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    style={{ borderRadius: previewConfig.theme.borderRadius }}
                                    disabled
                                  />
                                ) : field.type === 'number' ? (
                                  <input
                                    type="number"
                                    placeholder={field.placeholder}
                                    min={field.min}
                                    max={field.max}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    style={{ borderRadius: previewConfig.theme.borderRadius }}
                                    disabled
                                  />
                                ) : field.type === 'email' ? (
                                  <input
                                    type="email"
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    style={{ borderRadius: previewConfig.theme.borderRadius }}
                                    disabled
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    style={{ borderRadius: previewConfig.theme.borderRadius }}
                                    disabled
                                  />
                                )}
                              </div>
                            ))}
                        </form>
                      )}

                      <div
                        className={`mt-6 ${
                          previewConfig.formDesign?.submitButtonPosition === 'full' ? 'w-full' :
                          previewConfig.formDesign?.submitButtonPosition === 'center' ? 'flex justify-center' :
                          previewConfig.formDesign?.submitButtonPosition === 'right' ? 'flex justify-end' :
                          'flex justify-start'
                        }`}
                      >
                        <button
                          type="button"
                          className="px-6 py-3 text-white font-medium rounded-lg transition-colors hover:opacity-90"
                          style={{
                            backgroundColor: previewConfig.theme.primaryColor,
                            borderRadius: previewConfig.theme.borderRadius,
                            width: previewConfig.formDesign?.submitButtonPosition === 'full' ? '100%' : 'auto',
                          }}
                        >
                          {previewConfig.formDesign?.submitButtonText || 'Submit Testimonial'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-800">
                  <strong>💡 Tip:</strong> Changes update instantly. Click the button above to preview the modal/drawer.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
