import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesFilter } from './heroes-filter';

describe('HeroesFilter', () => {
  let component: HeroesFilter;
  let fixture: ComponentFixture<HeroesFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
