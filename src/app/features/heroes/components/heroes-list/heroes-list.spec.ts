import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Hero } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { HeroesList } from './heroes-list';

const mockHeroes: Hero[] = [
  {
    id: 1,
    name: 'Superman',
    age: 35,
    secretIdentity: 'Clark Kent',
    birthDate: '1938-06-01',
    region: 'Krypton',
    origin: 'comic',
    powers: ['flight', 'strength'],
  },
  {
    id: 2,
    name: 'Batman',
    age: 40,
    secretIdentity: 'Bruce Wayne',
    birthDate: '1939-05-01',
    region: 'Gotham',
    origin: 'comic',
    powers: ['intelligence'],
  },
];

class HeroesStateStub {
  public readonly heroesList = signal<Hero[]>(mockHeroes);

  public readonly delete = vi.fn((id: number) => {
    this.heroesList.update((heroes) => heroes.filter((hero) => hero.id !== id));
    return of(undefined);
  });

  search(term: string): Hero[] {
    const normalized = term.trim().toLowerCase();
    return normalized
      ? this.heroesList().filter((hero) => hero.name.toLowerCase().includes(normalized))
      : this.heroesList();
  }
}

describe('HeroesList', () => {
  let component: HeroesList;
  let fixture: ComponentFixture<HeroesList>;
  let heroesState: HeroesStateStub;
  let dialogOpen: ReturnType<typeof vi.fn>;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    heroesState = new HeroesStateStub();
    dialogOpen = vi.fn(() => ({ afterClosed: () => of(true) }));
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [HeroesList],
      providers: [
        { provide: HeroesState, useValue: heroesState },
        { provide: MatDialog, useValue: { open: dialogOpen } },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the list of heroes with the mocked data', () => {
    expect(component.pagedHeroes()).toEqual(mockHeroes);
  });

  it('shows zero heroes when the list is empty', () => {
    heroesState.heroesList.set([]);

    expect(component.pagedHeroes()).toEqual([]);
    expect(component.totalHeroes()).toBe(0);
  });

  it('filters the heroes by name (batman)', () => {
    component.onFilterChange('bat');

    expect(component.pagedHeroes()).toEqual([
      {
        id: 2,
        name: 'Batman',
        age: 40,
        secretIdentity: 'Bruce Wayne',
        birthDate: '1939-05-01',
        region: 'Gotham',
        origin: 'comic',
        powers: ['intelligence'],
      },
    ]);
  });

  it('navigates to the new hero page when adding a hero', () => {
    component.addHero();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes', 'new']);
  });

  it('navigates to the hero details page when viewing a hero', () => {
    component.viewHero(mockHeroes[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/heroes', mockHeroes[0].id]);
  });

  it('opens the edit modal with the selected hero when editing', () => {
    component.editHero(mockHeroes[0]);

    expect(dialogOpen).toHaveBeenCalledWith(
      EditHeroModal,
      expect.objectContaining({ data: { hero: mockHeroes[0] } }),
    );
  });

  it('removes the hero from the table once the deletion is confirmed', () => {
    component.deleteHero(mockHeroes[0]);
    expect(component.pagedHeroes().length).toBe(1);
  });

  it('keeps the hero when the deletion is not confirmed', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(false) });
    component.deleteHero(mockHeroes[0]);
    expect(component.pagedHeroes()).toEqual(mockHeroes);
  });

  it('shows an error message when the deletion fails', () => {
    heroesState.delete.mockReturnValueOnce(throwError(() => new Error('boom')));
    component.deleteHero(mockHeroes[0]);
    expect(component.errorMessage()).toBe('Could not delete hero.');
  });
});
