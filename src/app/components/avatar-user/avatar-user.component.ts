import { Component, Input, OnInit } from '@angular/core';
import { Applicants, ShowApplicant } from 'src/app/interfaces/applicants';
import { Conversation, Message } from 'src/app/interfaces/message';
import { MessageService } from 'src/app/services/message.service';
import { APPLICANT_PRIVATE_TYPE } from 'src/app/constants/config'
import { ApplicantsService } from 'src/app/services/applicants.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Candidate } from 'src/app/interfaces/candidate';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ms-avatar-user',
  templateUrl: './avatar-user.component.html',
  styleUrls: ['./avatar-user.component.scss']
})
export class AvatarUserComponent implements OnInit {
  @Input('applicant') applicant: Applicants;
  @Input('candidate') candidate: Candidate;
  @Input('message') message: Message;
  @Input('conversation') conversation: Conversation;
  @Input('canViewProfile') canViewProfile: number;
  APPLICANT_PRIVATE_TYPE = APPLICANT_PRIVATE_TYPE;
  applicantDraft: Applicants;
  conversationDraft: Conversation;
  isShowApplicant: boolean = false;
  isShowMesasge: boolean = false;
  numberStar: Array<number> = Array.from(Array(5).keys());
  urlShot: string;
  constructor(
    private subjectService: SubjectService,
    private messageService: MessageService,
    private helperService: HelperService,
    private applicantService: ApplicantsService
  ) { }

  ngOnInit(): void {
    this.urlShot = environment.api_url_short;
    this.subjectService.isShowApplicant.subscribe((data: ShowApplicant) => {
      if (data == null) return;
      const show = data.show == 1;
      this.viewApplicantWithPrivateJob(!show, APPLICANT_PRIVATE_TYPE.CONVERSATION, data.id);
    })
    this.isShowApplicant = this.applicant && this.applicant.canViewProfile == 1;
    this.isShowMesasge = this.conversation && this.conversation.can_view_profile == 1;
    this.applicantDraft = Object.assign({}, this.applicant);
    this.conversationDraft = Object.assign({}, this.conversation);
  }

  viewApplicantWithPrivateJob(isShow, type, idApplicant = null) {
    switch (type) {
      case APPLICANT_PRIVATE_TYPE.APPLICANT:
        this.isShowApplicant = !isShow;
        if (this.applicant.jobIsPrivate != 1) return;
        this.applicant.canViewProfile = this.isShowApplicant ? 1 : 0;
        this.makeToViewApplicant(this.applicant.userId, { canViewProfile: this.applicant.canViewProfile });
        break;
      case APPLICANT_PRIVATE_TYPE.CONVERSATION:
        if (idApplicant != null && this.conversation.job_applicant_id != idApplicant) return;
        if (this.conversation.job_is_private != 1) return;
        this.isShowMesasge = !isShow;
        this.conversation.can_view_profile = this.isShowMesasge ? 1 : 0;
        this.makeToViewApplicant(this.conversation.job_applicant_id, { canViewProfile: this.conversation.can_view_profile });
        break;
      default:
        break;
    }
  }

  makeToViewApplicant(id, body) {
    console.log(body);
    this.applicantService.updateViewApplicant(id, body).subscribe(res => {
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }

}
