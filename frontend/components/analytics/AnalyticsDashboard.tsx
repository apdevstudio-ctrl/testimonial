'use client';

import { useEffect, useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface AnalyticsStats {
  buttonViews?: number;
  buttonClicks?: number;
  testimonialSubmissions?: number;
  wallViews?: number;
  widgetImpressions?: number;
  completionRate?: number;
  eventsByType?: Record<string, number>;
  recentEvents?: { eventType: string; createdAt: string }[];
}

type Range = '7d' | '30d' | 'all';

export default function AnalyticsDashboard({ siteId }: { siteId: string }) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('30d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/analytics/stats?siteId=${siteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed');
        setStats(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [siteId]);

  const funnelData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Impressions', value: stats.widgetImpressions || 0 },
      { name: 'Wall views', value: stats.wallViews || 0 },
      { name: 'Clicks', value: stats.buttonClicks || 0 },
      { name: 'Submissions', value: stats.testimonialSubmissions || 0 },
    ];
  }, [stats]);

  const eventBreakdown = useMemo(() => {
    if (!stats?.eventsByType) return [];
    return Object.entries(stats.eventsByType).map(([name, value]) => ({ name, value }));
  }, [stats]);

  if (loading) return <CardSkeleton />;
  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-600">No analytics data yet. Embed your widget to start tracking.</div>
    );
  }

  const kpis = [
    { label: 'Widget impressions', value: stats.widgetImpressions || 0, color: 'text-indigo-600' },
    { label: 'Wall views', value: stats.wallViews || 0, color: 'text-violet-600' },
    { label: 'Button clicks', value: stats.buttonClicks || 0, color: 'text-cyan-600' },
    { label: 'Submissions', value: stats.testimonialSubmissions || 0, color: 'text-emerald-600' },
    { label: 'Completion rate', value: `${((stats.completionRate || 0) * 100).toFixed(1)}%`, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
        <div className="flex gap-2">
          {(['7d', '30d', 'all'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                range === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'all' ? 'All time' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <div className={`text-2xl font-bold mb-1 ${k.color}`}>{k.value}</div>
            <div className="text-sm text-gray-600">{k.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Conversion funnel</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {eventBreakdown.length > 0 && (
        <Card>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Events by type</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={eventBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {stats.recentEvents && stats.recentEvents.length > 0 && (
        <Card>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Recent activity</h4>
          <ul className="divide-y divide-gray-100">
            {stats.recentEvents.slice(0, 8).map((ev, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span className="font-mono text-indigo-600">{ev.eventType}</span>
                <span className="text-gray-500">{new Date(ev.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
