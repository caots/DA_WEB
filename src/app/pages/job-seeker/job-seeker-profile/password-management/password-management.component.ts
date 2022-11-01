import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'ms-password-management',
  templateUrl: './password-management.component.html',
  styleUrls: ['./password-management.component.scss']
})
export class PasswordManagementComponent implements OnInit {
  changePasswordForm: FormGroup;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z0-9$@$#!%*?&].{6,}')]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [
        this.matchingPasswords('newPassword', 'confirmPassword'),
      ]
    })
  }

  markFormGroupTouched(formGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
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

  submit(form) {
    this.isSubmitted = true;
    this.markFormGroupTouched(this.changePasswordForm);
    if (this.changePasswordForm.invalid) {
      return;
    }
    const data = {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    }

    this.isLoading = true;
    this.userService.changePassword(data).subscribe((res: any) => {
      this.isLoading = false;
      this.isSubmitted = false;
      this.helperService.showToastSuccess(MESSAGE.CONGRATULATION);
      this.cancelChangePassword();
    }, errorRes => {
      this.isLoading = false;
      this.isSubmitted = false;
      this.helperService.showToastError(errorRes);
    })
  }

  cancelChangePassword() {
    let oldPass: any = document.getElementById('oldPassword'); oldPass.value = '';
    let newPassword: any = document.getElementById('newPassword'); newPassword.value = '';
    let confirmPassword: any = document.getElementById('confirmPassword'); confirmPassword.value = '';
    this.changePasswordForm.get('oldPassword').setValue(null);
    this.changePasswordForm.get('newPassword').setValue(null);
    this.changePasswordForm.get('confirmPassword').setValue(null);
  }

  checkFillValue(){
    if(
      !this.changePasswordForm.get('oldPassword').value || this.changePasswordForm.get('oldPassword').value === '' ||
      !this.changePasswordForm.get('newPassword').value || this.changePasswordForm.get('newPassword').value === '' ||
      !this.changePasswordForm.get('confirmPassword').value || this.changePasswordForm.get('confirmPassword').value === ''
    ){
      return true;
    }
    return false;
  }

}
