import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { UppercaseName } from '../../../../shared/directives/uppercase-name/uppercase-name';
import { HeroOrigin, NewHero } from '../../../../shared/models/hero.model';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
import { HERO_ORIGINS } from '../../../../shared/consts/hero-origins';
import { HeroFormService } from '../../../../shared/services/hero-form-service/hero-form-service';

@Component({
  selector: 'app-add-hero',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    UppercaseName,
  ],
  templateUrl: './add-hero.html',
  styleUrl: './add-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddHero {
  private readonly heroesState = inject(HeroesState);
  private readonly router = inject(Router);
  private readonly heroFormService = inject(HeroFormService);
  public readonly origins: readonly HeroOrigin[] = HERO_ORIGINS;
  public readonly saving = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly powerSeparatorKeyCodes = [ENTER, COMMA];

  public readonly form = this.heroFormService.createHeroForm();

  addPower(event: MatChipInputEvent): void {
    this.heroFormService.addPower(this.form.controls.powers, event);
  }

  removePower(power: string): void {
    this.heroFormService.removePower(this.form.controls.powers, power);
  }

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
      powers: value.powers,
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
