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
    loadComponent: () => import('./pages/shop-dashboard/shop-dashboard.page').then(m => m.ShopDashboardPage), canActivate: [AuthGuard] },
  { path: 'shop-owner/tabs', loadComponent: () => import('./pages/shop-owner/tabs/tabs.page').then(m => m.TabsPage) },
  {
    path: 'shop-owner/tabs',
    component: undefined, // Placeholder, actual component is loaded dynamically
    children: [
      { path: 'orders', loadComponent: () => import('./pages/shop-owner/orders/orders.page').then(m => m.OrdersPage) },
      { path: 'products', loadComponent: () => import('./pages/shop-owner/products/products.page').then(m => m.ProductsPage) },
      { path: 'profile', loadComponent: () => import('./pages/shop-owner/profile/profile.page').then(m => m.ProfilePage) },
      { path: 'settings', loadComponent: () => import('./pages/shop-owner/settings/settings.page').then(m => m.SettingsPage) },
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
    ]
  },
  {
    path: 'add-product',
    loadComponent: () => import('./pages/products/add-product/add-product.page').then(m => m.AddProductPage)
  },
  {
    path: 'create-shop',
    loadComponent: () => import('./pages/shop/create-shop/create-shop.page').then(m => m.CreateShopPage)
  },
  {
    path: 'add-product',
    loadComponent: () => import('./pages/products/add-product/add-product.page').then( m => m.AddProductPage)
  },
  {
    path: 'create-shop',
    loadComponent: () => import('./pages/shop/create-shop/create-shop.page').then( m => m.CreateShopPage)
  },
  {
    path: 'select-location',
    loadComponent: () => import('./pages/select-location/select-location.page').then( m => m.SelectLocationPage)
  },
  
];
