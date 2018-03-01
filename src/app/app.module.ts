import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ElementRef } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app.routing.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { NoteModule } from './note/note.module';
import { SharedModule } from './shared/shared.module';
import { NewDirDialogComponent } from './note/new-dir-dialog/new-dir-dialog.component';
import { NewNoteDialogComponent } from './note/new-note-dialog/new-note-dialog.component';
import { ConfirmDialogComponent } from './note/confirm-dialog/confirm-dialog.component';
import { ShareModule } from './share/share.module';
import { ChangeLocationDialogComponent } from './note/change-location-dialog/change-location-dialog.component';
import { MyshareModule } from './myshare/myshare.module';
import { RubbishModule } from './rubbish/rubbish.module';
import { ProfileModule } from './profile/profile.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    LoginModule,
    RegisterModule,
    NoteModule,
    ShareModule,
    MyshareModule,
    RubbishModule,
    ProfileModule,
  ],
  providers: [],
  entryComponents: [NewDirDialogComponent, NewNoteDialogComponent, ConfirmDialogComponent, ChangeLocationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
