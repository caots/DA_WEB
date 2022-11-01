import { get } from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'src/app/services/message.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { JobService } from 'src/app/services/job.service';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { Applicants } from 'src/app/interfaces/applicants';
import { ASSESSMENTS_TYPE, ASSESSMENT_STATUS, ASSESSMENT_WEIGHT, CAPTCHA_ACTION, CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL, CUSTOM_ASSESSMENT_INTRUCTION_TEXT, LIST_BENEFITS, MIN_VALUE_PRICE, PAYMENT_TYPE, SALARY_TYPE, TEST_ASSESSMENT_IMOCHA } from 'src/app/constants/config';
import { NavigationExtras, Router } from '@angular/router';
import { Assesment } from 'src/app/interfaces/assesment';
import { DataUpdate } from 'src/app/interfaces/questionCustomAssessment';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { Job } from 'src/app/interfaces/job';
import { cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment'
import { IsloginGuard } from 'src/app/guards/islogin.guard';
import { AnalyticServices } from 'src/app/services/analytics.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';
@Component({
  selector: 'ms-modal-apply-job',
  templateUrl: './modal-apply-job.component.html',
  styleUrls: ['./modal-apply-job.component.scss']
})
export class ModalApplyJobComponent implements OnInit {
  @ViewChild('modalPaymentFree', { static: true }) modalPaymentFree: NgbModalRef;
  @Input() job: Job;
  @Output() close = new EventEmitter();
  @Output() confirm = new EventEmitter();
  @Input() validateAssessments: any;
  @Input() listAssessmentJob: any;
  // @Input() settingsCard: any;
  settingsCard: any;
  @Input() jobDashboard: any;
  @Input() routerUrlJobDetails: string;
  formApplyJob: FormGroup;
  isCallingApi: boolean;
  user: UserInfo;
  listBenefits = cloneDeep(LIST_BENEFITS);
  listAssessmentJobAssign = [];
  checkValidate: boolean;
  isTakeTest: boolean;
  assessmentWeight: any = ASSESSMENT_WEIGHT;
  assessmentType = ASSESSMENTS_TYPE;
  modalPaymentConfirmationRef: NgbModalRef;
  modalPaymentFreeRef: NgbModalRef;
  cardInfo: CardInfo;
  assessmentData: any;
  customAssessment: DataUpdate;
  salaryType = SALARY_TYPE;
  valueSalaryType: number = SALARY_TYPE[0].id;
  listBenefistSelected: any[] = [];
  urlHistory: string;
  assessmentStatus: boolean = true;
  dataPaymentFree: any;
  titleSalaryType: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private jobService: JobService,
    private subjectService: SubjectService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private authService: AuthService,
    private paymentService: PaymentService,
    public assessmentService: AssessmentService,
    private helperService: HelperService,
    private analyticServices: AnalyticServices,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) { }

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      this.user = user;
    })
    this.subjectService.cart.subscribe(cart => {
      this.cardInfo = cart;
    })
    this.subjectService.settingsCard.subscribe(res => {
      this.settingsCard = res;
    })
    this.initForm()
    // this.listAssessmentJob.map(ass => {
    //   this.listAssessmentJobAssign.push(Object.assign({}, ass, { retry: false, point: null }))
    // })
    this.mergeWeightingToJob();
    this.analyticServices.eventOnClickApplyJob(this.job, false);    
  }

  mergeWeightingToJob() {
    let checkTakeTest = 0;
    this.listAssessmentJob.map(ass => {
      ass.weight = null;
      this.validateAssessments.map(validateAss => {
        if (validateAss.assessmentId === ass.assessmentId) {
          checkTakeTest++;
          ass.totalTake = validateAss.totalTake;
          ass.updated_at = validateAss.updated_at;
          ass.weight = validateAss.weight != null ? validateAss.weight.toFixed(0) : null;
          ass.current_testInvitationId = validateAss.current_testInvitationId;
          ass.current_testStatus = validateAss.current_testStatus;
          this.checkValidate = false;
          if (ass.weight === null && ass.totalTake > 0 && ass.current_testStatus != 'In Progress') {
            this.assessmentStatus = false;
          }
        }
      })
    })
    if (checkTakeTest < this.listAssessmentJob.length) this.isTakeTest = true;
  }

  initForm() {
    const iSalaryType = this.job.salaryType ? this.job.salaryType : this.valueSalaryType;
    if (this.job.salaryType) {
      this.salaryType = this.salaryType.filter(x => x.id == this.job.salaryType)
    }
    this.titleSalaryType = SALARY_TYPE.filter(type => type.id == iSalaryType)[0].title;
    this.formApplyJob = this.fb.group({
      salary: [''],
      salaryType: [iSalaryType]
    })
  }

  async submitJob(data) {
    const isConfirmed = await this.helperService.confirmPopup(MESSAGE.CONFIRM_APPLY_JOB, MESSAGE.BTN_APPLY_TEXT);
    if (!isConfirmed) {
      this.close.emit();
      return;
    }
    this.isCallingApi = true;
    let dataApply: any = {}
    dataApply.job_sekker_id = this.user.id;
    dataApply.employer_id = this.job.employerId;
    dataApply.job_id = this.job.id;
    dataApply.asking_salary = data.salary ? this.jobService.switchSalary(data.salary) : null;
    dataApply.asking_salary_type = parseInt(data.salaryType);
    dataApply.asking_benefits = this.listBenefistSelected.length > 0 ? this.listBenefistSelected.join(',') : '';
    this.jobService.applyJob(this.job.id, dataApply).subscribe((res: Applicants) => {
      this.confirm.emit();
      this.closeModal();
      this.isCallingApi = false;
      this.analyticServices.eventOnClickApplyJob(this.job, true);
      this.helperService.showToastSuccess(MESSAGE.APPLY_JOB_SUCCESSFULY);
    }, errorRes => {
      this.isCallingApi = false;
      if (errorRes == MESSAGE.scoreApplyJobInProgress) {
        this.helperService.showToastWarning(errorRes);
        return;
      }
      this.helperService.showToastError(errorRes);
    });
  }
  closeModal() {
    this.close.emit();
  }

  getFreeASttemptsRemaining(assessment: Assesment) {
    if (!assessment.totalTake) return this.settingsCard.free_assessment_validation || 0;
    const nmberOfFree = this.settingsCard.free_assessment_validation - assessment.totalTake;
    return nmberOfFree > 0 ? nmberOfFree : 0
  }

  goToValidateOrRetry(assessment, modalPaymentConfirmation) {
    if (assessment.type === ASSESSMENTS_TYPE.Custom) {
      this.onValidateCustomAssessment(assessment);
      this.close.emit();
      return;
    } else {
      const nbrCredits = get(this.user, 'nbrCredits', 0);
      const nbrFreeCredits = this.getFreeASttemptsRemaining(assessment);
      if (this.jobDashboard) {
        this.urlHistory = `${environment.url_webapp}job/${this.job.urlSeo}?apply=1&showAlert=1`;
      } else {
        const url = this.routerUrlJobDetails.indexOf('?') >= 0 ? `${environment.url_webapp}${this.routerUrlJobDetails}&apply=1&showAlert=1` :
          `${environment.url_webapp}${this.routerUrlJobDetails}?apply=1&showAlert=1`;
        this.urlHistory = url;
      }

      const checkTestAssessment = this.assessmentService.messageTestAssessmentJobseeker(nbrFreeCredits, nbrCredits);
      if (checkTestAssessment == TEST_ASSESSMENT_IMOCHA.NBR_UNAVAIL) {
        this.paymentAssessment(assessment, modalPaymentConfirmation, this.urlHistory);
        return;
      }

      const isPayment = nbrFreeCredits <= 0;
      if (assessment.retry) {
        this.onRetryAssessment(assessment, this.urlHistory, isPayment, checkTestAssessment);
      } else {
        this.onValidateAssessment(assessment, this.urlHistory, isPayment, checkTestAssessment);
      }
    }
  }

  showModalConfirmTakeTest() {
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

  async paymentAssessment(data: Assesment, modalPaymentConfirmation, urlHistory = '') {
    const isConfirmed = await this.helperService.confirmPopup(
      CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL,
      MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirmed) {
      this.dataPaymentFree = data;
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
      } else
        this.confirmPaymentAssessment(data, modalPaymentConfirmation, urlHistory);
    }
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
    const assessmentId = assessment.assessmentId ? assessment.assessmentId : assessment['assessment_id'];
    const jobId = get(this, 'job.id', 0);
    this.assessmentService.takeAssessment(assessment, jobId, this.urlHistory, isPayment).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_self');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }


  confirmPaymentAssessment(data: Assesment, modalPaymentConfirmation, urlHistory) {
    const assesmentTYpe = data.status === ASSESSMENT_STATUS.retry ? PAYMENT_TYPE.RetryValidateTest : PAYMENT_TYPE.ValidateTest;
    let body = {
      paymentType: assesmentTYpe,
      urlHistory: urlHistory,
      assessment: {
        assessmentId: data.assessmentId,
        type: data.type,
        name: data.name,
      } as Assesment,
      assessmentInfo: data,
      subTotal: this.settingsCard.standard_direct_message_price,
      discountValue: 0,
    }
    this.assessmentData = body;
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
    this.close.emit();
  }


  async onValidateCustomAssessment(assessment: Assesment) {
    let title = `${CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT}  <p class="text-center mb-3 mt-3 intruction-assessment-bottom">Good luck!</p> <div>${MESSAGE.CONFIRM_SWITCH_IMOCHA}</div>`;
    if (assessment.assessments_instruction && assessment.assessments_instruction != '')
      title = `${CUSTOM_ASSESSMENT_INTRUCTION_TEXT.TEXT}
        <p class="intruction-assessment"><span>6.</span> <span class="text-left"><b>Employer's Instructions: </b>${assessment.assessments_instruction}</span></p>
        <p class="text-center mt-3 mb-3 intruction-assessment-bottom">Good luck!</p> <div>${MESSAGE.CONFIRM_SWITCH_IMOCHA}</div>`;
    const isConfirmed = await this.helperService.confirmPopup(title, MESSAGE.BTN_YES_TEXT);
    if (!isConfirmed) {
      return;
    } else {
      this.getCustomAssessmentDetails(assessment);
      return;
    }
  }

  getCustomAssessmentDetails(assessment: Assesment) {
    const jobId = get(this, 'job.id', 0);
    this.assessmentService.takeAssessment(assessment, jobId, '', false).subscribe((data: DataUpdate) => {
      this.customAssessment = data;
      const navigationExtras: NavigationExtras = {
        state: {
          customAssessment: data,
          jobDashboard: this.jobDashboard,
          assessmentId: data.id,
          jobInfo: this.job
        }
      };
      // const url = this.router.serializeUrl(this.router.createUrlTree(['/job-seeker-test-assessments'], navigationExtras));
      // window.open(url, '_blank');
      this.router.navigate(['/job-seeker-test-assessments'], navigationExtras);

    }, err => {
      this.helperService.showToastError(err);
    })
  }

  async onValidateAssessment(assessment: Assesment, urlHistory = '', isPayment = false, checkTestAssessment) {
    const message = checkTestAssessment == TEST_ASSESSMENT_IMOCHA.NBR_AVAIL ? CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL : MESSAGE.CONFIRM_SWITCH_IMOCHA;
    const isConfirmed = await this.helperService.confirmPopup(message, MESSAGE.BTN_YES_TEXT);
    if (!isConfirmed) { return; }
    const jobId = get(this, 'job.id', 0);
    this.assessmentService.takeAssessment(assessment, jobId, urlHistory, isPayment).subscribe((res: any) => {
      const url = res.testUrl;
      window.open(url, '_self');
      this.authService.getUserInfo().subscribe(() => { })
    })
    this.close.emit();
  }

  async onRetryAssessment(assessment: Assesment, urlHistory = "", isPayment = false, checkTestAssessment) {
    const message = checkTestAssessment == TEST_ASSESSMENT_IMOCHA.NBR_AVAIL ? CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL : MESSAGE.CONFIRM_RETRY_IMOCHA;
    const isConfirmed = await this.helperService.confirmPopup(message, MESSAGE.BTN_OK_TEXT);
    if (!isConfirmed) { return; }
    // call api go to mocha
    const jobId = get(this, 'job.id', 0);
    this.assessmentService.takeAssessment(assessment, jobId, urlHistory, isPayment).subscribe((res: any) => {
      const url = res.testUrl;
      window.open(url, '_self');
      this.authService.getUserInfo().subscribe(() => { })
    })
    this.close.emit();

  }

  selectOptionSalary(value) {
    this.valueSalaryType = value;
  }
  selectBenefits(benefits) {
    const index = this.listBenefits.findIndex(c => c.id === benefits.id);
    this.listBenefits[index].status = !benefits.status;;
    if (!this.listBenefits[index].status && this.listBenefistSelected.length > 0) {
      const index = this.listBenefistSelected.findIndex(id => id === benefits.id);
      this.listBenefistSelected.splice(index, 1);
    } else {
      this.listBenefistSelected.push(benefits.id);
    }
  }

  checkRetryCustomAssessment(assessment: Assesment) {
    if (!assessment.totalTake) return true;
    assessment.job_seeker_assessments_time = assessment.updated_at;
    return this.assessmentService.checkRetryCustomAssessment(assessment);
  }
}
