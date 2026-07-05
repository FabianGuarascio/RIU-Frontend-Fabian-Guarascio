import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'heroes-filter',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline" class="w-full sm:max-w-sm sm:flex-1">
      <mat-label>Filter by name</mat-label>
      <mat-icon matPrefix>search</mat-icon>
      <input matInput [formControl]="filterControl" placeholder="e.g. man" />
    </mat-form-field>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesFilter {
  private readonly destroyRef = inject(DestroyRef);

  public readonly filterControl = new FormControl('', { nonNullable: true });
  public readonly filterChange = output<string>();

  constructor() {
    this.filterControl.valueChanges
      .pipe(
        startWith(this.filterControl.value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((term) => this.filterChange.emit(term));
  }
}
