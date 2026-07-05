import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';

import { Hero, NewHero } from '../models/hero.model';
import { HeroStore } from '../store/hero-store';

const HEROES_COLLECTION_URL = '/api/heroes';
const HERO_ITEM_URL_PATTERN = /^\/api\/heroes\/(\d+)$/;


export const mockHeroesInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(HEROES_COLLECTION_URL)) {
    return next(req);
  }

  const store = inject(HeroStore);
  const itemMatch = req.url.match(HERO_ITEM_URL_PATTERN);
  const id = itemMatch ? Number(itemMatch[1]) : null;

  const respond = (body: unknown) =>
    of(new HttpResponse({ status: 200, body })).pipe(delay(300));
  const notFound = (message: string) =>
    throwError(
      () => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url, error: { message } }),
    ).pipe(delay(300));

  if (req.method === 'GET' && id === null) {
    const name = req.params.get('name');
    return respond(name ? store.search(name) : store.getAll());
  }

  if (req.method === 'GET' && id !== null) {
    const hero = store.getById(id);
    return hero ? respond(hero) : notFound(`Hero ${id} not found`);
  }

  if (req.method === 'POST' && id === null) {
    return respond(store.create(req.body as NewHero));
  }

  if (req.method === 'PUT' && id !== null) {
    const updated = store.update({ ...(req.body as Hero), id });
    return updated ? respond(updated) : notFound(`Hero ${id} not found`);
  }

  if (req.method === 'DELETE' && id !== null) {
    return store.delete(id) ? respond(null) : notFound(`Hero ${id} not found`);
  }

  return next(req);
};
