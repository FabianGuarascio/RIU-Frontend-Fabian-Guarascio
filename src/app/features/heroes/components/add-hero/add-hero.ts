import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UppercaseName } from '../../../../shared/directives/uppercase-name/uppercase-name';
import { HeroOrigin, NewHero } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';

@Component({
  selector: 'app-add-hero',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    UppercaseName,
  ],
  templateUrl: './add-hero.html',
  styleUrl: './add-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddHero {
  private readonly fb = inject(FormBuilder);
  private readonly heroesState = inject(HeroesState);
  private readonly router = inject(Router);
  private readonly HERO_ORIGINS: HeroOrigin[] = [
    'comic',
    'manga',
    'anime',
    'movie',
    'tv-series',
    'video-game',
    'other',
  ];

  public readonly origins = this.HERO_ORIGINS;
  public readonly saving = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    secretIdentity: [''],
    age: [0, [Validators.required, Validators.min(0)]],
    birthDate: ['', Validators.required],
    region: ['', Validators.required],
    nationality: [''],
    author: [''],
    origin: ['comic' as HeroOrigin, Validators.required],
    powers: [''],
    description: [''],
    imageUrl: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const payload: NewHero = {
      name: value.name,
      secretIdentity: value.secretIdentity || undefined,
      age: value.age,
      birthDate: value.birthDate,
      region: value.region,
      nationality: value.nationality || undefined,
      author: value.author || undefined,
      origin: value.origin,
      powers: value.powers
        ? value.powers
            .split(',')
            .map((power) => power.trim())
            .filter(Boolean)
        : [],
      description: value.description || undefined,
      imageUrl: value.imageUrl || undefined,
    };

    this.heroesState.create(payload).subscribe({
      next: () => this.router.navigate(['/heroes']),
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save hero.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/heroes']);
  }
}
