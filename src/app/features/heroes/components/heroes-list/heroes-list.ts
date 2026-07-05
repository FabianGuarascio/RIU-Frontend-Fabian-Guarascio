import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Hero } from '../../../../shared/models/hero.model';
import { LoadingService } from '../../../../shared/services/loading-service/loading-service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroesState } from '../../../../shared/store/heroes-state/heroes-state';
@Component({
  selector: 'heroes-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
  private readonly heroesState = inject(HeroesState);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  public readonly isLoading = inject(LoadingService).isLoading;

  public readonly displayedColumns = ['name', 'secretIdentity', 'origin', 'age', 'actions'];
  public readonly filterControl = new FormControl('', { nonNullable: true });

  private readonly filterTerm = toSignal(
    this.filterControl.valueChanges.pipe(
      startWith(this.filterControl.value),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: this.filterControl.value },
  );

  public readonly pageIndex = signal(0);
  public readonly pageSize = signal(5);
  public readonly errorMessage = signal<string | null>(null);

  public readonly filteredHeroes = computed(() => this.heroesState.search(this.filterTerm()));
  public readonly totalHeroes = computed(() => this.filteredHeroes().length);
  public readonly pagedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.filterTerm();
      this.pageIndex.set(0);
    });
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
