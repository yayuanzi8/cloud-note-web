import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { ShareComponent } from './share.component';

const routes: Routes = [
  {
    path: 'share/:sid',
    component: ShareComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ShareRoutingModule { }
