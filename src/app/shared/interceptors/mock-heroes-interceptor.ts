import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { delay, of, throwError } from 'rxjs';

import { Hero, NewHero } from '../models/hero.model';
import { INITIAL_HEROES } from './initial-heroes';

const HEROES_COLLECTION_URL = '/api/heroes';
const HERO_ITEM_URL_PATTERN = /^\/api\/heroes\/(\d+)$/;

const heroes = signal<Hero[]>(INITIAL_HEROES);
let nextId = Math.max(...INITIAL_HEROES.map((hero) => hero.id)) + 1;
/**
 * Este interceptor la funcion que cumple es simular el backend con sus llamados http y la base de datos.
 * Hubiera sido mas sencillo crear un crud en nestJs pero esta es la forma que encontre mas sencilla sin necesidad 
 * de instalar ninguna libreria ni dockerizar la aplicacion.
 */
export const mockHeroesInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(HEROES_COLLECTION_URL)) {
    return next(req);
  }

  const itemMatch = req.url.match(HERO_ITEM_URL_PATTERN);
  const id = itemMatch ? Number(itemMatch[1]) : null;

  const respond = (body: unknown) =>
    of(new HttpResponse({ status: 200, body })).pipe(delay(300));
  const notFound = (message: string) =>
    throwError(
      () => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url, error: { message } }),
    ).pipe(delay(300));

  if (req.method === 'GET' && id === null) {
    return respond(heroes());
  }

  if (req.method === 'GET' && id !== null) {
    const hero = heroes().find((h) => h.id === id);
    return hero ? respond(hero) : notFound(`Hero ${id} not found`);
  }

  if (req.method === 'POST' && id === null) {
    const hero: Hero = { ...(req.body as NewHero), id: nextId++ };
    heroes.update((list) => [...list, hero]);
    return respond(hero);
  }

  if (req.method === 'PUT' && id !== null) {
    const exists = heroes().some((h) => h.id === id);
    if (!exists) {
      return notFound(`Hero ${id} not found`);
    }
    const updated: Hero = { ...(req.body as Hero), id };
    heroes.update((list) => list.map((h) => (h.id === id ? updated : h)));
    return respond(updated);
  }

  if (req.method === 'DELETE' && id !== null) {
    const exists = heroes().some((h) => h.id === id);
    if (!exists) {
      return notFound(`Hero ${id} not found`);
    }
    heroes.update((list) => list.filter((h) => h.id !== id));
    return respond(null);
  }

  return next(req);
};
