# 🧠 MindEase – Plataforma de Acessibilidade Cognitiva (Web)

Aplicação web desenvolvida como parte do **Hackathon Final da Pós-Graduação FIAP (Front-End)**, com foco em **Acessibilidade Cognitiva** para estudantes e profissionais que enfrentam desafios como:

- TDAH
- TEA (Autismo)
- Dislexia
- Burnout e sobrecarga mental
- Ansiedade em ambientes digitais
- Dificuldades de foco e retenção

O **MindEase** busca reduzir a carga cognitiva causada por interfaces digitais caóticas, oferecendo uma experiência **previsível, controlável e de baixo estímulo**, priorizando clareza, ritmo guiado e personalização.

---

## 🎯 Objetivo do Projeto

O objetivo do projeto é aplicar, de forma integrada, os conhecimentos adquiridos ao longo da pós-graduação, incluindo:

- Arquitetura de software (Clean Architecture)
- Desenvolvimento Web moderno
- Acessibilidade digital com foco cognitivo
- Persistência de dados por usuário
- Autenticação segura
- Testes automatizados
- Pipeline de CI/CD

Além de atender aos requisitos técnicos, o projeto busca **inovação funcional**, colocando o usuário neurodivergente no centro das decisões de design e arquitetura.

---

## 📄 Contexto – Hackathon FIAP

O Hackathon é o projeto final da Pós-Graduação FIAP, sendo o momento de consolidar todos os aprendizados do curso em uma aplicação real.

O tema definido é **Acessibilidade Cognitiva**, com foco na redução de:

- Excesso de informação na tela
- Falta de previsibilidade e consistência
- Navegação caótica
- Textos longos e pouco adaptados
- Sobrecarga sensorial

A plataforma **MindEase** foi idealizada para resolver esses problemas de forma prática e acessível.

---

## ♿ Acessibilidade Cognitiva (Pilar Central)

O MindEase aplica princípios de **Cognitive Load Reduction**, incluindo:

- **Níveis ajustáveis de complexidade da interface**
- **Modo foco para ocultar distrações**
- **Modo resumo vs. modo detalhado**
- **Controle de contraste, espaçamento e tamanho de fonte**
- **Animações controláveis pelo usuário**
- **Ritmo guiado de navegação**
- **Avisos de transição entre atividades**

Todos os componentes interativos utilizam **Headless UI**, garantindo:

- Navegação por teclado
- Foco visível
- Uso correto de ARIA
- Compatibilidade com leitores de tela

---

## 🚀 Stack Utilizada (Web)

### Frontend

- [**Next.js 16 (App Router)**](https://nextjs.org/docs/app)
- [**React 19**](https://react.dev/)
- [**TypeScript 5+**](https://www.typescriptlang.org/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**Headless UI**](https://headlessui.com/)
- [**Lucide Icons**](https://lucide.dev/)
- [**Framer Motion**](https://www.framer.com/motion/) (uso pontual e controlável)
- [**React Hook Form**](https://react-hook-form.com/)
- [**Zod**](https://zod.dev/)

### Backend / Infra

- [**Firebase Authentication**](https://firebase.google.com/docs/auth) – Login com Google
- [**Firestore**](https://firebase.google.com/docs/firestore) – Banco NoSQL
- [**GitHub Actions**](https://github.com/features/actions) – CI/CD
- [**Vercel**](https://vercel.com/) – Deploy

---

## 🧱 Arquitetura

O projeto segue os princípios de **Clean Architecture**, adaptados para um escopo acadêmico, priorizando clareza e manutenibilidade sem complexidade excessiva.

```
app/
 ├── login/
 │   └── page.tsx
 │
 ├── (authenticated)/    # Route group para rotas autenticadas
 │   ├── layout.tsx      # Layout com sidebar + header
 │   │
 │   ├── dashboard/
 │   │   └── page.tsx
 │   │
 │   ├── tasks/
 │   │   └── page.tsx
 │   │
 │   └── profile/
 │       └── page.tsx
 │
 └── layout.tsx          # Layout público

components/
 ├── ui/                 # Componentes base
 │   ├── button/
 │   ├── input/
 │   ├── dialog/
 │   ├── toast/
 │   └── alert-banner/
 │
 ├── feedback/
 │   ├── toast/
 │   ├── alert/
 │   └── inline-error/
 │
 ├── tasks/
 │   ├── task-card/
 │   ├── task-list/
 │   ├── task-dialog/    # Create/Edit modal
 │   └── task-timer/
 │
 └── layout/
     ├── header/
     ├── sidebar/
     └── page-container/

hooks/
 ├── useTasks.ts
 ├── useCognitiveSettings.ts
 ├── useFeedback.ts
 └── useFocusMode.ts

services/
 ├── auth/
 ├── firestore/
 └── tasks/

models/
 ├── Task.ts
 └── UserPreferences.ts

utils/
 ├── accessibility/
 └── formatting/

styles/
 └── tokens/             # Design tokens (globals.css)
```

---

## 💡 Funcionalidades (Web)

### 🔐 Login

- Autenticação via Google
- Sem formulários manuais
- Criação automática do perfil do usuário no Firestore

### 🧠 Painel Cognitivo (Dashboard)

- Ajuste de complexidade da interface
- Modo foco
- Controle de animações
- Acesso rápido às tarefas

### ✅ Organizador de Tarefas

- Lista ou etapas visuais simplificadas
- Subtarefas (checklist inteligente)
- Timer de foco (Pomodoro adaptado)
- Avisos de transição entre atividades

### ⚙️ Perfil e Preferências

- Contraste
- Espaçamento
- Tamanho de fonte
- Movimento
- Persistência automática por usuário

---

## 🧪 Testes Automatizados

### Ferramentas

- **Jest**
- **@testing-library/react**
- **@testing-library/jest-dom**

### Escopo de Testes

- Renderização de telas principais
- Acessibilidade de componentes interativos
- Fluxo de criação e exibição de tarefas
- Persistência de preferências (Firestore mockado)

---

## 📦 Como Rodar o Projeto

### Pré-requisitos

- Node.js **22+**
- npm
- Conta Firebase configurada

### Instalação

```bash
git clone https://github.com/Brendhon/MindEase.git
cd MindEase
npm install
```

### Variáveis de Ambiente (`.env.local`)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Execução

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 👥 Autor

<img style="border-radius: 20%;" src="https://avatars1.githubusercontent.com/u/52840078?s=400" width="120px;" alt="autor"/>

**Brendhon Moreira**
[LinkedIn](https://www.linkedin.com/in/brendhon-moreira)
📧 [brendhon.e.c.m@gmail.com](mailto:brendhon.e.c.m@gmail.com)
