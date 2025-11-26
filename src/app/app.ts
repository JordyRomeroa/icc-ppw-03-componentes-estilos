import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./features/daisyui-page/components/footer/footer";
import { Drawer } from './features/daisyui-page/components/drawer/drawer';
import { BackToTop } from "./shared/components/back-to-top/back-to-top";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Drawer, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [],
})
export class App {
  protected readonly title = signal('03-ui-componentes-estilos');
  
}