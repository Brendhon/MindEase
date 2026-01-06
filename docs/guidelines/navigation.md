# Navigation Guidelines - MindEase

## Overview

This document outlines the navigation architecture and best practices for the MindEase application, following Next.js 16 App Router conventions and NextAuth integration.

## Architecture

### Route Protection Strategy

We use a **two-layer protection** approach:

1. **Proxy (Middleware) Layer** (`proxy.ts`):
   - Runs on Edge Runtime before requests are completed
   - Protects routes at the network boundary
   - Handles redirects for unauthenticated users
   - Redirects authenticated users away from public auth pages

2. **Server Component Layer** (`app/(authenticated)/layout.tsx`):
   - Server-side session verification
   - Additional security layer
   - Provides session data to child components

### Route Organization

Routes are organized using **Route Groups** to maintain clean URLs while grouping related pages:

```
app/
├── (authenticated)/          # Route group (not in URL)
│   ├── layout.tsx            # Authenticated layout (Sidebar + Header)
│   ├── dashboard/
│   │   └── page.tsx          # /dashboard
│   ├── tasks/
│   │   └── page.tsx          # /tasks
│   └── profile/
│       └── page.tsx          # /profile
├── login/
│   └── page.tsx              # /login (public)
└── page.tsx                  # / (public home)
```

**Key Points:**
- Route groups `(authenticated)` don't appear in URLs
- Each route group can have its own layout
- Layouts are nested (root layout → authenticated layout → page)

## Navigation Components

### Using Next.js Link

Always use `next/link` for client-side navigation:

```tsx
import Link from "next/link";

<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>
```

**Best Practices:**
- `prefetch={true}` is enabled by default (recommended for better UX)
- Use `prefetch={false}` only for routes that are rarely accessed
- Link automatically handles active state with `usePathname()`

### Programmatic Navigation

For programmatic navigation in Client Components:

```tsx
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/dashboard");
```

For Server Components, use `redirect()`:

```tsx
import { redirect } from "next/navigation";

if (!session) {
  redirect("/login");
}
```

## Route Constants

All routes are centralized in `utils/routes/routes.ts`:

```tsx
import { PROTECTED_ROUTES, PAGE_ROUTES } from "@/utils/routes";

// Use constants instead of hardcoded strings
<Link href={PROTECTED_ROUTES.DASHBOARD}>Dashboard</Link>
```

**Benefits:**
- Type safety
- Single source of truth
- Easy refactoring
- Prevents typos

## Authentication Flow

### Unauthenticated User Accessing Protected Route

1. User navigates to `/dashboard`
2. `proxy.ts` intercepts request
3. Checks for authentication token
4. Redirects to `/login?callbackUrl=/dashboard`
5. After login, user is redirected back to `/dashboard`

### Authenticated User Accessing Public Auth Page

1. User navigates to `/login` while authenticated
2. `proxy.ts` intercepts request
3. Detects authenticated state
4. Redirects to `/dashboard`

## Performance Considerations

### Prefetching

Next.js Link automatically prefetches routes when:
- Link is visible in viewport
- User hovers over link (on desktop)
- Link is in a prefetched route

**Disable prefetching when:**
- Route has heavy data requirements
- Route is rarely accessed
- Route requires authentication check before prefetch

```tsx
<Link href="/heavy-page" prefetch={false}>
  Heavy Page
</Link>
```

### Route Groups and Full Page Reloads

**Important:** Navigating between routes with different root layouts triggers a full page reload.

Example:
- `/dashboard` uses `app/(authenticated)/layout.tsx`
- `/login` uses `app/layout.tsx` (root)
- Navigation between these triggers full reload

This is expected behavior in Next.js and helps maintain layout isolation.

## Accessibility

### Navigation Semantics

Always use semantic HTML for navigation:

```tsx
<nav aria-label="Main navigation">
  <Link href="/dashboard" aria-current={isActive ? "page" : undefined}>
    Dashboard
  </Link>
</nav>
```

**Key Points:**
- Use `<nav>` element for navigation sections
- Provide `aria-label` for screen readers
- Use `aria-current="page"` for active links
- Mark decorative icons with `aria-hidden="true"`

## Error Handling

### 404 Pages

Next.js automatically handles 404s:
- `app/not-found.tsx` - Global 404 page
- `app/404/page.tsx` - Custom 404 route

### Redirects

Use `redirect()` in Server Components or `router.push()` in Client Components:

```tsx
// Server Component
import { redirect } from "next/navigation";
redirect("/login");

// Client Component
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/login");
```

## Testing Navigation

When testing navigation:

1. **Test protected routes** - Verify redirects work correctly
2. **Test public routes** - Ensure authenticated users are redirected
3. **Test active states** - Verify `aria-current` is set correctly
4. **Test prefetching** - Check Network tab for prefetch requests
5. **Test accessibility** - Use screen reader to verify navigation

## Common Patterns

### Conditional Navigation Based on Auth State

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <Link href="/dashboard">Dashboard</Link>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
```

### Navigation with Callback URL

```tsx
import { PROTECTED_ROUTES, PAGE_ROUTES } from "@/utils/routes";

const callbackUrl = encodeURIComponent(PROTECTED_ROUTES.DASHBOARD);
const loginUrl = `${PAGE_ROUTES.LOGIN}?callbackUrl=${callbackUrl}`;
```

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Linking and Navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- [Next.js Proxy (Middleware)](https://nextjs.org/docs/app/api-reference/file-conventions/middleware)
- [NextAuth.js Documentation](https://next-auth.js.org/)

