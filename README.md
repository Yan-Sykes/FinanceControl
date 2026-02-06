# 💰 FinanceControl

Sistema inteligente de controle financeiro pessoal com análise de dados e insights automáticos.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Funcionalidades

- 📊 **Dashboard Inteligente** - Visão completa das suas finanças
- � **Gesotão de Receitas e Despesas** - Controle total do seu dinheiro
- � **Gráfico s Interativos** - Visualize seus gastos por categoria
- 🎯 **Sistema de Orçamentos** - Defina limites e receba alertas
- 🧠 **Insights Automáticos** - Análise comportamental dos seus gastos
- � **Autetnticação Segura** - Login com email/senha ou Google OAuth
- � I**Perfil Personalizável** - Configure suas preferências
- 🎓 **Tour Guiado** - Aprenda a usar o sistema facilmente
- 📱 **Design Responsivo** - Funciona em qualquer dispositivo

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- Conta no [Supabase](https://supabase.com) (gratuita)

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd FinanceControl

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Execute as migrations no Supabase SQL Editor
# Arquivos em: supabase/migrations/

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔧 Configuração

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute as migrations em ordem:
   - `01_initial_schema.sql`
   - `02_add_budgets.sql`
   - `03_add_month_transitions.sql`
   - `04_add_rls_policies.sql`
   - `05_add_user_profiles.sql`
3. Configure o Google OAuth (opcional):
   - Veja: `docs/GOOGLE_AUTH_SETUP.md`

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` no Git!

---

## 📁 Estrutura do Projeto

```
FinanceControl/
├── src/
│   ├── components/      # Componentes React
│   │   ├── Dashboard.tsx
│   │   ├── AddExpense.tsx
│   │   ├── BudgetManager.tsx
│   │   └── ...
│   ├── contexts/        # Context API
│   │   └── AuthContext.tsx
│   ├── hooks/          # Custom hooks
│   │   └── useInputValidation.ts
│   ├── lib/            # Utilitários
│   │   ├── supabase.ts
│   │   └── errorMessages.ts
│   └── types/          # TypeScript types
├── supabase/
│   └── migrations/     # SQL migrations
├── docs/              # Documentação
│   ├── DEPLOY.md
│   ├── SECURITY.md
│   └── ...
└── public/            # Assets estáticos
```

---

## � Seguorança

Este projeto implementa as melhores práticas de segurança:

- ✅ **Row Level Security (RLS)** - Isolamento de dados por usuário
- ✅ **Autenticação JWT** - Tokens seguros com PKCE flow
- ✅ **OAuth 2.0** - Login com Google
- ✅ **Content Security Policy** - Proteção contra XSS
- ✅ **Headers de Segurança** - HSTS, X-Frame-Options, etc.
- ✅ **Validação de Inputs** - Sanitização no frontend
- ✅ **Queries Parametrizadas** - Proteção contra SQL Injection

📄 Veja o relatório completo: [`docs/SECURITY.md`](docs/SECURITY.md)

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel
```

📄 Guia completo: [`docs/DEPLOY.md`](docs/DEPLOY.md)

### Variáveis de Ambiente no Vercel

Configure no dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📚 Documentação

- [Deploy no Vercel](docs/DEPLOY.md)
- [Configurar Google OAuth](docs/GOOGLE_AUTH_SETUP.md)
- [Configurar Email](docs/EMAIL_CONFIRMATION_SETUP.md)
- [Relatório de Segurança](docs/SECURITY.md)
- [Guia Rápido Vercel](docs/VERCEL_QUICKSTART.md)

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT + OAuth) |
| **Charts** | Chart.js, react-chartjs-2 |
| **Icons** | Lucide React |
| **Deploy** | Vercel |

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👤 Autor

Desenvolvido com ❤️ para ajudar no controle financeiro pessoal.

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend as a Service
- [Vercel](https://vercel.com) - Hospedagem
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Ícones
