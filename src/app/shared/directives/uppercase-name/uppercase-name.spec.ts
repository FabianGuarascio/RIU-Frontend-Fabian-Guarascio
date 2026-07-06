import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UppercaseName } from './uppercase-name';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseName],
  template: `<input [formControl]="control" appUppercaseName />`,
})
class MockHostComponent {
  control = new FormControl('', { nonNullable: true });
}

describe('UppercaseName', () => {
  let fixture: ComponentFixture<MockHostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MockHostComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('when add letter to the 5 position of input value, the next position of caret should be 6', () => {
    input.value = 'spidergirl';
    const start = 5;
    const end = 5;
    input.setSelectionRange(start, end);
    const char = 'x';
    input.value = input.value.slice(0, start) + char + input.value.slice(end);
    const caret = start + char.length;
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event('input'));
    expect(input.selectionStart).toBe(6);
  });
});
