import { TestBed } from '@angular/core/testing';

import { HeroApi } from './hero-api';

describe('HeroApi', () => {
  let service: HeroApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
