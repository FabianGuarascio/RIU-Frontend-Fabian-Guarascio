import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { LoadingService } from '../../../../shared/services/loading-service/loading-service';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';

@Component({
  selector: 'app-hero-detail',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.scss',
})
export class HeroDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroesState = inject(HeroesState);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  public readonly loadingService = inject(LoadingService);

  private readonly heroId = Number(this.route.snapshot.paramMap.get('id'));

  private readonly actionError = signal<string | null>(null);

  public readonly hero = computed(() => this.heroesState.getById(this.heroId) ?? null);
  public readonly errorMessage = computed(() => {
    if (this.actionError()) {
      return this.actionError();
    } else if (this.heroesState.heroesListLoaded() && !this.hero()) {
      return 'Hero not found.';
    } else {
      return null;
    }
  });

  editHero(): void {
    const hero = this.hero();
    if (!hero) return;
    this.dialog.open(EditHeroModal, { data: { hero }, width: 'min(600px, 90vw)' });
  }

  deleteHero(): void {
    const hero = this.hero();
    if (!hero) return;
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Delete hero',
          message: `Are you sure you want to delete ${hero.name}?`,
        },
      })
      .afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => confirmed === true),
        switchMap(() => this.heroesState.delete(hero.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.router.navigate(['/heroes']),
        error: () => this.actionError.set('Could not delete hero.'),
      });
  }

  back(): void {
    this.router.navigate(['/heroes']);
  }
}
