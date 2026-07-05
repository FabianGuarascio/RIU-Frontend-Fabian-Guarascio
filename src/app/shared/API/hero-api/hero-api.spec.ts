import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { Hero, NewHero } from '../../models/hero.model';
import { HeroApi } from './hero-api';

const BASE_URL = environment.heroesApiUrl;

const mockHero: Hero = {
  id: 1,
  name: 'Superman',
  age: 35,
  secretIdentity: 'Clark Kent',
  birthDate: '1938-06-01',
  region: 'Krypton',
  origin: 'comic',
  powers: ['flight', 'strength'],
};

describe('HeroApi', () => {
  let service: HeroApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HeroApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() sends a GET request and returns the heroes', () => {
    let result: Hero[] | undefined;
    service.getAll().subscribe((heroes) => (result = heroes));
    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('GET');
    req.flush([mockHero]);
    expect(result).toEqual([mockHero]);
  });

  it('getById() sends a GET request to the hero endpoint', () => {
    let result: Hero | undefined;
    service.getById(1).subscribe((hero) => (result = hero));
    const req = httpMock.expectOne(`${BASE_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
    expect(result).toEqual(mockHero);
  });

  it('create() sends a POST request with the new hero as body', () => {
    const newHero: NewHero = {
      name: 'Superman',
      age: 35,
      secretIdentity: 'Clark Kent',
      birthDate: '1938-06-01',
      region: 'Krypton',
      origin: 'comic',
      powers: ['flight', 'strength'],
    };
    let result: Hero | undefined;

    service.create(newHero).subscribe((hero) => (result = hero));

    const req = httpMock.expectOne(BASE_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush(mockHero);
    expect(result).toEqual(mockHero);
  });

  it('update() sends a PUT request to the hero endpoint with the hero as body', () => {
    let result: Hero | undefined;
    service.update(mockHero).subscribe((hero) => (result = hero));
    const req = httpMock.expectOne(`${BASE_URL}/${mockHero.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockHero);
    req.flush(mockHero);
    expect(result).toEqual(mockHero);
  });

  it('delete() sends a DELETE request to the hero endpoint', () => {
    let completed = false;
    service.delete(1).subscribe(() => (completed = true));
    const req = httpMock.expectOne(`${BASE_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(completed).toBe(true);
  });
});
