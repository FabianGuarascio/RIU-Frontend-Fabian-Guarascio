import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';


@Component({
  selector: 'app-heroes',
  imports: [RouterOutlet],
  template: `
    @if (errorMessage()) {
      <p class="p-4 text-(--mat-sys-error)" role="alert">{{ errorMessage() }}</p>
    }
    <router-outlet />
  `,
  styles: ``,
})
export class Heroes {
  private readonly heroesState = inject(HeroesState);

  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.heroesState
      .loadHeroes()
      .pipe(takeUntilDestroyed())
      .subscribe({
        error: () => this.errorMessage.set('Could not load heroes.'),
      });
  }
}
