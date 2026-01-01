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

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', domain: '' });
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
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
    if (!newSite.name) {
      showToast('Site name is required', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem('auth_token');
      // Backend will auto-generate UUID for siteId
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSite),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create site');
      }

      const site = await response.json();
      setSites([...sites, site]);
      setIsCreateModalOpen(false);
      setNewSite({ name: '', domain: '' });
      showToast('Site created successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to create site', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-600 mt-1">Manage your testimonial collection sites</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Create Site
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first site</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Site
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card key={site._id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{site.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{site.siteId}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    site.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {site.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {site.domain && (
                <div className="mb-4">
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {site.domain}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(site.createdAt)}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Link href={`/sites/${site.siteId}`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
                {site.domain && (
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Site"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              placeholder="My Awesome Site"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain (optional)
            </label>
            <Input
              value={newSite.domain}
              onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
              placeholder="example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Your website domain
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSite}
              isLoading={isCreating}
            >
              Create Site
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

