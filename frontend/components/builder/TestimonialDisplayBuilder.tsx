'use client';

import { useState } from 'react';
import { Layout, Palette, Grid, List, Film, Star, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface TestimonialDisplayConfig {
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
}

interface TestimonialDisplayBuilderProps {
  displayConfig: TestimonialDisplayConfig;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  onUpdate: (config: TestimonialDisplayConfig) => void;
}

const defaultDisplayConfig: TestimonialDisplayConfig = {
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
};

export default function TestimonialDisplayBuilder({ displayConfig, theme, onUpdate }: TestimonialDisplayBuilderProps) {
  const [localConfig, setLocalConfig] = useState<TestimonialDisplayConfig>(displayConfig || defaultDisplayConfig);

  const updateConfig = (updates: Partial<TestimonialDisplayConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onUpdate(newConfig);
  };

  const updateCardStyle = (updates: Partial<TestimonialDisplayConfig['cardStyle']>) => {
    updateConfig({ cardStyle: { ...localConfig.cardStyle, ...updates } });
  };

  const updateAuthorStyle = (updates: Partial<TestimonialDisplayConfig['authorStyle']>) => {
    updateConfig({ authorStyle: { ...localConfig.authorStyle, ...updates } });
  };

  const updateRatingStyle = (updates: Partial<TestimonialDisplayConfig['ratingStyle']>) => {
    updateConfig({ ratingStyle: { ...localConfig.ratingStyle, ...updates } });
  };

  const updateSpacing = (updates: Partial<TestimonialDisplayConfig['spacing']>) => {
    updateConfig({ spacing: { ...localConfig.spacing, ...updates } });
  };

  const getShadowStyle = (shadow: string) => {
    switch (shadow) {
      case 'small': return '0 1px 3px rgba(0, 0, 0, 0.1)';
      case 'medium': return '0 4px 6px rgba(0, 0, 0, 0.1)';
      case 'large': return '0 10px 15px rgba(0, 0, 0, 0.1)';
      default: return 'none';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Controls */}
      <div className="space-y-6">
        {/* Layout Settings */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Layout Settings</h3>
          </div>
          <div className="space-y-4">
            <Select
              label="Display Layout"
              value={localConfig.layout}
              onChange={(e) => updateConfig({ layout: e.target.value as any })}
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'carousel', label: 'Carousel' },
                { value: 'list', label: 'List' },
              ]}
            />
            {localConfig.layout === 'grid' && (
              <Input
                label="Items Per Row"
                type="number"
                min="1"
                max="6"
                value={localConfig.itemsPerRow || 3}
                onChange={(e) => updateConfig({ itemsPerRow: parseInt(e.target.value) || 3 })}
              />
            )}
            <Input
              label="Maximum Testimonials to Show"
              type="number"
              min="1"
              value={localConfig.limit || 6}
              onChange={(e) => updateConfig({ limit: parseInt(e.target.value) || 6 })}
            />
          </div>
        </Card>

        {/* Display Options */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Grid className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Display Options</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.showRating}
                onChange={(e) => updateConfig({ showRating: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <Star className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Show Ratings</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.showAuthor}
                onChange={(e) => updateConfig({ showAuthor: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Show Author Info</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localConfig.showVideo}
                onChange={(e) => updateConfig({ showVideo: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <Film className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Show Video Testimonials</span>
            </label>
          </div>
        </Card>

        {/* Card Styling */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Card Styling</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.cardStyle.backgroundColor}
                  onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                  className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={localConfig.cardStyle.backgroundColor}
                  onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.cardStyle.textColor}
                  onChange={(e) => updateCardStyle({ textColor: e.target.value })}
                  className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={localConfig.cardStyle.textColor}
                  onChange={(e) => updateCardStyle({ textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localConfig.cardStyle.borderColor}
                  onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                  className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  value={localConfig.cardStyle.borderColor}
                  onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <Input
              label="Border Radius"
              value={localConfig.cardStyle.borderRadius}
              onChange={(e) => updateCardStyle({ borderRadius: e.target.value })}
              placeholder="12px"
            />
            <Input
              label="Padding"
              value={localConfig.cardStyle.padding}
              onChange={(e) => updateCardStyle({ padding: e.target.value })}
              placeholder="24px"
            />
            <Select
              label="Shadow"
              value={localConfig.cardStyle.shadow}
              onChange={(e) => updateCardStyle({ shadow: e.target.value as any })}
              options={[
                { value: 'none', label: 'None' },
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
        </Card>

        {/* Author Styling */}
        {localConfig.showAuthor && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Author Styling</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.authorStyle.showAvatar}
                  onChange={(e) => updateAuthorStyle({ showAvatar: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Avatar</span>
              </label>
              {localConfig.authorStyle.showAvatar && (
                <Input
                  label="Avatar Size"
                  value={localConfig.authorStyle.avatarSize}
                  onChange={(e) => updateAuthorStyle({ avatarSize: e.target.value })}
                  placeholder="48px"
                />
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.authorStyle.showCompany}
                  onChange={(e) => updateAuthorStyle({ showCompany: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Company</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.authorStyle.showPosition}
                  onChange={(e) => updateAuthorStyle({ showPosition: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Position</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localConfig.authorStyle.textColor}
                    onChange={(e) => updateAuthorStyle({ textColor: e.target.value })}
                    className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={localConfig.authorStyle.textColor}
                    onChange={(e) => updateAuthorStyle({ textColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Rating Styling */}
        {localConfig.showRating && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Rating Styling</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Star Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localConfig.ratingStyle.starColor}
                    onChange={(e) => updateRatingStyle({ starColor: e.target.value })}
                    className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={localConfig.ratingStyle.starColor}
                    onChange={(e) => updateRatingStyle({ starColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empty Star Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={localConfig.ratingStyle.emptyStarColor}
                    onChange={(e) => updateRatingStyle({ emptyStarColor: e.target.value })}
                    className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={localConfig.ratingStyle.emptyStarColor}
                    onChange={(e) => updateRatingStyle({ emptyStarColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <Select
                label="Star Size"
                value={localConfig.ratingStyle.size}
                onChange={(e) => updateRatingStyle({ size: e.target.value as any })}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* Spacing */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Grid className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Spacing</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Gap Between Cards"
              value={localConfig.spacing.gap}
              onChange={(e) => updateSpacing({ gap: e.target.value })}
              placeholder="24px"
            />
            <Input
              label="Container Margin"
              value={localConfig.spacing.margin}
              onChange={(e) => updateSpacing({ margin: e.target.value })}
              placeholder="0"
            />
          </div>
        </Card>
      </div>

      {/* Preview */}
      <div>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 overflow-auto"
            style={{
              minHeight: '600px',
              maxHeight: '600px',
              gap: localConfig.spacing.gap,
              margin: localConfig.spacing.margin,
              display: localConfig.layout === 'grid' ? 'grid' : localConfig.layout === 'carousel' ? 'flex' : 'flex',
              gridTemplateColumns: localConfig.layout === 'grid' ? `repeat(${localConfig.itemsPerRow || 3}, 1fr)` : 'none',
              flexDirection: localConfig.layout === 'list' ? 'column' : 'row',
              overflowX: localConfig.layout === 'carousel' ? 'auto' : 'visible',
            }}
          >
            {/* Sample Testimonial Card */}
            <div
              style={{
                backgroundColor: localConfig.cardStyle.backgroundColor,
                color: localConfig.cardStyle.textColor,
                border: `1px solid ${localConfig.cardStyle.borderColor}`,
                borderRadius: localConfig.cardStyle.borderRadius,
                padding: localConfig.cardStyle.padding,
                boxShadow: getShadowStyle(localConfig.cardStyle.shadow),
                minWidth: localConfig.layout === 'carousel' ? '300px' : 'auto',
                fontFamily: theme.fontFamily,
              }}
            >
              {localConfig.showAuthor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {localConfig.authorStyle.showAvatar && (
                    <div
                      style={{
                        width: localConfig.authorStyle.avatarSize,
                        height: localConfig.authorStyle.avatarSize,
                        borderRadius: '50%',
                        background: theme.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                      }}
                    >
                      JD
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px', color: localConfig.authorStyle.textColor }}>
                      John Doe
                    </div>
                    {localConfig.authorStyle.showPosition && localConfig.authorStyle.showCompany && (
                      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                        CEO at Example Corp
                      </div>
                    )}
                  </div>
                </div>
              )}
              {localConfig.showRating && (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      style={{
                        color: i <= 4 ? localConfig.ratingStyle.starColor : localConfig.ratingStyle.emptyStarColor,
                        fontSize: localConfig.ratingStyle.size === 'small' ? '16px' : localConfig.ratingStyle.size === 'large' ? '24px' : '20px',
                      }}
                    >
                      {i <= 4 ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ color: localConfig.cardStyle.textColor, lineHeight: '1.6' }}>
                "This is a sample testimonial text that demonstrates how the testimonial will look with your custom styling applied."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

