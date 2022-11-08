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
export class InfoCardComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  listStages: any = APPLICANT_STAGE;
  stageName: string;
  model: NgbDateStruct;
  listAssessmentJobseeker: any[] = [];
  @Input('listMessage') listMessage: any[];
  @Input('totalJobseekerMsg') totalJobseekerMsg: number;
  @Input('currentCompany') currentCompany: any;
  @Input('groupChat') groupChat: GroupInfo;
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
    private helperService: HelperService,
    private messageService: MessageService,
    public fileService: FileService,
    public imageService: ImageService,
    public subjectService: SubjectService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getDataMaster();
    const addMsgToListMedia = this.subjectService.addMsgToListMedia.subscribe(res => {
      if (res) {
        this.getDataMaster();
      }
    })
    this.subscription.add(addMsgToListMedia);
  }

  openPopupShowImage(url){
    this.showModalViewImage.emit(url);
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
