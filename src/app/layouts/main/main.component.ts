import { Component, OnInit } from '@angular/core';

import { USER_TYPE } from 'src/app/constants/config';
import { JobService } from 'src/app/services/job.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'ms-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  isLoadingUserInfo: boolean = false;
  currentUser: UserInfo;
  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private subjectService: SubjectService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLogin()) {
      this.authService.getUserInfo().subscribe((user: UserInfo) => {
        this.currentUser = user;
        this.isLoadingUserInfo = true;
        
        this.authService.saveUser({
          role: this.currentUser.accountType,
          signUpStep: this.currentUser.signUpStep
        });

        if (user.accountType == USER_TYPE.JOB_SEEKER) {
          this.jobService.getListBookmark().subscribe(listBookmark => {
            this.subjectService.listBookmark.next(listBookmark);
          });
        }
      }, (error) => {
        this.isLoadingUserInfo = true;
      });
    } else {
      this.isLoadingUserInfo = true;
    }
  }
}
