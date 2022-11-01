import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CAPTCHA_ACTION, EMPLOYER_PAYMENT, JOBSEEKER_PAYMENT_REDIRECT, STEP_CREATE_JOB, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { Assesment } from 'src/app/interfaces/assesment';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { SendDataUpgrade } from 'src/app/interfaces/coupon';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AuthService } from 'src/app/services/auth.service';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { MessageService } from 'src/app/services/message.service';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';
import UsStates from "us-state-codes";
@Component({
  selector: 'ms-upgrade-job-step1',
  templateUrl: './upgrade-job-step1.component.html',
  styleUrls: ['./upgrade-job-step1.component.scss']
})
export class UpgradeJobStep1Component implements OnInit {
  formUpdate: FormGroup;
  isLoading: boolean = false;
  listCity: Array<any> = [];
  listState: Array<any> = [];
  listCityStore: any[] = [];
  userInfo: UserInfo;
  listZipCode: any[];
  isCheckSaveBilling: boolean = true;
  isConfirmInformation: boolean = false;
  isSaveCard: number = 1;
  cardInfo: CardInfo;
  taxValue: number;
  billingInfo: any;
  confirmPaymentData: any;
  assessmentInfo: any;
  USER_TYPE = USER_TYPE;
  isVisiableButtonPayment: boolean = false;
  disableFormAddress: boolean = false;
  isSubmitConfirmAddress: boolean = false;
  isConfirmBillingAddress: boolean = false;

  @Input() senData: SendDataUpgrade;
  @Input() settingsCard: CardSettings;
  @Input() isTopupJobseeker: boolean;
  @Input() isAddApplicant: boolean;
  @Input() isUpgradeJob: boolean;
  @Input() isDirectMessage: boolean;
  @Input() isPaymentAssessment: boolean;
  @Input() isPaymentTopup: boolean;
  @Output() back = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() continueStep = new EventEmitter();
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private paymentConvergeService: PaymentConvergeService,
    private subjectService: SubjectService,
    private jobService: JobService,
    private assessmentService: AssessmentService,
    private helperService: HelperService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) { }

  ngOnInit(): void {
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
    })
    this.subjectService.isSaveCard.subscribe((res) => {
      this.isSaveCard = res;
    })
    this.subjectService.cart.subscribe(data => {
      if(data) this.cardInfo = data;
    })
    this.initForm();
    this.getDataCity();
    this.subjectService.user.subscribe(user => {
      if (!user) return;
      this.userInfo = user;
      this.formUpdate.get('company').setValue(this.userInfo.company_name || '');
      if (this.userInfo.billingInfo) this.bindingData(this.userInfo.billingInfo);
    })
  }

  initForm() {
    this.formUpdate = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      company: [''],
      address_line1: ['', [Validators.required]],
      address_line2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]]
    })
  }

  bindingData(data) {
    this.formUpdate.get('firstName').setValue(data.first_name);
    this.formUpdate.get('lastName').setValue(data.last_name);
    this.formUpdate.get('company').setValue(data.company_name || '');
    this.formUpdate.get('address_line1').setValue(data.address_line_1);
    this.formUpdate.get('address_line2').setValue(data.address_line_2 || '');
    this.formUpdate.get('city').setValue(data.city_name);
    this.formUpdate.get('state').setValue(data.state_name);
    this.formUpdate.get('zipcode').setValue(data.zip_code);
  }

  convertData(form) {
    const data = {
      first_name: form.firstName,
      last_name: form.lastName,
      company_name: form.company,
      address_line_1: form.address_line1,
      address_line_2: form.address_line2,
      city_name: form.city || '',
      state_name: form.state || '',
      zip_code: Number.parseInt(form.zipcode),
      isSaveBilling: this.isCheckSaveBilling ? 1 : 0,
      sub_total: this.senData.subTotal,
      discount_value: this.senData.discountValue,
      payment_type: this.senData.paymentType,
    }

    return data;
  }

  selectZipcode = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listZipCode, query, 10);
      })
    )
  }


  selectState(value) {
    const stateName = value;
    this.formUpdate.get('city').setValue('');
    const index = this.listState.findIndex(state => state == stateName);
    if (index >= 0) {
      const code = UsStates.getStateCodeByStateName(this.listState[index]);
      this.listCity = this.listCityStore.filter(res => res.adminCode == code);
    }

  }

  getDataCity(code = '') {
    this.listCityStore = [];
    this.jobService.getAllCity().subscribe(listCity => {
      this.listCityStore = listCity;
      this.getDataState();
    });
  }

  getDataState() {
    this.jobService.getAllState().subscribe(listState => {
      this.listState = listState;
      const index = this.listState.findIndex(state => state == this.userInfo.stateName);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }

  getTotalValue() {
    if (this.taxValue) {
      if(this.isDirectMessage){
        return Number.parseFloat((this.settingsCard.standard_direct_message_price + this.taxValue).toFixed(2));
      } else if(this.isPaymentAssessment ){
        return Number.parseFloat((this.settingsCard.standard_validation_price + this.taxValue).toFixed(2));
      }else return Number.parseFloat((this.senData.subTotal - this.senData.discountValue + this.taxValue).toFixed(2));
    }
    if(this.isDirectMessage) return this.settingsCard.standard_direct_message_price;
    else if(this.isPaymentAssessment ) return this.settingsCard.standard_validation_price;
    else return this.senData.subTotal - this.senData.discountValue;
  }

  getTaxValue() {
    return this.taxValue ? `${this.taxValue}` : '';
  }

  onSubmitGetTax(data) {
    this.paymentService.getTaxForPayment(data).subscribe(res => {
      this.taxValue = res.avatax.tax;
      this.isConfirmInformation = true;
      this.billingInfo = res.userBillingInfo;
      this.continueStep.emit(STEP_CREATE_JOB.STEP_0);
      this.subjectService.user.next(Object.assign({}, this.userInfo, {billingInfo: this.billingInfo}))
      let body: any;
      if(this.isUpgradeJob || this.isAddApplicant){
        body = Object.assign({}, this.convertData(this.formUpdate.value), {
          jobs: this.senData.jobs,
          coupon: this.senData.coupon ? this.senData.coupon?.code : ''
        })
      }
      if(this.isPaymentTopup || this.isDirectMessage || this.isPaymentAssessment){
        body = Object.assign({}, this.convertData(this.formUpdate.value), {
          ...this.senData,
          coupon: this.senData.coupon ? this.senData.coupon?.code : ''
        })
      }
      delete body.isSaveBilling;
      delete body.sub_total;
      delete body.discount_value;
      this.confirmPaymentData = body;
      if(this.isPaymentAssessment) this.assessmentInfo = body.assessmentInfo;

    }, err => {
      this.helperService.showToastError(err);
      this.taxValue = null;
    })
  }

  async paymentCarts(body) {
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    this.paymentService.confirmPaymentUpgradeUpdate(body).subscribe(data => {
      this.subjectService.isLoadingCard.next(false);
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.close.emit(true);
    }, err => {
      this.helperService.showToastError(err);
      this.subjectService.isLoadingCard.next(false);
    })
  }

  async paymentAddApplicant(body) {
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    this.paymentService.confirmPaymentJobPrivate(body).subscribe(data => {
      this.subjectService.isLoadingCard.next(false);
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.close.emit(true);
    }, err => {
      this.helperService.showToastError(err);
      this.subjectService.isLoadingCard.next(false);
    })
  }

  async paymentDirectMessageEmployer(body) {
    const candidateInfo = body.candidateInfo;
    delete body.candidateInfo;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardEmployer(body).subscribe(res => {
      this.subjectService.isLoadingCard.next(false);
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      candidateInfo.chat_group_id = res.groupId;
      this.messageService.redirectToDSCandidateCenter(candidateInfo);
      this.close.emit(true);
    }, err => {
      this.helperService.showToastError(err);
      this.subjectService.isLoadingCard.next(false);
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async paymentTopup(body){
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    if (this.isTopupJobseeker) {
      this.paymentService.confirmPaymentCardJobseeker(body).subscribe(res => {
        const nbrCredit = this.userInfo.nbrCredits ? this.userInfo.nbrCredits : 0;
        const newnbrCredit = body.numRetake;
        this.userInfo.nbrCredits = nbrCredit + newnbrCredit;
        this.subjectService.user.next(this.userInfo);
        this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
        this.subjectService.isLoadingCard.next(false);
        this.close.emit(true);
      }, errorRes => {
        this.helperService.showToastError(errorRes);
        this.subjectService.isLoadingCard.next(false);
      })
    } else {
      this.paymentService.confirmPaymentCardEmployer(body).subscribe(res => {
        const nbrCredit = this.userInfo.nbrCredits ? this.userInfo.nbrCredits : 0;
        const newnbrCredit = body.numCredit;
        this.subjectService.isLoadingCard.next(false);
        this.userInfo.nbrCredits = nbrCredit + newnbrCredit;
        this.subjectService.user.next(this.userInfo);
        this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
        this.close.emit(true);
      }, errorRes => {
        this.helperService.showToastError(errorRes);
        this.subjectService.isLoadingCard.next(false);
      })
    }
  }

  async paymentAssessment(body){
    this.assessmentInfo = body.assessmentInfo;
    delete body.assessmentInfo;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.paymentService.confirmPaymentCardJobseeker(body).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.subjectService.isLoadingCard.next(false);
      this.close.emit(true);
      // redirect to IMOCHA
      this.callTakeValidateService(body.assessment, true, body.urlHistory);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.subjectService.isLoadingCard.next(false);
    })
  }

  async confirmPaymentSubmit() {
    if(this.isAddApplicant) this.paymentAddApplicant(this.confirmPaymentData);
    if(this.isUpgradeJob) this.paymentCarts(this.confirmPaymentData);
    if(this.isPaymentTopup) this.paymentTopup(this.confirmPaymentData);
    if(this.isDirectMessage) this.paymentDirectMessageEmployer(this.confirmPaymentData);
    if(this.isPaymentAssessment) this.paymentAssessment(this.confirmPaymentData);
  }

  changeCardPaymentSubmit() {
    this.continueStep.emit(STEP_CREATE_JOB.STEP_1);
    if(this.isAddApplicant) this.paymentConvergeService.getPayment(this.getTotalValue(), this.confirmPaymentData, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.private).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));
    if(this.isUpgradeJob) this.paymentConvergeService.getPayment(this.getTotalValue(), this.confirmPaymentData, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.upgrade).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));
    if(this.isPaymentTopup){
      if(this.isTopupJobseeker){
      this.paymentConvergeService.getPayment(this.getTotalValue(), this.confirmPaymentData, USER_TYPE.JOB_SEEKER, JOBSEEKER_PAYMENT_REDIRECT.profile).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));
      }else{
        this.paymentConvergeService.getPayment(this.getTotalValue(), this.confirmPaymentData, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.messageTopup).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));
      }
    } 
    if(this.isDirectMessage) this.paymentConvergeService.getPayment(this.settingsCard.standard_direct_message_price, this.confirmPaymentData, USER_TYPE.EMPLOYER, EMPLOYER_PAYMENT.messageTopup).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));
    if(this.isPaymentAssessment) this.paymentConvergeService.getPayment(this.settingsCard.standard_validation_price, this.confirmPaymentData, USER_TYPE.JOB_SEEKER, JOBSEEKER_PAYMENT_REDIRECT.imocha).subscribe(()=> {}, err => this.subjectService.isLoadingCard.next(false));

  }

  confirmInfomationCard(){
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }
    this.disableFormAddress = true;

    this.isVisiableButtonPayment = true;
    this.isSubmitConfirmAddress = true;
    if(this.isConfirmBillingAddress) return;
    const data = this.convertData(this.formUpdate.value);
    this.onSubmitGetTax(data);
  }

  editFormAddress() {
    this.isConfirmBillingAddress = false;
    this.isVisiableButtonPayment = false;
    this.disableFormAddress = false;
  }

  saveFormAddress() {
    this.helperService.markFormGroupTouched(this.formUpdate);
    if (this.formUpdate.invalid) {
      return;
    }
    this.isConfirmBillingAddress = true;
    this.disableFormAddress = true;
    const data = this.convertData(this.formUpdate.value);
    this.onSubmitGetTax(data);
  }

  closeModal() {
    this.back.emit();
  }

  callTakeValidateService(assessment: Assesment, isPayment = false, urlHistory = '') {
    const assessmentId = assessment.assessmentId ? assessment.assessmentId : assessment['assessment_id'];
    const jobId = 0;
    this.assessmentService.takeAssessment(assessment, jobId, urlHistory, isPayment).subscribe((res: any) => {
      if (res) {
        const url = res.testUrl;
        window.open(url, '_self');
        this.authService.getUserInfo().subscribe(() => { })
      }
    })
  }

}
