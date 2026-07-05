import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
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
import { HeroApi } from '../../../../shared/API/hero-api/hero-api';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { EditHeroModal } from '../edit-hero-modal/edit-hero-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
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
})
export class HeroesList {
  private readonly heroService = inject(HeroApi);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loadingService = inject(LoadingService);

  protected readonly displayedColumns = ['name', 'secretIdentity', 'origin', 'age', 'actions'];
  protected readonly filterControl = new FormControl('', { nonNullable: true });

  private readonly heroes = signal<Hero[]>([]);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly totalHeroes = computed(() => this.heroes().length);
  protected readonly pagedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.heroes().slice(start, start + this.pageSize());
  });

  private readonly refresh$ = new Subject<void>();

  constructor() {
    const filterTerm$ = this.filterControl.valueChanges.pipe(
      startWith(this.filterControl.value),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.pageIndex.set(0)),
    );

    merge(filterTerm$, this.refresh$.pipe(map(() => this.filterControl.value)))
      .pipe(
        tap(() => this.errorMessage.set(null)),
        switchMap((term) =>
          this.heroService.search(term).pipe(
            catchError(() => {
              this.errorMessage.set('Could not load heroes.');
              return of<Hero[]>([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((heroes) => this.heroes.set(heroes));
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected addHero(): void {
    this.router.navigate(['/heroes', 'new']);
  }

  protected viewHero(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id]);
  }

  protected editHero(hero: Hero): void {
    const dialogRef = this.dialog.open(EditHeroModal, {
      data: { hero },
      width: 'min(600px, 90vw)',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((saved): saved is true => saved === true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.refresh$.next());
  }

  protected deleteHero(hero: Hero): void {
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
        switchMap(() => this.heroService.delete(hero.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.pageIndex.set(0);
          this.refresh$.next();
        },
        error: () => this.errorMessage.set('Could not delete hero.'),
      });
  }
}
