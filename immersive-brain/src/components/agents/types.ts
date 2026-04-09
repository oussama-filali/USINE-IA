export interface AgentProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'coming';
  link?: string;
  icon: string;
  imageUrl?: string;
  modelUrl?: string;
  modelRotation?: [number, number, number];
  modelScale?: number;
  ctaLabel?: string;
  ctaHref?: string;
  ctaAction?: 'navigate';
  ctaTargetId?: string;
}
