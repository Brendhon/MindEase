# 🧠 MindEase – Plataforma de Acessibilidade Cognitiva (Web)

> Aplicação **web** do projeto **MindEase**, desenvolvida com Next.js e React, com foco em oferecer uma experiência de acessibilidade cognitiva para usuários neurodivergentes.

**Acesse a aplicação em produção: 🔗 [https://mind-ease-web.vercel.app](https://mind-ease-web.vercel.app)**

---

## 📜 Sumário

- [🧠 MindEase – Plataforma de Acessibilidade Cognitiva (Web)](#-mindease--plataforma-de-acessibilidade-cognitiva-web)
  - [📜 Sumário](#-sumário)
  - [🎯 Sobre o Projeto](#-sobre-o-projeto)
  - [✨ Funcionalidades Principais](#-funcionalidades-principais)
    - [🔐 Autenticação Simplificada](#-autenticação-simplificada)
    - [🧠 Dashboard Cognitivo](#-dashboard-cognitivo)
    - [⏱️ Sessão de Foco Adaptável](#️-sessão-de-foco-adaptável)
    - [✅ Organizador de Tarefas](#-organizador-de-tarefas)
    - [⚙️ Perfil e Preferências](#️-perfil-e-preferências)
  - [♿ Acessibilidade Cognitiva: O Pilar Central](#-acessibilidade-cognitiva-o-pilar-central)
  - [🧱 Arquitetura e Stack](#-arquitetura-e-stack)
    - [Arquitetura](#arquitetura)
    - [Stack Tecnológica](#stack-tecnológica)
      - [Frontend](#frontend)
      - [Backend \& Infra](#backend--infra)
  - [🧪 Qualidade e Testes](#-qualidade-e-testes)
    - [Ferramentas de Qualidade](#ferramentas-de-qualidade)
    - [Testes Automatizados](#testes-automatizados)
  - [🚀 Pipeline de CI/CD](#-pipeline-de-cicd)
    - [Configuração de Variáveis de Ambiente (.env.local)](#configuração-de-variáveis-de-ambiente-envlocal)
  - [📦 Como Rodar o Projeto](#-como-rodar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação e Configuração](#instalação-e-configuração)
    - [Execução](#execução)
  - [📱 Relação com o Projeto Mobile](#-relação-com-o-projeto-mobile)
  - [👥 Autor](#-autor)

---

## 🎯 Sobre o Projeto

O MindEase Web nasceu como uma solução focada em **acessibilidade cognitiva**, projetada para reduzir a sobrecarga causada por interfaces digitais complexas. O projeto foi desenvolvido como parte do **Hackathon Final da Pós-Graduação FIAP (Front-End)**.

A plataforma oferece uma experiência **previsível, guiada e personalizável**, com estímulos controlados e clareza visual como prioridade, atendendo usuários que enfrentam desafios como:

- TDAH (Transtorno do Déficit de Atenção com Hiperatividade)
- TEA (Transtorno do Espectro Autista)
- Dislexia
- Burnout e sobrecarga mental
- Ansiedade em ambientes digitais
- Dificuldades de foco, organização e autorregulação

O objetivo é consolidar práticas de desenvolvimento web moderno e arquitetura limpa para criar uma aplicação com impacto social real.

---

## ✨ Funcionalidades Principais

Cada funcionalidade foi desenhada com uma **responsabilidade única** para evitar sobrecarga de informações e decisões simultâneas.

### 🔐 Autenticação Simplificada

- Login exclusivo via Google (Firebase Auth), eliminando formulários longos.
- Criação automática do perfil do usuário no Firestore.

### 🧠 Dashboard Cognitivo

- Centraliza controle e previsibilidade, com uma visão simples do estado do usuário.
- Ativação do modo foco e acesso rápido às funcionalidades.
- Exibição de alertas cognitivos apenas quando relevantes.

### ⏱️ Sessão de Foco Adaptável

- Timer de foco inspirado no método Pomodoro, mas com ciclos flexíveis.
- Pausas obrigatórias para evitar hiperfoco e promover descanso mental.
- Alertas contextuais ao final de ciclos ou longos períodos de atividade.

### ✅ Organizador de Tarefas

- Criação de tarefas simples e hierarquizadas (com subtarefas).
- Interface projetada para reduzir a paralisia decisória.
- Integração opcional com as sessões de foco.

### ⚙️ Perfil e Preferências

- Personalização da interface: contraste, espaçamento, tamanho de fonte.
- Opção para reduzir movimento e animações.
- Todas as preferências são salvas automaticamente por usuário.

---

## ♿ Acessibilidade Cognitiva: O Pilar Central

A aplicação segue princípios de **Cognitive Load Reduction**, aplicados de forma prática no design e na arquitetura:

- **Sessões de foco** com tempo controlado.
- **Modo foco** para ocultar distrações visuais.
- **Alertas cognitivos** contextuais e não intrusivos.
- **Interface personalizável** (contraste, fonte, espaçamento).
- **Ritmo guiado** de navegação.

Todos os componentes interativos foram construídos com **Headless UI**, garantindo navegação completa por teclado, foco visível e previsível, uso correto de ARIA e compatibilidade com leitores de tela.

---

## 🧱 Arquitetura e Stack

### Arquitetura

O projeto adota os princípios da **Clean Architecture** para garantir um código escalável e de fácil manutenção, com uma clara separação entre as camadas de UI, aplicação e domínio.

### Stack Tecnológica

#### Frontend

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript 5+**
- **Tailwind CSS**
- **Headless UI** e **Lucide Icons**
- **React Hook Form** e **Zod** (formulários e validação)

#### Backend & Infra

- **Firebase Authentication** (Login com Google)
- **Firestore** (Banco de dados NoSQL)
- **Vercel** (Deploy e Hosting)
- **GitHub Actions** (CI/CD)

---

## 🧪 Qualidade e Testes

O projeto adota um conjunto de ferramentas que garantem padronização, manutenibilidade e qualidade contínua.

### Ferramentas de Qualidade

- **ESLint**: Análise estática de código.
- **Prettier**: Formatação automática.
- **Commitlint**: Padrão de commits (Conventional Commits).
- **Husky + lint-staged**: Execução de validações antes de cada commit.

### Testes Automatizados

- **Vitest**: Testes unitários e de componentes.
- **Testing Library**: Foco no comportamento do usuário, não na implementação.
- **Playwright**: Testes End-to-End (E2E).
- **Storybook**: Documentação e teste visual de componentes.

---

## 🚀 Pipeline de CI/CD

O projeto utiliza **GitHub Actions** para automatizar o processo de build, testes e deploy na Vercel, garantindo entregas seguras e consistentes.

O fluxo é dividido em:

1. **Build e Teste**: Executado em cada pull request para a branch `main`.
2. **Deploy**: Realizado automaticamente na Vercel após o merge na `main`.

> Para detalhes completos sobre a configuração de secrets e ambientes do GitHub, consulte o workflow em [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml). As instruções detalhadas sobre as variáveis de ambiente necessárias estão no arquivo `environment.example`.

### Configuração de Variáveis de Ambiente (.env.local)

Para o pipeline e o ambiente local funcionarem, configure as seguintes variáveis, conforme o `environment.example`:

- **Firebase**: `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, etc.)
- **NextAuth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Google OAuth**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

## 📦 Como Rodar o Projeto

### Pré-requisitos

- **Node.js 22+**
- **npm** (ou pnpm/yarn)
- **Git**
- **Conta Firebase** e **Google Cloud** (para credenciais OAuth)

### Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Brendhon/MindEase.git
   cd MindEase
   ```
2. **Instale as dependências**:
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente**:
   Copie o arquivo de exemplo e preencha com suas credenciais. As instruções detalhadas estão no próprio arquivo.
   ```bash
   cp environment.example .env.local
   ```

### Execução

- **Modo de Desenvolvimento**:

  ```bash
  npm run dev
  ```

  A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

- **Outros Comandos**:
  ```bash
  npm run build     # Build para produção
  npm run start     # Iniciar servidor de produção
  npm run lint      # Executar linter
  npm run test      # Executar testes
  npm run storybook # Iniciar Storybook
  ```

---

## 📱 Relação com o Projeto Mobile

O MindEase também possui uma versão mobile, desenvolvida em React Native, que compartilha a mesma lógica de domínio e propósito.

- **GitHub do App Mobile**: [https://github.com/Brendhon/MindEase-Mobile](https://github.com/Brendhon/MindEase_Mobile)

---

## 👥 Autor

**Brendhon Moreira**

- LinkedIn: [https://www.linkedin.com/in/brendhon-moreira](https://www.linkedin.com/in/brendhon-moreira)
- Email: [brendhon.e.c.m@gmail.com](mailto:brendhon.e.c.m@gmail.com)
