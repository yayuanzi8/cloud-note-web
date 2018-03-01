import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { User } from '../domain/entities';

@Injectable()
export class UserService {

  private api_url = "http://localhost:8080/user";

  constructor(private http:Http) { }

  findUser(id:number){
    const url = `${this.api_url}/loginUserInfo`;
    return this.http.get(url).map(res=>res.json() as User);
  }

}
