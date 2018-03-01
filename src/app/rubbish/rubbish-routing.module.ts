import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RubbishComponent } from './rubbish.component';
import { AuthGuardService } from '../core/auth-guard.service';

const routes: Routes = [
  {
    path: 'rubbish',
    component: RubbishComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RubbishRoutingModule { }
