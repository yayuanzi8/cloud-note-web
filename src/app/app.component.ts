import { Component, Inject, OnInit } from '@angular/core';
import { Auth, User } from './domain/entities';
import { Router } from '@angular/router';

// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user = null;
  title = '云笔记系统';
  constructor(@Inject('auth') private service, private router: Router) {
  }
  ngOnInit() {
    this.service.loginUserInfo().subscribe((user: User) => {
      this.user = Object.assign({}, user);
    });
  }
  login() {
    this.router.navigate(['login']);
  }
  logout() {
    this.service.unAuth();
    this.user = null;
    this.router.navigate(['login']);
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
