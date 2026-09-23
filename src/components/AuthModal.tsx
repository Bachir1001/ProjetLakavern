import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ⚠️ Remplacez par votre propre Client ID obtenu sur Google Cloud Console
const GOOGLE_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';

// ⚠️ Remplacez par l'URL de votre site WordPress
const WORDPRESS_API_URL = 'https://VOTRE-SITE-WORDPRESS.com/wp-json/monsite/v1/google-auth';

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // Champs Formulaire
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleInitialized = useRef(false);

  // Initialise le SDK Google Identity Services une fois le script chargé
  useEffect(() => {
    if (!isOpen) return;

    const initGoogle = () => {
      if (!window.google || googleInitialized.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });
      googleInitialized.current = true;
    };

    if (window.google) {
      initGoogle();
    } else {
      // Le script GSI (https://accounts.google.com/gsi/client) n'est peut-être pas encore chargé
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Appelée par Google avec le ID Token une fois l'utilisateur authentifié
  const handleGoogleCredentialResponse = async (response: { credential: string }) => {
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const res = await fetch(WORDPRESS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.message || 'Authentification Google refusée par le serveur.');
      }

      // Stocke le token de session renvoyé par WordPress
      localStorage.setItem('auth_token', data.token);
      if (data.user) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      onClose();
    } catch (err) {
      console.error('Erreur d\'authentification Google :', err);
      setGoogleError('La connexion avec Google a échoué. Veuillez réessayer.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Déclenchée au clic sur le bouton Google
  const handleGoogleAuthClick = () => {
    setGoogleError('');
    if (!window.google) {
      setGoogleError('Le service Google met du temps à se charger, réessayez dans un instant.');
      return;
    }
    window.google.accounts.id.prompt((notification: any) => {
      // Si le "One Tap" ne peut pas s'afficher (déjà refusé, pas de session, etc.),
      // on retombe sur le bouton officiel de Google en dernier recours
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        setGoogleError('Veuillez autoriser les pop-ups Google pour continuer, ou réessayer.');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Connexion :', { identifier, password, rememberMe });
    } else {
      console.log('Inscription :', { identifier, email, password });
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setShowPassword(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* En-tête avec Logo et Bouton Fermer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="w-full text-center pl-6">
            <span className="text-2xl font-bold text-[#00c8db]">LaKavern</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du formulaire */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            {mode === 'login' ? 'Super de vous revoir!' : 'Créer un compte'}
          </h2>

          {/* Bouton Google */}
          <button
            type="button"
            onClick={handleGoogleAuthClick}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 mb-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {googleLoading
              ? 'Connexion en cours...'
              : mode === 'login'
                ? 'Se connecter avec Google'
                : "S'inscrire avec Google"}
          </button>

          {googleError && (
            <p className="text-xs text-red-500 text-center mb-4">{googleError}</p>
          )}
          {!googleError && <div className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom d'utilisateur */}
            <div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <label className="text-gray-700">
                  {mode === 'login' ? "Nom d'utilisateur ou email" : "Nom d'utilisateur"}{' '}
                  <span className="text-red-500">*</span>
                </label>
                {mode === 'login' && (
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#00c8db] focus:ring-[#00c8db]"
                    />
                    Se souvenir
                  </label>
                )}
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00c8db]"
              />
            </div>

            {/* Email supplémentaire en mode Inscription */}
            {mode === 'register' && (
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00c8db]"
                />
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <label className="text-gray-700">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                {mode === 'login' && (
                  <a href="#reset" className="text-xs text-gray-500 hover:text-[#00c8db]">
                    Perdu?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00c8db] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton de Validation */}
            <button
              type="submit"
              className="w-full bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold py-3 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer mt-2"
            >
              {mode === 'login' ? 'CONNECTEZ-VOUS À VOTRE COMPTE' : "S'INSCRIRE"}
            </button>
          </form>

          {/* Lien de basculement */}
          <div className="text-center text-sm text-gray-600 mt-6">
            {mode === 'login' ? (
              <>
                Pas un membre?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00c8db] hover:underline font-medium cursor-pointer"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà un membre?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00c8db] hover:underline font-medium cursor-pointer"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
