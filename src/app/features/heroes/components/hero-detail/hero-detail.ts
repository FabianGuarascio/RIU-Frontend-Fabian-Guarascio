import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { HeroApi } from '../../../../shared/API/hero-api/hero-api';
import { LoadingService } from '../../../../shared/services/loading-service/loading-service';
import { Hero } from '../../../../shared/models/hero.model';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-hero-detail',
  imports: [
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.scss',
})
export class HeroDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroApi = inject(HeroApi);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  private readonly heroId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly hero = signal<Hero | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.heroApi.getById(this.heroId).subscribe({
      next: (hero) => this.hero.set(hero),
      error: () => this.errorMessage.set('Hero not found.'),
    });
  }

  protected editHero(): void {
    const hero = this.hero();
    if (!hero) {
      return;
    }

    this.dialog
      .open(EditHeroModal, { data: { hero }, width: 'min(600px, 90vw)' })
      .afterClosed()
      .pipe(
        filter((saved): saved is true => saved === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.load());
  }

  protected deleteHero(): void {
    const hero = this.hero();
    if (!hero) {
      return;
    }

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
        switchMap(() => this.heroApi.delete(hero.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.router.navigate(['/heroes']),
        error: () => this.errorMessage.set('Could not delete hero.'),
      });
  }

  protected back(): void {
    this.router.navigate(['/heroes']);
  }
}
