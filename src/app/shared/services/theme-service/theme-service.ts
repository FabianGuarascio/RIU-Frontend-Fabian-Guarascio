import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'color-scheme';
  private readonly scheme = signal<'light' | 'dark'>(this.getInitialScheme());
  readonly isDark = computed(() => this.scheme() === 'dark');

  constructor() {
    effect(() => {
      const scheme = this.scheme();
      document.body.style.colorScheme = scheme;
      localStorage.setItem(this.STORAGE_KEY, scheme);
    });
  }

  toggle(): void {
    this.scheme.update((scheme) => (scheme === 'dark' ? 'light' : 'dark'));
  }

  private getInitialScheme(): 'light' | 'dark' {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
