import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';

import { Auth, User } from '../domain/entities';
import { MatSnackBar } from '@angular/material';
import { CropResult } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = null;

  oldPsw = new FormControl('', Validators.required);
  newPsw = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.email]);
  emailCode = new FormControl('', [Validators.required]);

  headers: Headers;

  sending = false;

  private cropResult: CropResult;

  constructor(@Inject('auth') private authService, private http: Http, private snackBar: MatSnackBar) {
    this.headers = new Headers();
    this.headers.set('Content-Type', 'application/json');
    this.authService.getAuth().subscribe((auth: Auth) => {
      this.headers.set('Authorization', 'Bearer ' + auth.token);
    });
    this.authService.loginUserInfo().subscribe((user: User) => {
      this.user = Object.assign({}, user);
    });
  }

  ngOnInit() {}

  private showHint(msg) {
    this.snackBar.open(msg, '关闭', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  imageSelected(value) {
    this.cropResult = Object.assign({}, value);
  }

  sendEmail() {
    const error = this.email.hasError('email');
    if (!error) {
      const email = this.email.value;
      this.http.post('http://localhost:8080/user/sendRegisterEmail', {email: email},
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
  }

  changePsw() {
    if (this.oldPsw.valid && this.newPsw.valid) {
      const oldPsw = this.oldPsw.value;
      const newPsw = this.newPsw.value;
      this.http.patch('http://localhost:8080/user/changePsw', JSON.stringify({
        oldpsw: oldPsw,
        newpsw: newPsw
      }), {headers: this.headers}).subscribe(res => {
        if (res.json().code === 20000) {
          this.showHint('密码修改成功！');
        }else {
          this.showHint(res.json().msg);
        }
      });
    }
  }

  changeEmail() {
    if (this.email.valid && this.emailCode.valid) {
      const email = this.email.value;
      const emailCode = this.emailCode.value;
      this.http.patch('http://localhost:8080/user/changeEmail', JSON.stringify({
        newemail: email,
        code: emailCode
      }), {headers: this.headers}).subscribe(res => {
        if (res.json().code === 20000) {
          this.showHint('邮箱修改成功！');
        }else {
          this.showHint(res.json().msg);
        }
      });
    }
  }

  private realChangePortrait(url: string) {
    this.http.patch('http://localhost:8080/user/changePortrait', JSON.stringify({
      portrait: url
    }), {headers: this.headers}).subscribe(res => {
      if (res.json().code === 20000) {
        this.showHint('头像更换成功');
      }else {
        this.showHint(res.json().msg);
      }
    });
  }

  changePortrait() {
    if (this.cropResult.hasCrop) {
      const portrait_form = new FormData();
      portrait_form.set('file', this.cropResult.blob);
      this.http.post('http://localhost:8080/tps/upload', portrait_form).subscribe(res => {
        if (res.json().code === 20000) {
          this.realChangePortrait(res.json().url);
        }else {
          this.showHint(res.json().msg);
        }
      });
    }else {
      this.showHint('头像未更换');
    }
  }
}
