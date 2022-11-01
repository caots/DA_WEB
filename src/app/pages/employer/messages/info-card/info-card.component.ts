import { ModalPreviewFileComponent } from './../../../../components/modal-preview-file/modal-preview-file.component';
import { Component, OnInit, EventEmitter, Injectable, Input, Output, HostListener } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PermissionService } from 'src/app/services/permission.service'
import { APPLICANT_STAGE, GROUP_TYPE, LIST_BENEFITS, SALARY_TYPE } from 'src/app/constants/config';
import { environment } from 'src/environments/environment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { TimeService } from 'src/app/services/time.service';
import { MESSAGE } from 'src/app/constants/message';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { MessageService } from 'src/app/services/message.service';
import { HelperService } from 'src/app/services/helper.service';
import { GroupInfo } from 'src/app/interfaces/message';
import { Applicants } from 'src/app/interfaces/applicants';
import { FileService } from 'src/app/services/file.service';
import { ImageService } from 'src/app/services/image.service'
import { SubjectService } from 'src/app/services/subject.service';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = { day: <any>null, month: <any>null, year: <any>null }
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${HelperService.padNumber(date.month)}/${HelperService.padNumber(date.day)}/${date.year || ''}` :
      '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}
@Component({
  selector: 'ms-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  listStages: any = APPLICANT_STAGE;
  stageName: string;
  placeHolderExpired: NgbDateStruct;
  @Input('totalJobseekerMsg') totalJobseekerMsg: number;
  @Input('groupChat') groupChat: GroupInfo;
  @Input('voteResponsive') voteResponsive: any;
  @Input('potentialCandidate') potentialCandidate: any;
  @Input('user') user: any;
  @Output() rateBot = new EventEmitter();
  @Output() callApi = new EventEmitter();
  @Output() requestShowAvatar = new EventEmitter();
  @Output() viewApplicantWithPrivateJob = new EventEmitter();
  @Output() rateApplicant = new EventEmitter();
  @Output() showModalViewImage = new EventEmitter();

  isShowApplicant: boolean;
  // listApplicant: Applicants;
  GROUP_TYPE = GROUP_TYPE;
  listBenefits: any[] = [];
  numberStar: Array<number> = Array.from(Array(5).keys());
  rateStar: number;
  @Input('listApplicant') listApplicant: Applicants;
  listAssessmentJobseeker: any[] = [];
  image: string;
  stageIcon: any;
  time = { hour: 13, minute: 30 };
  meridian = true;
  strTime: string;
  comment: string;
  schedule: any;
  stage: number;
  model: any;
  isCallingApi: boolean;
  listUploadedFiles: any[] = [];
  listUploadedImages: any[] = [];
  userVoted: any;
  voteStatus: number = 0;
  showRateBot: boolean;
  listMessageOther: any[] = [];


  constructor(
    private assessmentService: AssessmentService,
    private timeService: TimeService,
    public formatter: NgbDateParserFormatter,
    private applicantsService: ApplicantsService,
    private helperService: HelperService,
    public messageService: MessageService,
    private permissionService: PermissionService,
    public fileService: FileService,
    public imageService: ImageService,
    public subjectService: SubjectService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getDataMaster();
    this.prepareApplicant();
    //console.log(this.listApplicant);
    this.subjectService.checkRateResponsive.subscribe(data => {
      if (data) this.voteStatus = data;
    })
    if (this.voteResponsive) {
      this.voteStatus = this.voteResponsive.is_responsive;
    }
    this.checkValidateRateBot();
    const addMsgToListMedia = this.subjectService.addMsgToListMedia.subscribe(res => {
      if (res) {
        this.getDataMaster();
      }
    })
    this.subscription.add(addMsgToListMedia);
  }
  ngOnChanges() {
    this.prepareApplicant();
  }
  prepareApplicant() {
    if (this.groupChat && !this.groupChat.job_id) {
      // this.potentialCandidate
      this.isShowApplicant = this.potentialCandidate?.can_view_profile == 1;
      this.getPotentialAssessment();
      return;
    }
    // applicant
    if (this.listApplicant) {
      this.listAssessmentJobseeker = this.listApplicant?.assessmentsResult;
      this.isShowApplicant = this.listApplicant?.can_view_profile == 1;
      this.stage = this.listApplicant?.stage;
      this.schedule = this.listApplicant?.scheduleTime;
      this.placeHolderExpired = this.listApplicant?.scheduleTime ? this.setValueDatePicker(this.listApplicant.scheduleTime) : null;
      const stageIcon = this.listStages.find(x => x.id === this.stage);
      this.stageIcon = stageIcon;
      this.listBenefits = [];
      if (this.listApplicant?.benefits) {
        this.listApplicant.benefits.split(',').map(benefit => {
          const item = LIST_BENEFITS.find(bens => bens.id === Number.parseInt(benefit));
          if (item) {
            this.listBenefits.push(item);
          };
        })
      }
      this.rateStar = this.listApplicant.jobSeekerRate ? Number(this.listApplicant.jobSeekerRate.toFixed(0)) : -1;
      if (!this.listApplicant.scheduleTime) { return; }
      this.strTime = this.timeService.formatAMPM(this.listApplicant.scheduleTime);
      this.time = {
        hour: this.listApplicant.scheduleTime.getHours(),
        minute: this.listApplicant.scheduleTime.getMinutes()
      };
    }

  };
  openPopupShowImage(url) {
    this.showModalViewImage.emit(url);
  }


  getSalaryType(salaryType) {
    if (salaryType !== null) {
      const result = SALARY_TYPE.find((slt) => slt.id === salaryType);
      if (result) {
        return result.title;
      }
    }
    return '';
  }

  onViewApplicantWithPrivateJob(isShow) {
    this.isShowApplicant = !isShow;
    this.viewApplicantWithPrivateJob.emit(isShow);
  }

  checkValidateRateBot() {
    if (this.totalJobseekerMsg >= 2 && this.permissionService.checkMasterOrJobseeker(this.user)) {
      this.showRateBot = true;
    }
  }

  getJobseekerPoint(assessment) {
    if (assessment.job_seeker_point === null) {
      return "N/A";
    }
    return ((assessment.job_seeker_point / assessment.job_assessments_point) * 100).toFixed(0);
  }
  getPotentialPoint(assessment) {
    if (assessment.job_seeker_point === null) {
      return "N/A";
    }
    return ((assessment.job_seeker_assessments_weight / 100) * 100).toFixed(0);
  }

  handleAsideClick(event: Event) {
    event.stopPropagation();
  }

  convertImageAndFile(content) {
    return this.fileService.convertNameOfFile(content);
  }

  selectInterViewStatus(stage) {
    this.stage = stage.id;
    this.stageIcon = stage;
  }

  colorWeightAssessment(weight) {
    return this.assessmentService.colorWeightAssessment(weight);
  }

  setValueDatePicker(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    myDate.setHours(this.time.hour, this.time.minute);
    this.strTime = this.timeService.formatAMPM(myDate)
    this.schedule = myDate;
    this.placeHolderExpired = this.setValueDatePicker(myDate);
    // this.submit();s
  }

  submit() {
    this.isCallingApi = true;
    let myDate;
    if (this.schedule) {
      myDate = new Date(this.schedule);
      //console.log(myDate)
      myDate.setHours(this.time.hour, this.time.minute);
      this.strTime = this.timeService.formatAMPM(myDate)
    } else myDate = '';
    let data = {
      schedule: myDate,
      stage: this.stage
    }
    this.applicantsService.addNote(Number(this.listApplicant.userId), data,
      this.groupChat.job_id, this.groupChat.company_id).subscribe(res => {
        this.helperService.showToastSuccess(MESSAGE.ADD_NOTE_APPLICANTS);
        this.callApi.emit();
      }, errorRes => {
        this.helperService.showToastError(errorRes);
        this.isCallingApi = false;
      });
  }

  getDataMaster() {
    this.messageService.getListUploadData(Number(this.groupChat.id), 1).subscribe(res => {
      this.listUploadedImages = res.results;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });

    this.messageService.getListUploadData(Number(this.groupChat.id), 2).subscribe(res => {
      this.listUploadedFiles = res.results;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }
  getPotentialAssessment() {
    if (!this.potentialCandidate || !this.potentialCandidate.id) {
      return;
    }
    this.messageService.getAssessmentCandidateOfJobseeker(this.potentialCandidate.id).subscribe(res => {
      this.listAssessmentJobseeker = res.results;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
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

  async requestAvatar() {
    if (this.listApplicant.can_view_profile === -1) {
      this.helperService.showToastSuccess(MESSAGE.REQUEST_UNMARK_SUCCESS);
      return;
    } else if (this.listApplicant.can_view_profile != null) {
      return;
    }
    // const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_SHOW_AVATAR, 'Yes');
    this.applicantsService.requestUnmask(this.listApplicant.userId).subscribe((res) => {
      this.listApplicant.can_view_profile = -1;
      this.helperService.showToastSuccess(MESSAGE.REQUEST_UNMARK_SUCCESS);
      const socketMessage = {
        group_id: this.listApplicant.group_id,
        current_user: {
          id: this.user.id
        },
        can_view_profile: -1
      }
      this.messageService.sendRequestUnmark(socketMessage);
    }, (error) => {
      console.error('requestUnmask :', error);
      this.listApplicant.can_view_profile = null;
    });
  }
  async requestAvatarPotential() {
    if (this.potentialCandidate.can_view_profile === -1) {
      this.helperService.showToastSuccess(MESSAGE.REQUEST_UNMARK_SUCCESS);
      return;
    } else if (this.potentialCandidate.can_view_profile != null) {
      return;
    }
    this.messageService.requestUnmaskPotential(this.potentialCandidate.id).subscribe((res) => {
      this.potentialCandidate.can_view_profile = -1;
      this.helperService.showToastSuccess(MESSAGE.REQUEST_UNMARK_SUCCESS);
      const socketMessage = {
        group_id: this.groupChat.id,
        current_user: {
          id: this.user.id
        },
        can_view_profile: -1
      }
      this.messageService.sendRequestUnmark(socketMessage);
    }, (error) => {
      console.error('requestUnmask :', error);
      this.listApplicant.can_view_profile = null;
    });
  }
  rateStarNumber(number) {
    this.rateStar = number;
    this.rateApplicant.emit(number);
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
