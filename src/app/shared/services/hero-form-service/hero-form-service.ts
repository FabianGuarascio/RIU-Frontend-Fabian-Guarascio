import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { HeroOrigin } from '../../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroFormService {
  private readonly fb = inject(FormBuilder);

  createHeroForm() {
    return this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      secretIdentity: [''],
      age: [0, [Validators.required, Validators.min(0)]],
      birthDate: ['', Validators.required],
      region: ['', Validators.required],
      nationality: [''],
      author: [''],
      origin: ['comic' as HeroOrigin, Validators.required],
      powers: [[] as string[]],
      description: [''],
      imageUrl: [''],
    });
  }

  addPower(powers: FormControl<string[]>, event: MatChipInputEvent): void {
    const power = (event.value || '').trim();
    if (power) {
      powers.setValue([...powers.value, power]);
    }
    event.chipInput.clear();
  }

  removePower(powers: FormControl<string[]>, power: string): void {
    powers.setValue(powers.value.filter((p) => p !== power));
  }
}
