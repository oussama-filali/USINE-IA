import type { AgentProject } from './types';

const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const agentProjects: AgentProject[] = [
  {
    id: 'sophia',
    name: 'Sophia',
    tagline: 'IA Émotionnelle',
    description:
      "Sophia n'est pas un chatbot. C'est une mémoire expérientielle : elle détecte la détresse, structure l'écoute et ne juge jamais.",
    status: 'live',
    link: 'https://t.me/Sophia_bot',
    ctaLabel: 'Tester Sophia sur Telegram',
    ctaHref: 'https://t.me/Sophia_bot',
    icon: '💖',
    imageUrl: publicUrl('images/sophia.png'),
  },
  {
    id: 'dino',
    name: 'Dino Bot',
    tagline: 'Fact-checking enfants (6–12 ans)',
    description: "L'éducation aux médias pour les 6–12 ans : vérification des faits et langage adapté.",
    status: 'live',
    link: 'https://www.dino-bot.fun/',
    ctaLabel: 'Ouvrir Dino Bot',
    ctaHref: 'https://www.dino-bot.fun/',
    icon: '🦕',
    modelUrl: publicUrl('models/dino_plushie(1).glb'),
    modelRotation: [0, 0.9, 0],
    modelScale: 1,
  },
  {
    id: 'koba',
    name: 'Maître Koba',
    tagline: "L'Avocat Sémantique",
    description:
      "Déconstruit la complexité juridique et stratégique. Met fin à la confusion des démarches initiales en offrant une feuille de route claire pour chaque problème professionnel ou légal. Un raisonnement de haut niveau pour des décisions importantes.",
    status: 'coming',
    icon: '⚖️',
    imageUrl: publicUrl('images/justice-scale-concept-with-copy-space.png'),
  },
  {
    id: 'leon',
    name: 'Léon',
    tagline: 'Superviseur clinique intelligent',
    description:
      'Le superviseur clinique intelligent qui assiste les professionnels de santé dans l’analyse approfondie de dossiers complexes. Une architecture de précision conçue pour sécuriser le diagnostic médical et optimiser la prise en charge des patients.',
    status: 'coming',
    icon: '🩺',
    imageUrl: publicUrl('images/leon.jpg'),
  },
  {
    id: 'khayav',
    name: 'Khayav',
    tagline: 'Agent exécutif “Col Bleu”',
    description:
      'Agent dédié à l’économie de proximité qui automatise la gestion opérationnelle et les réservations. Une solution d’action réelle conçue pour redonner du temps de métier aux restaurateurs et commerçants locaux.',
    status: 'live',
    link: 'https://khayav-agent.onrender.com/',
    icon: '🛠️',
    imageUrl: publicUrl('images/khayav.png'),
    ctaLabel: 'Ouvrir Khayav',
    ctaHref: 'https://khayav-agent.onrender.com/',
  },
];
