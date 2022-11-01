import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { CAPTCHA_ACTION, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ms-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() isEmployer: boolean;
  @Input() isJobSeeker: boolean;
  isLoadingBtn: boolean;
  formRegister: FormGroup;
  USER_TYPE = USER_TYPE;
  disableButtonForm: boolean;
  defaultTypeValue: number;
  constructor(
    private ceoService: CeoService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private userService: UserService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this.defaultTypeValue = this.isJobSeeker ? USER_TYPE.JOB_SEEKER : USER_TYPE.EMPLOYER;
    this.initForm();
    
  }

  initForm() {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w\._-]+@[a-zA-Z0-9_.-]+?(\.[a-zA-Z0-9_.-]+)+$/)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      acc_type: ['', [Validators.required]]
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
      acc_type: this.formRegister.value.acc_type,
      first_name: this.formRegister.value.first_name,
      last_name: this.formRegister.value.last_name,
      'g-recaptcha-response': tokenCaptcha
    }
    this.userService.signupToReceiveUpdate(data).subscribe(res => {
      this.isLoadingBtn = false;
      this.disableButtonForm = true;
      this.helperService.showToastSuccess(MESSAGE.SEND_FORM_HOMEPAGE_SUCCESS);
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingBtn = false;
    })
  }
}
