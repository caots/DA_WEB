import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-footer-bottom',
  templateUrl: './footer-bottom.component.html',
  styleUrls: ['./footer-bottom.component.scss']
})
export class FooterBottomComponent implements OnInit {
  userInfo: UserInfo;
  isWaitLoadData: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private helperService: HelperService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      if (!user) return;
      this.userInfo = user;
    });
    setTimeout(() => {
      this.isWaitLoadData = true;
    }, 1000)
  }

  goToJobseekerPage() {
    if (!this.userInfo || this.userInfo.accountType == USER_TYPE.JOB_SEEKER) {
      this.router.navigate(['/landing-jobseeker']);
    } else {
      this.goToLandingPage(true);
    }
  }

  goToEmployerPage() {
    if (!this.userInfo || this.userInfo.accountType == USER_TYPE.EMPLOYER) {
      this.router.navigate(['/landing-employer']);
    } else {
      this.goToLandingPage(false);
    }
  }

  async goToLandingPage(isJobseeker = false) {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_GO_TO_LOGIN, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (!isConfirmed) return;
    this.authService.logout();
    if(isJobseeker) this.router.navigate(['/landing-jobseeker']);
    else this.router.navigate(['/landing-employer']);
  }

  getCurrentYear(){
    return new Date().getFullYear();
  }

}
