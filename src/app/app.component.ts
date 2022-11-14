import { NavigationEnd, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { CeoService } from 'src/app/services/ceo.service';
import { AuthService } from './services/auth.service';
import { PaymentService } from './services/payment.service';
import { MessageService } from './services/message.service';
import { SubjectService } from './services/subject.service';
import { USER_TYPE } from './constants/config';
import { CardInfo } from './interfaces/cardInfo';
import { JobService } from './services/job.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { UserInfo } from './interfaces/userInfo';
import { UserService } from './services/user.service';
declare let ga: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  oldUrl: string;
  title: string = 'measuredskills';
  userInfo: UserInfo;

  constructor(
    private router: Router,
    private ceoService: CeoService,
    private jobService: JobService,
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
    private subjectService: SubjectService,
    private messageService: MessageService,
    private faIconLibrary: FaIconLibrary,

  ) {
    this.ceoService.changeMetaTagByPage();
    this.router.events.subscribe((event: any) => {      
      if (this.oldUrl != this.router.url) {
        this.oldUrl = this.router.url;
        this.ceoService.changeMetaTagByPage(this.router.url);
      }
    })
  }
 
  ngOnInit(): void {
    if (this.authService.isLogin()) {
      this.authService.getUserInfo().subscribe((user) => {
        this.userInfo = user;
        this.messageService.connectSocket(user);
        if (user.acc_type !== USER_TYPE.JOB_SEEKER) {
          this.paymentService.getAllJobInCard().subscribe();
        }else{
          this.jobService.getListIdCompanyFollowed().subscribe();
          this.userService.getUserSurvey().subscribe();
        }
      }, (error) => { 
      });
    } else {
    }
    this.jobService.getAllFallUnder().subscribe(res => this.subjectService.listFallUnder.next(res));
    this.jobService.getListCategory().subscribe();
    this.jobService.getListJobLevel().subscribe();
    this.jobService.getListAssessMent().subscribe();
    this.addFaIcon();
  }

  addFaIcon() {
    this.faIconLibrary.addIconPacks(fas, fab, far);
  }
  
}
