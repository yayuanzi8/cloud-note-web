import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './core/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'note/root',
    canLoad: [AuthGuardService],
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'login',
  },
  {
    path: 'register',
    redirectTo: 'register',
  },
  {
    path: 'myshare',
    redirectTo: 'myshare'
  },
  {
    path: 'rubbish',
    redirectTo: 'rubbish'
  },
  {
    path: 'share',
    redirectTo: 'share',
    canLoad: [AuthGuardService],
  },
  {
    path: 'profile',
    redirectTo: 'profile',
    canLoad: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
