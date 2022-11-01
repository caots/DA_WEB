import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { ASSESSMENTS_TYPE, SETINGS_STEP, SETINGS_STEP_EMPLOYER, USER_STORY_ROUTER } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})

export class CompanySettingsComponent implements OnInit {
  userInfo: UserInfo;
  stepConfig = SETINGS_STEP_EMPLOYER;
  step: number;
  isBackStepHeader: boolean = false;
  fromUserStory: number;
  assessmentId: string = "";
  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,   
    private helperService: HelperService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if(params.fromUserStory){
        this.fromUserStory = params.fromUserStory;
        this.assessmentId = params?.assessmentId || "";
      }
    });
    this.subjectService.user.subscribe(user => {
      if (user) {
        this.userInfo = user;
        if (this.step === undefined) {
          this.step = this.userInfo.signUpStep;
        }
        if (this.step == SETINGS_STEP_EMPLOYER.COMPANY) this.isBackStepHeader = true;   
      } else {
        this.step = SETINGS_STEP_EMPLOYER.ACCOUNT;
      }
    })    
  }

  goBack() {
    if (this.step == this.stepConfig.COMPANY) {
      this.step = this.stepConfig.ACCOUNT;
    } 
  }

  goTobDashBoard(){
    const navigationExtras: NavigationExtras = {
      state: {
        neddVerifyEmailEmployer: true,
      }
    };
    this.authService.saveUser({
      role: this.userInfo.acc_type,
      signUpStep: SETINGS_STEP.COMPLETE
    })
    if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.FIND_CANDIDATE){
      this.router.navigate(['/find-candidates'], navigationExtras);
    } else if(this.fromUserStory && this.fromUserStory == USER_STORY_ROUTER.PREVIEW_ASESSMENT){
      if(this.assessmentId) this.getPreviewAssessment(this.assessmentId);
      else this.router.navigate(['/employer-dashboard'], navigationExtras);
    } else this.router.navigate(['/employer-dashboard'], navigationExtras);
   
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

  nextStep(step) {
    this.step = step;
  }

  changeStepHeader(step) {
    if (this.isBackStepHeader) this.step = step;
  }
}
