import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Drawer } from "../drawer/drawer";

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar { }
