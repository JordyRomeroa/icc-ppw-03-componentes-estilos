import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Signal que guarda el tema actual
  theme = signal(localStorage.getItem('theme') || 'light');

  constructor() {
    // Aplica el tema guardado al cargar la app
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  setTheme(themeName: string) {
    this.theme.set(themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  }
}