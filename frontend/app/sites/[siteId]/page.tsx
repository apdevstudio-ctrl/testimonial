'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Settings, Palette, BarChart3, MessageSquare, Video, FileText, Play, Star, Calendar, User, Globe, Wand2, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import VisualBuilder from '@/components/builder/VisualBuilder';

interface Site {
  _id: string;
  siteId: string;
  name: string;
  domain?: string;
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
  isActive: boolean;
  formDesign?: any;
}

interface Testimonial {
  _id: string;
  type: 'video' | 'text';
  text?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  rating?: number;
  author?: {
    name?: string;
    email?: string;
    company?: string;
    position?: string;
    avatar?: string;
  };
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}

export default function SitePage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'config' | 'theme' | 'analytics' | 'testimonials'>('builder');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();


  useEffect(() => {
    fetchSite();
  }, [siteId]);

  const fetchSite = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sites/${siteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch site');
      const data = await response.json();
      setSite(data);
    } catch (error) {
      console.error('Error fetching site:', error);
      showToast('Failed to load site', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateSite = async (updates: Partial<Site>) => {
    if (!site) return;

    // Don't show toast for empty updates
    if (Object.keys(updates).length === 0) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        setSite(updated);
        // Only show toast if there are actual changes
        if (Object.keys(updates).length > 0) {
          showToast('Settings saved', 'success');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Update failed:', errorData);
        showToast(errorData.message || 'Failed to update settings', 'error');
      }
    } catch (error) {
      console.error('Error updating site:', error);
      showToast(`Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-8">
        <CardSkeleton />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Site not found</h2>
            <p className="text-gray-600 mb-4">The site you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const scriptSnippet = `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/script.js" data-site-id="${site.siteId}"></script>`;

  const tabs = [
    { id: 'builder', label: 'Builder', icon: Wand2 },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sites
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{site.name}</h1>
            <p className="text-gray-600 font-mono text-sm">{site.siteId}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                site.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {site.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Integration Code */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Integration Code</h2>
            <p className="text-sm text-gray-600">Add this script tag to your website to enable testimonial collection</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <code className="text-sm text-gray-800 font-mono break-all">{scriptSnippet}</code>
        </div>
        <Button
          onClick={() => copyToClipboard(scriptSnippet)}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </>
          )}
        </Button>
      </Card>

      {/* Tabs */}
      <Card padding="none">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={activeTab === 'builder' ? '' : 'p-6'}>
          {activeTab === 'builder' && (
            <div className="p-6">
              <VisualBuilder site={site} onUpdate={updateSite} />
            </div>
          )}
          {activeTab === 'config' && (
            <ConfigTab site={site} onUpdate={updateSite} />
          )}
          {activeTab === 'theme' && (
            <ThemeTab site={site} onUpdate={updateSite} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab siteId={siteId} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsTab siteId={siteId} />
          )}
        </div>
      </Card>
    </div>
  );
}

function ConfigTab({ site, onUpdate }: { site: Site; onUpdate: (updates: Partial<Site>) => void }) {
  const [config, setConfig] = useState(site.button);
  const [features, setFeatures] = useState(site.enabledFeatures);
  const [flowType, setFlowType] = useState(site.flowType);

  const handleSave = () => {
    onUpdate({
      button: config,
      enabledFeatures: features,
      flowType,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Button Text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
          />
          <Select
            label="Position"
            value={config.position}
            onChange={(e) => setConfig({ ...config, position: e.target.value as any })}
            options={[
              { value: 'bottom-right', label: 'Bottom Right' },
              { value: 'bottom-left', label: 'Bottom Left' },
              { value: 'top-right', label: 'Top Right' },
              { value: 'top-left', label: 'Top Left' },
            ]}
          />
          <Select
            label="Shape"
            value={config.shape}
            onChange={(e) => setConfig({ ...config, shape: e.target.value as any })}
            options={[
              { value: 'rounded', label: 'Rounded' },
              { value: 'square', label: 'Square' },
              { value: 'pill', label: 'Pill' },
            ]}
          />
          <Select
            label="Size"
            value={config.size}
            onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />
        </div>
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable Button</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enabled Features</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={features.videoTestimonial}
              onChange={(e) => setFeatures({ ...features, videoTestimonial: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Video Testimonials</span>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={features.textTestimonial}
              onChange={(e) => setFeatures({ ...features, textTestimonial: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Text Testimonials</span>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Type</h3>
        <Select
          value={flowType}
          onChange={(e) => setFlowType(e.target.value as any)}
          options={[
            { value: 'modal', label: 'Modal' },
            { value: 'drawer', label: 'Drawer' },
            { value: 'page', label: 'Page (iframe)' },
          ]}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function ThemeTab({ site, onUpdate }: { site: Site; onUpdate: (updates: Partial<Site>) => void }) {
  const [theme, setTheme] = useState(site.theme);

  const handleSave = () => {
    onUpdate({ theme });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
              />
              <Input
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                placeholder="#6366f1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
              />
              <Input
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                placeholder="#8b5cf6"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
        <Input
          label="Font Family"
          value={theme.fontFamily}
          onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
          placeholder="Inter, sans-serif"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Border Radius</h3>
        <Input
          label="Border Radius"
          value={theme.borderRadius}
          onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
          placeholder="8px"
          helperText="CSS border-radius value (e.g., 8px, 0.5rem)"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Style</h3>
        <Select
          value={theme.buttonStyle}
          onChange={(e) => setTheme({ ...theme, buttonStyle: e.target.value as any })}
          options={[
            { value: 'filled', label: 'Filled' },
            { value: 'outlined', label: 'Outlined' },
            { value: 'text', label: 'Text' },
          ]}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function AnalyticsTab({ siteId }: { siteId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [siteId]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/analytics/stats?siteId=${siteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Views', value: stats.buttonViews || 0 },
    { name: 'Clicks', value: stats.buttonClicks || 0 },
    { name: 'Submissions', value: stats.testimonialSubmissions || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.buttonViews || 0}</div>
            <div className="text-sm text-gray-600">Button Views</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.buttonClicks || 0}</div>
            <div className="text-sm text-gray-600">Button Clicks</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.testimonialSubmissions || 0}</div>
            <div className="text-sm text-gray-600">Submissions</div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {((stats.completionRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </Card>
        </div>
      </div>

      <Card>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Engagement Metrics</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function TestimonialsTab({ siteId }: { siteId: string }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, [siteId]);

  const fetchTestimonials = async () => {
    try {
      // Use ?all=true to get all testimonials (including unpublished) for admin
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/testimonials?siteId=${siteId}&all=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (testimonialId: string, currentStatus: boolean) => {
    setUpdating(testimonialId);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');

      // Update local state
      setTestimonials((prev) =>
        prev.map((t) =>
          t._id === testimonialId
            ? { ...t, isPublished: !currentStatus }
            : t
        )
      );

      showToast(
        currentStatus
          ? 'Testimonial unpublished successfully'
          : 'Testimonial published successfully',
        'success'
      );
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showToast('Failed to update testimonial', 'error');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Testimonials ({testimonials.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Review and publish testimonials to display them on your website
          </p>
        </div>
      </div>
      {testimonials.length === 0 ? (
        <Card className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No testimonials yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author?.name || 'Anonymous'}
                    </div>
                    {testimonial.author?.email && (
                      <div className="text-sm text-gray-500">{testimonial.author.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      testimonial.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {testimonial.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {testimonial.text && (
                <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.text}</p>
              )}

              {testimonial.videoUrl && (
                <div className="mb-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                    <video
                      src={testimonial.videoUrl}
                      controls
                      className="w-full h-full"
                      poster={testimonial.videoThumbnail}
                    />
                  </div>
                </div>
              )}

              {testimonial.rating && (
                <div className="flex items-center gap-1 text-sm mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">{testimonial.rating}</span>
                  <span className="text-gray-500">/ 5</span>
                </div>
              )}

              {/* Publish/Unpublish Button */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleTogglePublish(testimonial._id, testimonial.isPublished)}
                  disabled={updating === testimonial._id}
                  variant={testimonial.isPublished ? 'outline' : 'primary'}
                  className={testimonial.isPublished ? '' : 'bg-indigo-600 hover:bg-indigo-700'}
                >
                  {updating === testimonial._id ? (
                    'Updating...'
                  ) : testimonial.isPublished ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
