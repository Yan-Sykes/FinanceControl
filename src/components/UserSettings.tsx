import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { X, User, Bell, Save, Loader2 } from 'lucide-react';

interface UserSettingsProps {
  onClose: () => void;
}

export default function UserSettings({ onClose }: UserSettingsProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (data) {
        setDisplayName((data as any).display_name || '');
        setShowWelcome((data as any).show_welcome_animation !== false);
      } else {
        // Set default from email
        const emailName = user.email?.split('@')[0] || '';
        setDisplayName(emailName);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const profileData = {
        user_id: user.id,
        display_name: displayName.trim() || null,
        show_welcome_animation: showWelcome,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData as any, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      
      // Close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideDown"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6" />
              Configurações
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como você gostaria de ser chamado?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              maxLength={50}
            />
            <p className="mt-1 text-sm text-gray-500">
              Este nome aparecerá nas mensagens de boas-vindas
            </p>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Welcome Animation Toggle */}
          <div className="border-t pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Animação de Boas-vindas
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Mostrar animação de boas-vindas ao fazer login
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(!showWelcome)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  showWelcome ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showWelcome ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}