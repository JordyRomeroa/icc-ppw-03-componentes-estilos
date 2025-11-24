import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Drawer } from './components/drawer/drawer';
import { Table } from "./components/table/table";
import { Card } from "./components/card/card";
import { CardResponsive } from "./components/card-responsive/card-responsive";
import { Avatar } from "./components/avatar/avatar";
import { Footer } from "./components/footer/footer";
import { Code } from "./components/code/code";


@Component({
  selector: 'app-daisyui-page',
  standalone: true,
  imports: [CommonModule, Drawer, Table, Card, CardResponsive, Avatar, Footer, Code],
  templateUrl: './daisyui-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyuiPageComponent {}
