import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage)
    },
    {
        path: 'home',
        loadComponent: () => import('./features/daisyui-page/daisyui-page').then(m => m.DaisyuiPage)
    },
    {
        path: 'estilos',
        loadComponent: () => import('./features/estilos-page/estilos-page').then(m => m.EstilosPage)
    },
    {
        path: 'simpsons',
        loadComponent: () => import('./features/simpsons/page/Simpsons-Page').then(m => m.SimpsonsPageComponent) },
    {
        path: '**',
        redirectTo: 'login'
    }
];
