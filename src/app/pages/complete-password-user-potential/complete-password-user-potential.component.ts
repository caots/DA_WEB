import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SETINGS_STEP, USER_TYPE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { MessageService } from 'src/app/services/message.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ms-complete-password-user-potential',
  templateUrl: './complete-password-user-potential.component.html',
  styleUrls: ['./complete-password-user-potential.component.scss']
})
export class CompletePasswordUserPotentialComponent implements OnInit {
  formUpdate: FormGroup;
  tokenParam: string;
  isCallingApi: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private authService: AuthService,
    private userService: UserService,
    private subjectService: SubjectService,
    private paymentService: PaymentService,
    private jobService: JobService,
    private messageService: MessageService,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.queryParamMap.subscribe(params => {
      let queryParamsUrl = this.activatedRoute.snapshot.queryParams;
      const tokenParam = queryParamsUrl.token;
      if (tokenParam) this.tokenParam = tokenParam;
    });
  }

  initForm() {
    this.formUpdate = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z0-9$@$#!%*?&].{6,}')]],
      confirmPassword: ['', [Validators.required]]
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

  save(form) {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }
    this.isCallingApi = true;
  
    this.userService.completeUserPotentials({
      password: form.password,
      token: this.tokenParam,
    }).subscribe((res: any) => {
      this.isCallingApi = false;
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

      this.subjectService.userPotentialsCategory.next(res.category);

      this.authService.saveUser({
        role: userInfo.acc_type,
        signUpStep: userInfo.sign_up_step
      })
      if (userInfo.converge_ssl_token) {
        this.paymentService.getCardInfo().subscribe();
      }
      this.getDataMaster();
      this.redirect(userInfo);
      //this.router.navigate(['/employer-dashboard']);
    }, errorRes => {
      this.isCallingApi = false;
      this.helperService.showToastError(errorRes);
    })
  }

  redirect(user) {
    this.messageService.connectSocket(user);
    if (user.sign_up_step != SETINGS_STEP.COMPLETE) {
      if (user.acc_type == USER_TYPE.EMPLOYER) {
        this.router.navigate(['/employer-settings']);
      } else {
        this.router.navigate(['/job-seeker-settings']);
      }
    } else {
      if (user.acc_type == USER_TYPE.EMPLOYER) {
        this.router.navigate(['/employer-dashboard']);
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

  getDataMaster() {
    this.jobService.getListAssessMent().subscribe();
    this.jobService.getListCategory().subscribe();
    this.jobService.getListJobLevel().subscribe();
  }


}
