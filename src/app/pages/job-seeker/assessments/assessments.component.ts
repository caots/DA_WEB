import { get } from 'lodash';
import { async } from '@angular/core/testing';
import { filter } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PAGING, PAYMENT_TYPE, ASSESSMENT_STATUS, CUSTOM_ASSESSMENT_INTRUCTION_TEXT, ASSESSMENTS_TYPE, ONLY_VIEW_ASSESSMENT, TEST_ASSESSMENT_IMOCHA, MIN_VALUE_PRICE, CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL, ASSESSMENT_CUSTOM_CATEGORY, CAPTCHA_ACTION } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { SearchAssessment } from 'src/app/interfaces/search';
import { AssessmentService } from 'src/app/services/assessment.service';
import { PaymentService } from 'src/app/services/payment.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'ms-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  @ViewChild('modalPaymentFree', { static: true }) modalPaymentFree: NgbModalRef;

  isAddAssessmentPage: boolean = false;
  dataAssessment: Array<Assesment> = []
  listSelectedAssessment: any = []
  paginationConfig: PaginationConfig;
  orderBy: number;
  querySearch: SearchAssessment;
  isLoadingListAssessment: boolean;
  listCategory: Array<JobCategory> = [];
  isSearching: boolean;
  isAdding: boolean;
  ignoreValidated: number = 1;
  userData: UserInfo;
  titleConfirmPayment: string;
  modalPaymentConfirmationRef: NgbModalRef;
  modalPaymentFreeRef: NgbModalRef;
  assessmentData: any;
  cardInfo: CardInfo;
  settingsCard: CardSettings;
  customAssessment: DataUpdate;
  dataPaymentFree: any;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private jobService: JobService,
    private modalService: NgbModal,
    private userService: UserService,
    private paymentService: PaymentService,
    private subjectService: SubjectService,
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
    private previousRouteService: PreviousRouteService
  ) {
    this.querySearch = new SearchAssessment();
  }

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      this.userData = user;
    });
    this.userService.assessment.subscribe(assessment => {
      if (assessment) {
        let assessmentSocket = this.listSelectedAssessment.filter(obj => {
          return (obj.assessmentId == assessment.assessment_id && obj.type == assessment.assessment_type)
        });
        this.listSelectedAssessment[this.listSelectedAssessment.indexOf(assessmentSocket[0])].weight = assessment.weight;
        this.listSelectedAssessment[this.listSelectedAssessment.indexOf(assessmentSocket[0])].totalTake = assessment.totalTake;
        this.listSelectedAssessment[this.listSelectedAssessment.indexOf(assessmentSocket[0])].status = assessment.status;
        this.getListAssessment();
      }
    });
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.name) {
        this.querySearch.name = params.name;
      }
      if (params && params.q) {
        this.querySearch.name = params.q;
      }
      if (params && params.page) {
        this.paginationConfig.currentPage = Number.parseInt(params.page);
      }
      // if (params && params.ignoreValidated) {
      //   this.ignoreValidated = params.ignoreValidated;
      // }
      // if (params && params.onlyViewMyAssessment) {
      //   this.isAddAssessmentPage = params.onlyViewMyAssessment == 1;
      // }
    });
    
    this.getListMyAssessment();
    this.getListAssessment();
    this.getDataMaster();
    this.getCardInfo();
    this.getCardSettings();
  }

  getCardSettings() {
    this.paymentService.getSettingsPayment().subscribe((res: CardSettings) => {
      this.settingsCard = res;
      // this.settingsCard.top_up = res.top_up ? JSON.parse(this.settingsCard.top_up) : [];
    }, errorRes => {
      //console.log(errorRes);
    })
  }

  getCardInfo() {
    this.paymentService.getCardInfo().subscribe(res => {
      this.cardInfo = res;
    }, errorRes => {
      //console.log(errorRes);
    })
  }

  searchStep() {
    this.getListAssessment();
    this.isAddAssessmentPage = !this.isAddAssessmentPage;
    if (this.isAddAssessmentPage) {
      this.getListMyAssessment();
    }
  }

  removeAssessment(assessment) {
    this.assessmentService.removeAssessment(assessment.assessmentId ? assessment.assessmentId : assessment.assessment_id, assessment.type).subscribe(res => {
      this.isAdding = false;
      this.getListMyAssessment();
      this.getListAssessment();
      this.helperService.showToastSuccess(MESSAGE.REMOVE_ASSESSMENT);
    }, errorRes => {
      this.isAdding = false;
      this.helperService.showToastError(errorRes);
    })
  }

  addAssessment(assessment) {
    this.assessmentService.addAssessment(assessment.assessment_id, assessment.type).subscribe(res => {
      this.isAdding = false;
      this.getListMyAssessment();
      this.getListAssessment();
      this.helperService.showToastSuccess(MESSAGE.ADDED_ASSESSMENT);
    }, errorRes => {
      this.isAdding = false;
      this.helperService.showToastError(errorRes);
    })
  }

  async paymentAssessment(data: Assesment, modalPaymentConfirmation) {
    const isConfirmed = await this.helperService.confirmPopup(
      CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL,
      MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirmed) {
      if (this.settingsCard.standard_validation_price <= MIN_VALUE_PRICE) {
        const assesmentTYpe = data.status === ASSESSMENT_STATUS.retry ? PAYMENT_TYPE.RetryValidateTest : PAYMENT_TYPE.ValidateTest;
        this.dataPaymentFree = {
          paymentType: assesmentTYpe,
          notPayment: 1,
          assessment: {
            assessmentId: data.assessmentId ? data.assessmentId : data.assessment_id,
            type: data.type,
            name: data.name
          } as Assesment,
          assessmentInfo: data,
          subTotal: this.settingsCard.standard_validation_price,
          discountValue: 0
        }
        this.showModalConfirmTakeTest()
      } else this.confirmPaymentAssessment(data, modalPaymentConfirmation);
    }
  }



  showModalConfirmTakeTest() {
    console.log('show modal');
    this.modalPaymentFreeRef = this.modalService.open(this.modalPaymentFree, {
      windowClass: 'modal-payment-confirmation',
      size: 'md'
    });
  }


  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async takeTestForPaymentFree() {
    delete this.dataPaymentFree.assessmentInfo;
    const tokenCaptcha = await this.generateCaptchaV3();
    this.dataPaymentFree['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardJobseeker(this.dataPaymentFree).subscribe(res => {
      this.modalPaymentFreeRef.close();
      this.callTakeValidateService(this.dataPaymentFree.assessment, true);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  confirmPaymentAssessment(data: Assesment, modalPaymentConfirmation) {
    const assesmentTYpe = data.status === ASSESSMENT_STATUS.retry ? PAYMENT_TYPE.RetryValidateTest : PAYMENT_TYPE.ValidateTest;
    let body = {
      paymentType: assesmentTYpe,
      assessment: {
        assessmentId: data.assessmentId ? data.assessmentId : data.assessment_id,
        type: data.type,
        name: data.name
      } as Assesment,
      assessmentInfo: data,
      subTotal: this.settingsCard.standard_validation_price,
      discountValue: 0
    }
    this.assessmentData = body;
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
  }

  async submitPaymentProcess(data) {
    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardJobseeker(data).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      // redirect to IMOCHA
      this.callTakeValidateService(data.assessment, true);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
    this.modalPaymentConfirmationRef.close();
  }

  getFreeASttemptsRemaining(assessment: Assesment) {
    if (!assessment.totalTake) return this.settingsCard.free_assessment_validation || 0;
    const nmberOfFree = this.settingsCard.free_assessment_validation - assessment.totalTake;
    return nmberOfFree > 0 ? nmberOfFree : 0
  }

  async validateAssessment(assessment: Assesment, modalPaymentConfirmation = null) {
    const nbrCredits = get(this.userData, 'nbrCredits', 0);
    const nbrFreeCredits = this.getFreeASttemptsRemaining(assessment);
    //  payment
    if (assessment.type === ASSESSMENTS_TYPE.Custom) {
      // assessment.intructionText
      const title = `${CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT} <p>${MESSAGE.CONFIRM_SWITCH_IMOCHA}</p> <p>Good luck!</p>`
      const isConfirmed = await this.helperService.confirmPopup(title, MESSAGE.BTN_YES_TEXT);
      if (!isConfirmed) {
        return;
      }
      this.getCustomAssessmentDetails(assessment);
      return;
    }
    assessment.assessmentId = assessment.assessment_id ? assessment.assessment_id : assessment.assessmentId;
    const checkTestAssessment = this.assessmentService.messageTestAssessmentJobseeker(nbrFreeCredits, nbrCredits);
    switch (checkTestAssessment) {
      case TEST_ASSESSMENT_IMOCHA.NBR_FREE:
        const isConfirmedFree = await this.helperService.confirmPopup(MESSAGE.CONFIRM_SWITCH_IMOCHA, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
        if (!isConfirmedFree) return;
        break;
      case TEST_ASSESSMENT_IMOCHA.NBR_AVAIL:
        const isConfirmed = await this.helperService.confirmPopup(CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
        if (!isConfirmed) return;
        break;
      case TEST_ASSESSMENT_IMOCHA.NBR_UNAVAIL:
        this.paymentAssessment(assessment, modalPaymentConfirmation);
        return;
    }
    const isPayment = nbrFreeCredits <= 0;
    this.callTakeValidateService(assessment, isPayment);
  }

  getCustomAssessmentDetails(assessment: Assesment) {
    const jobId = 0;
    this.assessmentService.takeAssessment(assessment, jobId, window.location.href, false).subscribe((data: DataUpdate) => {
      this.customAssessment = data;
      const navigationExtras: NavigationExtras = {
        state: {
          customAssessment: data,
          assessmentId: assessment.id,
          isAssessmentPage: true
        }
      };
      this.router.navigate(['/job-seeker-test-assessments'], navigationExtras);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  callTakeValidateService(assessment: Assesment, isPayment = false) {
    const assessmentId = assessment.assessmentId ? assessment.assessmentId : assessment['assessment_id'];
    const jobId = 0;
    this.assessmentService.takeAssessment(assessment, jobId, window.location.href, isPayment).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_self');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }

  async retryAssessment(assessment: Assesment, modalPaymentConfirmation) {
    if (assessment.type === ASSESSMENTS_TYPE.Custom) {
      this.onRetryCustomAssessment(assessment);
      return;
    }
    const nbrCredits = get(this.userData, 'nbrCredits', 0);
    const nbrFreeCredits = this.getFreeASttemptsRemaining(assessment);
    const checkTestAssessment = this.assessmentService.messageTestAssessmentJobseeker(nbrFreeCredits, nbrCredits);
    switch (checkTestAssessment) {
      case TEST_ASSESSMENT_IMOCHA.NBR_FREE:
        const isConfirmedFree = await this.helperService.confirmPopup(MESSAGE.CONFIRM_RETRY_IMOCHA, MESSAGE.BTN_CONTINUE_TEXT);
        if (!isConfirmedFree) return;
        break;
      case TEST_ASSESSMENT_IMOCHA.NBR_AVAIL:
        const isConfirmed = await this.helperService.confirmPopup(CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
        if (!isConfirmed) return;
        break;
      case TEST_ASSESSMENT_IMOCHA.NBR_UNAVAIL:
        this.paymentAssessment(assessment, modalPaymentConfirmation);
        return;
    }
    const isPayment = nbrFreeCredits <= 0;
    this.callTakeValidateService(assessment, isPayment)
  }

  async onRetryCustomAssessment(assessment: Assesment) {
    const intructionText = assessment?.instruction || '';
    let title = '';
    if (intructionText !== '') {
      title = `${CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT} <p><b>6. Employer's Instructions: </b><span>${intructionText}</span></p>  <p class="text-center mb-3">Good luck!</p> <div><b>${MESSAGE.CONFIRM_SWITCH_IMOCHA}</b></div>`

    } else {
      title = `${CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT} <p class="text-center mb-3">Good luck!</p> <div>${MESSAGE.CONFIRM_SWITCH_IMOCHA}</div>`
    }
    const isConfirmed = await this.helperService.confirmPopup(title, MESSAGE.BTN_YES_TEXT);
    if (!isConfirmed) {
      return;
    } else {
      this.getCustomAssessmentDetails(assessment);
      return;
    }
  }

  // resetSearchJob() {
  //   this.querySearch = new SearchJobJobSeeker();
  //   this.orderBy = undefined;
  //   this.getListAssessment();
  // }

  getSearchCondition() {
    let condition: any = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      ignoreValidated: this.ignoreValidated
    }

    if (this.querySearch.name) {
      condition.q = encodeURIComponent(this.querySearch.name);
    }

    if (this.querySearch.category) {
      let numberCategory = this.querySearch.category[0]?.id
      condition.categoryId = numberCategory;
    }

    condition.onlyViewMyAssessment = this.isAddAssessmentPage ? 1 : 0;

    return condition;
  }

  getListMyAssessment() {
    this.isLoadingListAssessment = true;
    this.assessmentService.getListMyAssessments().subscribe(res => {
      this.isSearching = false;
      this.listSelectedAssessment = res.listMyAssessment;
      this.isLoadingListAssessment = false;
    }, err => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  getListAssessment() {
    this.isLoadingListAssessment = true;
    let condition = this.getSearchCondition();
    const query = this.jobService._convertObjectToQuery(condition);
    this.previousRouteService.replaceStage(`/job-seeker-assessments?${query}`);
    this.assessmentService.getListAssessment(condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.paginationConfig.totalRecord = res.total;
      this.dataAssessment = res.listAssessment;
    }, err => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  getDataMaster() {
    this.jobService.getListCategory().subscribe((listCategory: JobCategory[]) => {
      // listCategory.unshift({ id: 1, name: 'Custom Assessment(s)' });
      this.listCategory = listCategory;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  searchAssessment() {
    this.isSearching = true;
    this.paginationConfig.currentPage = 0
    // this.getListAssessment();
    setTimeout(() => {
      this.getListAssessment();
    }, 100)
  }

  paginationAssessment(page) {
    this.paginationConfig.currentPage = page;
    this.getListAssessment();
  }

  isSwitchAssessment(e) {
    this.isAddAssessmentPage = e;
    this.paginationConfig.currentPage = 0;
    if(!e && this.querySearch.category && this.querySearch.category[0]?.id == 1) this.querySearch.category = null;    
    this.getListAssessment();
  }

}
