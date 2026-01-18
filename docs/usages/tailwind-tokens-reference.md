# 🎯 Referência Rápida - Design Tokens com Tailwind

Este documento mostra como usar os Design Tokens do MindEase através de **classes Tailwind**.

---

## 📋 Índice

- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Border Radius](#border-radius)
- [Sombras](#sombras)
- [Animações](#animações)
- [Exemplos Práticos](#exemplos-práticos)

---

## 🎨 Cores

### Backgrounds

```tsx
// Backgrounds principais
<div className="bg-bg-primary">       // Fundo primário (#F9FAFB)
<div className="bg-bg-secondary">     // Fundo secundário (#F3F4F6)
<div className="bg-bg-tertiary">      // Fundo terciário (#E5E7EB)

// Surfaces (para cards, modais)
<div className="bg-surface-primary">  // Surface principal (#FFFFFF)
<div className="bg-surface-secondary"> // Surface secundária (#F9FAFB)
```

### Texto

```tsx
<p className="text-text-primary">     // Texto principal (#111827)
<p className="text-text-secondary">   // Texto secundário (#374151)
<p className="text-text-muted">       // Texto desfocado (#6B7280)
<p className="text-text-inverse">     // Texto invertido (#F9FAFB)
```

### Bordas

```tsx
<div className="border-border-subtle">  // Borda sutil (#E5E7EB)
<div className="border-border-strong">  // Borda forte (#D1D5DB)
```

### Ações (Botões, Links)

```tsx
// Primary action
<button className="bg-action-primary hover:bg-action-primary-hover">
  Clique aqui
</button>

// Secondary action
<button className="bg-action-secondary hover:bg-action-secondary-hover">
  Cancelar
</button>

// Link
<a className="text-action-primary hover:text-action-primary-hover">
  Saiba mais
</a>
```

### Feedback (Status, Alertas)

```tsx
<div className="bg-feedback-success">   // Sucesso (#16A34A)
<div className="bg-feedback-warning">   // Aviso (#D97706)
<div className="bg-feedback-error">     // Erro (#DC2626)
<div className="bg-feedback-info">      // Info (#0284C7)

// Para texto
<p className="text-feedback-success">Operação concluída!</p>
<p className="text-feedback-error">Erro na validação</p>
```

---

## 🔤 Tipografia

### Tamanhos de Fonte

```tsx
<p className="text-xs">   // 12px (--font-size-xs)
<p className="text-sm">   // 14px (--font-size-sm)
<p className="text-md">   // 16px (--font-size-md) - Padrão
<p className="text-lg">   // 18px (--font-size-lg)
<p className="text-xl">   // 20px (--font-size-xl)
<p className="text-2xl">  // 24px (--font-size-2xl)
<p className="text-3xl">  // 30px (--font-size-3xl)
```

### Pesos

```tsx
<p className="font-regular">   // 400 (padrão)
<p className="font-medium">    // 500 (destaque leve)
<p className="font-semibold">  // 600 (títulos)
```

### Line Height

```tsx
<p className="leading-tight">    // 1.25
<p className="leading-normal">   // 1.5 (padrão)
<p className="leading-relaxed">  // 1.75
```

### Família

```tsx
<p className="font-sans">  // Inter, system-ui (padrão)
```

---

## 📏 Espaçamento

### Padding & Margin

```tsx
// Padding
<div className="p-1">   // 4px
<div className="p-2">   // 8px
<div className="p-3">   // 12px
<div className="p-4">   // 16px
<div className="p-6">   // 24px
<div className="p-8">   // 32px
<div className="p-12">  // 48px
<div className="p-16">  // 64px

// Margin (mesma escala)
<div className="m-4">   // 16px
<div className="mt-6">  // Margin top 24px
<div className="mb-8">  // Margin bottom 32px

// Gap (para flexbox/grid)
<div className="flex gap-2">   // 8px entre itens
<div className="flex gap-4">   // 16px entre itens
<div className="flex gap-6">   // 24px entre itens
```

---

## 🧱 Border Radius

```tsx
<div className="rounded-sm">    // 6px (sutil)
<div className="rounded-md">    // 8px (padrão)
<div className="rounded-lg">    // 12px (destacado)
<div className="rounded-full">  // 9999px (circular/pílula)
```

---

## 🌫 Sombras

```tsx
<div className="shadow-soft">    // Sombra suave (elevation-soft)
<div className="shadow-medium">  // Sombra média (elevation-medium)
```

---

## 🎞 Animações

### Duração

```tsx
<div className="transition-colors duration-150">  // Rápido (150ms)
<div className="transition-all duration-200">     // Normal (250ms)
<div className="transition-opacity duration-300"> // Lento (350ms)
```

### Exemplo de hover com transição

```tsx
<button className="bg-action-primary hover:bg-action-primary-hover transition-colors duration-200">
  Hover suave
</button>
```

---

## 💡 Exemplos Práticos

### Card Simples

```tsx
<div className="p-6 bg-surface-primary border border-border-subtle rounded-md shadow-soft">
  <h3 className="text-xl font-semibold text-text-primary mb-2">
    Título do Card
  </h3>
  <p className="text-md text-text-secondary leading-relaxed">
    Descrição com boa legibilidade e hierarquia visual.
  </p>
</div>
```

### Botão Primary

```tsx
<button className="px-6 py-3 bg-action-primary hover:bg-action-primary-hover text-text-inverse font-medium rounded-full transition-colors duration-200">
  Ação Principal
</button>
```

### Botão Secondary (Outline)

```tsx
<button className="px-6 py-3 bg-surface-primary border border-border-strong hover:bg-bg-secondary hover:border-action-secondary text-text-primary font-medium rounded-full transition-all duration-200">
  Ação Secundária
</button>
```

### Alert de Sucesso

```tsx
<div className="p-4 bg-feedback-success/10 border border-feedback-success rounded-md">
  <p className="text-sm font-medium text-feedback-success">
    ✓ Operação realizada com sucesso!
  </p>
</div>
```

### Form Input

```tsx
<input
  type="text"
  className="w-full px-4 py-2 bg-surface-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:border-action-primary focus:outline-none transition-colors duration-150"
  placeholder="Digite aqui..."
/>
```

### Link com hover

```tsx
<a
  href="#"
  className="text-action-primary hover:text-action-primary-hover font-medium transition-colors duration-150"
>
  Saiba mais →
</a>
```

### Container Principal

```tsx
<div className="min-h-screen bg-bg-secondary">
  <main className="max-w-7xl mx-auto px-8 py-16 bg-surface-primary">
    {/* Conteúdo */}
  </main>
</div>
```

---

## ✅ Boas Práticas

### ✓ Fazer

```tsx
// Usar tokens semânticos
<p className="text-text-secondary">Texto secundário</p>

// Combinar tokens para consistência
<div className="p-4 gap-4 rounded-md">...</div>

// Usar hover states com transições
<button className="bg-action-primary hover:bg-action-primary-hover transition-colors duration-200">
```

### ✗ Evitar

```tsx
// ❌ Não usar cores hardcoded
<p className="text-gray-600">Texto</p>
<div className="bg-[#2563EB]">Box</div>

// ❌ Não usar valores arbitrários para espaçamento
<div className="p-[13px] gap-[17px]">...</div>

// ❌ Não usar inline styles
<p style={{ color: '#374151' }}>Texto</p>
```

---

## 🎨 Hierarquia Visual Recomendada

### Títulos

```tsx
<h1 className="text-3xl font-semibold text-text-primary leading-tight">
  Título Principal
</h1>

<h2 className="text-2xl font-semibold text-text-primary leading-tight">
  Subtítulo
</h2>

<h3 className="text-xl font-medium text-text-primary">
  Seção
</h3>
```

### Parágrafos

```tsx
// Corpo principal
<p className="text-md text-text-secondary leading-relaxed">
  Texto principal com boa legibilidade...
</p>

// Texto auxiliar
<p className="text-sm text-text-muted">
  Informação complementar ou menos importante
</p>
```

---

## 🌗 Dark Mode

**Todos os tokens ajustam automaticamente no dark mode!**

Não é necessário usar classes `dark:` manualmente, pois os tokens já mudam seus valores baseado no `prefers-color-scheme`.

```tsx
// ✅ Funciona automaticamente em light/dark
<div className="bg-bg-primary text-text-primary">
  Conteúdo que se adapta ao tema
</div>

// ❌ Desnecessário (os tokens já fazem isso)
<div className="bg-bg-primary dark:bg-gray-900">
  ...
</div>
```

---

## 📚 Referências

- [Design Tokens Completo](./design-tokens.md)
- [Guidelines Globais](../guidelines/global.md)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)

---

> **MindEase:** Design que respeita a cognição do usuário 🧠✨
