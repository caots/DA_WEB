import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { EXPORT_TYPE, PAGING, USER_TYPE, TAB_EMPLOYER_BILLINGS } from 'src/app/constants/config';
import { PaymentService } from 'src/app/services/payment.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingHistory } from 'src/app/interfaces/billingHistory';
import { AuthService } from 'src/app/services/auth.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-employer-profile',
  templateUrl: './employer-profile.component.html',
  styleUrls: ['./employer-profile.component.scss']
})
export class EmployerProfileComponent implements OnInit {
  active: any;
  userData: any;
  dataBillings: BillingHistory[];
  isLoadingBillingHistory: boolean = true;
  params: Object;
  paginationConfig: PaginationConfig;
  subScriptions: Subscription[] = [];
  cardInfo: CardInfo;
  settingsCard: any;
  userType = USER_TYPE;
  TAB_EMPLOYER_BILLINGS = TAB_EMPLOYER_BILLINGS;
  tabBillingInfo: number = TAB_EMPLOYER_BILLINGS.INFO_CARD;
  titleAttachmentModel: string = 'billing history';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private authService: AuthService,
    private paymentConvergeService: PaymentConvergeService,
    private subjectService: SubjectService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.active = res.type;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.billings) this.tabBillingInfo = params.billings;
    })
    this.subjectService.cart.subscribe(data => {
      if (!data) return;
      this.cardInfo = data;
    })
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.params = {
      page: 0,
      size: 10
    }
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
  }

  exportBillingHistory(data) {
    const exportDataSubscrition = this.paymentService.exportBillingHistory()
    this.subScriptions.push(exportDataSubscrition);
  }

  deleteCard() {
    this.paymentService.deleteCard().subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.DELETE_CARD_SUCCESSFULLY);
      this.subjectService.cart.next(null);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  updateCard() {
    this.subjectService.isLoadingCard.next(true);
    this.paymentConvergeService.updateCard().subscribe(data => {}, err => {
      this.subjectService.isLoadingCard.next(false);
    });
  }

  ngOnDestroy() {
    this.subScriptions.forEach((sub) => sub.unsubscribe());
  }


  changeTab(type) {
    if (type == TAB_EMPLOYER_BILLINGS.INFO_CARD) {
      this.tabBillingInfo = TAB_EMPLOYER_BILLINGS.INFO_CARD;
    } else {
      this.tabBillingInfo = TAB_EMPLOYER_BILLINGS.BILLINGS;
    };
    this.router.navigate([], {
      queryParams: { billings: this.tabBillingInfo },
      queryParamsHandling: 'merge'
    })
  }

  goToPreviewEMployer() {
    this.router.navigate(['/preview-employer'], { queryParams: { tab: 'employer' } });
  }

}
