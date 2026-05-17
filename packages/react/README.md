# @testiflow/react

Official React components for [TestiFlow](https://testiflow.site) embeds.

## Install

```bash
npm install @testiflow/react
```

## Wall of Love

```tsx
import { TestiflowWall } from '@testiflow/react';

export function Reviews() {
  return (
    <TestiflowWall
      siteId="your-site-id"
      theme="glass"
      layout="bento"
      limit={12}
      loadingFallback={<p>Loading reviews…</p>}
      onReady={() => console.log('widget ready')}
    />
  );
}
```

## Collect button

```tsx
import { TestiflowModal } from '@testiflow/react';

<TestiflowModal siteId="your-site-id" buttonText="Share your story" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `siteId` | `string` | required |
| `apiBase` | `string` | current origin |
| `theme` | `TestiflowTheme` | `saas` |
| `layout` | `TestiflowLayout` | `grid` |
| `limit` | `number` | `12` |

Layouts: `grid`, `carousel`, `marquee`, `list`, `bento`, `masonry`, `floating`, `columns`.

Themes: `saas`, `minimal`, `dark`, `glass`, `ocean`, `bold`, `warm`, `mono`.
