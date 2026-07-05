import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHero } from './add-hero';

describe('AddHero', () => {
  let component: AddHero;
  let fixture: ComponentFixture<AddHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHero],
    }).compileComponents();

    fixture = TestBed.createComponent(AddHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
