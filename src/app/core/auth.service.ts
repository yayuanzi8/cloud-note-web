import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { ReplaySubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Auth, User } from '../domain/entities';

@Injectable()
export class AuthService {

  defaultAuth:Auth = {hasError:true,redirectUrl:'',errMsg:'not logged in',token:'',expDuration:604800000};
  auth:Auth = Object.assign({},this.defaultAuth);

  apiUrl:string = "http://localhost:8080/";
  private headers = new Headers({'Content-Type': 'application/json'});
  subject: ReplaySubject<Auth> = new ReplaySubject<Auth>(1);

  constructor(private http: Http) {
    let auth:Auth = JSON.parse(localStorage.getItem("auth"));
    if (auth!=null){
      this.auth = Object.assign({},auth);
    }
    this.subject.next(this.auth);
  }

  private existFlag():boolean{
    let expDuration:number = parseInt(localStorage.getItem("lastLoginTime"),10);
    let auth:Auth = JSON.parse(localStorage.getItem("auth"));
    if (expDuration == null || auth == null ){
      return false;
    }
    return true;
  }

  getToken():string{
    return this.auth.token;
  }

  getAuth(): Observable<Auth> {
    if (!this.existFlag()){
      this.auth = Object.assign({},this.defaultAuth);
      this.auth.errMsg = "暂未登录";
    }else{
      let lastLoginTime:number = parseInt(localStorage.getItem("lastLoginTime"),10);
      if (Date.now() - lastLoginTime > this.auth.expDuration){
        this.auth = Object.assign({},this.defaultAuth);
        this.auth.errMsg = "登录过期";
      }else{
        let auth:Auth = JSON.parse(localStorage.getItem("auth"));
        this.auth = Object.assign({},auth);
      }
    }
    this.subject.next(this.auth);
    return this.subject.asObservable();
  }

  unAuth(): void {
    this.auth = Object.assign(
      {}, this.defaultAuth);
    localStorage.setItem("auth",JSON.stringify(this.auth));
    localStorage.removeItem("lastLoginTime");
    this.subject.next(this.auth);
  }

  loginUserInfo(): Observable<User> {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Bearer ' + this.auth.token);
    return this.http.get('http://localhost:8080/user/loginUserInfo', {headers: headers}).map(res => {
      let user = null;
      if (res.json().code === 20000) {
        user = new User();
        user.uid = res.json().uid;
        user.username = res.json().username;
        user.registerTime = res.json().registerTime;
        user.email = res.json().email;
        user.portrait = res.json().portrait;
      }
      return user;
    });
  }

  private handleError(error: any): Observable<any>{
    console.log(JSON.stringify(error));
    return error;
  }

  login(username:string,password:string):Observable<Auth>{
    let request = {
      'username':username,
      'password':password
    };
    return this.http.post(this.apiUrl + "user/auth",JSON.stringify(request),{headers:this.headers})
    .map(res=>{
      let response = res.json(); // json()方法就可以获取数据了，不必使用json().data
      let auth = new Auth();
      if (response.code === 20000){
        auth.user = response.jwtUser;
        auth.user.portrait = auth.user.portrait;
        auth.errMsg = null;
        auth.hasError = false;
        auth.token = response.token;
        auth.expDuration = response.expDuration * 1000;
        localStorage.setItem("auth",JSON.stringify(auth));
        localStorage.setItem("lastLoginTime",Date.now()+"");
      }else{
        auth.user = null;
        auth.errMsg = response.msg;
        auth.hasError = true;
        auth.token = '';
      }
      this.auth = Object.assign({}, auth);
      this.subject.next(this.auth);
      return this.auth;
    }).catch(this.handleError);
  }

}
