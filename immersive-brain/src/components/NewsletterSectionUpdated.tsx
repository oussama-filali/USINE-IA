import React, { useState } from 'react';

export default function NewsletterSectionUpdated() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => null) : null;

      if (!isJson) {
        const text = await response.text().catch(() => '');
        console.error('Newsletter non-JSON response:', {
          status: response.status,
          contentType,
          preview: text.slice(0, 140),
        });
        setError(
          "Le serveur a répondu avec du HTML au lieu de JSON. L’API n’est probablement pas branchée sur /api (prod)."
        );
        return;
      }

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError((data as any)?.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion. Réessayez dans un instant.');
      console.error('Newsletter error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="relative">
        {/* Titre principal */}
        <h2 
          className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white/90 mb-12"
          style={{
            animation: 'fadeInUp 2s ease-out',
            textShadow: '0 0 40px rgba(255,255,255,0.3)'
          }}
        >
          Rejoignez le Club USINE IA
        </h2>

        <p
          className="text-sm md:text-base text-gray-400/90 font-light max-w-2xl mx-auto mb-10"
          style={{
            animation: 'fadeInUp 2s ease-out 0.15s backwards'
          }}
        >
          Pas de spam. Juste de la haute stratégie. Recevez nos études de cas et nos prompts exclusifs.
        </p>

        {/* Newsletter dans un bloc compact (comme ProjectsSection) */}
        <div 
          className="max-w-2xl mx-auto"
          style={{
            animation: 'fadeInUp 2s ease-out 0.35s backwards'
          }}
        >
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-light text-white/90 mb-2">Newsletter</h3>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={loading}
                required
                className="flex-1 px-4 py-2 bg-black/50 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : "S'inscrire"}
              </button>
            </form>

            {submitted && (
              <p className="text-xs text-white/70">
                ✓ Merci
              </p>
            )}

            {error && (
              <p className="text-xs text-white/50">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Circular light effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
            zIndex: -1
          }}
        />
        
        {/* Concentric circles */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[240px] w-48 h-24"
          style={{
            animation: 'fadeIn 2s ease-out 1.5s backwards'
          }}
        >
          <svg viewBox="0 0 200 100" className="w-full h-full opacity-60">
            <ellipse cx="100" cy="50" rx="90" ry="15" fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
            <ellipse cx="100" cy="50" rx="70" ry="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
            <ellipse cx="100" cy="50" rx="50" ry="9" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
            <ellipse cx="100" cy="50" rx="30" ry="6" fill="none" stroke="white" strokeWidth="1" opacity="0.7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}