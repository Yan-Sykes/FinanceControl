# 🚀 Deploy no Vercel

## ⚡ Início Rápido

### 1. Preparar Credenciais do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon/public key` → `VITE_SUPABASE_ANON_KEY`

⚠️ **Se as credenciais foram expostas:** Clique em "Reset API keys" primeiro!

### 2. Deploy no Vercel

**Via Interface Web (Recomendado):**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório do GitHub
3. Configure **Environment Variables:**
   ```
   VITE_SUPABASE_URL = sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY = sua_chave_anonima
   ```
4. Clique em **Deploy**
5. Aguarde 2-3 minutos ✅

**Via CLI:**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login e deploy
vercel login
vercel

# Adicionar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy para produção
vercel --prod
```

### 3. Configurar URL no Supabase

Após receber a URL do Vercel (ex: `seu-projeto.vercel.app`):

1. Volte ao Supabase Dashboard
2. Vá em **Authentication → URL Configuration**
3. Configure:
   - **Site URL:** `https://seu-projeto.vercel.app`
   - **Redirect URLs:** `https://seu-projeto.vercel.app/**`
4. Salvar

### 4. Testar

1. Acesse sua URL do Vercel
2. Crie uma conta de teste
3. Adicione uma despesa
4. Verifique se tudo funciona ✅

---

## 📋 Checklist Pré-Deploy

- [ ] Migrations aplicadas no Supabase
- [ ] RLS (Row Level Security) habilitado
- [ ] Arquivo `.env` não está no Git
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local testado (`npm run build`)

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Verifique se as variáveis estão no Vercel
- Nomes devem começar com `VITE_`
- Faça redeploy: Vercel → Deployments → ⋯ → Redeploy

### "Failed to fetch" ao fazer login
- Verifique se a URL do Vercel está no Supabase Auth
- Aguarde 1-2 minutos para propagação

### Página em branco
- Abra o console (F12) e veja os erros
- Verifique logs: Vercel → Deployments → View Function Logs

### Erro 401 ao acessar dados
- Verifique se as RLS policies estão corretas
- Teste autenticação no Supabase Dashboard

---

## 🔄 Atualizações Automáticas

Após o primeiro deploy, toda vez que você fizer `git push`, o Vercel fará deploy automático:

```bash
git add .
git commit -m "Minha atualização"
git push origin main
```

---

## 🛠️ Comandos Úteis

```bash
# Build local para testar
npm run build
npm run preview

# Ver logs do Vercel
vercel logs

# Listar deployments
vercel ls
```

---

## 📊 Monitoramento

Após o deploy, monitore:

- **Vercel Analytics:** Dashboard do Vercel
- **Supabase Logs:** Dashboard → Logs
- **Erros:** Vercel → Project → Logs

---

## 📞 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Configurar Google OAuth](GOOGLE_AUTH_SETUP.md)
- [Configurar Email](EMAIL_CONFIRMATION_SETUP.md)
- [Relatório de Segurança](SECURITY.md)
