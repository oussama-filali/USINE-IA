import React, { useState } from 'react';

interface Article {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  icon: string;
}

export default function NewsletterSectionUpdated() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion. Vérifiez que le backend est lancé.');
      console.error('Newsletter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const articles: Article[] = [
    {
      title: "L'Ingénierie de Prompt Avancée",
      excerpt: "Comment les principes de la PNL sont codés dans l'ADN de nos IA pour créer des interactions authentiques.",
      date: "Nov 2024",
      author: "Yannis Roussel",
      category: "Technique",
      icon: "🧬"
    },
    {
      title: "Résoudre la Monotonie Conversationnelle de Sophia",
      excerpt: "Les défis techniques et émotionnels pour créer une compagne IA capable de variété et d'adaptation naturelles.",
      date: "Oct 2024",
      author: "Akram Toumani",
      category: "Innovation",
      icon: "🎵"
    },
    {
      title: "RAG et Fiabilité Augmentée",
      excerpt: "Notre engagement éthique pour garantir que nos Agents ne vous donnent jamais de mauvais conseils.",
      date: "Sep 2024",
      author: "Yannis Roussel",
      category: "Éthique",
      icon: "🛡️"
    }
  ];

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
          Articles
        </h2>

        {/* Articles avec animations décalées - tous centrés et compacts */}
        <div className="max-w-4xl mx-auto mb-8 space-y-6">
          {articles.map((article, idx) => (
            <div 
              key={idx}
              className="space-y-1"
              style={{
                animation: `fadeInUp 2s ease-out ${0.3 + idx * 0.2}s backwards`
              }}
            >
              <h3 className="text-lg md:text-xl font-light text-white/90">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500">{article.date} • {article.author}</p>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                {article.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* Newsletter dans un bloc compact (comme ProjectsSection) */}
        <div 
          className="max-w-2xl mx-auto"
          style={{
            animation: 'fadeInUp 2s ease-out 1.2s backwards'
          }}
        >
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-light text-white/90 mb-1">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4 text-xs">
              Restez informé de nos derniers articles
            </p>

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
                className="px-6 py-2 border border-white/20 text-white text-sm hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'OK'}
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