import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PermissionService } from 'src/app/services/permission.service'
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-rate-bot',
  templateUrl: './rate-bot.component.html',
  styleUrls: ['./rate-bot.component.scss']
})
export class RateBotComponent implements OnInit {
  @Input('totalJobseekerMsg') totalJobseekerMsg: number;
  @Input('groupChat') groupChat: any;
  @Input('voteResponsive') voteResponsive: any;
  @Input('user') user: any;
  @Output() rateBot = new EventEmitter();

  showRateBot: boolean = false;
  userVoted: any;
  voteStatus: number = 0;

  constructor(
    private subjectService: SubjectService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    if (this.voteResponsive) {
      this.voteStatus = this.voteResponsive.is_responsive;
    }
    this.checkValidateRateBot();
  }

  checkValidateRateBot() {
    if (this.permissionService.checkMasterOrJobseeker(this.user)) {
      this.showRateBot = true;
    }
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
    this.subjectService.checkRateResponsive.next(vote);
    this.rateBot.emit(data);
    this.showRateBot = false;
  }

}
