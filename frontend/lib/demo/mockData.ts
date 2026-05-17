import type { WallTestimonial } from '@/components/wall/WallOfLove';
import type { WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';

export const DEMO_TESTIMONIALS: WallTestimonial[] = [
  {
    _id: '1',
    type: 'text',
    text: 'TestiFlow doubled our signup conversion. The Wall of Love embed took 2 minutes to set up.',
    rating: 5,
    verified: true,
    author: { name: 'Sarah Chen', company: 'TechStart', position: 'Founder' },
  },
  {
    _id: '2',
    type: 'text',
    text: 'Finally a testimonial tool that feels premium. Our customers love recording video reviews.',
    rating: 5,
    verified: true,
    sourceLabel: 'Product Hunt',
    author: { name: 'Michael Rodriguez', company: 'DesignCo', position: 'CEO' },
  },
  {
    _id: '3',
    type: 'text',
    text: 'The SEO wall page alone was worth it. We rank for customer reviews now.',
    rating: 5,
    author: { name: 'Emily Johnson', company: 'GrowthLabs', position: 'Head of Marketing' },
  },
  {
    _id: '4',
    type: 'text',
    text: 'Developer-friendly embeds with iframe auto-resize. Works perfectly on our Next.js site.',
    rating: 5,
    verified: true,
    author: { name: 'Alex Kumar', company: 'DevStack', position: 'CTO' },
  },
  {
    _id: '5',
    type: 'text',
    text: 'Beautiful bento layout on our pricing page. Social proof that actually matches our brand.',
    rating: 5,
    author: { name: 'Priya Sharma', company: 'SaaSify', position: 'Product Lead' },
  },
  {
    _id: '6',
    type: 'text',
    text: 'Moderation workflow is smooth. Approve, publish, embed — done in one dashboard.',
    rating: 4,
    author: { name: 'James Wilson', company: 'CloudBase', position: 'Support Manager' },
  },
  {
    _id: '7',
    type: 'text',
    text: 'We switched from a competitor and saved money while getting better widgets.',
    rating: 5,
    verified: true,
    author: { name: 'Lisa Park', company: 'Nomad Tools', position: 'Founder' },
  },
  {
    _id: '8',
    type: 'text',
    text: 'The marquee layout on our homepage gets compliments every week.',
    rating: 5,
    author: { name: 'David Okonkwo', company: 'FinFlow', position: 'Growth' },
  },
];

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  theme: WidgetThemePreset;
  layout: WidgetCustomizeConfig['layout'];
  title: string;
  subtitle: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  { id: 'saas-grid', name: 'SaaS Grid', description: 'Classic card grid for landing pages', theme: 'saas', layout: 'grid', title: 'Loved by teams worldwide', subtitle: 'What our customers say' },
  { id: 'dark-bento', name: 'Dark Bento', description: 'Premium asymmetric layout', theme: 'dark', layout: 'bento', title: 'Wall of Love', subtitle: 'Trusted by builders' },
  { id: 'glass-marquee', name: 'Glass Marquee', description: 'Flowing social proof strip', theme: 'glass', layout: 'marquee', title: 'Customer stories', subtitle: 'Real feedback, real results' },
  { id: 'minimal-list', name: 'Minimal List', description: 'Clean vertical testimonials', theme: 'minimal', layout: 'list', title: 'Testimonials', subtitle: 'From verified customers' },
  { id: 'ocean-masonry', name: 'Ocean Masonry', description: 'Pinterest-style wall', theme: 'ocean', layout: 'masonry', title: 'Reviews', subtitle: 'See why teams choose us' },
  { id: 'bold-carousel', name: 'Bold Carousel', description: 'Swipeable highlight reel', theme: 'bold', layout: 'carousel', title: 'Featured reviews', subtitle: 'Swipe to explore' },
];
