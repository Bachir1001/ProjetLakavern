import React, { useEffect, useRef, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthResponse {
  token?: string;
  user?: { id: number; username: string; email: string; display_name: string };
  message?: string;
}

const API_URL = 'https://lakavernshop.com/wp-json/lakavern-auth/v1';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const saveSession = (data: AuthResponse) => {
    if (!data.token || !data.user) throw new Error('Réponse de connexion incomplète.');
    // Stockage compatible avec le backend actuel. Une session par cookie HttpOnly
    // serait préférable à terme pour mieux protéger le jeton contre les scripts.
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem('auth_token', data.token);
    store.setItem('auth_user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('lakavern-auth-changed'));
    onClose();
  };

  const request = async (endpoint: string, body: Record<string, string>): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: AuthResponse = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Une erreur est survenue. Veuillez réessayer.');
    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (password.length < 10) throw new Error('Le mot de passe doit contenir au moins 10 caractères.');
        const data = await request('register', { username: identifier.trim(), email: email.trim(), password });
        saveSession(data);
      } else {
        const data = await request('login', { identifier: identifier.trim(), password });
        saveSession(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (response: { credential: string }) => {
    setError('');
    setLoading(true);
    try {
      const data = await request('google', { credential: response.credential });
      saveSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La connexion Google a échoué.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    const initialize = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) return false;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard', theme: 'outline', size: 'large', text: mode === 'login' ? 'signin_with' : 'signup_with',
        shape: 'rectangular', width: 320,
      });
      return true;
    };
    if (!initialize()) {
      interval = setInterval(() => { if (initialize() && interval) clearInterval(interval); }, 250);
    }
    return () => { cancelled = true; if (interval) clearInterval(interval); };
    // The Google SDK callback is reinitialized when the modal or mode changes.
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md max-h-[95dvh] overflow-y-auto rounded-xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Connexion' : 'Création de compte'}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-2xl font-bold text-[#00c8db]">LaKavern</span>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-gray-500 hover:text-gray-700"><X size={21} /></button>
        </div>
        <div className="p-5 sm:p-8">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-800">{mode === 'login' ? 'Super de vous revoir !' : 'Créer un compte'}</h2>
          {GOOGLE_CLIENT_ID ? (
            <div className="mb-5 flex min-h-11 justify-center" ref={googleButtonRef} aria-label="Connexion avec Google" />
          ) : (
            <p className="mb-5 text-center text-xs text-gray-500">Connexion Google en attente de configuration.</p>
          )}
          {error && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p role="status" className="mb-4 text-sm text-green-700">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-identifier" className="mb-1 block text-sm text-gray-700">{mode === 'login' ? "Nom d'utilisateur ou e-mail" : "Nom d'utilisateur"} *</label>
              <input id="auth-identifier" autoComplete={mode === 'login' ? 'username' : 'username'} required value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#00c8db] focus:outline-none" />
            </div>
            {mode === 'register' && <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm text-gray-700">Adresse e-mail *</label>
              <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#00c8db] focus:outline-none" />
            </div>}
            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm text-gray-700">Mot de passe *</label>
              <div className="relative">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 10 : undefined} required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#00c8db] focus:outline-none" />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </div>
            {mode === 'login' && <div className="flex items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Se souvenir de moi</label>
              <a href="https://lakavernshop.com/mon-compte/lost-password/" className="text-[#00a6b7] hover:underline">Mot de passe oublié ?</a>
            </div>}
            <button type="submit" disabled={loading} className="w-full rounded bg-[#00c8db] py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#00b3c4] disabled:opacity-60">{loading ? 'Veuillez patienter…' : mode === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); setPassword(''); }} className="font-medium text-[#00a6b7] hover:underline">{mode === 'login' ? 'Créer un compte' : 'Se connecter'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
