# 🎨 MindEase — Design Tokens & Color System

## 1. Objetivo do Documento

Este documento define os **Design Tokens** do projeto **MindEase**, garantindo:

* Consistência visual entre Web e Mobile
* Suporte a acessibilidade cognitiva
* Facilidade de customização pelo usuário
* Baixo estímulo visual
* Integração direta com Tailwind CSS

Os tokens **não representam cores ou tamanhos fixos**, mas **significados semânticos**, permitindo ajustes dinâmicos de contraste, fonte e densidade.

---

## 2. Princípios de Acessibilidade Cognitiva

Todos os tokens seguem estes princípios:

* **Baixo contraste agressivo** por padrão
* **Hierarquia clara**, sem excesso de cores
* **Uso semântico** (não “azul”, mas “primary”)
* **Previsibilidade visual**
* **Customização pelo usuário**, não pelo desenvolvedor

---

## 3. Estrutura dos Design Tokens

### Categorias principais:

* 🎨 **Colors**
* 🔤 **Typography**
* 📐 **Spacing**
* 🧱 **Radius**
* 🌫 **Elevation**
* 🎞 **Motion**

---

## 4. Color Tokens (Semânticos)

### 4.1 Base Neutra (Low Stimulation)

```ts
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary

--color-surface-primary
--color-surface-secondary

--color-border-subtle
--color-border-strong
```

💡 **Uso**

* Backgrounds
* Containers
* Cards
* Divisões visuais suaves

---

### 4.2 Texto (Legibilidade Cognitiva)

```ts
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-inverse
```

Regras:

* Nunca usar texto puro preto (`#000`)
* Texto secundário sempre ≥ 4.5:1 de contraste
* Texto muted nunca usado para conteúdo crítico

---

### 4.3 Cores Funcionais (Pouco Saturadas)

```ts
--color-action-primary
--color-action-secondary

--color-feedback-success
--color-feedback-warning
--color-feedback-error
--color-feedback-info
```

💡 Usadas apenas para:

* Estados
* Feedback
* Ações importantes

🚫 Nunca usadas como decoração.

---

### 4.4 Modo de Contraste Ajustável

O sistema suporta **níveis de contraste**:

* `default`
* `high`
* `very-high`

O contraste é ajustado via troca de valores dos tokens, **não trocando classes no código**.

---

## 5. Paleta Base Recomendada (Default Theme)

### Tons Neutros

| Token           | Valor     |
| --------------- | --------- |
| bg-primary      | `#F9FAFB` |
| bg-secondary    | `#F3F4F6` |
| surface-primary | `#FFFFFF` |
| border-subtle   | `#E5E7EB` |

---

### Texto

| Token          | Valor     |
| -------------- | --------- |
| text-primary   | `#111827` |
| text-secondary | `#374151` |
| text-muted     | `#6B7280` |

---

### Ação (Baixo estímulo)

| Token            | Valor     |
| ---------------- | --------- |
| action-primary   | `#2563EB` |
| action-secondary | `#475569` |

---

### Feedback

| Tipo    | Cor       |
| ------- | --------- |
| success | `#16A34A` |
| warning | `#D97706` |
| error   | `#DC2626` |
| info    | `#0284C7` |

---

## 6. Typography Tokens

### 6.1 Fonte Base

```ts
--font-family-base: "Inter", system-ui, sans-serif;
```

Motivos:

* Alta legibilidade
* Excelente para dislexia
* Neutra cognitivamente

---

### 6.2 Escala de Fonte (Controlável)

```ts
--font-size-xs
--font-size-sm
--font-size-md
--font-size-lg
--font-size-xl
```

O usuário pode selecionar:

* Compact
* Default
* Large
* Extra Large

🚫 Nunca usar `px` diretamente no código.

---

### 6.3 Peso Tipográfico

```ts
--font-weight-regular
--font-weight-medium
--font-weight-semibold
```

Regra:

* Nunca usar `bold` excessivo
* Destaque por **espaço + hierarquia**, não peso

---

## 7. Spacing Tokens (Densidade Cognitiva)

```ts
--space-1
--space-2
--space-3
--space-4
--space-6
--space-8
```

### Modos de Densidade:

* **Compact:** menos espaçamento
* **Comfort:** padrão
* **Relaxed:** mais respiro visual

O modo é aplicado trocando os valores base dos tokens.

---

## 8. Radius Tokens

```ts
--radius-sm
--radius-md
--radius-lg
```

Regras:

* Interfaces suaves reduzem carga cognitiva
* Evitar cantos extremamente retos

---

## 9. Elevation (Sem sombras agressivas)

```ts
--elevation-none
--elevation-soft
```

Sombras devem ser:

* Curtas
* Difusas
* Pouco contraste

---

## 10. Motion Tokens (Animação Controlável)

```ts
--motion-duration-fast
--motion-duration-normal
--motion-easing-base
```

Regras:

* Animações **opcionais**
* Desativáveis pelo usuário
* Nunca automáticas sem consentimento

Framer Motion deve respeitar esses tokens.

---

## 12. Conclusão

Este sistema de Design Tokens:

* Atende totalmente o Hackathon FIAP Inclusive
* Facilita controle de acessibilidade
* Permite evolução futura
* Mantém Web e Mobile coerentes
* Reduz esforço de manutenção

> **No MindEase, o design se adapta à mente do usuário — não o contrário.**