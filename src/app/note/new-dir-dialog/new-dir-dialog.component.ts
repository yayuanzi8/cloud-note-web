import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup,FormControl,Validators} from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-dir-dialog',
  templateUrl: './new-dir-dialog.component.html',
  styleUrls: ['./new-dir-dialog.component.css']
})
export class NewDirDialogComponent implements OnInit {

  options: FormGroup;
  dirNameInfo = new FormControl('', [Validators.required]);
  dir_name = '';
  processingSubmit = false;

  private parent = null;
  private auth;
  private headers;

  constructor(fb: FormBuilder, private http: Http,
    public dialogRef: MatDialogRef<NewDirDialogComponent>, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject('auth') private authService) {
      this.authService.getAuth().subscribe(auth => {
        this.auth = Object.assign({}, auth);
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + this.auth.token);
      });
      this.options = fb.group({
        hideRequired: false,
        floatLabel: 'auto',
      });
      this.parent = data;
    }

  ngOnInit() {
  }

  getDirNameErrorMessage(): string {
    if (this.dirNameInfo.hasError('required')) {
        return '文件夹名称必须填写';
    }
  }

  private showHint(msg): void {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  cancel(): void {
    this.dialogRef.close({
      success: false,
    });
  }

  createNewDir(): void {
    if (this.dir_name === '' || this.parent == null){
      return;
    }
    this.processingSubmit = true;
    const request = {
      parent: this.parent.parent,
      dir: this.dir_name
    };
    let createdDir = null;
    this.http.post('http://localhost:8080/note/newDir', JSON.stringify(request), {headers: this.headers})
    .subscribe(res => {
      if (res.json().code === 20000) {
        createdDir = res.json().dir;
        this.dialogRef.close({
          success: true,
          data: createdDir
        });
      }else {
        this.showHint(res.json().msg);
      }
    });
  }

}
