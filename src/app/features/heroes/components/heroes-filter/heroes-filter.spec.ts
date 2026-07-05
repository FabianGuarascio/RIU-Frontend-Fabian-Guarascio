import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesFilter } from './heroes-filter';

describe('HeroesFilter', () => {
  let component: HeroesFilter;
  let fixture: ComponentFixture<HeroesFilter>;
  let emissions: string[];

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [HeroesFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesFilter);
    component = fixture.componentInstance;

    emissions = [];
    component.filterChange.subscribe((value) => emissions.push(value));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits empty value on init', () => {
    vi.advanceTimersByTime(300);
    expect(emissions).toEqual(['']);
  });

  it('emits the value after the debounce window', () => {
    emissions = [];
    component.filterControl.setValue('bat');
    vi.advanceTimersByTime(300);

    expect(emissions).toEqual(['bat']);
  });

  it("doesn't re-emit the same value", () => {
    emissions = [];
    component.filterControl.setValue('bat');
    vi.advanceTimersByTime(300);
    component.filterControl.setValue('bat');
    vi.advanceTimersByTime(300);

    expect(emissions.length).toBe(1);
  });
});
