import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ms-change-email-verification',
  templateUrl: './change-email-verification.component.html',
  styleUrls: ['./change-email-verification.component.scss']
})
export class ChangeEmailVerificationComponent implements OnInit {
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
        this.authService.verifyChangeEmail({
          token: tokenParam
        }).subscribe((res: any) => {
          this.isCallingApi = false;
          this.title = 'Complete';
          this.message = 'Congratulations! This email has already been registered.';
        }, resError => {
          this.isCallingApi = false;
          this.title = 'Error';
          this.message = resError;
        })
      }
    })
  }

  ngOnInit(): void {
    
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }

}
