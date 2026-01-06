MindEase is a platform focused on **cognitive accessibility** for neurodivergent users (TDAH, TEA, Dislexia, ansiedade, sobrecarga mental).

All technical decisions **must support**:

* Reduction of cognitive load
* Predictability and consistency
* User-controlled complexity
* Accessibility-first design (WCAG + cognitive accessibility)

---

## 🧱 Code Style

* Write **concise, readable, and type-safe TypeScript**
* Use **functional components and React Hooks only**
* Prefer **simple logic over clever abstractions**
* Keep components **small, composable, and easy to reason about**
* **Group files by feature**, not by type

---

## 📛 Naming Conventions

* **Variables & functions:** `camelCase`
* **React Components:** `PascalCase`
* **Directories:** `lowercase-hyphenated`
* **Accessibility-related components/hooks:** prefix with `useAccessibility`, `Cognitive`, or `Focus`

---

## 🟦 TypeScript Rules

* Use **TypeScript everywhere** (no `.js` files) — enable **strict mode**
* **Prefer `interface`** for component props and domain models
* **Avoid `any`** — use `unknown` when flexibility is needed
* Domain logic must be **framework-agnostic**

---

## 🧠 Clean Architecture (Mandatory)

### Layers

* **Domain:** Entities, use cases, business rules
* **Application:** Services, orchestrators
* **Infrastructure:** API clients, storage (LocalStorage, IndexedDB, backend)
* **UI:** React components, hooks, pages

> ❌ UI must never contain business rules  
> ✅ Use cases must not depend on React, Next.js, or browser APIs

---

## ⚙️ Server vs Client Components

* **Server Components by default**
* Use `"use client"` **only when necessary** (interactivity, forms, animations, user preferences)
* Keep **Client Components minimal** — move data fetching, heavy logic, and transformations to Server Components or services

---

## ⚡ Performance & Hooks

* `useState` → only when truly needed
* `useEffect` → avoid when logic can be derived
* `useMemo` → only for expensive computations
* `useCallback` → only for memoized child components
* Avoid re-renders that increase **cognitive noise**

---

## 🎨 UI & Styling

### Tailwind CSS

- Use **Tailwind CSS exclusively** for all component styling
- **Do not use Tailwind classes directly inside TSX components**
- Define component styles as a `const` object at the end of the file with `as const`

```typescript
const styles = {
  container: `flex flex-col items-center`,
  image: `h-auto object-contain`,
} as const;
```
* **Headless UI** for accessible primitives (Menu, Dialog, Switch, Listbox)
* **lucide-react** for all icons (consistent + low visual noise)
* **Framer Motion allowed** — must be optional, subtle, and disableable (no mandatory animations)

---

## ♿ Accessibility (Core Requirement)

Every feature must support: adjustable font size, spacing, contrast; **Focus Mode** (hide non-essential UI); predictable navigation; reduced visual clutter; clear hierarchy; keyboard navigation; screen reader support.

> If a feature increases cognitive load, it must be configurable or removable.

---

## 🖼️ Images

* Always use **`next/image`**
* Avoid decorative images
* Images must never convey essential information alone

---

## 📚 Documentation

### Docs Structure (`/docs`)

```
docs/
├── components   # Shared UI components
├── guidelines   # Architecture, accessibility, patterns
└── usages       # Hooks, services, APIs
```

### Documentation Rules

* All documentation in **English**
* ❌ Do not document pages or one-off components
* ✅ Document shared hooks, accessibility utilities, and design tokens
* No large code blocks in `.md` — link to source instead

---

## 🧪 Testing (Mandatory)

* Unit tests for hooks, domain use cases, and services
* Component tests for shared UI and accessibility behavior
* Tests are required for CI to pass

---

## 🔁 CI/CD

* Use **GitHub Actions** — pipeline must include lint, type check, and tests
* No direct push to main without passing checks

---

## 🧰 Libraries & Tools

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Headless UI**
* **lucide-react**
* **React Hook Form**
* **Zod**
* **GitHub Actions**

> Deployment may be manual or custom, CI/CD is mandatory.

---

## 📁 Directory Structure

```
@/app            # App Router pages and routes
@/components     # Reusable UI components
@/contexts       # Global accessibility & user settings
@/hooks          # Custom hooks
@/domain         # Entities and use cases
@/services       # Application services
@/utils          # Helper functions
@/docs           # Project documentation
```

---

## ✅ Verification Rule

After implementing any feature:

1. Check accessibility impact
2. Verify architectural boundaries
3. Confirm tests are updated
4. Update documentation if shared logic changed