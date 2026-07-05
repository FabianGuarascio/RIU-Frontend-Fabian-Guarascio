import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { Hero } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
import { EditHeroModal } from './edit-hero-modal';

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

class HeroesStateStub {
  public readonly update = vi.fn((hero: Hero) => of(hero));
}

describe('EditHeroModal', () => {
  let component: EditHeroModal;
  let fixture: ComponentFixture<EditHeroModal>;
  let heroesStateStub: HeroesStateStub;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    heroesStateStub = new HeroesStateStub();
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EditHeroModal],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { hero: mockHero } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: HeroesState, useValue: heroesStateStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('start the form with the hero data', () => {
    const superman = {
      name: 'Superman',
      secretIdentity: 'Clark Kent',
      age: 35,
      birthDate: '1938-06-01',
      region: 'Krypton',
      nationality: '',
      author: '',
      origin: 'comic',
      powers: 'flight, strength',
      description: '',
      imageUrl: '',
    };
    expect(component.form.getRawValue()).toEqual(superman);
  });

  it('does not save when the form is invalid', () => {
    component.form.patchValue({ name: '' });
    component.submit();
    expect(heroesStateStub.update).not.toHaveBeenCalled();
  });

  it('saves the hero and closes the dialog when the form is valid', () => {
    component.form.patchValue({
      name: 'Superman II',
      powers: 'flight,  strength , heat vision',
    });
    component.submit();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('shows an error message and stops saving when the update fails', () => {
    heroesStateStub.update.mockReturnValueOnce(throwError(() => new Error('boom')));
    component.submit();
    expect(component.errorMessage()).toBe('Could not save hero.');
  });
});
