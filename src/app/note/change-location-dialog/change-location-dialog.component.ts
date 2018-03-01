import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-change-location-dialog',
  templateUrl: './change-location-dialog.component.html',
  styleUrls: ['./change-location-dialog.component.css']
})
export class ChangeLocationDialogComponent implements OnInit{

  private headers;
  private location = 'root';
  list = null;
  loadSuccess = true;
  pageStack = [];

  constructor(private http: Http,
    public dialogRef: MatDialogRef<ChangeLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject('auth') private authService) {
      this.authService.getAuth().subscribe(auth => {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + auth.token);
      });
  }

  loadList(): void {
    this.http.get('http://localhost:8080/note/dirList/' + this.location, {headers: this.headers})
      .subscribe(res => {
        if (res.json().code === 20000) {
          this.list = res.json().fileSet;
          this.loadSuccess = true;
        }else {
          this.loadSuccess = false;
        }
    });
  }

  ngOnInit() {
    this.loadList();
  }

  loadFolder(did): void {
    this.pageStack.push(this.location);
    this.location = did;
    this.loadList();
  }

  goToPrevPage(): void {
    this.location = this.pageStack.pop();
    this.loadList();
  }

  confirm(): void {
    this.dialogRef.close({
      confirm: true,
      pageStack: [...this.pageStack, this.location],
    });
  }

}
