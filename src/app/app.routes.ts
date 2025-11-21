import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { SignalBox } from './features/signal-box/signal-box';
import { ProgressBar } from './features/progress-bar/progress-bar';

export const routes: Routes = [

  {
    path:'',
    component: EstilosPage
  },
  {
path: '',
  loadComponent: () => import('./features/estilos-page/estilos-page').then(
    (m) => m.EstilosPage)
  },
  {
    path: '',
    component: SignalBox,
  },
  {
    path: '',
    component: ProgressBar,
  }

];
