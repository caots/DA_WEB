import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'ms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [FormBuilder]
})

export class ResetPasswordComponent implements OnInit {
  public formResetPassword: FormGroup;
  public tokenParam: string;
  public errorMessage: string;
  public isCallingApi: boolean = false;
  public title: string = "Reset Password";
  public typeParam: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService
  ) {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let queryParamsUrl = this.activatedRoute.snapshot.queryParams;
      this.tokenParam = queryParamsUrl.token;
      this.typeParam = queryParamsUrl.type;
    })
  }

  ngOnInit(): void {
    this.initForm();
    if (this.typeParam) {
      this.title = "Set Up password";
    }
  }

  initForm() {
    this.formResetPassword = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z0-9$@$#!%*?&].{6,}')
    ]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: [
        this.matchingPasswords('password', 'confirmPassword'),
      ]
    })
  }

  matchingPasswords(passwordkey: string, confirmPasswordkey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordkey];
      const confirmPassword = group.controls[confirmPasswordkey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        }
      }
    }
  }

  change(form) {
    this.helperService.markFormGroupTouched(this.formResetPassword);
    if (this.formResetPassword.invalid) {
      return;
    }
    this.isCallingApi = true;
    this.authService.resetPassword({
      'token': this.tokenParam,
      'password': form.password
    }).subscribe((res: any) => {
      this.isCallingApi = false;
      if (this.typeParam) {
        this.helperService.showToastSuccess(MESSAGE.SET_UP_PASSWORD_SUCCESS);
      } else {
        this.helperService.showToastSuccess(MESSAGE.RESET_PASSWORD_SUCCESSFULY);
      }
      setTimeout(() => {
        this.router.navigate(['/login'])
    }, 1000)
    }, resError => {
      this.isCallingApi = false;
      this.errorMessage = resError;
    })
  }
}