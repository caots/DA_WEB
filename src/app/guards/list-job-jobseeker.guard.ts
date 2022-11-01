import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { USER_TYPE } from '../constants/config';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListJobJobseekerGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ){}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLogin()) {
      const user = this.authService.getUser();
      if (user && user.role == USER_TYPE.EMPLOYER) {
        if(state.url == '/landing-employer') return true;
        this.router.navigate(['/landing-employer']);
        return false;
      }
    }
    return true;
  }
  
}
