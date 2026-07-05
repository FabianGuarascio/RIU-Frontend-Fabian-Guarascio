import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgScrollbar } from 'ngx-scrollbar';
import { UppercaseName } from '../../../../shared/directives/uppercase-name/uppercase-name';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hero, HeroOrigin } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';

@Component({
  selector: 'edit-hero-modal',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    NgScrollbar,
    UppercaseName,
  ],
  templateUrl: './edit-hero-modal.html',
  styleUrl: './edit-hero-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditHeroModal {
  private readonly fb = inject(FormBuilder);
  private readonly heroesState = inject(HeroesState);
  private readonly dialogRef = inject(MatDialogRef<EditHeroModal, boolean>);
  private readonly data = inject<{ hero: Hero }>(MAT_DIALOG_DATA);
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

  constructor() {
    const hero = this.data.hero;
    this.form.patchValue({
      name: hero.name,
      secretIdentity: hero.secretIdentity ?? '',
      age: hero.age,
      birthDate: hero.birthDate,
      region: hero.region,
      nationality: hero.nationality ?? '',
      author: hero.author ?? '',
      origin: hero.origin,
      powers: hero.powers.join(', '),
      description: hero.description ?? '',
      imageUrl: hero.imageUrl ?? '',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    this.heroesState
      .update({
        id: this.data.hero.id,
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
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('Could not save hero.');
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
