import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    // canActivate: [IsGuestGuard],
    loadChildren: () => import('src/app/pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    // canActivate: [IsGuestGuard],
    loadChildren: () => import('src/app/pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'signup',
    // canActivate: [IsGuestGuard],
    loadChildren: () => import('src/app/pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('src/app/pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('src/app/pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'change-email',
    loadChildren: () => import('src/app/pages/change-email-verification/change-email-verification.module').then(m => m.ChangeEmailVerificationModule)
  },
  {
    path: 'verification-email',
      loadChildren: () => import('src/app/pages/email-verification/email-verification.module').then(m => m.EmailVerificationModule)
  },
  {
    path: 'complete-forgot-password',
    loadChildren: () => import('src/app/pages/complete-forgot-password/complete-forgot-password.module').then(m => m.CompleteForgotPasswordModule)
  },
  {
    path: 'active-account',
    loadChildren: () => import('src/app/pages/active-account/active-account.module').then(m => m.ActiveAccountModule)
  },
  {
    path: '',
    loadChildren: () => import('src/app/layouts/main/main.module').then(m => m.MainModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
