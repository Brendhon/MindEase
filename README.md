# 🧠 MindEase – Plataforma de Acessibilidade Cognitiva (Web)

Aplicação web desenvolvida como parte do **Hackathon Final da Pós-Graduação FIAP (Front-End)**, com foco em **Acessibilidade Cognitiva**, voltada a usuários que enfrentam desafios como:

- TDAH
- TEA (Autismo)
- Dislexia
- Burnout e sobrecarga mental
- Ansiedade em ambientes digitais
- Dificuldades de foco, organização e retenção

O **MindEase** foi projetado para reduzir a **carga cognitiva** causada por interfaces digitais complexas, oferecendo uma experiência **previsível, guiada e personalizável**, com estímulos controlados e clareza visual como prioridade.

---

## 🎯 Objetivo do Projeto

O objetivo do projeto é consolidar os conhecimentos adquiridos ao longo da pós-graduação, aplicando-os de forma integrada em uma aplicação real, com foco em impacto social e técnico:

- Arquitetura limpa e escalável (Clean Architecture)
- Desenvolvimento Web moderno com React e Next.js
- Acessibilidade digital com foco **cognitivo** (não apenas visual)
- Persistência de preferências por usuário
- Autenticação segura
- Testes automatizados em múltiplos níveis

* Pipeline de CI/CD

Além dos requisitos técnicos, o MindEase prioriza **decisões conscientes de UX**, sempre partindo das necessidades de usuários neurodivergentes.

---

## 📄 Contexto – Hackathon FIAP

O Hackathon representa o projeto final da Pós-Graduação FIAP, sendo o momento de aplicar, de forma prática, todos os conceitos abordados ao longo do curso.

O tema definido foi **Acessibilidade Cognitiva**, com foco em reduzir:

- Excesso de informação simultânea
- Falta de previsibilidade na navegação
- Interfaces visualmente caóticas
- Textos longos sem hierarquia clara
- Sobrecarga sensorial e decisória

O **MindEase** surge como uma resposta direta a esses problemas, oferecendo uma plataforma centrada no usuário e não apenas na funcionalidade.

---

## ♿ Acessibilidade Cognitiva (Pilar Central)

A aplicação segue princípios de **Cognitive Load Reduction**, aplicados de forma prática no design e na arquitetura da interface:

- **Sessões de foco com tempo controlado e pausas orientadas**
- **Modo foco para ocultar distrações visuais**
- **Alertas cognitivos contextuais** (transições, pausas, excesso de tempo)
- **Níveis ajustáveis de complexidade da interface**
- **Modo resumo vs. modo detalhado**
- **Controle de contraste, espaçamento e tamanho de fonte**
- **Animações opcionais e controláveis**
- **Ritmo guiado de navegação**

Todos os componentes interativos utilizam **Headless UI**, garantindo:

- Navegação completa por teclado
- Foco visível e previsível
- Uso correto de ARIA
- Compatibilidade com leitores de tela

---

## 🧠 Estrutura Funcional e Responsabilidade das Páginas

A aplicação foi estruturada para que cada página tenha **responsabilidade clara**, evitando sobrecarga de informações e decisões simultâneas.

### 🔐 Autenticação

- Login exclusivo via Google (Firebase Auth)
- Elimina formulários longos e validações complexas
- Criação automática do perfil do usuário no Firestore

### 🧠 Dashboard (Painel Cognitivo)

Responsável por **centralizar controle e previsibilidade**:

- Visualização simples do estado atual do usuário
- Ativação do modo foco
- Exibição de alertas cognitivos apenas quando relevantes
- Acesso rápido às sessões de foco e tarefas

### ⏱️ Sessão de Foco

- Timer de foco inspirado no Pomodoro, porém **adaptável**
- Opções pré-definidas de foco e pausa (curta, média e longa)
- Pausas obrigatórias para evitar hiperfoco
- Alertas cognitivos ao final de ciclos ou longos períodos contínuos

### 🚨 Alertas Cognitivos

Os alertas não são notificações constantes, mas **intervenções conscientes**, exibidas apenas quando:

- O tempo de foco ultrapassa limites seguros
- É necessário iniciar uma pausa
- O usuário retorna de uma pausa
- Há mudança significativa de contexto

Objetivo: **auxiliar a autorregulação**, não interromper desnecessariamente.

### ✅ Organizador de Tarefas

- Tarefas simples e hierarquizadas
- Subtarefas em formato de checklist
- Redução de decisões simultâneas
- Integração opcional com sessões de foco

### ⚙️ Perfil e Preferências

- Contraste
- Espaçamento
- Tamanho de fonte
- Redução de movimento
- Persistência automática por usuário

---

## 🚀 Stack Utilizada (Web)

### Frontend

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript 5+**
- **Tailwind CSS**
- **Headless UI**
- **Lucide Icons**
- **Framer Motion** (uso pontual e opcional)
- **React Hook Form**
- **Zod**

### Backend / Infra

- **Firebase Authentication** – Login com Google
- **Firestore** – Banco NoSQL
- **GitHub Actions** – CI/CD
- **Vercel** – Deploy

---

## ✨ Qualidade de Código e Padrões

O projeto adota um conjunto de ferramentas que garantem **padronização, manutenibilidade e qualidade contínua**.

### 🔧 Ferramentas

- **ESLint** – Análise estática
- **Prettier** – Formatação automática
- **Commitlint** – Conventional Commits
- **Husky** – Git Hooks
- **Lint-staged** – Execução otimizada

### 🎯 Benefícios

- Código consistente
- Histórico de commits semântico
- Menos bugs em produção
- Onboarding facilitado
- Pipeline de CI/CD mais confiável

---

## 🧪 Testes Automatizados

- **Vitest** – Unitários e componentes
- **Testing Library** – Foco em comportamento do usuário
- **Playwright** – E2E
- **Storybook** – Testes e documentação de componentes

Cobertura inclui:

- Componentes críticos
- Fluxos principais do usuário
- Acessibilidade
- Persistência de preferências

---

## 📦 Como Rodar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 22+** – [Download](https://nodejs.org/)
- **npm** (vem junto com o Node.js) ou **pnpm/yarn** (opcional)
- **Git** – Para clonar o repositório
- **Conta Firebase** – Para autenticação e banco de dados
- **Conta Google Cloud** – Para OAuth (login com Google)

> 💡 **Dica**: Verifique sua versão do Node.js com `node --version`. O projeto requer Node.js 22 ou superior.

### Instalação

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

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp environment.example .env.local
```

### Configuração das Variáveis de Ambiente

O arquivo `.env.local` contém todas as configurações necessárias para o projeto funcionar. Abra o arquivo e preencha os valores conforme descrito abaixo.

#### 🔥 Firebase Configuration

Todas as variáveis do Firebase podem ser obtidas no [Firebase Console](https://console.firebase.google.com/):

1. Acesse seu projeto no Firebase Console
2. Vá em **Configurações do Projeto** (ícone de engrenagem)
3. Role até a seção **Seus apps** e selecione o app web
4. Copie os valores do objeto de configuração

```bash
# Firebase API Key
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here

# Firebase Auth Domain (geralmente: seu-project-id.firebaseapp.com)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com

# Firebase Project ID (nome do seu projeto)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Firebase Storage Bucket (geralmente: seu-project-id.appspot.com)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Firebase Messaging Sender ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id

# Firebase App ID
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Measurement ID (opcional - para Google Analytics)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

#### 🔐 NextAuth Configuration

O NextAuth é usado para gerenciar sessões de autenticação:

```bash
# Gere um secret seguro: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-here

# URL da aplicação (desenvolvimento: http://localhost:3000)
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **Importante**: O `NEXTAUTH_SECRET` deve ser uma string aleatória e segura. Use o comando `openssl rand -base64 32` para gerar um valor seguro.

#### 🔑 Google OAuth Credentials

Para habilitar o login com Google, você precisa criar credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/):

1. Acesse o Google Cloud Console
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** (ou Google Identity API)
4. Vá em **Credenciais** > **Criar credenciais** > **ID do cliente OAuth 2.0**
5. Configure o tipo de aplicativo como **Aplicativo da Web**
6. Adicione a URI de redirecionamento autorizada:
   - Desenvolvimento: `http://localhost:3000/api/auth/callback/google`
   - Produção: `https://seu-dominio.com/api/auth/callback/google`

```bash
# Google OAuth Client ID
GOOGLE_CLIENT_ID=your-google-client-id

# Google OAuth Client Secret
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 🌐 Application URL (Opcional)

```bash
# URL da aplicação (padrão: http://localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 📝 **Nota**: Esta variável é opcional e tem como padrão `http://localhost:3000` se não for definida.

### Execução

#### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

O Next.js possui **Hot Module Replacement (HMR)**, então as alterações no código serão refletidas automaticamente no navegador.

#### Outros Comandos Disponíveis

```bash
# Build para produção
npm run build

# Iniciar servidor de produção (após o build)
npm start

# Executar linter
npm run lint

# Executar testes
npm run test

# Executar testes E2E com Playwright
npm run test:e2e

# Executar Storybook
npm run storybook
```

---

## 👥 Autor

**Brendhon Moreira**
[LinkedIn](https://www.linkedin.com/in/brendhon-moreira)
📧 [brendhon.e.c.m@gmail.com](mailto:brendhon.e.c.m@gmail.com)
