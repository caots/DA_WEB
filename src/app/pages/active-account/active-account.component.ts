import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ms-active-account',
  templateUrl: './active-account.component.html',
  styleUrls: ['./active-account.component.scss']
})

export class ActiveAccountComponent implements OnInit {
  title: string;
  message: string;
  isCallingApi: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let queryParamsUrl = this.activatedRoute.snapshot.queryParams;
      const tokenParam = queryParamsUrl.token;
      if (tokenParam) {
        this.authService.verifyEmail({
          token: tokenParam
        }).subscribe((res: any) => {
          this.isCallingApi = false;
          this.title = 'This email has been successfully verified.';
          this.message = '';
        }, resError => {
          this.isCallingApi = false;
          this.title = 'This email has already been verified.';
          this.message = '';
        })
      }
    })
   }

  ngOnInit(): void {
  }

  goToLoginPage() {
    this.router.navigate(['/login'])
  }
}
