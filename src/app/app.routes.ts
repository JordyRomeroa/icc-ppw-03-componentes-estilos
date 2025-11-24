import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { SignalBox } from './features/signal-box/signal-box';
import { Drawer } from './features/daisyui-page/components/drawer/drawer';
import { DaisyuiPageComponent } from './features/daisyui-page/daisyui-page';
import { ProgressBar } from './features/progress-bar/progress-bar';

export const routes: Routes = [
  {
    path: '',
    component: DaisyuiPageComponent
  },
  {
    path: '',
    component: EstilosPage
  },
  {
    path: 'estilos',
    component: EstilosPage
  },
  {
    path:'',
    component: SignalBox
  }

];
