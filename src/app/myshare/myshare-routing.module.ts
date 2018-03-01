import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyShareComponent } from './my-share/my-share.component';
import { AuthGuardService } from '../core/auth-guard.service';

const routes: Routes = [
  {
    path: 'myshare',
    component: MyShareComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MyShareRoutingModule { }
