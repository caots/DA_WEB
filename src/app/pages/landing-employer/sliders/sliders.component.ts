import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { CAPTCHA_ACTION, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { environment } from 'src/environments/environment';
import { CeoService } from 'src/app/services/ceo.service';
@Component({
  selector: 'ms-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})

export class SlidersComponent implements OnInit {
  @Input() userInfo: UserInfo;
  isLoadingBtn: boolean;
  formRegister: FormGroup;
  USER_TYPE = USER_TYPE;
  disableButtonForm: boolean;
  API_S3 = environment.api_s3;
  constructor(
    private ceoService: CeoService,
    private router: Router,
    private fb: FormBuilder,
    private helperService: HelperService,
    private userService: UserService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  goToLogin() {
    this.router.navigate(['/register']);
  }

  initForm() {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return '';
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.LOGIN).toPromise();
  }

  async submitForm() {
    this.helperService.markFormGroupTouched(this.formRegister);
    if (this.formRegister.invalid || this.disableButtonForm) {
      return;
    }
    const tokenCaptcha = await this.generateCaptchaV3();
    this.isLoadingBtn = true;
    const data = {
      email: this.formRegister.value.email,
      acc_type: USER_TYPE.EMPLOYER,
      'g-recaptcha-response': tokenCaptcha
    }
    this.userService.signupToReceiveUpdate(data).subscribe(data => {
      this.isLoadingBtn = false;
      this.disableButtonForm = true;
      this.helperService.showToastSuccess(MESSAGE.SEND_FORM_HOMEPAGE_SUCCESS);
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingBtn = false;
    })
  }

}
