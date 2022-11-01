import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'ms-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [FormBuilder]
})

export class ForgotPasswordComponent implements OnInit {
  public formForgotPassword: FormGroup;
  public isCallingApi: boolean = false;
  public errorMessage: string;
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private helperService: HelperService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  backToHome() {
    this.router.navigate(['/home'])
  }

  initForm() {
    this.formForgotPassword = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
    })
  }

  confirm(form) {
    this.helperService.markFormGroupTouched(this.formForgotPassword);
    if (this.formForgotPassword.invalid) {
      return;
    }
    this.isCallingApi = true;
    this.authService.forgotPassword({
      'email': form.email
    }).subscribe((res: any) => {
      this.isCallingApi = false;
      this.router.navigate(['/complete-forgot-password'])
    }, resError => {
      this.isCallingApi = false;
      this.errorMessage = resError;
    })
  }
}
