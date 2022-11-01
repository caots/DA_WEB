import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { USER_STORY_ROUTER } from 'src/app/constants/config';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-user-story-view',
  templateUrl: './user-story-view.component.html',
  styleUrls: ['./user-story-view.component.scss']
})
export class UserStoryViewComponent implements OnInit {
  userStory: any;
  token: string;
  modalViewAssessmentRef: NgbModalRef;
  listAssessmentUserStory: any[] = [];
  assessmentId: number;
  hoverAssessment: any;
  isShowAssessmentHover: boolean = false;
  isShowAssessmentResultHover: boolean = false;
  indexAssessment: number = -1;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private helperService: HelperService,
    private router: Router,
    private assessmentService: AssessmentService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.token) {
        this.token = params.token;
        if (this.token) this.getUserStory(this.token);
      }
    });
  }

  getUserStory(token) {
    this.userService.getUserStoryByToken(token).subscribe((data: any) => {
      this.userStory = data;
      this.userStory.assessment = JSON.parse(this.userStory.assessment);
      if (this.userStory?.assessment && this.userStory.assessment.length > 0) {
        const ids = [];
        this.userStory?.assessment.map(assessment => {
          ids.push(assessment.id);
        });
        if (ids.length > 0) this.getAssessmentUserStory(ids);
      }
    }, err => {
      this.helperService.showToastError(err);
    })
  }


  getAssessmentUserStory(ids: number[]) {
    const params = {
      ids: JSON.stringify(ids)
    }
    this.assessmentService.getAssessmentsUserStory(params).subscribe(data => {
      this.listAssessmentUserStory = data || [];
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  colorWeightAssessment(weight) {
    return this.assessmentService.colorWeightAssessment(weight)
  }

  backToHome() {
    this.router.navigate(['/home'])
  }

  previewAssessment(modalViewAssessment, assessmentId) {
    this.modalViewAssessmentRef = this.modalService.open(modalViewAssessment, {
      windowClass: 'modal-report-company',
      size: 'xl',
      centered: true
    });
    this.assessmentId = assessmentId;
  }

  goToPostJob() {
    const newTab = `${environment.url_webapp}register?fromUserStory=${USER_STORY_ROUTER.POST_JOB}`
    window.open(newTab, '_blank');
  }
  goToFindCandidates() {
    const newTab = `${environment.url_webapp}register?fromUserStory=${USER_STORY_ROUTER.FIND_CANDIDATE}`
    window.open(newTab, '_blank');
  }

  hoverOver(assessmentId, i){
    this.indexAssessment = i;
    this.isShowAssessmentHover = true;
    this.assessmentId = assessmentId;
    if(assessmentId >= 0){
      const index = this.listAssessmentUserStory.findIndex(ass => ass.id == assessmentId);
      if(index >= 0) this.hoverAssessment = this.listAssessmentUserStory[index];
    }
  }

  showPreviewAssessment(assessmentId){
    // this.storageService.set(USER_STORY_ROUTER.SAVELOCAL_LINK_PREVIEW, url);
    setTimeout(()=> {
      this.modalViewAssessmentRef.close();
    }, 300);
    const newTab = `${environment.url_webapp}register?fromUserStory=${USER_STORY_ROUTER.PREVIEW_ASESSMENT}&assessmentId=${assessmentId}`
    window.open(newTab, '_blank');
  }

  hoverOut(){}
}
