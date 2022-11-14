import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  USER_TYPE,
  SETINGS_STEP,
  CAPTCHA_ACTION,
  RegexParten,
  USER_STORY_ROUTER,
  ASSESSMENTS_TYPE
} from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';
import { PaymentService } from 'src/app/services/payment.service';
import { JobService } from 'src/app/services/job.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { CeoService } from 'src/app/services/ceo.service';
import { StorageService } from 'src/app/services/storage.service';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'ms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [FormBuilder]
})

export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  errorMessage: string;
  isCallingApi: boolean = false;
  emailPattern: string = RegexParten.Email;
  fromUserStory: number;
  urlJobDetailsWhenApply: string;
  assessmentId: string = "";
  constructor(
    private ceoService: CeoService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private jobService: JobService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private previousRouteService: PreviousRouteService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if(params.fromUserStory){
        this.fromUserStory = params.fromUserStory;
        this.assessmentId = params.assessmentId || "";
      }
    });
    this.subjectService.isShowModalApplyJobNoLogin.subscribe(data => {
      if (data && data?.url) {
        this.urlJobDetailsWhenApply = data.url;
      }
    })
    // this.generateCaptchaV3();
    this.helperService.toggleCaptchaBadge(true);
  }

  ngOnDestroy(): void {
    this.helperService.toggleCaptchaBadge(false);
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]],
      password: ['', [
        Validators.required,
        //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z\d$@$#!%*?&].{6,}')
      ]],
      rememberMe: [false]
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.LOGIN).toPromise();
  }

  async login(form) {
    const tokenCaptcha = await this.generateCaptchaV3();
    this.helperService.markFormGroupTouched(this.formLogin);
    if (this.formLogin.invalid) {
      return;
    }

    this.isCallingApi = true;
    this.authService.login({
      'email': form.email.toLowerCase(),
      'password': form.password,
      'remember_me': form.rememberMe,
      'g-recaptcha-response': tokenCaptcha
    }).subscribe((res: any) => {
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
      if (userInfo.acc_type !== USER_TYPE.JOB_SEEKER) this.paymentService.getAllJobInCard().subscribe();
      this.getDataMaster();
      this.redirect(userInfo);
    }, resError => {
      this.isCallingApi = false;
      this.errorMessage = resError;
      // this.generateCaptchaV3();
    })
  }

  getDataMaster() {
    this.jobService.getListAssessMent().subscribe();
    this.jobService.getListCategory().subscribe();
    this.jobService.getListJobLevel().subscribe();
  }

  redirect(user) {
    this.messageService.connectSocket(user);
    if (user.sign_up_step != SETINGS_STEP.COMPLETE) {
      if (user.acc_type == USER_TYPE.EMPLOYER) {
        this.router.navigate(['/employer-settings'], { queryParams: this.fromUserStory ? { fromUserStory: this.fromUserStory } : {} });
      } else {
        this.router.navigate(['/job-seeker-settings']);
      }
    } else {
      if (this.urlJobDetailsWhenApply) {
        this.router.navigate([this.urlJobDetailsWhenApply]);
      } else if (user.acc_type == USER_TYPE.EMPLOYER) {
        if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.FIND_CANDIDATE){
          this.router.navigate(['/find-candidates']);
        }else if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.PREVIEW_ASESSMENT){
          if(this.assessmentId) this.getPreviewAssessment(this.assessmentId);
          else this.router.navigate(['/employer-dashboard']);
        }else this.router.navigate(['/employer-dashboard']);
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

  backToHome() {
    this.location.back();
  }
}
