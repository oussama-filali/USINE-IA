import React, { useState, useEffect, useRef } from 'react';
import SpaceStationScene from './components/SpaceStationScene';
import Intro from './components/Intro';
import ProjectsSection from './components/ProjectsSection';
import NewsletterSectionUpdated from './components/NewsletterSectionUpdated';
import HeartMorph from './components/HeartMorph';

const slides = [
  { id: 'hero', title: 'Hero' },
  { id: 'services', title: 'Notre Expertise' },
  { id: 'formations', title: 'Transmission de Savoir' },
  { id: 'agents', title: 'Sophia & Dino' },
  { id: 'newsletter', title: 'Newsletter' },
  { id: 'contact', title: 'Contact' }
];

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Auto-advance from 3D showcase to hero
  useEffect(() => {
    if (introComplete && currentSlide === -1) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide(0);
        setTimeout(() => setIsTransitioning(false), 800);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [introComplete, currentSlide]);

  const goToSlideId = (id: string) => {
    const idx = slides.findIndex(s => s.id === id);
    if (idx < 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Navigation handler (unifiée pour wheel et touch)
  const navigateSlides = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    if (direction === 'next' && currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (direction === 'prev' && currentSlide > -1) {
      setCurrentSlide(prev => prev - 1);
    }
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Wheel navigation (desktop)
  useEffect(() => {
    if (!introComplete) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime.current < 120) return;
      
      if (isTransitioning) return;
      
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      const threshold = 8;
      if (Math.abs(e.deltaY) < threshold) return;

      lastWheelTime.current = now;

      wheelTimeoutRef.current = setTimeout(() => {
        if (e.deltaY > 0) {
          navigateSlides('next');
        } else if (e.deltaY < 0) {
          navigateSlides('prev');
        }
      }, 80);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [introComplete, currentSlide, isTransitioning]);

  // Touch navigation (mobile)
  useEffect(() => {
    if (!introComplete) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;

      touchEndY.current = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY.current;
      const threshold = 50;

      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          navigateSlides('next');
        } else {
          navigateSlides('prev');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [introComplete, currentSlide, isTransitioning]);

  const slide = currentSlide >= 0 ? slides[currentSlide] : null;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black text-white">
      {/* 3D Background - ALWAYS VISIBLE */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <SpaceStationScene slideIndex={currentSlide} />
      </div>

      {/* Intro overlay (attend le vrai chargement) */}
      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

      {/* Dark overlay that increases with slides (except during 3D showcase) */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-700 ease-out"
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
            transition: 'opacity 0.7s ease-out'
          }}
        >
          <div className="text-center px-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light mb-3 md:mb-4 text-white/80 tracking-[0.3em]">
              USINE-IA
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/40 tracking-[0.4em] font-light">
              MANUFACTURING EMOTIONAL AI
            </p>
          </div>
        </div>
      )}

      {/* Content Layer - Slides 0+ */}
      {introComplete && currentSlide >= 0 && (
        <div className="absolute inset-0 flex items-center justify-center px-6" style={{ zIndex: 2 }}>
          <div 
            className="w-full max-w-4xl"
            style={{ 
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {slide?.id === 'hero' ? (
              // HERO SLIDE
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-light mb-6 leading-[1.18]">
                  L'Intelligence Artificielle{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    doit avoir du <HeartMorph delayMs={1800} word="cœur" modelUrl="/models/robot_playground.glb" />
                  </span>
                  .
                </h1>
                <p className="text-sm sm:text-base md:text-lg font-light text-gray-300/80 max-w-3xl mx-auto leading-relaxed">
                  Nous ne nous contentons pas de coder. Nous transformons des algorithmes froids en confidents numériques.
                  Expertise RAG, Fine-tuning et UX Conversationnelle pour entreprises ambitieuses.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => goToSlideId('contact')}
                    className="px-7 py-3 bg-indigo-600/90 hover:bg-indigo-600 text-white text-sm tracking-wider shadow-lg shadow-indigo-500/20 transition-all duration-300"
                  >
                    Parler à un expert
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlideId('agents')}
                    className="px-7 py-3 border border-white/20 text-white/80 text-sm tracking-wider hover:bg-white/10 transition-all duration-300"
                  >
                    Nos Réalisations
                  </button>
                </div>
              </div>
            ) : slide?.id === 'services' ? (
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.3em] text-white/90 mb-4">
                  Notre Expertise
                </h2>
                <p className="text-sm md:text-base font-light text-gray-300/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Nous accompagnons les entreprises, les cliniques et les associations dans l'intégration d'IA conversationnelles éthiques et performantes.
                </p>

                <div className="grid md:grid-cols-3 gap-4 md:gap-6 text-left">
                  {[
                    {
                      title: 'Audit & Stratégie IA',
                      desc: "Analyse de vos besoins. Comment l'IA peut-elle réduire la charge mentale de vos équipes ?"
                    },
                    {
                      title: 'Architecture RAG & Vectorielle',
                      desc: 'Implémentation de bases de connaissances complexes. Vos PDF deviennent un cerveau consultable.'
                    },
                    {
                      title: 'Web Design & Intégration',
                      desc: "Création de sites internet immersifs et d'applications web intégrant nativement vos agents IA."
                    }
                  ].map((card) => (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => goToSlideId('contact')}
                      className="group relative p-5 border border-white/10 bg-black/30 backdrop-blur-sm hover:border-white/30 transition-all duration-500 text-left"
                    >
                      <h3 className="text-lg md:text-xl font-light tracking-wide text-white/95 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400/85 font-light leading-relaxed">
                        {card.desc}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40 group-hover:text-white/70 transition-colors duration-300">
                        <span>En discuter</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-white/30 to-white/10 group-hover:w-full transition-all duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            ) : slide?.id === 'formations' ? (
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.3em] text-white/90 mb-4">
                  Transmission de Savoir
                </h2>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-left mt-10">
                  <div className="relative p-6 border border-white/10 bg-black/30 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                    <h3 className="text-xl md:text-2xl font-light text-white/95 mb-2">Mise en Orbite</h3>
                    <p className="text-xs text-white/50 tracking-widest mb-4">1/2 JOURNÉE · DÉCIDEURS / MANAGERS</p>
                    <p className="text-sm text-gray-300/80 font-light leading-relaxed mb-6">
                      Démystifiez l'IA Générative. Identifiez vos 3 premiers cas d'usage. Pas de code, 100% stratégie.
                    </p>
                    <a
                      href="mailto:contact@usineiaclub.store?subject=R%C3%A9server%20un%20cr%C3%A9neau%20%E2%80%94%20Mise%20en%20Orbite"
                      className="inline-block px-5 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs tracking-wider transition-all duration-300"
                    >
                      Réserver un créneau
                    </a>
                  </div>

                  <div className="relative p-6 border border-white/10 bg-black/30 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                    <h3 className="text-xl md:text-2xl font-light text-white/95 mb-2">Le Réacteur Cognitif</h3>
                    <p className="text-xs text-white/50 tracking-widest mb-4">2 JOURS · ÉQUIPES TECH / DATA</p>
                    <p className="text-sm text-gray-300/80 font-light leading-relaxed mb-6">
                      Plongez au cœur du moteur : embeddings, vector stores, prompt engineering. Vos équipes repartent avec un prototype.
                    </p>
                    <a
                      href="mailto:contact@usineiaclub.store?subject=Demander%20le%20programme%20%E2%80%94%20Le%20R%C3%A9acteur%20Cognitif"
                      className="inline-block px-5 py-2 border border-white/20 text-white/85 text-xs tracking-wider hover:bg-white/10 transition-all duration-300"
                    >
                      Demander le programme
                    </a>
                  </div>
                </div>
              </div>
            ) : slide?.id === 'agents' ? (
              <ProjectsSection onNavigateToId={goToSlideId} />
            ) : slide?.id === 'newsletter' ? (
              <NewsletterSectionUpdated />
            ) : slide?.id === 'contact' ? (
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-light tracking-[0.3em] text-white/90 mb-6">
                  Prêt à donner une âme à votre IA ?
                </h2>
                <p className="text-sm md:text-base font-light text-gray-300/80 max-w-3xl mx-auto leading-relaxed mb-6">
                  Nous n'acceptons que 3 nouveaux clients par mois pour garantir une qualité d'exécution totale.
                </p>
                <a
                  href="mailto:contact@usineiaclub.store"
                  className="inline-block text-xl md:text-3xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                >
                  contact@usineiaclub.store
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Slide indicator */}
      {introComplete && currentSlide >= 0 && (
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
    </div>
  );
}
