import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Hero } from '../../../../shared/models/hero.model';
import { LoadingService } from '../../../../shared/services/loading-service/loading-service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { HeroesFilter } from '../heroes-filter/heroes-filter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
@Component({
  selector: 'heroes-list',
  imports: [
    HeroesFilter,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './heroes-list.html',
  styleUrl: './heroes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesList {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly heroesState = inject(HeroesState);
  public readonly isLoading = inject(LoadingService).isLoading;

  public readonly errorMessage = signal<string | null>(null);
  public readonly displayedColumns = ['name', 'secretIdentity', 'origin', 'age', 'actions'];
  public readonly filterTerm = signal('');

  public readonly pageIndex = signal(0);
  public readonly pageSize = signal(5);

  public readonly filteredHeroes = computed(() => this.heroesState.search(this.filterTerm()));
  public readonly totalHeroes = computed(() => this.filteredHeroes().length);
  public readonly pagedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });

  onFilterChange(term: string): void {
    this.filterTerm.set(term);
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  addHero(): void {
    this.router.navigate(['/heroes', 'new']);
  }

  viewHero(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id]);
  }

  editHero(hero: Hero): void {
    this.dialog.open(EditHeroModal, {
      data: { hero },
      width: 'min(600px, 90vw)',
    });
  }

  deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete hero',
        message: `Are you sure you want to delete ${hero.name}?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => confirmed === true),
        switchMap(() => this.heroesState.delete(hero.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.pageIndex.set(0),
        error: () => this.errorMessage.set('Could not delete hero.'),
      });
  }
}
