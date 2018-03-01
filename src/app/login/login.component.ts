import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Auth } from '../domain/entities';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  options: FormGroup;
  value = '清空';
  username = '';
  password= '';
  usernameInfo = new FormControl('', [Validators.required]);
  passwordInfo = new FormControl('', [Validators.required]);
  processingLogin = false;
  loginError = null;

  auth: Auth;

  constructor(fb: FormBuilder, @Inject('auth') private authService, private router:Router) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }

  getUsernameErrorMessage() {
      if (this.usernameInfo.hasError('required')) {
        return '用户名必须填写';
      }
  }

  getPasswordErrorMessage() {
    if (this.passwordInfo.hasError('required')) {
      return '密码必须填写';
    }
    return '';
  }

  login() {
    this.processingLogin = true;
    this.authService.login(this.username, this.password).subscribe(auth => {
      this.auth = Object.assign({}, auth);
      if (!this.auth.hasError) {
        this.router.navigate(['note/root']);
      }else {
        this.loginError = this.auth.errMsg;
      }
      this.processingLogin = false;
    });
    this.processingLogin = false;
  }

}
