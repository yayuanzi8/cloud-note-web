import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private http: Http,
    private snackBar: MatSnackBar) { }

  private sid = null;

  note = null;

  private showHint(msg) {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private loadNote() {
    if (this.sid == null) {
      this.showHint('参数sid传递错误');
      return;
    }
    this.http.get('http://localhost:8080/note/share/' + this.sid, {}).subscribe(res => {
      if (res.json().code === 20000) {
        this.note = res.json().note;
        console.dir(this.note);
      }else {
        this.showHint(res.json().msg);
      }
    });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.sid = params['sid'];
    });
    this.loadNote();
  }

}
