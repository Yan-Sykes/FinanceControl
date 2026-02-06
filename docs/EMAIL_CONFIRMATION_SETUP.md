# 📧 Configuração de Email

## Opções Rápidas

### Desenvolvimento (Recomendado para testes)

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. **Desmarque:** "Enable email confirmations"
3. Salvar

✅ Usuários podem fazer login imediatamente sem confirmar email

### Produção (Recomendado para deploy)

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. **Marque:** "Enable email confirmations"
3. Salvar

✅ Mais seguro - valida emails reais e previne spam

---

## Personalizar Templates (Opcional)

1. Supabase Dashboard → **Authentication** → **Email Templates**
2. Selecione: **Confirm signup**
3. Personalize o conteúdo em português
4. Salvar

---

## SMTP Customizado (Opcional)

Para usar seu próprio servidor de email:

1. Supabase Dashboard → **Project Settings** → **Auth** → **SMTP Settings**
2. Habilite "Enable Custom SMTP"
3. Configure com suas credenciais (Gmail, SendGrid, etc.)

**Gmail:** Use [App Passwords](https://myaccount.google.com/apppasswords)

---

## Troubleshooting

**Email não chega:**
- Verifique spam
- Verifique configurações SMTP
- Veja logs no Supabase Dashboard

**Link expirado:**
- Links expiram em 24h
- Usuário precisa se cadastrar novamente

---

**Nota:** O componente Register já está preparado para ambos os modos.
