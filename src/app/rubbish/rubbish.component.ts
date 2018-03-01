import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-rubbish',
  templateUrl: './rubbish.component.html',
  styleUrls: ['./rubbish.component.css']
})
export class RubbishComponent implements OnInit {

  private headers;

  rubbishes = [];

  constructor(private http: Http, @Inject('auth') private authService, public snackBar: MatSnackBar) {
    this.authService.getAuth().subscribe(auth => {
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Authorization', 'Bearer ' + auth.token);
    });
  }

  functions = [
    {link: '/note/root', icon: 'folder', name: '我的文件'},
    {link: '/myshare', icon: 'share', name: '我的分享'},
    {link: '/rubbish', icon: 'delete_sweep', name: '回收站'}
  ];

  private showHint(msg) {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private loadRubbish() {
    this.http.get('http://localhost:8080/note/myRubbish', {headers: this.headers}).subscribe(res => {
      if (res.json().code === 20000) {
        this.rubbishes = res.json().rubbishes;
      }
    });
  }

  ngOnInit() {
    this.loadRubbish();
  }

  recover(rubbish) {
    this.http.post('http://localhost:8080/note/recover',
    JSON.stringify({rid: rubbish.rid}),
      {headers: this.headers}).subscribe(res => {
        if (res.json().code === 20000) {
          const index = this.rubbishes.indexOf(rubbish);
          this.rubbishes = [...this.rubbishes.slice(0, index), ...this.rubbishes.slice(index + 1)];
          this.showHint('恢复成功');
        }else {
          this.showHint(res.json().msg);
        }
    });
  }

}
