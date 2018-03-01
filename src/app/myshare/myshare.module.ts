import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyShareComponent } from './my-share/my-share.component';
import { SharedModule } from '../shared/shared.module';
import { MyShareRoutingModule } from './myshare-routing.module';

@NgModule({
  imports: [
    SharedModule,
    MyShareRoutingModule,
  ],
  declarations: [MyShareComponent]
})
export class MyshareModule { }
