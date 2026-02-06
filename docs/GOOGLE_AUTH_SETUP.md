# 🔐 Configurar Login com Google

## Passo 1: Configurar no Google Cloud Console

### 1.1 Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Clique em "Select a project" no topo
3. Clique em "NEW PROJECT"
4. Nome do projeto: `FinanceControl`
5. Clique em "CREATE"

### 1.2 Habilitar Google+ API

1. No menu lateral, vá em: **APIs & Services → Library**
2. Procure por: `Google+ API`
3. Clique em "ENABLE"

### 1.3 Configurar OAuth Consent Screen

1. No menu lateral: **APIs & Services → OAuth consent screen**
2. Selecione: **External**
3. Clique em "CREATE"

**Preencha:**
- App name: `FinanceControl`
- User support email: seu email
- Developer contact: seu email
- Clique em "SAVE AND CONTINUE"

**Scopes:**
- Clique em "ADD OR REMOVE SCOPES"
- Selecione: `email`, `profile`, `openid`
- Clique em "UPDATE"
- Clique em "SAVE AND CONTINUE"

**Test users (opcional para desenvolvimento):**
- Adicione seu email de teste
- Clique em "SAVE AND CONTINUE"

### 1.4 Criar Credenciais OAuth

1. No menu lateral: **APIs & Services → Credentials**
2. Clique em "+ CREATE CREDENTIALS"
3. Selecione: **OAuth client ID**
4. Application type: **Web application**
5. Name: `FinanceControl Web Client`

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:5174
http://localhost:5175
https://hxhjdqiessfsqlnfxfon.supabase.co
https://sua-url.vercel.app
```

**Authorized redirect URIs:**
```
https://hxhjdqiessfsqlnfxfon.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:5175/auth/callback
```

6. Clique em "CREATE"
7. **COPIE** o Client ID e Client Secret

---

## Passo 2: Configurar no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Authentication → Providers**
4. Encontre **Google** e clique para expandir
5. Toggle "Enable Sign in with Google" para ON

**Preencha:**
- **Client ID (for OAuth):** Cole o Client ID do Google
- **Client Secret (for OAuth):** Cole o Client Secret do Google
- **Authorized Client IDs:** Deixe em branco (opcional)

6. Clique em "SAVE"

---

## Passo 3: Testar Localmente

1. Certifique-se de que o servidor está rodando:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:5175

3. Clique em "Entrar com Google"

4. Selecione sua conta Google

5. Autorize o acesso

6. Você deve ser redirecionado de volta e logado automaticamente!

---

## Passo 4: Configurar para Produção (Vercel)

Depois do deploy no Vercel:

1. Copie a URL do Vercel (ex: `https://finance-control-xxx.vercel.app`)

2. Volte ao Google Cloud Console:
   - APIs & Services → Credentials
   - Clique no seu OAuth Client ID
   - Adicione em **Authorized JavaScript origins:**
     ```
     https://finance-control-xxx.vercel.app
     ```
   - Adicione em **Authorized redirect URIs:**
     ```
     https://hxhjdqiessfsqlnfxfon.supabase.co/auth/v1/callback
     ```
   - Clique em "SAVE"

3. No Supabase:
   - Authentication → URL Configuration
   - Site URL: `https://finance-control-xxx.vercel.app`
   - Redirect URLs: `https://finance-control-xxx.vercel.app/**`

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL de redirect está EXATAMENTE igual no Google Cloud Console
- A URL deve ser: `https://SEU_PROJETO.supabase.co/auth/v1/callback`

### Erro: "Access blocked: This app's request is invalid"
- Configure o OAuth Consent Screen
- Adicione seu email como test user

### Botão do Google não aparece
- Verifique se você salvou as alterações no Supabase
- Recarregue a página (Ctrl+F5)

### Login funciona localmente mas não no Vercel
- Adicione a URL do Vercel nas Authorized JavaScript origins
- Adicione a URL do Vercel nas Redirect URIs do Supabase

---

## ✅ Checklist

- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] Credenciais OAuth criadas
- [ ] Client ID e Secret copiados
- [ ] Google Provider habilitado no Supabase
- [ ] Credenciais coladas no Supabase
- [ ] Testado localmente
- [ ] URLs de produção adicionadas (após deploy)

---

## 📚 Recursos

- [Documentação Supabase - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)
