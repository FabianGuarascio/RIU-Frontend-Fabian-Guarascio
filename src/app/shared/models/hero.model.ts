import { HERO_ORIGINS } from '../consts/hero-origins';

export type HeroOrigin = (typeof HERO_ORIGINS)[number];

export interface Hero {
  id: number;
  name: string;
  age: number;
  secretIdentity?: string;
  birthDate: string;
  region: string;
  nationality?: string;
  author?: string;
  origin: HeroOrigin;
  powers: string[];
  description?: string;
  imageUrl?: string;
}

export type NewHero = Omit<Hero, 'id'>;
