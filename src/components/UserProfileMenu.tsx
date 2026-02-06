import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, ChevronRight, X, Bell, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Settings Content Component
function SettingsContent({ onClose, onSave }: { onClose: () => void; onSave?: () => void }) {
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
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setDisplayName((data as any).display_name || '');
        setShowWelcome((data as any).show_welcome_animation !== false);
      } else {
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

      setMessage({ type: 'success', text: 'Salvo com sucesso!' });
      if (onSave) onSave(); // Atualiza o nome no menu
      setTimeout(() => onClose(), 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Erro ao salvar' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          maxLength={50}
        />
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
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Welcome Toggle */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-emerald-600" />
            <label className="text-sm font-medium text-gray-700">
              Animação de Boas-vindas
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Mostrar ao fazer login
          </p>
        </div>
        <button
          onClick={() => setShowWelcome(!showWelcome)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
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
  );
}


export default function UserProfileMenu() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    loadDisplayName();
  }, [user]);

  const loadDisplayName = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      if (data && (data as any).display_name) {
        setUserDisplayName((data as any).display_name);
      } else {
        setUserDisplayName(user.email?.split('@')[0] || 'Usuário');
      }
    } catch (error) {
      setUserDisplayName(user.email?.split('@')[0] || 'Usuário');
    }
  };

  const displayName = userDisplayName || user?.email?.split('@')[0] || 'Usuário';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowMenu(!showMenu);
          setShowSettings(false);
        }}
        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
      >
        {/* Avatar with letter */}
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-lg">{firstLetter}</span>
        </div>
        
        {/* Name */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-gray-800">{displayName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </button>

      {/* Dropdown Menu - Facebook Style */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideDown">
            
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white font-bold text-xl">{firstLetter}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate text-lg">{displayName}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Settings */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-xl transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <Settings className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Configurações</p>
                  <p className="text-xs text-gray-500">Personalize sua experiência</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Logout */}
            <div className="p-2">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-600">Sair</p>
                  <p className="text-xs text-red-400">Encerrar sessão</p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                FinanceControl © 2026
              </p>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideDown max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Settings Content - Inline */}
            <SettingsContent 
              onClose={() => setShowSettings(false)} 
              onSave={loadDisplayName}
            />
          </div>
        </>
      )}
    </div>
  );
}
