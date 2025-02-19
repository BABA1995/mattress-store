import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.page').then( m => m.SignupPage)
  },
  { path: 'customer-home', 
    loadComponent: () => import('./pages/customer-home/customer-home.page').then(m => m.CustomerHomePage), canActivate: [AuthGuard] },
  { path: 'shop-dashboard', 
    loadComponent: () => import('./pages/shop-dashboard/shop-dashboard.page').then(m => m.ShopDashboardPage), canActivate: [AuthGuard] }
];
