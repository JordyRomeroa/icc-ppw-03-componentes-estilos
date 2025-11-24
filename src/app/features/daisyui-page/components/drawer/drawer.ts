import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer { }
