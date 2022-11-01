

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CAPTCHA_ACTION, JOBSEEKER_PAYMENT_REDIRECT, STEP_CREATE_JOB, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CardInfo } from 'src/app/interfaces/cardInfo';
import { SendDataPayment } from 'src/app/interfaces/coupon';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';
import UsStates from "us-state-codes";

@Component({
  selector: 'ms-payment-shopping-cart-step1',
  templateUrl: './payment-shopping-cart-step1.component.html',
  styleUrls: ['./payment-shopping-cart-step1.component.scss']
})

export class PaymentShoppingCartStep1Component implements OnInit {
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
  isVisiableButtonPayment: boolean = false;
  disableFormAddress: boolean = false;
  isSubmitConfirmAddress: boolean = false;
  isConfirmBillingAddress: boolean = false;
  @Input() senData: SendDataPayment;
  @Output() back = new EventEmitter();
  @Output() continueStep = new EventEmitter();
  @Output() getAllCard = new EventEmitter();

  constructor(
    private router: Router,
    private ceoService: CeoService,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private paymentConvergeService: PaymentConvergeService,
    private subjectService: SubjectService,
    private jobService: JobService,
    private helperService: HelperService,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
    })
    this.subjectService.isSaveCard.subscribe((res) => {
      this.isSaveCard = res;
    })
    this.subjectService.cart.subscribe(data => {
      if (data) this.cardInfo = data;
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
      return Number.parseFloat((this.senData.subTotal - this.senData.discountValue + this.taxValue).toFixed(2));
    }
    return this.senData.subTotal - this.senData.discountValue;
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
      this.subjectService.user.next(Object.assign({}, this.userInfo, { billingInfo: this.billingInfo }))
      const body = Object.assign({}, this.convertData(this.formUpdate.value), {
        carts: this.senData.carts,
        coupon: this.senData.coupon ? this.senData.coupon?.code : ''
      })

      delete body.isSaveBilling;
      delete body.sub_total;
      delete body.discount_value;
      this.confirmPaymentData = body;

    }, err => {
      this.helperService.showToastError(err);
      this.taxValue = null;
    })
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async paymentCarts(body) {
    const tokenCaptcha = await this.generateCaptchaV3();
    body['g-recaptcha-response'] = tokenCaptcha;
    this.subjectService.isLoadingCard.next(true);
    this.subjectService.isSaveCard.next(this.isSaveCard);
    this.paymentService.confirmPaymentCardUpdate(body).subscribe(data => {
      this.subjectService.isLoadingCard.next(false);
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.getAllCard.emit(true);
    }, err => {
      this.helperService.showToastError(err);
      this.subjectService.isLoadingCard.next(false);
    })
  }

  async confirmPaymentSubmit() {
    this.paymentCarts(this.confirmPaymentData);
  }

  changeCardPaymentSubmit() {
    this.paymentConvergeService.getPayment(this.getTotalValue(), this.confirmPaymentData, USER_TYPE.EMPLOYER, JOBSEEKER_PAYMENT_REDIRECT.other).subscribe(()=>{

    }, err =>{
      this.subjectService.isLoadingCard.next(false);
    });
  }

  confirmInfomationCard() {
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

}
