import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../../shared/components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-drawer',
  imports: [RouterModule,RouterLinkActive,ThemeSwitcherComponent],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer { }