import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenGuard } from './guards/authen.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full'},
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'tabs', canActivate: [AuthenGuard], loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  // { path: 'details', loadChildren: './pages/modals/bundle-details/bundle-details.module#BundleDetailsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}


// {
//   path: 'login',
//   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
// }