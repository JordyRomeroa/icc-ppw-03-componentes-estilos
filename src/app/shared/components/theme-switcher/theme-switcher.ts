import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../../features/simpsons/service/theme-service';


@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './theme-switcher.html',
})
export class ThemeSwitcherComponent {
  themes = ['light', 'dark', 'forest'];
  themeService = inject(ThemeService);

  // Signal para mostrar en el botón
  currentTheme = signal(this.themeService.theme());

  constructor() {
    // Inicializa currentTheme desde el servicio
    this.currentTheme.set(this.themeService.theme());
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme);
    this.currentTheme.set(theme);
  }
}