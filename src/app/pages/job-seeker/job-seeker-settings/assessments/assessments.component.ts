import { get } from 'lodash';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {
  ASSESSMENT_STATUS,
  CAPTCHA_ACTION,
  CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL,
  PAGING,
  PAYMENT_TYPE
} from 'src/app/constants/config';
import { UserService } from 'src/app/services/user.service';
import { Assesment } from 'src/app/interfaces/assesment';
import { SubjectService } from 'src/app/services/subject.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { JobService } from 'src/app/services/job.service';
import { SearchAssessment } from 'src/app/interfaces/search';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { AssessmentService } from 'src/app/services/assessment.service';
import { MESSAGE } from 'src/app/constants/message';
import { PaymentService } from 'src/app/services/payment.service';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';


@Component({
  selector: 'ms-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})

export class AssessmentsComponent implements OnInit {
  @Output() next = new EventEmitter();
  isCallingApi: boolean = false;
  isAddAssessmentPage: boolean = true;
  dataAssessment: Array<Assesment> = [];
  listSelectedAssessment: any = [];
  querySearch: SearchAssessment;
  isLoadingListAssessment: boolean;
  listCategory: Array<JobCategory> = [];
  isSearching: boolean;
  paginationConfig: PaginationConfig;
  isAdding: boolean;
  assessmentSocket: any;
  ignoreValidated: number = 1;
  modalPaymentConfirmationRef: NgbModalRef;
  cardInfo: CardInfo;
  settingsCard: CardSettings;
  userData: UserInfo;
  titleConfirmPayment: string;
  assessmentData: any;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private jobService: JobService,
    private assessmentService: AssessmentService,
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) {
    this.querySearch = new SearchAssessment();
  }

  ngOnInit(): void {
    this.subjectService.user.subscribe(res => {
      this.userData = res
    })
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
    })
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.getListMyAssessment();
    this.getListAssessment();
    this.getDataMaster();
  }

  continueStep() {
    this.isCallingApi = true;
    this.userService.completeSignUpStep().subscribe(res => {
      this.authService.getUserInfo().subscribe(userInfo => {
        this.next.emit();
        this.isCallingApi = false;
        this.authService.saveUser({
          role: userInfo.accountType,
          signUpStep: userInfo.signUpStep
        })
      })
    }, err => {
      this.isCallingApi = false;
      this.helperService.showToastSuccess(err);
    })
  }

  searchStep() {
    this.isAddAssessmentPage = !this.isAddAssessmentPage;
    if (this.isAddAssessmentPage) {
      this.getListMyAssessment();
    }
  }

  removeAssessment(assessment) {
    this.assessmentService.removeAssessment(assessment.assessmentId ? assessment.assessmentId : assessment.assessment_id, assessment.type).subscribe(res => {
      this.isAdding = false;
      this.getListAssessment();
      this.getListMyAssessment();
      this.helperService.showToastSuccess(MESSAGE.REMOVE_ASSESSMENT);
    }, errorRes => {
      this.isAdding = false;
      this.helperService.showToastError(errorRes);
    })
  }

  addAssessment(assessment) {
    this.assessmentService.addAssessment(assessment.assessment_id, assessment.type).subscribe(res => {
      this.isAdding = false;
      this.getListAssessment();
      this.getListMyAssessment();
      this.helperService.showToastSuccess(MESSAGE.ADDED_ASSESSMENT);
    }, errorRes => {
      this.isAdding = false;
      this.helperService.showToastError(errorRes);
    })
  }

  async paymentAssessment(data: Assesment, modalPaymentConfirmation) {
    this.titleConfirmPayment = CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL;
    const isConfirmed = await this.helperService.confirmPopup(
      this.titleConfirmPayment,
      MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirmed) {
      this.confirmPaymentAssessment(data, modalPaymentConfirmation);
    }
  }

  confirmPaymentAssessment(data: Assesment, modalPaymentConfirmation) {
    const assesmentType = data.status === ASSESSMENT_STATUS.retry ? PAYMENT_TYPE.RetryValidateTest : PAYMENT_TYPE.ValidateTest;
    let body = {
      paymentType: assesmentType,
      assessment: {
        assessmentId: data.assessmentId,
        type: data.type,
        name: data.name
      } as Assesment
    }
    this.assessmentData = body;
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
  }


  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
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

  callTakeValidateService(assessment: Assesment, isPayment = false) {
    this.assessmentService.takeAssessment(assessment, 0, '', isPayment).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_blank');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }

  async validateAssessment(assessment: Assesment, modalPaymentConfirmation = null) {
    const nbrCredits = get(this.userData, 'nbrCredits', 0);
    const nbrFreeCredits = get(this.userData, 'nbrFreeCredits', 0);
    let numberTest = nbrCredits + nbrFreeCredits;
    //payment
    assessment.assessmentId = assessment.assessment_id ? assessment.assessment_id : assessment.assessmentId;
    if (numberTest < 1) {
      this.paymentAssessment(assessment, modalPaymentConfirmation);
      return;
    }
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_SWITCH_IMOCHA, MESSAGE.BTN_YES_TEXT);
    if (!isConfirmed) {
      return;
    }
    const isPayment = nbrFreeCredits <= 0;
    this.callTakeValidateService(assessment, isPayment);
  }

  async retryAssessment(assessment: Assesment, modalPaymentConfirmation) {
    const nbrCredits = get(this.userData, 'nbrCredits', 0);
    const nbrFreeCredits = get(this.userData, 'nbrFreeCredits', 0);
    let numberTest = nbrCredits + nbrFreeCredits;
    //  payment
    if (numberTest < 1) {
      this.paymentAssessment(assessment, modalPaymentConfirmation);
      return;
    }
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_RETRY_IMOCHA, MESSAGE.BTN_CONTINUE_TEXT);
    if (!isConfirmed) { return; }
    const isPayment = nbrFreeCredits <= 0;
    this.callTakeValidateService(assessment, isPayment);
  }

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

    return condition;
  }

  getListMyAssessment() {
    this.isLoadingListAssessment = true;
    this.assessmentService.getListMyAssessments().subscribe(res => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.listSelectedAssessment = res.listMyAssessment;
    }, err => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  getListAssessment() {
    this.isLoadingListAssessment = true;
    let condition = this.getSearchCondition();
    this.assessmentService.getListAssessment(condition).subscribe(res => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.paginationConfig.totalRecord = res.total;
      this.dataAssessment = res.listAssessment;
      // .filter(assessment => {
      //   return assessment.job_seeker_assessments_status == null
      // });
      // this.listSelectedAssessment = res.listAssessment.filter(assessment => {
      //   return assessment.job_seeker_assessments_status != null
      // });
    }, err => {
      this.isSearching = false;
      this.isLoadingListAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  getDataMaster() {
    this.jobService.getListCategory().subscribe((listCategory: JobCategory[]) => {
      this.listCategory = listCategory;
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  searchAssessment() {
    this.isSearching = true;
    this.paginationConfig.currentPage = 0
    setTimeout(() => {
      this.getListAssessment();
    }, 100)
  }

  paginationAssessment(page) {
    this.paginationConfig.currentPage = page;
    this.getListAssessment();
  }

}
