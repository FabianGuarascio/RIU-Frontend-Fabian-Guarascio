import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Hero, NewHero } from '../../models/hero.model';
import { Observable } from 'rxjs';
const HEROES_URL = '/api/heroes';
@Injectable({
  providedIn: 'root',
})
export class HeroApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(HEROES_URL);
  }

  getById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${HEROES_URL}/${id}`);
  }

  search(name: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(HEROES_URL, { params: { name } });
  }

  create(newHero: NewHero): Observable<Hero> {
    return this.http.post<Hero>(HEROES_URL, newHero);
  }

  update(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${HEROES_URL}/${hero.id}`, hero);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${HEROES_URL}/${id}`);
  }
}
