import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteComponent } from './note.component';
import { AuthGuardService } from '../core/auth-guard.service';

const routes: Routes = [
  {
    path: 'note/:dest',
    component: NoteComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NoteRoutingModule { }