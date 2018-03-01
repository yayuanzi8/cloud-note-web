import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-note-dialog',
  templateUrl: './new-note-dialog.component.html',
  styleUrls: ['./new-note-dialog.component.css']
})
export class NewNoteDialogComponent implements OnInit {

  options: FormGroup;
  titleInfo = new FormControl('', [Validators.required]);
  title = '';
  processingSubmit = false;

  private parent = 'root';
  private headers;

  constructor(fb: FormBuilder, private http: Http, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject('auth') private authService) { 
      this.authService.getAuth().subscribe(auth => {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + auth.token);
      });
      this.options = fb.group({
        hideRequired: false,
        floatLabel: 'auto',
      });
      this.parent = data.parent;
    }

  ngOnInit() {
  }

  getTitleErrorMessage(): string {
    if (this.titleInfo.hasError('required')) {
        return '笔记标题必须填写';
    }
  }

  cancel(): void {
    this.dialogRef.close({
      success: false,
    });
  }

  private showHint(msg): void {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  createNewNote(): void {
    if (this.title === '' || this.parent == null) {
      return;
    }
    this.processingSubmit = true;
    const request = {
      parent: this.parent,
      title: this.title
    };
    let createdNote = null;
    this.http.post('http://localhost:8080/note/newNote', JSON.stringify(request), {headers: this.headers})
    .subscribe(res => {
      if (res.json().code === 20000) {
        createdNote = res.json().note;
        this.dialogRef.close({
          success: true,
          data: createdNote
        });
      }else {
        this.showHint(res.json().msg);
      }
      this.processingSubmit = false;
    });
  }

}
