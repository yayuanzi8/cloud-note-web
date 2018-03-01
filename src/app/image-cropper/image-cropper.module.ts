import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyImageCropperComponent } from './image-cropper.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    MyImageCropperComponent,
  ],
  declarations: [MyImageCropperComponent]
})
export class MyImageCropperModule { }
