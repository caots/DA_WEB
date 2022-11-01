import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { USER_TYPE, SETINGS_STEP } from '../constants/config';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsGuestGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url == '/signup') {
      this.router.navigate(['/register']);
      return false;
    }
    if (this.authService.isLogin()) {
      const user = this.authService.getUser();
      if (user && user.role == USER_TYPE.EMPLOYER) {
        this.router.navigate(['/landing-employer']);
      }
      if (user && user.role == USER_TYPE.JOB_SEEKER) {
        this.router.navigate(['/landing-jobseeker']);
      }
      return false;
    }
    return true;
  }

}
