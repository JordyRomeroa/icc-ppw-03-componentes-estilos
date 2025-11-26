import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Drawer } from './components/drawer/drawer';

import { Card } from './components/card/card';
import { CardResponsive } from './components/card-responsive/card-responsive';
import { Footer } from './components/footer/footer';
import { Avatar } from './components/avatar/avatar';
import { Menu } from './components/menu/menu';
import { Table } from './components/table/table';

@Component({
  selector: 'app-daisyui-page',
  standalone: true,
  imports: [CommonModule,
    Avatar,
    Table,
    Card,
    CardResponsive,Menu,],
  templateUrl: './daisyui-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyuiPage{}