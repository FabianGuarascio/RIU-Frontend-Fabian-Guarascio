import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Hero, NewHero } from '../../models/hero.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.heroesApiUrl;

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl);
  }

  getById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.baseUrl}/${id}`);
  }

  create(newHero: NewHero): Observable<Hero> {
    return this.http.post<Hero>(this.baseUrl, newHero);
  }

  update(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.baseUrl}/${hero.id}`, hero);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
