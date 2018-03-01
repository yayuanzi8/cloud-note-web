import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { MyImageCropperModule } from '../image-cropper/image-cropper.module';

@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule,
    MyImageCropperModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
