import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { MatSnackBar } from '@angular/material';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../domain/entities';
import { Router } from '@angular/router';
import { CropResult } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: FormGroup;

  private cropResult: CropResult;

  sending = false;

  processLogin = false;

  private headers: Headers;

  constructor(private builder: FormBuilder, private router: Router, private http: Http, public snackBar: MatSnackBar) {
    this.headers = new Headers();
    this.headers.set('Content-Type', 'application/json');
  }

  ngOnInit() {
    this.user = this.builder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      emailCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  private showHint(msg) {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private register(portraitUrl) {
    const register_request = {
      username: this.user.value.username,
      password: this.user.value.password,
      email: this.user.value.email,
      code: this.user.value.emailCode,
      portrait: portraitUrl
    };
    this.http.post('http://localhost:8080/user/auth/register', JSON.stringify(register_request), {headers: this.headers}).subscribe(res => {
        if (res.json().code === 20000) {
          this.showHint('注册成功!2秒后跳转到登录页面');
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }else {
          this.showHint(res.json().msg);
        }
        this.processLogin = false;
      }, err => {
        console.dir(err);
        this.processLogin = false;
      });
  }

  onSubmit() {
    if (this.user.valid) {
      if (!this.cropResult.hasCrop) {
        this.showHint('请选择头像');
        return;
      }
      const portrait_form = new FormData();
      portrait_form.set('file', this.cropResult.blob);
      this.processLogin = true;
      this.http.post('http://localhost:8080/tps/upload', portrait_form).subscribe(res => {
        if (res.json().code === 20000) {
          this.register(res.json().url);
        }else {
          this.showHint(res.json().msg);
          this.processLogin = false;
        }
      }, err => {
        this.processLogin = false;
      });
    }
  }


  sendEmail() {
    const emailFormControl = this.user.get('email');
    if (emailFormControl.hasError('required') || emailFormControl.hasError('email')) {
      return;
    }
    this.http.post('http://localhost:8080/user/sendRegisterEmail', {email: this.user.value.email},
        {headers: this.headers}).subscribe(res => {
          if (res.json().code === 20000) {
            this.sending = true;
            this.showHint('已发送到' + this.user.value.email);
            setTimeout(() => {
              this.sending = false;
            }, 30000);
          }else {
            this.showHint(res.json().msg);
          }
        }, err => {
          this.showHint(err);
        });
  }

  imageSelected(value) {
    this.cropResult = Object.assign({}, value);
  }

}
