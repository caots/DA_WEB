import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import {
  USER_TYPE,
  SETINGS_STEP
} from 'src/app/constants/config';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class JobSeekerGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLogin()) {
      const user = this.authService.getUser();
      if (user && user.role == USER_TYPE.JOB_SEEKER) {
        if (user.signUpStep == SETINGS_STEP.COMPLETE || state.url == '/job-seeker-settings') {
          return true;
        } else {
          this.router.navigate(['/job-seeker-settings']);
          return false;
        }
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
