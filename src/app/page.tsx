'use client'

import { useState } from 'react'
import ProjectDemoModal from '@/components/ProjectDemoModal'

// Données des projets
const projectsData = [
  {
    id: 'sophia',
    name: 'SophIA',
    description: 'Assistant IA avancé capable de comprendre et d\'analyser des documents complexes avec une précision remarquable.',
    features: [
      'Analyse de documents PDF, Word, Excel en temps réel',
      'Compréhension contextuelle avancée avec GPT-4',
      'Génération de résumés et synthèses intelligentes',
      'Recherche sémantique dans de grandes bases documentaires',
      'Extraction automatique de données structurées',
      'Interface conversationnelle naturelle',
    ],
    demo: {
      title: '💡 Démo Interactive',
      content: 'SophIA transforme vos documents en conversations intelligentes. Posez des questions, obtenez des insights, et automatisez vos analyses documentaires. Avec une précision de 95%, SophIA comprend le contexte et les nuances de vos documents les plus complexes.',
      image: '/demos/sophia-demo.png',
      video: '/demos/sophia-demo.mp4',
    },
    gradient: 'from-coral to-orange-electric',
    icon: '🧠',
  },
  {
    id: 'dinosbot',
    name: 'Dinos Bot',
    description: 'Bot intelligent pour Discord qui transforme l\'expérience communautaire avec des fonctionnalités IA innovantes.',
    features: [
      'Modération intelligente avec détection de toxicité',
      'Génération d\'images et d\'art IA sur commande',
      'Système de niveau et récompenses gamifié',
      'Musique et playlist intelligentes',
      'Mini-jeux interactifs avec IA',
      'Statistiques et analytics de serveur',
    ],
    demo: {
      title: '🎮 Expérience Communautaire',
      content: 'Dinos Bot révolutionne la gestion de serveur Discord. Avec plus de 50 commandes IA, une modération automatique, et des interactions ludiques, votre communauté n\'a jamais été aussi engagée. Déjà adopté par 500+ serveurs.',
      image: '/demos/dinosbot-demo.png',
      video: '/demos/dinosbot-demo.mp4',
    },
    gradient: 'from-lemon-yellow to-mint-green',
    icon: '🦕',
  },
  {
    id: 'omega',
    name: 'Projet Ω',
    description: 'Innovation secrète en développement. Une révolution IA qui changera la façon dont nous interagissons avec la technologie.',
    features: [
      'Architecture IA de nouvelle génération',
      'Traitement multi-modal (texte, image, voix)',
      'Apprentissage continu et personnalisation',
      'Intégration seamless dans votre workflow',
      'Sécurité et confidentialité de niveau entreprise',
      'API RESTful et SDK pour développeurs',
    ],
    demo: {
      title: '🚀 L\'avenir de l\'IA',
      content: 'Le Projet Ω repousse les limites de ce qui est possible avec l\'intelligence artificielle. En phase de développement avancé, il promet de redéfinir les interactions homme-machine. Inscrivez-vous à la beta privée pour être parmi les premiers à l\'essayer.',
      image: '/demos/omega-demo.png',
    },
    gradient: 'from-violet-neon to-magenta',
    icon: '🚀',
  },
]

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null)

  return (
    <>
      {/* Modal de démo */}
      {selectedProject && (
        <ProjectDemoModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}

      {/* Contenu du site */}
      <main className="relative z-10">
        {/* En-tête de section */}
        <section className="py-24 px-6 bg-gradient-to-b from-[#000814] via-[#000814] to-[#000814]">
          <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-5xl md:text-6xl font-bold tracking-[-1px] text-white mb-4">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#00AACC]">Projets</span>
            </h2>
            <p className="text-xl text-white/70">Découvrez nos créations IA qui révolutionnent l&apos;industrie</p>
          </div>
        </section>

        {/* Section Projets */}
        <section className="min-h-screen py-32 px-6 bg-gradient-to-b from-transparent via-[#000814]/80 to-[#000814]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12" />

            <div className="grid md:grid-cols-3 gap-8">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#00D9FF]/50 transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00D9FF] to-[#0088CC] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">{project.icon}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 tracking-[-1px]">
                    {project.name}
                  </h3>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <button className="text-transparent bg-gradient-to-r from-[#00D9FF] to-[#00AACC] bg-clip-text font-bold group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                    Voir la démo →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#000814] border-t border-white/10 py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#0088CC] rounded-xl"></div>
                  <span className="text-xl font-bold text-white">Usine AI</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  La factory IA qui construit l&apos;avenir, un projet à la fois.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Projets</h4>
                <ul className="space-y-2 text-white/50 text-sm">
                  <li><a href="#" className="hover:text-[#00D9FF] transition-colors">SophIA</a></li>
                  <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Dinos Bot</a></li>
                  <li><a href="#" className="hover:text-[#00D9FF] transition-colors">Projet Ω</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Communauté</h4>
                <ul className="space-y-2 text-white/50 text-sm">
                  <li><a href="#" className="hover:text-[#0088CC] transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-[#0088CC] transition-colors">Telegram</a></li>
                  <li><a href="#" className="hover:text-[#0088CC] transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Suivez-nous</h4>
                <div className="flex space-x-3">
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#0088CC] rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="text-lg">🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#0088CC] rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="text-lg">📱</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#0088CC] rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="text-lg">💬</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-white/40 text-sm">© 2025 Usine AI. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}