import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RubbishRoutingModule } from './rubbish-routing.module';
import { RubbishComponent } from './rubbish.component';

@NgModule({
  imports: [
    SharedModule,
    RubbishRoutingModule
  ],
  declarations: [RubbishComponent]
})
export class RubbishModule { }
