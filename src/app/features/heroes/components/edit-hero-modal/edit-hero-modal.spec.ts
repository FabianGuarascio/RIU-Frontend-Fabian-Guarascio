import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHeroModal } from './edit-hero-modal';

describe('EditHeroModal', () => {
  let component: EditHeroModal;
  let fixture: ComponentFixture<EditHeroModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHeroModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
