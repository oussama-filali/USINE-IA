import React, { useEffect, useRef, useState } from 'react';

interface Article {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  icon: string;
}

export default function NewsletterSectionUpdated() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
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
    <section 
      ref={sectionRef}
      id="newsletter"
      className="relative min-h-screen py-32 px-6 bg-gradient-to-b from-black via-black/95 to-black overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.1em] text-white mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AU-DELÀ
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              DU CODE
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Plongez dans la Psychologie des Agents IA et les secrets de l'Ingénierie Émotionnelle
          </p>
        </div>

        {/* Mission statement */}
        <div 
          className={`max-w-4xl mx-auto mb-20 p-8 border-l-4 border-cyan-400/30 bg-cyan-400/5 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <p 
            className="text-lg text-gray-300 font-light leading-relaxed mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            L'ère du simple chatbot est terminée. Notre newsletter et notre rubrique d'articles sont dédiées 
            à l'art et à la science qui transforment les algorithmes en entités dotées d'une conscience de rôle.
          </p>
          <p 
            className="text-base text-gray-400 font-light leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Nous vous ouvrons les portes de notre laboratoire : découvrez les secrets de l'Ingénierie de Prompt Avancée, 
            comment nous résolvons les défis de la connexion authentique, et pourquoi la Fiabilité Augmentée (RAG) est notre 
            engagement éthique pour garantir que nos Agents ne vous donnent jamais de mauvais conseils.
          </p>
        </div>

        {/* Newsletter subscription */}
        <div 
          className={`max-w-2xl mx-auto mb-20 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="p-8 border border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-blue-400/5 rounded-xl backdrop-blur-sm">
            <h3 
              className="text-2xl font-light mb-2 text-cyan-400 tracking-wide"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Recevoir les insights exclusifs
            </h3>
            <p 
              className="text-gray-400 font-light mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Soyez le premier à découvrir nos derniers articles et techniques de pointe
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 bg-black/50 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-black font-light tracking-wide hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
              >
                S'abonner
              </button>
            </form>

            {submitted && (
              <p className="text-sm text-green-400 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                ✓ Merci! Vérifiez votre email pour confirmer votre abonnement.
              </p>
            )}
          </div>
        </div>

        {/* Featured articles */}
        <div 
          className={`transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 
            className="text-3xl font-light mb-12 text-center tracking-wide"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Articles Récents
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className="group relative p-8 border border-gray-700/50 bg-black/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{ transitionDelay: `${700 + idx * 100}ms` }}
              >
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon & category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{article.icon}</div>
                    <span 
                      className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 tracking-wider uppercase border border-cyan-400/30"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 
                    className="text-lg font-light text-cyan-400 group-hover:text-pink-400 transition-colors duration-300 mb-3 tracking-wide"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {article.title}
                  </h4>

                  {/* Excerpt */}
                  <p 
                    className="text-sm text-gray-400 font-light leading-relaxed mb-6"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700/50 pt-4">
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>{article.date}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>{article.author}</span>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div 
          className={`text-center mt-20 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p 
            className="text-gray-400 font-light mb-6 text-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Voulez-vous explorer les techniques qui font fonctionner nos Agents ?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 border-2 border-pink-400/50 text-pink-400 hover:bg-pink-400/10 hover:border-pink-400 transition-all duration-300 tracking-widest text-sm font-light"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            EN SAVOIR PLUS
          </a>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-blue-400/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-purple-400/20 pointer-events-none" />
    </section>
  );
}