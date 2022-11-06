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
  }

}
