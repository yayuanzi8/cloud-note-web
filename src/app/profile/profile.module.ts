import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyImageCropperModule } from '../image-cropper/image-cropper.module';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    MyImageCropperModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
