import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
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
  public readonly powerSeparatorKeyCodes = [ENTER, COMMA];

  public readonly form = this.fb.nonNullable.group({
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
      powers: hero.powers,
      description: hero.description ?? '',
      imageUrl: hero.imageUrl ?? '',
    });
  }

  addPower(event: MatChipInputEvent): void {
    const power = (event.value || '').trim();
    if (power) {
      this.form.controls.powers.setValue([...this.form.controls.powers.value, power]);
    }
    event.chipInput.clear();
  }

  removePower(power: string): void {
    this.form.controls.powers.setValue(
      this.form.controls.powers.value.filter((p) => p !== power),
    );
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
        powers: value.powers,
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
