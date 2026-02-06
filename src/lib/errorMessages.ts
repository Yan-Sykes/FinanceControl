/**
 * Traduz mensagens de erro do Supabase para português
 */
export function translateAuthError(error: any): string {
  if (!error) return 'Erro desconhecido';

  const message = error.message || error.error_description || '';

  // Mapeamento de mensagens comuns do Supabase
  const translations: Record<string, string> = {
    // Auth errors
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Signup requires a valid password': 'É necessário fornecer uma senha válida',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'User not found': 'Usuário não encontrado',
    'Email link is invalid or has expired': 'Link de email inválido ou expirado',
    'Token has expired or is invalid': 'Sessão expirada. Faça login novamente',
    'Invalid email or password': 'Email ou senha incorretos',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos',
    'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos antes de tentar novamente',
    
    // OAuth errors
    'OAuth error': 'Erro ao conectar com provedor externo',
    'Provider not found': 'Provedor de autenticação não encontrado',
    'redirect_uri_mismatch': 'Erro de configuração. Entre em contato com o suporte',
    
    // Network errors
    'Failed to fetch': 'Erro de conexão. Verifique sua internet',
    'Network request failed': 'Erro de rede. Tente novamente',
    
    // Generic errors
    'Invalid request': 'Requisição inválida',
    'Internal server error': 'Erro no servidor. Tente novamente mais tarde',
  };

  // Procura por correspondência exata
  if (translations[message]) {
    return translations[message];
  }

  // Procura por correspondência parcial
  for (const [key, value] of Object.entries(translations)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Se não encontrar tradução, retorna mensagem genérica
  console.warn('Untranslated error:', message);
  return 'Ocorreu um erro. Tente novamente';
}
