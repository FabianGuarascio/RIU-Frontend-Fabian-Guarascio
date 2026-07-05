import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../services/theme-service/theme-service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly themeService = inject(ThemeService);
  isDark = this.themeService.isDark
  DESKTOP_QUERY = '(min-width: 1024px)';

  isDesktop = toSignal(
    this.breakpointObserver.observe(this.DESKTOP_QUERY).pipe(map((state) => state.matches)),
    { initialValue: this.breakpointObserver.isMatched(this.DESKTOP_QUERY) },
  );

  toggleTheme():void{
    this.themeService.toggle()
  }
}
