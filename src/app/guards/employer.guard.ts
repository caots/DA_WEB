import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { 
  USER_TYPE, 
  SETINGS_STEP 
} from 'src/app/constants/config';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class EmployerGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLogin()) {
      const user = this.authService.getUser();
      if (user && user.role == USER_TYPE.EMPLOYER) {
        if (user.signUpStep == SETINGS_STEP.COMPLETE || state.url.indexOf('employer-settings') >= 0) {
          return true;
        } else {
          if(state['_root']?.value?.queryParams) this.router.navigate(['/employer-settings'], { queryParams: state['_root'].value.queryParams });
          else this.router.navigate(['/employer-settings']);
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
