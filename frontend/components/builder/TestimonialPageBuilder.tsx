'use client';

import { useState } from 'react';
import { Image, Type, Palette, Layout, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface PageDesign {
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
}

interface TestimonialPageBuilderProps {
  pageDesign: PageDesign;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  onUpdate: (pageDesign: PageDesign) => void;
}

const defaultPageDesign: PageDesign = {
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
};

export default function TestimonialPageBuilder({ pageDesign, theme, onUpdate }: TestimonialPageBuilderProps) {
  const [localDesign, setLocalDesign] = useState<PageDesign>(pageDesign || defaultPageDesign);

  const updateDesign = (updates: Partial<PageDesign>) => {
    const newDesign = { ...localDesign, ...updates };
    setLocalDesign(newDesign);
    onUpdate(newDesign);
  };

  const updateHero = (updates: Partial<PageDesign['hero']>) => {
    updateDesign({ hero: { ...localDesign.hero, ...updates } });
  };

  const updateContent = (updates: Partial<PageDesign['content']>) => {
    updateDesign({ content: { ...localDesign.content, ...updates } });
  };

  const updatePageTheme = (updates: Partial<PageDesign['pageTheme']>) => {
    updateDesign({ pageTheme: { ...localDesign.pageTheme, ...updates } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localDesign.hero.enabled}
                onChange={(e) => updateHero({ enabled: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Enable Hero Section</span>
            </label>

            {localDesign.hero.enabled && (
              <>
                <Input
                  label="Hero Title"
                  value={localDesign.hero.title}
                  onChange={(e) => updateHero({ title: e.target.value })}
                />
                <Input
                  label="Hero Subtitle"
                  value={localDesign.hero.subtitle}
                  onChange={(e) => updateHero({ subtitle: e.target.value })}
                />
                <Select
                  label="Text Alignment"
                  value={localDesign.hero.alignment}
                  onChange={(e) => updateHero({ alignment: e.target.value as any })}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                  ]}
                />
                <Select
                  label="Padding Size"
                  value={localDesign.hero.padding}
                  onChange={(e) => updateHero({ padding: e.target.value as any })}
                  options={[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ]}
                />
                <Select
                  label="Background Type"
                  value={localDesign.hero.backgroundType}
                  onChange={(e) => updateHero({ backgroundType: e.target.value as any })}
                  options={[
                    { value: 'color', label: 'Solid Color' },
                    { value: 'gradient', label: 'Gradient' },
                    { value: 'image', label: 'Image' },
                  ]}
                />
                {localDesign.hero.backgroundType === 'color' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={localDesign.hero.backgroundColor}
                        onChange={(e) => updateHero({ backgroundColor: e.target.value })}
                        className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <Input
                        value={localDesign.hero.backgroundColor}
                        onChange={(e) => updateHero({ backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
                {localDesign.hero.backgroundType === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gradient CSS</label>
                    <Input
                      value={localDesign.hero.backgroundGradient}
                      onChange={(e) => updateHero({ backgroundGradient: e.target.value })}
                      placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                  </div>
                )}
                {localDesign.hero.backgroundType === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                    <Input
                      value={localDesign.hero.backgroundImage || ''}
                      onChange={(e) => updateHero({ backgroundImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localDesign.hero.textColor}
                      onChange={(e) => updateHero({ textColor: e.target.value })}
                      className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={localDesign.hero.textColor}
                      onChange={(e) => updateHero({ textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Content Sections */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localDesign.content.showBeforeForm}
                onChange={(e) => updateContent({ showBeforeForm: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Content Before Form</span>
            </label>
            {localDesign.content.showBeforeForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Before Form Text</label>
                <textarea
                  value={localDesign.content.beforeFormText}
                  onChange={(e) => updateContent({ beforeFormText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add content that appears before the testimonial form..."
                />
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localDesign.content.showAfterForm}
                onChange={(e) => updateContent({ showAfterForm: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Content After Form</span>
            </label>
            {localDesign.content.showAfterForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">After Form Text</label>
                <textarea
                  value={localDesign.content.afterFormText}
                  onChange={(e) => updateContent({ afterFormText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add content that appears after the testimonial form..."
                />
              </div>
            )}
          </div>
        </Card>

        {/* Page Theme */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Page Theme</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localDesign.pageTheme.backgroundColor}
                  onChange={(e) => updatePageTheme({ backgroundColor: e.target.value })}
                  className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={localDesign.pageTheme.backgroundColor}
                  onChange={(e) => updatePageTheme({ backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localDesign.pageTheme.textColor}
                  onChange={(e) => updatePageTheme({ textColor: e.target.value })}
                  className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={localDesign.pageTheme.textColor}
                  onChange={(e) => updatePageTheme({ textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <Input
              label="Container Max Width"
              value={localDesign.pageTheme.containerMaxWidth}
              onChange={(e) => updatePageTheme({ containerMaxWidth: e.target.value })}
              placeholder="800px"
            />
            <Input
              label="Container Padding"
              value={localDesign.pageTheme.containerPadding}
              onChange={(e) => updatePageTheme({ containerPadding: e.target.value })}
              placeholder="40px"
            />
          </div>
        </Card>
      </div>

      {/* Preview */}
      <div>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Page Preview</h3>
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{
              backgroundColor: localDesign.pageTheme.backgroundColor,
              color: localDesign.pageTheme.textColor,
              minHeight: '600px',
            }}
          >
            {/* Hero Section Preview */}
            {localDesign.hero.enabled && (
              <div
                style={{
                  background:
                    localDesign.hero.backgroundType === 'color'
                      ? localDesign.hero.backgroundColor
                      : localDesign.hero.backgroundType === 'gradient'
                      ? localDesign.hero.backgroundGradient
                      : localDesign.hero.backgroundImage
                      ? `url(${localDesign.hero.backgroundImage})`
                      : localDesign.hero.backgroundColor,
                  backgroundSize: localDesign.hero.backgroundType === 'image' ? 'cover' : 'auto',
                  backgroundPosition: 'center',
                  color: localDesign.hero.textColor,
                  padding:
                    localDesign.hero.padding === 'small'
                      ? '32px 24px'
                      : localDesign.hero.padding === 'medium'
                      ? '64px 32px'
                      : '96px 40px',
                  textAlign: localDesign.hero.alignment,
                }}
              >
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
                  {localDesign.hero.title}
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.9 }}>{localDesign.hero.subtitle}</p>
              </div>
            )}

            {/* Content Before Form */}
            {localDesign.content.showBeforeForm && localDesign.content.beforeFormText && (
              <div
                style={{
                  padding: localDesign.pageTheme.containerPadding,
                  maxWidth: localDesign.pageTheme.containerMaxWidth,
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    color: localDesign.pageTheme.textColor,
                    lineHeight: '1.6',
                  }}
                  dangerouslySetInnerHTML={{ __html: localDesign.content.beforeFormText.replace(/\n/g, '<br />') }}
                />
              </div>
            )}

            {/* Form Container Preview */}
            <div
              style={{
                padding: localDesign.pageTheme.containerPadding,
                maxWidth: localDesign.pageTheme.containerMaxWidth,
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: theme.borderRadius,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <p className="text-sm">Testimonial Form Preview</p>
                <p className="text-xs mt-2">Form will appear here</p>
              </div>
            </div>

            {/* Content After Form */}
            {localDesign.content.showAfterForm && localDesign.content.afterFormText && (
              <div
                style={{
                  padding: localDesign.pageTheme.containerPadding,
                  maxWidth: localDesign.pageTheme.containerMaxWidth,
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    color: localDesign.pageTheme.textColor,
                    lineHeight: '1.6',
                  }}
                  dangerouslySetInnerHTML={{ __html: localDesign.content.afterFormText.replace(/\n/g, '<br />') }}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

