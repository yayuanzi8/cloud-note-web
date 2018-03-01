import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MatTableDataSource, MatSort, Sort, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-my-share',
  templateUrl: './my-share.component.html',
  styleUrls: ['./my-share.component.css']
})
export class MyShareComponent implements OnInit, AfterViewInit {

  ELEMENT_DATA = [];

  displayedColumns = ['position', 'title', 'shareDate', 'operation'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  functions = [
    {link: '/note/root', icon: 'folder', name: '我的文件'},
    {link: '/myshare', icon: 'share', name: '我的分享'},
    {link: '/rubbish', icon: 'delete_sweep', name: '回收站'}
  ];

  shareList = [];

  private headers;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private http: Http, @Inject('auth') private authService, public snackBar: MatSnackBar) {
    this.authService.getAuth().subscribe(auth => {
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Authorization', 'Bearer ' + auth.token);
    });
  }

  private showHint(msg) {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private refreshShare() {
    this.ELEMENT_DATA = [];
    this.shareList.forEach((note, index) => {
      const temp = {
        position: index + 1,
        sid: note.sid,
        title: note.title,
        shareDate: note.shareDate,
        operation: '取消分享'
      };
      this.ELEMENT_DATA.push(temp);
    });
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  private loadMyShare(): void {
    this.http.get('http://localhost:8080/note/myShare', {headers: this.headers}).subscribe(res => {
      if (res.json().code === 20000) {
        this.shareList = res.json().shareList;
        this.refreshShare();
      }
    });
  }

  ngOnInit() {
    this.loadMyShare();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  cancelShare(sid) {
    this.http.patch('http://localhost:8080/note/cancelShare', JSON.stringify({
      sid: sid
    }), {headers: this.headers}).subscribe(res => {
      let index = -1;
      if (res.json().code === 20000) {
        this.shareList.forEach((note, i) => {
          if (note.sid === sid) {
            index = i;
          }
        });
        this.shareList = [...this.shareList.slice(0, index), ...this.shareList.slice(index + 1)];
        this.refreshShare();
        this.showHint('取消成功');
      }else {
        this.showHint('取消失败！请重试！');
      }
    });
  }

}
