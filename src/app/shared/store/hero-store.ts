import { Injectable, signal } from '@angular/core';

import { Hero, NewHero } from '../models/hero.model';
import { INITIAL_HEROES } from './initial-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroStore {
  private readonly heroes = signal<Hero[]>(INITIAL_HEROES);
  private nextId = Math.max(...INITIAL_HEROES.map((hero) => hero.id)) + 1;

  getAll(): Hero[] {
    return this.heroes();
  }

  getById(id: number): Hero | undefined {
    return this.heroes().find((hero) => hero.id === id);
  }

  search(name: string): Hero[] {
    const term = name.trim().toLowerCase();
    return term
      ? this.heroes().filter((hero) => hero.name.toLowerCase().includes(term))
      : this.heroes();
  }

  create(newHero: NewHero): Hero {
    const hero: Hero = { ...newHero, id: this.nextId++ };
    this.heroes.update((heroes) => [...heroes, hero]);
    return hero;
  }

  update(hero: Hero): Hero | undefined {
    const exists = this.heroes().some((h) => h.id === hero.id);
    if (!exists) {
      return undefined;
    }
    this.heroes.update((heroes) => heroes.map((h) => (h.id === hero.id ? hero : h)));
    return hero;
  }

  delete(id: number): boolean {
    const exists = this.heroes().some((h) => h.id === id);
    if (!exists) {
      return false;
    }
    this.heroes.update((heroes) => heroes.filter((h) => h.id !== id));
    return true;
  }
}
