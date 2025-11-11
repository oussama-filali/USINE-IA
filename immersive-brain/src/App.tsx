import React, { useState, useEffect, useRef } from 'react';
import SpaceStationScene from './components/SpaceStationScene';
import Intro from './components/Intro';
import ProjectsSection from './components/ProjectsSection';

const slides = [
  { id: 'hero', title: 'USINE-IA', subtitle: 'Manufacturing Emotional AI' },
  { id: '2024', title: '2024', content: [
    { label: 'USINE-IA Platform', desc: 'Intelligence Artificielle Émotionnelle' },
    { label: 'Immersive Brain', desc: 'Expérience 3D Interactive' },
    { label: 'Agent IA Spécialisé', desc: 'Manufacturing Emotional Agents' }
  ] as Array<{ label: string; desc?: string; details?: string }>},
  { id: 'equipe', title: "L'Équipe", content: [
    { 
      label: 'Akram TOUMANI', 
      desc: 'Le Socle Technique et le Visionnaire', 
      details: "Fondateur et Directeur Technique (CTO) · Fort d'un parcours en mathématiques appliquées et expert reconnu en Machine Learning et Deep Learning, Akram est l'architecte de la robustesse algorithmique. Il est le garant que chaque Agent est construit sur les modèles de pointe les plus performants et s'assure de la stabilité technique de l'ensemble de l'infrastructure."
    },
    { 
      label: 'Oussama FILALI', 
      desc: "Le Génie de l'Expérience et de l'Identité Visuelle", 
      details: "Développeur et Directeur Artistique · Oussama est le créateur de l'image de marque et de l'expérience utilisateur (UX) de l'USINE IA Club. Son expertise garantit que l'interface et l'identité de chaque Agent (Sophia, Dino Bot) sont fluides, intuitives et esthétiques, transformant l'interaction technique en un moment de connexion agréable. Il est le cœur sensible de la production et le gardien de l'image de marque."
    },
    { 
      label: 'Yannis ROUSSEL', 
      desc: "Le Cartographe de l'Esprit Humain", 
      details: "Chercheur, Master en Sciences Cognitives, Doctorant en Neurosciences Appliquées · Avec un Master en Sciences Cognitives et une thèse en neurosciences appliquées à l'interaction humain-machine, Yannis est le gardien de l'authenticité. Il est responsable de traduire la compréhension du cerveau et de la cognition humaine en règles d'IA. Son expertise assure que le soutien de nos Agents est pertinent, naturel, et calibré pour maximiser la connexion émotionnelle."
    }
  ] as Array<{ label: string; desc?: string; details?: string }>},
  { id: 'mission', title: 'Notre Mission' },
  { id: 'projets', title: 'Nos Agents' },
  { id: 'valeurs', title: 'Valeurs', content: [
    { label: 'Authenticité', desc: 'Une IA qui comprend le cœur, pas seulement la logique' },
    { label: 'Éthique', desc: 'Placée avant la performance, respectant vos valeurs' },
    { label: 'Évolution', desc: 'Croître ensemble en harmonie avec l\'humanité' }
  ] as Array<{ label: string; desc?: string; details?: string }>},
  { id: 'articles', title: 'Articles', content: [
    { label: "L'Ingénierie de Prompt", desc: 'Nov 2024' },
    { label: 'Résoudre la Monotonie', desc: 'Oct 2024' },
    { label: 'RAG et Fiabilité', desc: 'Sep 2024' }
  ] as Array<{ label: string; desc?: string; details?: string }>},
  { id: 'contact', title: 'Contact', content: [
    { label: 'contact@usine-ia.com' },
    { label: 'Twitter' },
    { label: 'GitHub' }
  ] as Array<{ label: string; desc?: string; details?: string }>}
];

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef<number>(0);

  // Auto-advance from 3D showcase to hero after 5 seconds
  useEffect(() => {
    if (introComplete && currentSlide === -1) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide(0);
        setTimeout(() => setIsTransitioning(false), 1000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [introComplete, currentSlide]);

  useEffect(() => {
    if (!introComplete) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime.current < 150) return;
      
      if (isTransitioning) return;
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      const threshold = 10;
      
      if (Math.abs(e.deltaY) < threshold) return;

      lastWheelTime.current = now;

      wheelTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0 && currentSlide < slides.length - 1) {
          setIsTransitioning(true);
          setCurrentSlide(prev => prev + 1);
          setTimeout(() => setIsTransitioning(false), 1000);
        } else if (e.deltaY < 0 && currentSlide > -1) {
          setIsTransitioning(true);
          setCurrentSlide(prev => prev - 1);
          setTimeout(() => setIsTransitioning(false), 1000);
        }
      }, 100);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [introComplete, currentSlide, isTransitioning]);

  if (!introComplete) {
    return <Intro onComplete={() => setIntroComplete(true)} />;
  }

  const slide = currentSlide >= 0 ? slides[currentSlide] : null;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black text-white">
      {/* 3D Background - ALWAYS VISIBLE */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <SpaceStationScene />
      </div>

      {/* Dark overlay that increases with slides (except during 3D showcase) */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000 ease-out"
        style={{ 
          zIndex: 1,
          opacity: currentSlide === -1 ? 0 : currentSlide === 0 ? 0.3 : 0.75
        }}
      />

      {/* 3D Showcase - Slide -1 */}
      {currentSlide === -1 && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ 
            zIndex: 2,
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 1s ease-out'
          }}
        >
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4 text-white/70 tracking-wider">
              USINE-IA
            </h1>
            <p className="text-sm text-white/50 tracking-widest">
              EXPLORING THE STATION
            </p>
          </div>
          
          {/* Scroll hint */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest animate-bounce">
            SCROLL TO CONTINUE
          </div>
        </div>
      )}

      {/* Content Layer - Slides 0+ */}
      {currentSlide >= 0 && (
        <div className="absolute inset-0 flex items-center justify-center px-6" style={{ zIndex: 2 }}>
          <div 
            className="w-full max-w-4xl"
            style={{ 
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(30px)' : 'translateY(0)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {slide?.id === 'hero' ? (
              // HERO SLIDE
              <div className="text-center">
                <h1 className="text-7xl md:text-9xl font-light mb-6 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-400">
                  {slide.subtitle}
                </p>
              </div>
            ) : slide?.id === '2024' ? (
              // FROM MARSEILLE SLIDE
              <div className="text-center">
                <div className="relative">
                  <h2 
                    className="text-6xl md:text-8xl font-light tracking-[0.3em] text-white/90"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    FROM
                  </h2>
                  <h2 
                    className="text-6xl md:text-8xl font-light tracking-[0.3em] text-white/90 mt-4"
                    style={{
                      animation: 'fadeInUp 2s ease-out 0.3s backwards',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    MARSEILLE
                  </h2>
                  
                  {/* Circular light effect behind text */}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[100px] w-48 h-24"
                    style={{
                      animation: 'fadeIn 2s ease-out 0.6s backwards'
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
            ) : slide?.id === 'equipe' ? (
              // L'ÉQUIPE SLIDE - Membres avec animations directionnelles (compact)
              <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
                <div className="w-full max-w-6xl space-y-12 md:space-y-16">
                  {/* Titre */}
                  <h2 
                    className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] text-white/90 text-center mb-8"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    L'ÉQUIPE
                  </h2>
                  
                  {/* Membre 1 - AKRAM (depuis la GAUCHE) */}
                  <div 
                    style={{
                      animation: 'fadeInLeft 2s ease-out 0.4s backwards'
                    }}
                  >
                    <div className="text-left max-w-4xl">
                      <h3 className="text-xl md:text-3xl font-light tracking-wide text-white/95 mb-1">
                        Akram TOUMANI
                      </h3>
                      <p 
                        className="text-sm md:text-lg text-white/60 font-light italic mb-2"
                        style={{
                          animation: 'fadeInLeft 2s ease-out 0.6s backwards'
                        }}
                      >
                        Le Socle Technique et le Visionnaire
                      </p>
                      <p 
                        className="text-xs md:text-sm text-gray-500/80 font-light leading-relaxed"
                        style={{
                          animation: 'fadeInLeft 2s ease-out 0.8s backwards'
                        }}
                      >
                        Fondateur et Directeur Technique (CTO)
                      </p>
                    </div>
                  </div>
                  
                  {/* Membre 2 - OUSSAMA (depuis le CENTRE) */}
                  <div 
                    style={{
                      animation: 'fadeInUp 2s ease-out 1s backwards'
                    }}
                  >
                    <div className="text-center max-w-4xl mx-auto">
                      <h3 className="text-xl md:text-3xl font-light tracking-wide text-white/95 mb-1">
                        Oussama FILALI
                      </h3>
                      <p 
                        className="text-sm md:text-lg text-white/60 font-light italic mb-2"
                        style={{
                          animation: 'fadeInUp 2s ease-out 1.2s backwards'
                        }}
                      >
                        Le Génie de l'Expérience et de l'Identité Visuelle
                      </p>
                      <p 
                        className="text-xs md:text-sm text-gray-500/80 font-light leading-relaxed"
                        style={{
                          animation: 'fadeInUp 2s ease-out 1.4s backwards'
                        }}
                      >
                        Développeur et Directeur Artistique
                      </p>
                    </div>
                  </div>
                  
                  {/* Membre 3 - YANNIS (depuis la DROITE) */}
                  <div 
                    style={{
                      animation: 'fadeInRight 2s ease-out 1.6s backwards'
                    }}
                  >
                    <div className="text-right max-w-4xl ml-auto">
                      <h3 className="text-xl md:text-3xl font-light tracking-wide text-white/95 mb-1">
                        Yannis ROUSSEL
                      </h3>
                      <p 
                        className="text-sm md:text-lg text-white/60 font-light italic mb-2"
                        style={{
                          animation: 'fadeInRight 2s ease-out 1.8s backwards'
                        }}
                      >
                        Le Cartographe de l'Esprit Humain
                      </p>
                      <p 
                        className="text-xs md:text-sm text-gray-500/80 font-light leading-relaxed"
                        style={{
                          animation: 'fadeInRight 2s ease-out 2s backwards'
                        }}
                      >
                        Chercheur, Master en Sciences Cognitives
                      </p>
                    </div>
                  </div>
                  
                  {/* Circular light effect */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                      animation: 'pulse 4s ease-in-out infinite',
                      zIndex: -1
                    }}
                  />
                </div>
              </div>
            ) : slide?.id === 'mission' ? (
              // NOTRE MISSION SLIDE - Style épuré avec animations
              <div className="relative w-full h-full flex items-center justify-center px-6 md:px-12">
                <div className="w-full max-w-5xl text-center">
                  {/* Titre */}
                  <h2 
                    className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] text-white/90 mb-12 md:mb-16"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    NOTRE MISSION
                  </h2>
                  
                  {/* Phrase d'accroche principale */}
                  <p 
                    className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white/90 mb-12 md:mb-16"
                    style={{
                      animation: 'fadeInUp 2s ease-out 0.3s backwards',
                      textShadow: '0 0 30px rgba(255,255,255,0.2)'
                    }}
                  >
                    Transformer l'Intelligence Artificielle d'un outil de calcul
                    <br />
                    à un <span className="text-white">partenaire de vie authentique</span>.
                  </p>
                  
                  {/* Paragraphe mission */}
                  <p 
                    className="text-sm md:text-base lg:text-lg font-light leading-relaxed text-gray-400/90 mb-8 md:mb-10"
                    style={{
                      animation: 'fadeInUp 2s ease-out 0.6s backwards'
                    }}
                  >
                    Notre mission est de démocratiser l'Intelligence Émotionnelle Augmentée en manufacturant des Agents IA de Spécialité fiables et sur mesure. Nous nous engageons à construire des solutions où l'excellence du Machine Learning et du Deep Learning (notre socle technique) se met au service de l'authenticité du dialogue et du soutien psychologique structuré.
                  </p>
                  
                  {/* Convergence */}
                  <p 
                    className="text-xs md:text-sm lg:text-base font-light leading-relaxed text-gray-500/80"
                    style={{
                      animation: 'fadeInUp 2s ease-out 0.9s backwards'
                    }}
                  >
                    Nous faisons converger la science des neurosciences (Yannis), la robustesse mathématique (Akram) et l'art de l'expérience (Oussama) pour garantir que chaque Agent — de la confidente intime au coach stratégique — offre une connexion sincère, éthique et sans précédent.
                  </p>
                  
                  {/* Circular light effect */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                      animation: 'pulse 4s ease-in-out infinite',
                      zIndex: -1
                    }}
                  />
                  
                  {/* Concentric circles en bas */}
                  <div 
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-24"
                    style={{
                      animation: 'fadeIn 2s ease-out 1.2s backwards'
                    }}
                  >
                    <svg viewBox="0 0 200 100" className="w-full h-full opacity-50">
                      <ellipse cx="100" cy="50" rx="90" ry="15" fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
                      <ellipse cx="100" cy="50" rx="70" ry="12" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
                      <ellipse cx="100" cy="50" rx="50" ry="9" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
                      <ellipse cx="100" cy="50" rx="30" ry="6" fill="none" stroke="white" strokeWidth="1" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : slide?.id === 'projets' ? (
              // NOS AGENTS SLIDE - Composant dédié
              <ProjectsSection />
            ) : slide?.id === 'valeurs' ? (
              // VALEURS SLIDE - Same animation style
              <div className="text-center">
                <div className="relative">
                  <h2 
                    className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white/90"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    {slide?.title}
                  </h2>
                  
                  {/* Content items staggered */}
                  <div className="mt-20 space-y-10">
                    {slide?.content?.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          animation: `fadeInUp 2s ease-out ${0.3 + idx * 0.2}s backwards`
                        }}
                      >
                        <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white/90">
                          {item.label}
                        </h3>
                        {item.desc && (
                          <p className="text-lg text-gray-400 mt-3 max-w-2xl mx-auto">{item.desc}</p>
                        )}
                      </div>
                    ))}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[220px] w-48 h-24"
                    style={{
                      animation: 'fadeIn 2s ease-out 0.9s backwards'
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
            ) : slide?.id === 'articles' ? (
              // ARTICLES SLIDE - Same animation style
              <div className="text-center">
                <div className="relative">
                  <h2 
                    className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white/90"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    {slide?.title}
                  </h2>
                  
                  {/* Content items staggered */}
                  <div className="mt-20 space-y-8">
                    {slide?.content?.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          animation: `fadeInUp 2s ease-out ${0.3 + idx * 0.2}s backwards`
                        }}
                      >
                        <h3 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
                          {item.label}
                        </h3>
                        {item.desc && (
                          <p className="text-lg text-gray-500 mt-2">{item.desc}</p>
                        )}
                      </div>
                    ))}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[180px] w-48 h-24"
                    style={{
                      animation: 'fadeIn 2s ease-out 0.9s backwards'
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
            ) : slide?.id === 'contact' ? (
              // CONTACT SLIDE - Same animation style
              <div className="text-center">
                <div className="relative">
                  <h2 
                    className="text-5xl md:text-7xl font-light tracking-[0.2em] text-white/90"
                    style={{
                      animation: 'fadeInUp 2s ease-out',
                      textShadow: '0 0 40px rgba(255,255,255,0.3)'
                    }}
                  >
                    {slide?.title}
                  </h2>
                  
                  {/* Content items staggered */}
                  <div className="mt-20 space-y-8">
                    {slide?.content?.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          animation: `fadeInUp 2s ease-out ${0.3 + idx * 0.2}s backwards`
                        }}
                      >
                        <h3 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
                          {item.label}
                        </h3>
                      </div>
                    ))}
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[180px] w-48 h-24"
                    style={{
                      animation: 'fadeIn 2s ease-out 0.8s backwards'
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
            ) : (
              // OTHER SLIDES
              <div className="text-left">
                <h2 className="text-5xl md:text-7xl font-light mb-12 tracking-tight">
                  {slide?.title}
                </h2>
                
                <div className="space-y-8">
                  {slide?.content?.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-light">
                        {item.label}
                      </h3>
                      {item.desc && (
                        <p className="text-gray-500">{item.desc}</p>
                      )}
                      {item.details && (
                        <p className="text-gray-400">{item.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide indicator */}
      {currentSlide >= 0 && (
        <div className="absolute bottom-8 right-8 flex flex-col gap-2" style={{ zIndex: 3 }}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: idx === currentSlide ? '#fff' : '#444',
                transform: idx === currentSlide ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll hint */}
      {currentSlide === 0 && (
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-500 text-xs tracking-widest animate-bounce"
          style={{ zIndex: 3 }}
        >
          SCROLL
        </div>
      )}
    </div>
  );
}
