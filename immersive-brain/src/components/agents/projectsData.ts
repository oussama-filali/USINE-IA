import type { AgentProject } from './types';

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
    // Public-safe: do not depend on untracked photos or non-existent GLBs.
    imageUrl: '/images/logo-usine-ia.png',
  },
  {
    id: 'dino',
    name: 'Dino Bot',
    tagline: 'Fact-checking enfants (6–12 ans)',
    description: "L'éducation aux médias pour les 6–12 ans : vérification des faits et langage adapté.",
    status: 'coming',
    ctaLabel: "S'inscrire à la Beta",
    ctaAction: 'navigate',
    ctaTargetId: 'newsletter',
    icon: '🦕',
    imageUrl: '/images/logo-usine-ia.png',
  },
  {
    id: 'koba',
    name: 'Maître Koba',
    tagline: "L'Avocat Sémantique",
    description:
      "Déconstruit la complexité juridique et stratégique. Met fin à la confusion des démarches initiales en offrant une feuille de route claire pour chaque problème professionnel ou légal. Un raisonnement de haut niveau pour des décisions importantes.",
    status: 'coming',
    icon: '⚖️',
    imageUrl: '/images/logo-usine-ia.png',
  },
  {
    id: 'leon',
    name: 'Léon',
    tagline: 'Superviseur clinique intelligent',
    description:
      'Le superviseur clinique intelligent qui assiste les professionnels de santé dans l’analyse approfondie de dossiers complexes. Une architecture de précision conçue pour sécuriser le diagnostic médical et optimiser la prise en charge des patients.',
    status: 'coming',
    icon: '🩺',
    imageUrl: '/images/logo-usine-ia.png',
  },
  {
    id: 'khayav',
    name: 'Khayav',
    tagline: 'Agent exécutif “Col Bleu”',
    description:
      'Agent dédié à l’économie de proximité qui automatise la gestion opérationnelle et les réservations. Une solution d’action réelle conçue pour redonner du temps de métier aux restaurateurs et commerçants locaux.',
    status: 'coming',
    icon: '🛠️',
    imageUrl: '/images/logo-usine-ia.png',
  },
];
