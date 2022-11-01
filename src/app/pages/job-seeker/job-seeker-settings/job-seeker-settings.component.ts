import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { SIGN_UP_STEP } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-job-seeker-settings',
  templateUrl: './job-seeker-settings.component.html',
  styleUrls: ['./job-seeker-settings.component.scss']
})

export class JobSeekerSettingsComponent implements OnInit {
  userInfo: UserInfo;
  stepConfig = SIGN_UP_STEP;
  step: number;
  isBackStepHeader: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        if (this.step === undefined) {
          this.step = this.userInfo.signUpStep;
        }
        if (this.step == SIGN_UP_STEP.STEP1) this.isBackStepHeader = true;
      } else {
        this.step = SIGN_UP_STEP.STEP1;
      }
    })
    this.step = this.step == SIGN_UP_STEP.STEP0 ? SIGN_UP_STEP.STEP1 : this.step;
  }

  goBack() {
    if (this.step == this.stepConfig.STEP2) {
      this.step = this.stepConfig.STEP1;
    } else if (this.step == this.stepConfig.STEP3) {
      this.step = this.stepConfig.STEP2;
    }
  }

  goToSearchJobPage() {
    console.log('go to dahsboard');
    const navigationExtras: NavigationExtras = {
      state: {
        neddVerifyEmailJobseeker: true,
      }
    };
    this.authService.saveUser({
      role: this.userInfo.acc_type,
      signUpStep: this.userInfo.signUpStep
    })
    if (this.userInfo?.is_user_potentials) {
      this.router.navigate(['/job']);
    } else
      this.router.navigate(['/job'], navigationExtras);
  }

  nextStep(step) {
    this.step = step;
  }

  changeStepHeader(step) {
    if (this.isBackStepHeader) this.step = step;
  }
}