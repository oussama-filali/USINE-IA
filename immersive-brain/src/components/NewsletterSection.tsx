import React, { useEffect, useRef, useState } from 'react';

interface Article {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

const articles: Article[] = [
  {
    title: "L'Empathie Algorithmique : Mythe ou Réalité ?",
    excerpt: "Explorer comment les réseaux neuronaux peuvent apprendre à reconnaître et répondre aux émotions humaines de manière authentique.",
    date: "15 Nov 2024",
    category: "Research",
    readTime: "8 min"
  },
  {
    title: "Au-delà du Turing Test : Mesurer l'Authenticité",
    excerpt: "Développer de nouveaux paradigmes pour évaluer la qualité des interactions IA-humain au-delà de la simple imitation.",
    date: "08 Nov 2024",
    category: "Philosophy",
    readTime: "12 min"
  },
  {
    title: "L'Architecture des Émotions Artificielles",
    excerpt: "Plongée technique dans notre système de modélisation émotionnelle multi-couches et ses applications concrètes.",
    date: "01 Nov 2024",
    category: "Technical",
    readTime: "15 min"
  }
];

export default function NewsletterSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Ink particle effect on hover
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (hoveredArticle === index) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setParticles(prev => [...prev.slice(-10), { x, y }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section 
      id="articles"
      ref={sectionRef}
      className="relative min-h-screen w-full py-24 px-6 bg-black overflow-hidden"
    >
      {/* Animated ink-like background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent animate-pulse-slow"
          style={{ animationDuration: '8s' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section title */}
        <h2 
          className={`text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] mb-6 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          INSIGHTS &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            ARTICLES
          </span>
        </h2>

        <p 
          className={`text-center text-gray-400 text-lg mb-16 tracking-wide transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Explorations, réflexions et découvertes sur l'IA émotionnelle
        </p>

        {/* Articles grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {articles.map((article, index) => (
            <article
              key={index}
              className={`group relative transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              onMouseEnter={() => setHoveredArticle(index)}
              onMouseLeave={() => setHoveredArticle(null)}
              onMouseMove={(e) => handleMouseMove(e, index)}
            >
              {/* Card */}
              <div className="relative h-full p-6 border border-gray-800 bg-gray-900/50 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden cursor-pointer group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-400/10">
                {/* Ink particles overlay */}
                {hoveredArticle === index && particles.slice(-5).map((particle, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400/30 rounded-full pointer-events-none animate-ping"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      animationDuration: '1s'
                    }}
                  />
                ))}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Category & time */}
                  <div className="flex items-center justify-between mb-4 text-xs tracking-wider">
                    <span className="text-cyan-400 uppercase">{article.category}</span>
                    <span className="text-gray-500">{article.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium mb-4 text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  {/* Date & Read more */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800 group-hover:border-cyan-400/30 transition-colors duration-300">
                    <span className="text-xs text-gray-500">{article.date}</span>
                    <span className="text-xs text-cyan-400 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                      Lire plus
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter subscription */}
        <div 
          className={`relative max-w-2xl mx-auto p-8 border-2 border-dashed border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-light tracking-wider mb-3 text-white">
              Restez Connecté
            </h3>
            <p className="text-gray-400 text-sm tracking-wide">
              Recevez nos dernières découvertes et réflexions directement dans votre boîte mail
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="flex-1 px-6 py-4 bg-black border border-gray-700 focus:border-cyan-400 outline-none text-white placeholder-gray-600 tracking-wide transition-all duration-300"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-medium tracking-widest text-sm hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50"
            >
              S'ABONNER
            </button>
          </form>

          {/* Privacy note */}
          <p className="text-xs text-gray-600 text-center mt-4 tracking-wide">
            Pas de spam. Désinscription en un clic. Vos données sont protégées.
          </p>
        </div>
      </div>
    </section>
  );
}
