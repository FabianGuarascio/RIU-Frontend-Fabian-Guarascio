import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Hero, NewHero } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
import { AddHero } from './add-hero';

const createdHero: Hero = {
  id: 1,
  name: 'Superman',
  age: 35,
  birthDate: '1938-06-01',
  region: 'Krypton',
  origin: 'comic',
  powers: ['flight', 'strength'],
};

class HeroesStateStub {
  public readonly create = vi.fn((_hero: NewHero) => of(createdHero));
}

describe('AddHero', () => {
  let component: AddHero;
  let fixture: ComponentFixture<AddHero>;
  let heroesStateStub: HeroesStateStub;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    heroesStateStub = new HeroesStateStub();
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AddHero],
      providers: [
        { provide: HeroesState, useValue: heroesStateStub },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddHero);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not save when the form is invalid', () => {
    component.submit();
    expect(heroesStateStub.create).not.toHaveBeenCalled();
  });

  it('saves the hero and navigates to the heroes list when the form is valid', () => {
    component.form.patchValue({
      name: 'Superman',
      age: 35,
      birthDate: '1938-06-01',
      region: 'Krypton',
      origin: 'comic',
      powers: 'flight,  strength ',
    });

    component.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('shows an error message when the creation fails', () => {
    heroesStateStub.create.mockReturnValueOnce(throwError(() => new Error('boom')));
    component.form.patchValue({
      name: 'Superman',
      age: 35,
      birthDate: '1938-06-01',
      region: 'Krypton',
    });

    component.submit();
    expect(component.errorMessage()).toBe('Could not save hero.');
  });

  it('navigates to the heroes list when is cancelled', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });
});
