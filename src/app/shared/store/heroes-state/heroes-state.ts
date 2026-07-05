import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { HeroApi } from '../../API/hero-api/hero-api';
import { Hero, NewHero } from '../../models/hero.model';

/**
 * Esta es la implementacion de el manejo de estado ( comunicacion entre componentes) de forma muy sencilla.
 * Podria haberse utilizado NgRX store ( un signalStore hubiera bastado ). Pero esta es una solucion muy sencilla.
 * No es la mejor para un proyecto de escala profesional, pero para demostrar el despliegue de habilidades y la comunicacion de componentes basta.
 * Tambien estas soluciones son posibles de implementar a escala profesional para salir del camino rapido para comunicacion de componentes.
 * Esto es una mezcla de "signal as a service" y "redux store".
 */
@Injectable({
  providedIn: 'root',
})
export class HeroesState {
  private readonly heroApi = inject(HeroApi);

  public readonly heroesList = signal<Hero[]>([]);
  public readonly heroesListLoaded = signal(false);


  loadHeroes(): Observable<Hero[]> {
    if (this.heroesListLoaded()) {
      return of(this.heroesList());
    }

    return this.heroApi.getAll().pipe(
      tap((heroes) => {
        this.heroesList.set(heroes);
        this.heroesListLoaded.set(true);
      }),
    );
  }

  getById(id: number): Hero | undefined {
    return this.heroesList().find((hero) => hero.id === id);
  }

  search(term: string): Hero[] {
    const normalized = term.trim().toLowerCase();
    return normalized
      ? this.heroesList().filter((hero) => hero.name.toLowerCase().includes(normalized))
      : this.heroesList();
  }

  create(newHero: NewHero): Observable<Hero> {
    return this.heroApi.create(newHero).pipe(
      tap((hero) => this.heroesList.update((heroes) => [...heroes, hero])),
    );
  }

  update(hero: Hero): Observable<Hero> {
    return this.heroApi.update(hero).pipe(
      tap((updated) =>
        this.heroesList.update((heroes) => heroes.map((h) => (h.id === updated.id ? updated : h))),
      ),
    );
  }

  delete(id: number): Observable<void> {
    return this.heroApi.delete(id).pipe(
      tap(() => this.heroesList.update((heroes) => heroes.filter((hero) => hero.id !== id))),
    );
  }
}
