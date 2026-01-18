# Estratégia de Testes - MindEase

## Visão Geral

Este documento detalha a estratégia de testes para o projeto MindEase, focando em **60-70% de cobertura de código** através de testes unitários, de componentes, snapshot e E2E. A estratégia prioriza componentes e fluxos mais fáceis de testar e que trazem maior valor para a manutenibilidade e confiabilidade do código.

## Objetivos

- **Cobertura alvo**: 60-70% (não 100%)
- **Foco**: Componentes isolados, funções puras, fluxos críticos de usuário
- **Ferramentas**: Vitest (unitários, componentes, snapshot) + Playwright (E2E)
- **Prioridade**: Testar o que é mais fácil e traz mais valor

---

## Ferramentas e Configuração

### Ferramentas Utilizadas

- **Vitest 4.0.16**: Testes unitários, de componentes e snapshot
- **Playwright 1.57.0**: Testes end-to-end
- **@vitest/coverage-v8**: Análise de cobertura
- **@testing-library/react**: Renderização e interação com componentes React (a ser instalado)

### Scripts Propostos (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --project unit",
    "test:components": "vitest run --project components",
    "test:snapshot": "vitest run --project snapshot",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## Estrutura de Diretórios

```
__tests__/
├── unit/
│   ├── utils/
│   │   ├── timer-helpers.test.ts
│   │   ├── tasks.test.ts
│   │   ├── ui.test.ts
│   │   └── uuid.test.ts
│   ├── schemas/
│   │   └── task-dialog.schema.test.ts
│   └── hooks/
│       └── (hooks simples, se aplicável)
│
├── components/
│   ├── ui/
│   │   ├── button.test.tsx
│   │   ├── input.test.tsx
│   │   ├── card.test.tsx
│   │   └── checkbox.test.tsx
│   ├── form/
│   │   └── form-input.test.tsx
│   └── tasks/
│       ├── task-checklist.test.tsx
│       └── task-checklist-progress.test.tsx
│
├── e2e/
│   ├── auth.spec.ts
│   ├── tasks.spec.ts
│   └── timer.spec.ts
│
└── __snapshots__/
    └── (gerado automaticamente pelo Vitest)
```

---

## 1. Testes Unitários (Vitest)

### 1.1 Utils - Funções Puras

#### `utils/timer/timer-helpers.ts`

**Justificativa**: Funções puras, sem dependências externas, fáceis de testar e críticas para o funcionamento do timer.

**Arquivos de teste**: `__tests__/unit/utils/timer-helpers.test.ts`

**Funções a testar**:

- `formatTime(seconds: number)`: Formatação de tempo em MM:SS
  - Casos: 0s, 59s, 60s, 125s, 3661s, valores negativos
- `isTimerCompleted(remainingTime: number)`: Verificação de conclusão
  - Casos: 0, -1, 1, valores positivos

**Exemplo de teste**:

```typescript
describe('formatTime', () => {
  it('should format 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('should format 125 seconds as 02:05', () => {
    expect(formatTime(125)).toBe('02:05');
  });

  it('should format 3661 seconds as 61:01', () => {
    expect(formatTime(3661)).toBe('61:01');
  });
});
```

---

#### `utils/tasks/tasks.ts`

**Justificativa**: Lógica de negócio pura relacionada a tarefas, sem dependências de UI ou serviços externos.

**Arquivos de teste**: `__tests__/unit/utils/tasks.test.ts`

**Funções a testar**:

- `hasPendingSubtasks(task: Task)`: Verifica se há subtarefas pendentes
  - Casos: sem subtarefas, todas completas, algumas pendentes, todas pendentes
- `getPendingSubtasks(task: Task)`: Retorna subtarefas pendentes
  - Casos: sem subtarefas, todas completas, algumas pendentes
- `canCompleteTask(task: Task)`: Verifica se tarefa pode ser completada
  - Casos: sem subtarefas, todas completas, com pendentes

**Exemplo de teste**:

```typescript
describe('hasPendingSubtasks', () => {
  it('should return false when task has no subtasks', () => {
    const task: Task = {
      id: '1',
      userId: 'user1',
      title: 'Task',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(hasPendingSubtasks(task)).toBe(false);
  });

  it('should return true when task has pending subtasks', () => {
    const task: Task = {
      id: '1',
      userId: 'user1',
      title: 'Task',
      status: 0,
      subtasks: [
        { id: '1', title: 'Subtask 1', completed: true, order: 0 },
        { id: '2', title: 'Subtask 2', completed: false, order: 1 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(hasPendingSubtasks(task)).toBe(true);
  });
});
```

---

#### `utils/ui/ui.ts`

**Justificativa**: Função utilitária crítica para merge de classes, usada em todo o projeto.

**Arquivos de teste**: `__tests__/unit/utils/ui.test.ts`

**Funções a testar**:

- `cn(...inputs: ClassValue[])`: Merge de classes Tailwind
  - Casos: classes simples, arrays, objetos condicionais, valores null/undefined

**Exemplo de teste**:

```typescript
describe('cn', () => {
  it('should merge simple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('p-4 p-2')).toBe('p-2'); // p-2 sobrescreve p-4
  });
});
```

---

#### `utils/uuid/uuid.ts`

**Justificativa**: Função simples mas importante para geração de IDs únicos.

**Arquivos de teste**: `__tests__/unit/utils/uuid.test.ts`

**Funções a testar**:

- `generateRandomUUID()`: Geração de UUID único
  - Casos: gera string, formato válido, valores únicos em múltiplas chamadas

---

### 1.2 Schemas - Validação

#### `schemas/task-dialog.schema.ts`

**Justificativa**: Validação crítica de dados de entrada, usando Zod. Fácil de testar e importante para segurança.

**Arquivos de teste**: `__tests__/unit/schemas/task-dialog.schema.test.ts`

**Schemas a testar**:

- `taskDialogSchema`: Validação de formulário
  - Casos válidos: título válido, descrição opcional, subtarefas válidas
  - Casos inválidos: título vazio, título apenas espaços, subtarefas inválidas
- `taskDialogOutputSchema`: Transformação de dados
  - Casos: remove espaços em branco, filtra subtarefas vazias, reordena subtarefas

**Exemplo de teste**:

```typescript
describe('taskDialogSchema', () => {
  it('should validate a valid task', () => {
    const valid = {
      title: 'My Task',
      description: 'Description',
      subtasks: [],
    };
    expect(() => taskDialogSchema.parse(valid)).not.toThrow();
  });

  it('should reject empty title', () => {
    const invalid = { title: '', description: '', subtasks: [] };
    expect(() => taskDialogSchema.parse(invalid)).toThrow();
  });

  it('should reject title with only spaces', () => {
    const invalid = { title: '   ', description: '', subtasks: [] };
    expect(() => taskDialogSchema.parse(invalid)).toThrow();
  });
});
```

---

## 2. Testes de Componentes (Vitest + @testing-library/react)

### 2.1 Componentes UI Base

#### `components/ui/button/button.tsx`

**Justificativa**: Componente fundamental, usado em toda aplicação. Testar renderização, variantes, estados e acessibilidade.

**Arquivos de teste**: `__tests__/components/ui/button.test.tsx`

**Cenários a testar**:

- Renderização básica com texto
- Todas as variantes (primary, secondary, ghost, danger, warning)
- Todos os tamanhos (sm, md, lg)
- Estado de loading
- Estado disabled
- Integração com Button.Icon, Button.Text, Button.Loading
- Acessibilidade (aria-busy, aria-disabled)
- Interação via teclado

**Exemplo de teste**:

```typescript
describe('Button', () => {
  it('should render with text', () => {
    render(
      <Button>
        <Button.Text>Click me</Button.Text>
      </Button>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply primary variant styles', () => {
    render(
      <Button variant="primary">
        <Button.Text>Primary</Button.Text>
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass(/* classes esperadas */);
  });

  it('should show loading state', () => {
    render(
      <Button isLoading>
        <Button.Loading />
        <Button.Text>Saving...</Button.Text>
      </Button>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

---

#### `components/ui/input/input.tsx`

**Justificativa**: Componente de formulário crítico, usado em múltiplos lugares. Testar renderização, labels, erros e acessibilidade.

**Arquivos de teste**: `__tests__/components/ui/input.test.tsx`

**Cenários a testar**:

- Renderização com label e field
- Campo de texto básico
- Campo textarea
- Exibição de erro
- Associação label-field (htmlFor/id)
- Acessibilidade (aria-describedby para erros)

---

#### `components/ui/card/card.tsx`

**Justificativa**: Componente de layout usado extensivamente. Testar renderização e composição.

**Arquivos de teste**: `__tests__/components/ui/card.test.tsx`

**Cenários a testar**:

- Renderização básica
- Composição com Card.Header, Card.Title, Card.Description, Card.Content
- Prop `focused` (focus mode)
- Prop `as` (div, section, article)
- Aplicação de classes de acessibilidade

---

#### `components/ui/checkbox/checkbox.tsx`

**Justificativa**: Componente interativo importante. Testar estados, interações e acessibilidade.

**Arquivos de teste**: `__tests__/components/ui/checkbox.test.tsx`

**Cenários a testar**:

- Renderização checked/unchecked
- Toggle ao clicar
- Toggle via teclado (Enter, Space)
- Estado disabled
- Prop-based API vs Composition API
- Acessibilidade (aria-checked, role="checkbox")

---

### 2.2 Componentes de Formulário

#### `components/form/input/input.tsx` e `components/form/form-input/form-input.tsx`

**Justificativa**: Componentes que integram React Hook Form, críticos para formulários.

**Arquivos de teste**: `__tests__/components/form/form-input.test.tsx`

**Cenários a testar**:

- Integração com React Hook Form
- Validação de erros
- Exibição de mensagens de erro
- Estados de validação

---

### 2.3 Componentes de Tarefas

#### `components/tasks/task-checklist/task-checklist.tsx`

**Justificativa**: Componente com lógica de negócio (ordenação, progresso). Testável isoladamente.

**Arquivos de teste**: `__tests__/components/tasks/task-checklist.test.tsx`

**Cenários a testar**:

- Renderização de lista de subtarefas
- Ordenação por `order`
- Cálculo de progresso
- Toggle de subtarefas (quando `interactive={true}`)
- Exibição de hint quando `isInFocus={false}`
- Não renderiza quando `subtasks.length === 0`

**Mock necessário**: `useAccessibilityClasses`, `useTextDetail`

---

#### `components/tasks/task-checklist/task-checklist-progress.tsx`

**Justificativa**: Componente simples com lógica de cálculo. Fácil de testar.

**Arquivos de teste**: `__tests__/components/tasks/task-checklist-progress.test.tsx`

**Cenários a testar**:

- Exibição correta de progresso (completedCount/totalCount)
- Formatação de texto de progresso
- Casos extremos (0/0, 0/5, 5/5)

**Mock necessário**: `useAccessibilityClasses`, `useTextDetail`

---

## 3. Testes de Snapshot (Vitest)

**Justificativa**: Garantir que mudanças visuais em componentes UI estáveis sejam intencionais.

### Componentes para Snapshot

1. **Button** - Todas as variantes e tamanhos
2. **Card** - Estrutura básica e composição
3. **Input** - Estados (normal, erro, disabled)
4. **Checkbox** - Estados (checked, unchecked, disabled)

**Arquivos de teste**: `__tests__/components/ui/*.snapshot.test.tsx`

**Estratégia**:

- Criar snapshots iniciais após implementação
- Atualizar snapshots apenas quando mudanças visuais forem intencionais
- Revisar diffs cuidadosamente antes de aceitar

**Exemplo**:

```typescript
describe('Button Snapshot', () => {
  it('should match snapshot for primary variant', () => {
    const { container } = render(
      <Button variant="primary">
        <Button.Text>Click me</Button.Text>
      </Button>
    );
    expect(container).toMatchSnapshot();
  });
});
```

---

## 4. Testes E2E (Playwright)

### 4.1 Fluxo de Autenticação

**Arquivo**: `__tests__/e2e/auth.spec.ts`

**Justificativa**: Fluxo crítico de entrada na aplicação. Testar integração completa com NextAuth e Firebase.

**Cenários**:

1. **Login com Google**
   - Acessar `/login`
   - Clicar em botão de login
   - Verificar redirecionamento para `/dashboard` após autenticação
   - Verificar que sessão é mantida

2. **Proteção de Rotas**
   - Acessar `/dashboard` sem autenticação
   - Verificar redirecionamento para `/login`
   - Após login, verificar acesso a rotas protegidas

3. **Logout** (se implementado)
   - Fazer logout
   - Verificar redirecionamento para `/login`
   - Verificar que rotas protegidas não são acessíveis

**Setup necessário**:

- Mock ou conta de teste do Google OAuth
- Configuração de autenticação de teste no Playwright

---

### 4.2 Fluxo de Tarefas

**Arquivo**: `__tests__/e2e/tasks.spec.ts`

**Justificativa**: Funcionalidade core da aplicação. Testar CRUD completo de tarefas.

**Cenários**:

1. **Criar Nova Tarefa**
   - Acessar `/tasks`
   - Clicar em botão "Nova Tarefa"
   - Preencher formulário (título, descrição opcional)
   - Adicionar subtarefas (opcional)
   - Salvar
   - Verificar que tarefa aparece na lista

2. **Editar Tarefa Existente**
   - Abrir diálogo de edição
   - Modificar título/descrição
   - Adicionar/remover subtarefas
   - Salvar
   - Verificar que mudanças são refletidas

3. **Marcar Subtarefa como Completa**
   - Clicar em checkbox de subtarefa
   - Verificar que checkbox é marcado
   - Verificar atualização de progresso

4. **Deletar Tarefa**
   - Abrir diálogo de edição
   - Clicar em botão de deletar
   - Confirmar deleção
   - Verificar que tarefa é removida da lista

5. **Visualizar Lista de Tarefas**
   - Verificar que tarefas são exibidas corretamente
   - Verificar ordenação (se aplicável)
   - Verificar estados (To Do, In Progress, Done)

**Setup necessário**:

- Autenticação prévia (via `auth.spec.ts` ou setup global)
- Dados de teste no Firestore (ou mock)

---

### 4.3 Fluxo de Timer

**Arquivo**: `__tests__/e2e/timer.spec.ts`

**Justificativa**: Funcionalidade importante para foco. Testar ciclo completo do timer.

**Cenários**:

1. **Iniciar Timer de Foco**
   - Abrir uma tarefa
   - Clicar em "Iniciar Foco"
   - Verificar que timer inicia contagem regressiva
   - Verificar exibição de tempo restante

2. **Pausar Timer**
   - Iniciar timer
   - Clicar em "Pausar"
   - Verificar que timer para
   - Verificar que tempo não muda

3. **Completar Sessão de Foco**
   - Iniciar timer (usar timer curto para teste, ex: 5 segundos)
   - Aguardar conclusão
   - Verificar que diálogo de conclusão aparece
   - Verificar mensagem de sucesso

4. **Navegação Durante Timer**
   - Iniciar timer
   - Navegar para outra página
   - Verificar que timer continua (se aplicável)
   - Ou verificar aviso de navegação (se implementado)

**Setup necessário**:

- Timer de teste com duração curta (configurável)
- Mock de `setInterval`/`setTimeout` se necessário

---

## 5. Estratégia de Mocks

### 5.1 Mocks Necessários

#### Firebase/Firestore

- **Arquivo**: `__tests__/__mocks__/firebase.ts`
- **Uso**: Mockar `firestoreService` em testes unitários de serviços
- **Estratégia**: Criar implementação in-memory para testes

#### NextAuth

- **Arquivo**: `__tests__/__mocks__/next-auth.ts`
- **Uso**: Mockar `getServerSession` e hooks de autenticação
- **Estratégia**: Retornar sessão mockada baseada em contexto de teste

#### Hooks de Acessibilidade

- **Arquivo**: `__tests__/__mocks__/hooks/accessibility.ts`
- **Uso**: Mockar `useAccessibilityClasses`, `useTextDetail`, `useCognitiveSettings`
- **Estratégia**: Retornar valores padrão ou configuráveis

#### React Router (Next.js)

- **Uso**: Mockar `useRouter`, `usePathname` em componentes
- **Estratégia**: Usar `@testing-library/react` com mocks do Next.js

### 5.2 Setup de Testes

**Arquivo**: `__tests__/setup.ts`

```typescript
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock accessibility hooks
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => ({
    spacingClasses: { padding: 'p-4', gap: 'gap-2' },
    fontSizeClasses: { sm: 'text-sm', base: 'text-base', lg: 'text-lg' },
    contrastClasses: 'contrast-normal',
    animationClasses: 'animate-normal',
  }),
  useTextDetail: () => ({
    getText: (key: string) => key, // Retorna a chave como fallback
  }),
}));

// Mock cognitive settings
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => ({
    settings: {
      fontSize: 'base',
      contrast: 'normal',
      spacing: 'normal',
      animations: 'normal',
    },
  }),
}));
```

---

## 6. Configuração de Cobertura

### Vitest Coverage Config

**Arquivo**: `vitest.config.ts` (atualizar)

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/__mocks__/**',
        '**/.storybook/**',
        '**/stories/**',
        'app/**', // Páginas testadas via E2E
        'middlewares/**',
        'providers/**', // Providers complexos, muitas dependências
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});
```

### Arquivos Excluídos da Cobertura

- **Páginas** (`app/**/page.tsx`): Testadas via E2E
- **Providers complexos**: Muitas dependências, difícil de testar isoladamente
- **Middlewares**: Testados via E2E
- **Configurações**: Não precisam de testes
- **Tipos/Interfaces**: Não executáveis

---

## 7. Comandos de Execução

### Desenvolvimento

```bash
# Executar todos os testes em modo watch
npm run test:watch

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de componentes
npm run test:components

# Executar apenas testes E2E
npm run test:e2e

# Executar com UI interativa
npm run test:ui
```

### CI/CD

```bash
# Executar todos os testes e gerar cobertura
npm run test:coverage

# Executar testes E2E em modo headless
npm run test:e2e -- --headed
```

### Manutenção

```bash
# Atualizar snapshots
npm run test:snapshot -- -u

# Executar testes em modo debug
npm run test -- --inspect-brk
```

---

## 8. Metas e Priorização

### Prioridade Alta (Implementar Primeiro)

1. ✅ Utils puros (`timer-helpers`, `tasks`, `ui`)
2. ✅ Schemas de validação (`task-dialog.schema`)
3. ✅ Componentes UI base (`Button`, `Input`, `Card`, `Checkbox`)
4. ✅ Fluxo E2E de autenticação

### Prioridade Média

1. Componentes de formulário (`form-input`)
2. Componentes de tarefas (`task-checklist`, `task-checklist-progress`)
3. Fluxo E2E de tarefas (CRUD)
4. Testes de snapshot

### Prioridade Baixa (Opcional)

1. Hooks simples (se isoláveis)
2. Fluxo E2E de timer (pode ser complexo)
3. Testes de integração mais complexos

---

## 9. Checklist de Implementação

### Fase 1: Infraestrutura

- [ ] Configurar `vitest.config.ts` com projetos separados
- [ ] Configurar `playwright.config.ts`
- [ ] Criar estrutura de diretórios `__tests__/`
- [ ] Criar arquivo `__tests__/setup.ts` com mocks
- [ ] Adicionar scripts no `package.json`
- [ ] Instalar dependências faltantes (`@testing-library/react`, `@testing-library/jest-dom`)

### Fase 2: Testes Unitários

- [ ] `utils/timer/timer-helpers.test.ts`
- [ ] `utils/tasks/tasks.test.ts`
- [ ] `utils/ui/ui.test.ts`
- [ ] `utils/uuid/uuid.test.ts`
- [ ] `schemas/task-dialog.schema.test.ts`

### Fase 3: Testes de Componentes

- [ ] `components/ui/button.test.tsx`
- [ ] `components/ui/input.test.tsx`
- [ ] `components/ui/card.test.tsx`
- [ ] `components/ui/checkbox.test.tsx`
- [ ] `components/form/form-input.test.tsx`
- [ ] `components/tasks/task-checklist.test.tsx`
- [ ] `components/tasks/task-checklist-progress.test.tsx`

### Fase 4: Testes de Snapshot

- [ ] Snapshots para componentes UI principais

### Fase 5: Testes E2E

- [ ] `e2e/auth.spec.ts`
- [ ] `e2e/tasks.spec.ts`
- [ ] `e2e/timer.spec.ts`

### Fase 6: Validação

- [ ] Executar `npm run test:coverage` e verificar 60-70%
- [ ] Revisar relatório de cobertura
- [ ] Ajustar exclusões se necessário
- [ ] Documentar decisões de exclusão

---

## 10. Notas e Considerações

### Por que não 100% de cobertura?

- **Custo-benefício**: Alguns componentes são difíceis de testar isoladamente (muitas dependências)
- **Foco**: Priorizar o que traz mais valor (lógica de negócio, componentes reutilizáveis)
- **Manutenibilidade**: Testes complexos podem se tornar difíceis de manter

### Componentes Excluídos (Justificativa)

- **Páginas completas**: Testadas via E2E, não precisam de testes unitários
- **Providers complexos**: Muitas dependências (Firebase, Context), melhor testar via E2E
- **Hooks com muitas dependências**: Difíceis de mockar, melhor testar via componentes que os usam
- **Componentes de layout complexos**: Testados via E2E

### Quando Adicionar Mais Testes?

- Quando bugs forem encontrados em produção
- Quando componentes críticos forem modificados
- Quando novos fluxos importantes forem adicionados

---

## 11. Referências

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

**Última atualização**: 2025-01-27
**Versão**: 1.0.0
