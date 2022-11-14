import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import {
  EXPORT_TYPE,
  PAGING,
  USER_TYPE,
  TAB_JOBSEEKER_INFO,
  TAB_EMPLOYER_BILLINGS,
} from 'src/app/constants/config';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingHistory } from 'src/app/interfaces/billingHistory';
import { AuthService } from 'src/app/services/auth.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-job-seeker-profile',
  templateUrl: './job-seeker-profile.component.html',
  styleUrls: ['./job-seeker-profile.component.scss'],
})
export class JobSeekerProfileComponent implements OnInit {
  active: any;
  userData: any;
  dataBillings: BillingHistory[];
  isLoadingBillingHistory: boolean = true;
  params: Object;
  paginationConfig: PaginationConfig;
  subScriptions: Subscription[] = [];
  cardInfo: CardInfo;
  settingsCard: CardSettings;
  userType = USER_TYPE;
  titleAttachmentModel: string = 'billing history';
  tabUserInfo: string = TAB_JOBSEEKER_INFO.MY_INFO;
  TAB_JOBSEEKER_INFO = TAB_JOBSEEKER_INFO;
  TAB_EMPLOYER_BILLINGS = TAB_EMPLOYER_BILLINGS;
  tabBillingInfo: number = TAB_EMPLOYER_BILLINGS.INFO_CARD;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private authService: AuthService,
    private paymentConvergeService: PaymentConvergeService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res) => {
      this.active = res.type;
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.userInfo) this.tabUserInfo = params.userInfo;
      if (params.billings) this.tabBillingInfo = params.billings;
    });
    this.subjectService.user.subscribe((user) => {
      this.userData = user;
    });
    this.subjectService.cart.subscribe((data) => {
      if (!data) return;
      this.cardInfo = data;
    });
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM,
    };
    this.params = {
      page: 0,
      size: 10,
    };
  }
  
  changeTabUser(type) {
    switch (type) {
      case TAB_JOBSEEKER_INFO.MY_INFO:
        this.tabUserInfo = TAB_JOBSEEKER_INFO.MY_INFO;
        break;
      case TAB_JOBSEEKER_INFO.DEMOGRAPHIC_SURVEY:
         this.tabUserInfo = TAB_JOBSEEKER_INFO.DEMOGRAPHIC_SURVEY;
        break;
      case TAB_JOBSEEKER_INFO.CANDIDATE_PROFILE:
         this.tabUserInfo = TAB_JOBSEEKER_INFO.CANDIDATE_PROFILE;
        break;
      case TAB_JOBSEEKER_INFO.SHARE_USER_HISTORY:
         this.tabUserInfo = TAB_JOBSEEKER_INFO.SHARE_USER_HISTORY;
        break;
    }
    this.router.navigate([], {
      queryParams: { userInfo: this.tabUserInfo },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.subScriptions.forEach((sub) => sub.unsubscribe());
  }
}
