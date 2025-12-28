'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink, Settings, BarChart3, MessageSquare, Calendar, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

interface Site {
  _id: string;
  siteId: string;
  name: string;
  domain?: string;
  button: any;
  theme: any;
  enabledFeatures: {
    videoTestimonial: boolean;
    textTestimonial: boolean;
  };
  flowType: 'modal' | 'drawer' | 'page';
  isActive: boolean;
  createdAt: string;
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({ siteId: '', name: '', domain: '' });
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sites`);
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      showToast('Failed to load sites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async () => {
    if (!newSite.siteId || !newSite.name) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: newSite.siteId,
          name: newSite.name,
          domain: newSite.domain || undefined,
        }),
      });

      if (response.ok) {
        showToast('Site created successfully!', 'success');
        setIsCreateModalOpen(false);
        setNewSite({ siteId: '', name: '', domain: '' });
        fetchSites();
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to create site', 'error');
      }
    } catch (error) {
      console.error('Error creating site:', error);
      showToast('Failed to create site', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Sites</h1>
          <p className="text-gray-600">Manage your testimonial collection sites</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Sites</h1>
          <p className="text-gray-600">Manage your testimonial collection sites</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create New Site
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites yet</h3>
            <p className="text-gray-600 mb-6">Create your first site to start collecting testimonials</p>
            <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Site
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Link key={site._id} href={`/sites/${site.siteId}`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{site.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{site.siteId}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      site.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {site.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {site.domain && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{site.domain}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{site.enabledFeatures.videoTestimonial && site.enabledFeatures.textTestimonial ? 'Video & Text' : site.enabledFeatures.videoTestimonial ? 'Video' : 'Text'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Configure</span>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Site"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Site ID"
            placeholder="my-awesome-site"
            value={newSite.siteId}
            onChange={(e) => setNewSite({ ...newSite, siteId: e.target.value })}
            helperText="A unique identifier for your site (lowercase, no spaces)"
            required
          />
          <Input
            label="Site Name"
            placeholder="My Awesome Site"
            value={newSite.name}
            onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
            helperText="A friendly name for your site"
            required
          />
          <Input
            label="Domain (Optional)"
            placeholder="https://example.com"
            value={newSite.domain}
            onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
            helperText="Your website domain for validation"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSite}
              isLoading={isCreating}
              disabled={isCreating}
            >
              Create Site
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
