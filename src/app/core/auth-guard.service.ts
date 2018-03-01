import { Injectable, Inject } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Router,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }    from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuardService implements CanActivate,CanLoad {

  constructor(private router: Router,@Inject('auth') private authService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
    let url = state.url;
    return this.authService.getAuth().map(auth=>{
      if (auth.hasError){
        this.authService.auth.redirectUrl = url;
        this.router.navigate(['login']);
        return false;
      }
      return true;
    });
  }

  canLoad(route: Route): Observable<boolean> {
    return this.authService.getAuth().map(auth=>!auth.hasError);
  }

}
