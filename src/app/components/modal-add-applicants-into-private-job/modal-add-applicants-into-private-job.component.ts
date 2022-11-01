import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { CAPTCHA_ACTION, COUPON_DISCOUNT_FOR, COUPON_DISCOUNT_TYPE, COUPON_EXPIRED_TYPE, EMPLOYER_PAYMENT, MIN_VALUE_PRICE, NBR_USER_LIMIT, STEP_CREATE_JOB, USER_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { Coupon } from 'src/app/interfaces/coupon';
import { Job } from 'src/app/interfaces/job';
import { AuthService } from 'src/app/services/auth.service';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { PaymentConvergeService } from 'src/app/services/payment-converge.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-modal-add-applicants-into-private-job',
  templateUrl: './modal-add-applicants-into-private-job.component.html',
  styleUrls: ['./modal-add-applicants-into-private-job.component.scss']
})
export class ModalAddApplicantsIntoPrivateJobComponent implements OnInit {
  @Input() settingsCard: CardSettings;
  @Input() job: Job;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  numberJobseeker: any = 1;
  card: CardInfo;
  isLoadingCard: boolean;
  isSaveCard: number;
  step: number = STEP_CREATE_JOB.STEP_0;
  stepCreateJob = STEP_CREATE_JOB;
  COUPON_EXPIRED_TYPE = COUPON_EXPIRED_TYPE;
  COUPON_DISCOUNT_FOR = COUPON_DISCOUNT_FOR;
  COUPON_DISCOUNT_TYPE = COUPON_DISCOUNT_TYPE;
  NBR_USER_LIMIT = NBR_USER_LIMIT;
  couponText: string = '';
  couponData: Coupon;
  isValidCoupon: boolean;
  discountValue: number = 0;
  isVerySmallPriceTotal: boolean;
  senDataStep2: any;
  isLoadingPrivateApplicant: boolean = false;

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private paymentConvergeService: PaymentConvergeService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subjectService.isSaveCard.subscribe((res) => {
      this.isSaveCard = res;
    })
    this.subjectService.cart.subscribe(card => {
      this.card = card;
    });
    this.subjectService.isLoadingCard.subscribe(isLoadingCard => {
      this.isLoadingCard = isLoadingCard;
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  calcTotalMoney() {
    return this.numberJobseeker * this.settingsCard.private_job_price;
  }

  closeModal(event) {
    this.close.emit(event);
  }

  continuteStep(step) {
    if (step == STEP_CREATE_JOB.STEP_0) {
      this.step = STEP_CREATE_JOB.STEP_1;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_1) {
      this.step = STEP_CREATE_JOB.STEP_2;
      return;
    }
    if (step == STEP_CREATE_JOB.STEP_2) {
      return;
    }
  }

  backStep() {
    this.step = STEP_CREATE_JOB.STEP_0;
  }

  continueBillingUpgrade() {
    this.senDataStep2 = {
      jobs: [{
        id: this.job.id,
        private_applicants: this.numberJobseeker
      }],
      coupon: this.couponData,
      subTotal: this.calcTotalMoney(),
      discountValue: this.getDiscountValueCoupon()
    }
    this.continuteStep(STEP_CREATE_JOB.STEP_0);
  }

  checkCoupon() {
    this.paymentService.checkCoupon({ coupon: this.couponText }).subscribe(data => {
      if ((!data.isValid ||
        (data?.couponDetail && data.couponDetail.discount_for != COUPON_DISCOUNT_FOR.JOB_POSTING))) {
        this.isValidCoupon = false;
      } else this.isValidCoupon = true;
      this.couponData = this.isValidCoupon ? data.couponDetail : null;
      this.caclTotalPayCardWithCoupon();
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.couponData = null;
    })
  }

  getExpiredFromCoupon() {
    return moment(this.couponData.expired_to).format('L');
  }

  caclTotalPayCardWithCoupon() {
    if (this.couponData && (!this.isValidCoupon || this.couponData.discount_for != COUPON_DISCOUNT_FOR.JOB_POSTING)) return this.calcTotalMoney();
    const totalPrice = this.calcTotalMoney() - (this.discountValue || 0);
    if (totalPrice <= MIN_VALUE_PRICE && totalPrice > 0) this.isVerySmallPriceTotal = true;
    return totalPrice > 0 ? totalPrice : 0;
  }

  getDiscountValueCoupon() {
    if (!this.couponData) return 0;
    if (this.couponData.discount_type == COUPON_DISCOUNT_TYPE.FixedDollar) {
      this.discountValue = this.couponData.discount_value;
      return this.discountValue;
    }
    const value = ((this.couponData.discount_value / 100) * this.calcTotalMoney()).toFixed(2);
    const valueNumber = Number.parseFloat(value);
    this.discountValue = valueNumber > this.couponData.max_discount_value && this.couponData.max_discount_value != 0 ? this.couponData.max_discount_value : valueNumber;
    return this.discountValue;
  }

  paymentFreeCart() {
    const data = {
      id: this.job.id,
      private_applicants: this.numberJobseeker
    }
    this.submitPaymentProcess([data]);
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async submitPaymentProcess(data) {
    const tokenCaptcha = await this.generateCaptchaV3();
    data = { jobs: data, notPayment: 1, coupon: this.couponData?.code || '' };
    data['g-recaptcha-response'] = tokenCaptcha;
    this.isLoadingPrivateApplicant = true
    this.paymentService.confirmPaymentJobPrivate(data).subscribe(data => {
      this.subjectService.isLoadingCard.next(false);
      this.isLoadingPrivateApplicant = false
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.submit.emit();
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingPrivateApplicant = false
      this.subjectService.isLoadingCard.next(false);
    })
  }

  checkConfirmPayment() {
    if (!this.couponData) return false;
    const totalPrice = this.calcTotalMoney() - (this.discountValue || 0);
    return totalPrice <= MIN_VALUE_PRICE && totalPrice >= 0;
  }
}
