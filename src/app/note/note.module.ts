import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NoteRoutingModule } from './note-routing.module';
import { FileUploadModule } from 'ng2-file-upload';

import { NoteComponent } from './note.component';
import { NewDirDialogComponent } from './new-dir-dialog/new-dir-dialog.component';
import { NewNoteDialogComponent } from './new-note-dialog/new-note-dialog.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { NoteListComponent } from './note-list/note-list.component';
import { ChangeLocationDialogComponent } from './change-location-dialog/change-location-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    NoteRoutingModule,
    FileUploadModule,
  ],
  declarations: [NoteComponent, NewDirDialogComponent,
    NewNoteDialogComponent, NoteEditorComponent, NoteListComponent,
    ChangeLocationDialogComponent, ConfirmDialogComponent]
})
export class NoteModule { }
