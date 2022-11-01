import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { APPLICANT_STAGE, GROUP_TYPE } from 'src/app/constants/config';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from 'src/app/services/permission.service'
import { AssessmentService } from 'src/app/services/assessment.service';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { MessageService } from 'src/app/services/message.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { GroupInfo } from 'src/app/interfaces/message';
import { FileService } from 'src/app/services/file.service';
import { ImageService } from 'src/app/services/image.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Subscription } from 'rxjs';
import { ModalPreviewFileComponent } from 'src/app/components/modal-preview-file/modal-preview-file.component';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'ms-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit, OnChanges {
  private subscription: Subscription = new Subscription();
  listStages: any = APPLICANT_STAGE;
  stageName: string;
  model: NgbDateStruct;
  listAssessmentJobseeker: any[] = [];
  @Input('listMessage') listMessage: any[];
  @Input('totalJobseekerMsg') totalJobseekerMsg: number;
  @Input('currentCompany') currentCompany: any;
  @Input('groupChat') groupChat: GroupInfo;
  @Input('voteResponsive') voteResponsive: any;
  @Input('user') user: any;
  @Output() makeViewProfile = new EventEmitter();
  @Output() rateBot = new EventEmitter();
  @Input() listApplicants: any;
  @Input() groupId: any;
  @Output() showModalViewImage = new EventEmitter();

  userVoted: any;
  voteStatus: number = 0;
  showRateBot: boolean = false;
  listMessageOther: any[] = [];
  listUploadedImages: any;
  listUploadedFiles: any
  GROUP_TYPE = GROUP_TYPE;
  currentLogoCompany: string;

  constructor(
    private assessmentService: AssessmentService,
    private applicantsService: ApplicantsService,
    private helperService: HelperService,
    private permissionService: PermissionService,
    private messageService: MessageService,
    public fileService: FileService,
    public imageService: ImageService,
    public subjectService: SubjectService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    //console.log(this.listApplicants);
    this.subjectService.checkRateResponsive.subscribe(data => {
      if(data) this.voteStatus = data;
    })
    this.prepareApplicant();
    const addMsgToListMedia = this.subjectService.addMsgToListMedia.subscribe(res => {
      if (res) {
        this.getDataMaster();
      }
    })
    this.subscription.add(addMsgToListMedia);
  }
  prepareApplicant() {
    if (this.voteResponsive) {
      this.voteStatus = this.voteResponsive.is_responsive;
    }
    if (this.groupChat && this.groupChat.job_id) {
      this.stageName = "---Please select status---";
      this.listAssessmentJobseeker = this.listApplicants?.assessmentsResult;
      this.listStages.forEach(element => {
        if(element.id === 7) {
          this.stageName = element.icon;
        }
      });
    }
    this.checkValidateRateBot();
    this.currentLogoCompany = `${this.currentCompany?.company_profile_picture}`;
  }
  ngOnChanges() {
    this.prepareApplicant();
  }
  getJobseekerPoint(assessment) {
    if(assessment.job_seeker_point === null) {
      return "N/A";
    }
    return ((assessment.job_seeker_point / assessment.job_assessments_point) * 100).toFixed(0);
  }

  openPopupShowImage(url){
    this.showModalViewImage.emit(url);
  }

  checkValidateRateBot() {
    if (this.totalJobseekerMsg >=2 &&this.permissionService.checkMasterOrJobseeker(this.user)){
      this.showRateBot = true;
    }
    this.getDataMaster()
  }

  selectInterViewStatus(stage) {
    this.stageName = stage.icon;
    const groupChat = this.groupChat.can_view_profile
  }

  colorWeightAssessment(assessment) {
    let weight;
    if(assessment.job_seeker_point === null) {
      weight = "N/A";
    }
    weight = ((assessment.job_seeker_point / assessment.job_assessments_point) * 100).toFixed(0);
    return this.assessmentService.colorWeightAssessment(weight);
  }

  onRateBot(vote) {
    this.voteStatus = vote;
    let userId = this.groupChat.member_id === this.user.id ? this.groupChat.company_id : this.groupChat.member_id
    if (vote == 1) {
      this.voteStatus = 1;
    } else {
      this.voteStatus = -1;
    }
    let data = {
      userId: userId,
      vote: vote
    }
    this.rateBot.emit(data);
  }

  getDataMaster() {
    this.messageService.getListUploadData(this.groupId, 1).subscribe(res => {
      this.listUploadedImages = res.results;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });

    this.messageService.getListUploadData(this.groupId, 2).subscribe(res => {
      this.listUploadedFiles = res.results;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

  convertImageAndFile(content) {
    return this.fileService.convertNameOfFile(content);
  }

  async emitMakeViewProfile(groupChat) {
    if(groupChat?.can_view_profile === 0){
      this.makeViewProfile.emit(this.groupChat.job_id);
      return;
    }
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_REMASK_JOBSEEKER, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_CANCEL_TEXT);
    if (!isConfirmed) { return; }
    this.makeViewProfile.emit(this.groupChat.job_id);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  showModalPreviewFileComponent(content: string): any {
    const modalViewImageRef = this.modalService.open(ModalPreviewFileComponent, {
      windowClass: 'modal-view-image',
      size: 'xl'
    });
    modalViewImageRef.componentInstance.url = `${content}`;
  }
}
