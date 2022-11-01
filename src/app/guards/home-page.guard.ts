import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  USER_TYPE,
  SETINGS_STEP,
  REDIRECT_URL
} from 'src/app/constants/config';

@Injectable({
  providedIn: 'root'
})
export class HomePageGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //other url
      if(REDIRECT_URL.EMPLOYER.includes(state.url)){
        this.router.navigate(['/landing-employer']);
        return false;
      }
      if(REDIRECT_URL.JOBSEEKER.includes(state.url)){
        this.router.navigate(['/landing-jobseeker']);
        return false;
      }
      //===========
      if (this.authService.isLogin()) {
        const user = this.authService.getUser();
        if (user && user.role == USER_TYPE.EMPLOYER) {
          if(state.url == '/landing-employer') return true;
          this.router.navigate(['/landing-employer']);
          return false;
        }
        if (user && user.role == USER_TYPE.JOB_SEEKER) {
          if(state.url == '/landing-jobseeker') return true;
          this.router.navigate(['/landing-jobseeker']);
          return false;
        }
      }else{
        if(state.url == '/home'){
          this.router.navigate(['/landing-jobseeker']);
          return false;
        }
      }
      return true;
  }
  
}
