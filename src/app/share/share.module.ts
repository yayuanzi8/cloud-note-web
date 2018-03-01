import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { SharedModule } from '../shared/shared.module';
import { ShareRoutingModule } from './share-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ShareRoutingModule
  ],
  declarations: [ShareComponent]
})
export class ShareModule { }
