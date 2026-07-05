import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HeroApi } from '../../API/hero-api/hero-api';
import { Hero, NewHero } from '../../models/hero.model';
import { HeroesState } from './heroes-state';

const superman: Hero = {
  id: 1,
  name: 'Superman',
  age: 35,
  secretIdentity: 'Clark Kent',
  birthDate: '1938-06-01',
  region: 'Krypton',
  origin: 'comic',
  powers: ['flight', 'strength'],
};

const batman: Hero = {
  id: 2,
  name: 'Batman',
  age: 40,
  secretIdentity: 'Bruce Wayne',
  birthDate: '1939-05-01',
  region: 'Gotham',
  origin: 'comic',
  powers: ['intelligence'],
};

class HeroApiStub {
  public readonly getAll = vi.fn(() => of([superman, batman]));
  public readonly create = vi.fn((newHero: NewHero) => of({ ...newHero, id: 3 } as Hero));
  public readonly update = vi.fn((hero: Hero) => of(hero));
  public readonly delete = vi.fn(() => of(undefined));
}

describe('HeroesState', () => {
  let service: HeroesState;
  let heroApi: HeroApiStub;

  beforeEach(() => {
    heroApi = new HeroApiStub();

    TestBed.configureTestingModule({
      providers: [{ provide: HeroApi, useValue: heroApi }],
    });
    service = TestBed.inject(HeroesState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadHeroes() fetches heroes from the API and caches them', () => {
    let result: Hero[] | undefined;

    service.loadHeroes().subscribe((heroes) => (result = heroes));
    expect(result).toEqual([superman, batman]);
  });

  it('loadHeroes() returns the cached list without hitting the API again', () => {
    service.loadHeroes().subscribe();
    heroApi.getAll.mockClear();

    let result: Hero[] | undefined;
    service.loadHeroes().subscribe((heroes) => (result = heroes));

    expect(heroApi.getAll).not.toHaveBeenCalled();
  });

  it('getById() returns the matching hero (batman)', () => {
    service.loadHeroes().subscribe();
    expect(service.getById(2)).toEqual(batman);
  });

  it('search() filters heroes by name case-insensitively', () => {
    service.loadHeroes().subscribe();
    expect(service.search('bat')).toEqual([batman]);
    expect(service.search('BAT')).toEqual([batman]);
  });

  it('create() adds the created hero to the list', () => {
    service.loadHeroes().subscribe();

    const newHero: NewHero = {
      name: 'Flash',
      age: 28,
      birthDate: '1956-01-01',
      region: 'Central City',
      origin: 'comic',
      powers: ['speed'],
    };

    service.create(newHero).subscribe();
    expect(service.heroesList()).toEqual([superman, batman, { ...newHero, id: 3 }]);
  });

  it('create() leaves the list unchanged when the API call fails', () => {
    service.loadHeroes().subscribe();
    heroApi.create.mockReturnValueOnce(throwError(() => new Error('boom')));

    const newHero: NewHero = {
      name: 'Flash',
      age: 28,
      birthDate: '1956-01-01',
      region: 'Central City',
      origin: 'comic',
      powers: ['speed'],
    };

    service.create(newHero).subscribe({ error: () => {} });

    expect(service.heroesList()).toEqual([superman, batman]);
  });

  it('update() replaces the matching hero in the list', () => {
    service.loadHeroes().subscribe();

    const updatedBatman: Hero = { ...batman, age: 41 };
    service.update(updatedBatman).subscribe();
    expect(service.heroesList()).toEqual([superman, updatedBatman]);
  });

  it('delete() removes the hero from the list', () => {
    service.loadHeroes().subscribe();
    service.delete(1).subscribe();
    expect(service.heroesList()).toEqual([batman]);
  });

  it('delete() leaves the list unchanged when the API call fails', () => {
    service.loadHeroes().subscribe();
    heroApi.delete.mockReturnValueOnce(throwError(() => new Error('boom')));
    service.delete(1).subscribe({ error: () => {} });
    expect(service.heroesList()).toEqual([superman, batman]);
  });
});
