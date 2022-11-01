import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  USER_TYPE,
  CAPTCHA_ACTION,
  CEO_TAG_REGISTER_CONFIG,
  SETINGS_STEP,
  RegexParten,
  USER_STORY_ROUTER,
  ASSESSMENTS_TYPE
} from 'src/app/constants/config';
import { environment } from 'src/environments/environment';
import { PhoneNumberValidator } from 'src/app/directives/phone-number.validator';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { CeoService } from 'src/app/services/ceo.service'
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { MessageService } from 'src/app/services/message.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { PaymentService } from 'src/app/services/payment.service';
import { StorageService } from 'src/app/services/storage.service';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'ms-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [FormBuilder]
})

export class RegisterComponent implements OnInit {
  formRegister: FormGroup;
  captchaV3Code: string;
  errorMessage: string;
  isCallingApi: boolean = false;
  listUserType: object = USER_TYPE;
  currentUserType: number = undefined;
  emailPattern: string = RegexParten.Email;
  countryCode: number = 1;
  nameCountry: string = 'us';
  listPhoneCountry: Array<any> = environment.nationalPhone
  ref: string;
  CEO_TAG_REGISTER_CONFIG = CEO_TAG_REGISTER_CONFIG;
  isSubmitedRegister: boolean = false;
  fromUserStory: number;
  assessmentId: string = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private helperService: HelperService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private ceoService: CeoService,
    private messageService: MessageService,
    private subjectService: SubjectService,
    private previousRouteService: PreviousRouteService,
    private paymentService: PaymentService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.helperService.toggleCaptchaBadge(true);
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.ref = params.ref;
      if(params.fromUserStory){
        this.fromUserStory = params.fromUserStory;
        this.assessmentId = params.assessmentId || "";
        this.currentUserType = USER_TYPE.EMPLOYER;
      }
    });
    this.ceoService.changeMetaTag([{
      title: 'title',
      content: this.CEO_TAG_REGISTER_CONFIG.TITLE
    }, {
      title: 'description',
      content: this.CEO_TAG_REGISTER_CONFIG.DESCRIPTION
    }, {
      title: 'image',
      content: this.CEO_TAG_REGISTER_CONFIG.IMAGE
    }])
  }

  ngOnDestroy(): void {
    this.helperService.toggleCaptchaBadge(false);
  }

  initForm() {
    this.formRegister = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z0-9$@$#!%*?&].{6,}')
      ]],
      confirmPassword: ['', Validators.required],
      phone: ['', [PhoneNumberValidator(this.nameCountry)]],
      condition: [],
    }, {
      validator: [
        this.matchingPasswords('password', 'confirmPassword'),
      ]
    })
  }

  async register(form) {
    this.isSubmitedRegister = true;
    this.helperService.markFormGroupTouched(this.formRegister);
    if (this.formRegister.invalid || this.currentUserType == undefined) {
      return;
    }
    this.isCallingApi = true;
    await this.generateCaptchaV3();
    this.userService.checkExistedEmail({
      'email': form.email.toLowerCase(),
      'g-recaptcha-response': this.captchaV3Code
    }).subscribe(async res => {
      await this.generateCaptchaV3();
      this.authService.register(this.ref ? {
        'email': form.email.toLowerCase(),
        'password': form.password,
        'phone_number': form.phone,
        'acc_type': this.currentUserType,
        'region_code': this.nameCountry,
        'g-recaptcha-response': this.captchaV3Code,
        'ref': this.ref
      } : {
        'email': form.email.toLowerCase(),
        'password': form.password,
        'phone_number': form.phone,
        'acc_type': this.currentUserType,
        'region_code': this.nameCountry,
        'g-recaptcha-response': this.captchaV3Code
      }).subscribe((res: any) => {
        this.isCallingApi = false;
        // this.router.navigate(['/verification-email']);
        this.authService.saveToken(res.auth_info.access_token);
        const userInfo = res.user_info;
        this.subjectService.user.next({
          id: userInfo.id,
          email: userInfo.email.toLowerCase(),
          firstName: userInfo.first_name,
          lastName: userInfo.last_name,
          accountType: userInfo.acc_type,
          signUpStep: userInfo.sign_up_step,
          phone: userInfo.phone_number
        } as UserInfo);

        this.authService.saveUser({
          role: userInfo.acc_type,
          signUpStep: userInfo.sign_up_step
        })
        if (userInfo.converge_ssl_token) {
          this.paymentService.getCardInfo().subscribe();
        }
        if (userInfo.acc_type !== USER_TYPE.JOB_SEEKER) this.paymentService.getAllJobInCard().subscribe();
        this.redirect(userInfo);

      }, resError => {
        this.isCallingApi = false;
        this.errorMessage = resError;
        this.generateCaptchaV3();
      })
    }, resError => {
      this.errorMessage = resError;
      this.isCallingApi = false;
      this.generateCaptchaV3();
    })
  }

  selectUserType(type: number) {
    this.currentUserType = type;
  }

  countryChange(country: any) {
    this.countryCode = country.dialCode;
    this.nameCountry = country.iso2;
    const phoneControl = this.formRegister.get('phone');
    phoneControl.setValidators([PhoneNumberValidator(this.nameCountry)]);
    phoneControl.updateValueAndValidity();
  }

  redirect(user) {
    this.messageService.connectSocket(user);
    if (user.sign_up_step != SETINGS_STEP.COMPLETE) {
      if (user.acc_type == USER_TYPE.EMPLOYER) {
        this.router.navigateByUrl(`/employer-settings?fromUserStory=${this.fromUserStory || ''}&assessmentId=${this.assessmentId}`);
      } else {
        this.router.navigate(['/job-seeker-settings']);
      }
    } else {
      if (user.acc_type == USER_TYPE.EMPLOYER) {
        if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.FIND_CANDIDATE){
          this.router.navigate(['/find-candidates']);
        } else if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.PREVIEW_ASESSMENT){
          if(this.assessmentId) this.getPreviewAssessment(this.assessmentId);
          else this.router.navigate(['/employer-dashboard']);
        } else this.router.navigate(['/employer-dashboard']);
      } else {
        const previousRouter = this.previousRouteService.getPreviousUrl();
        if (previousRouter && previousRouter.includes('/job')) {
          this.router.navigateByUrl(previousRouter);
        } else {
          this.router.navigate(['/job']);
        }
      }
    }
  }

  getPreviewAssessment(assessmentId){
    const params = {
      id: assessmentId,
      type: ASSESSMENTS_TYPE.IMocha
    }
    this.assessmentService.getPreviewAssessmentEmployer(params).subscribe(url => {
      window.open(url, '_self');
    }, err => {
      this.helperService.showToastError(err);
    });
  }

  async generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    this.captchaV3Code = await this.recaptchaV3Service.execute(CAPTCHA_ACTION.REGISTER).toPromise();
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

  backToHome() {
    this.router.navigate(['/landing-jobseeker'])
  }
}
