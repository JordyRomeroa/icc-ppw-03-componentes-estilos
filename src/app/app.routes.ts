import { Routes } from '@angular/router';
import { EstilosPage } from './features/estilos-page/estilos-page';
import { SignalBox } from './features/signal-box/signal-box';
import { DaisyuiPage } from './features/daisyui-page/daisyui-page';
import { Drawer } from './features/daisyui-page/components/drawer/drawer';

import { SimpsonDetailPageComponent } from './features/simpson-detail-page/simpson-detail-page';
import { SimpsonsPageComponent } from './features/simpsons/page/Simpsons-Page';

export const routes: Routes = [
  {
    path: '',
    component: DaisyuiPage
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
  },
  {
  path: 'simpsons',
  component: SimpsonsPageComponent,
},
{
  path: 'simpsons/:id',
  component: SimpsonDetailPageComponent,
},



];