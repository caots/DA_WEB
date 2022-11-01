import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from 'src/app/services/payment.service';
import { HelperService } from 'src/app/services/helper.service';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { CAPTCHA_ACTION, COUPON_DISCOUNT_FOR, COUPON_DISCOUNT_TYPE, COUPON_EXPIRED_TYPE, MIN_VALUE_PRICE, NBR_USER_LIMIT, PAYMENT_TYPE, STEP_CREATE_JOB } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { SubjectService } from 'src/app/services/subject.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { Coupon } from 'src/app/interfaces/coupon';
import { AuthService } from 'src/app/services/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';

@Component({
  selector: 'ms-modal-top-up',
  templateUrl: './modal-top-up.component.html',
  styleUrls: ['./modal-top-up.component.scss']
})
export class ModalTopUpComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() settings: CardSettings;
  @Input() isJobseeker: boolean;
  @Input() isDmCandidate: boolean;
  selectTopup: any;
  topupOnePayment: any;
  modalPaymentConfirmationRef: NgbModalRef;
  cardInfo: CardInfo;
  userInfo: UserInfo;
  step: number = STEP_CREATE_JOB.STEP_0;
  stepCreateJob = STEP_CREATE_JOB;
  COUPON_EXPIRED_TYPE = COUPON_EXPIRED_TYPE;
  COUPON_DISCOUNT_FOR = COUPON_DISCOUNT_FOR;
  COUPON_DISCOUNT_TYPE = COUPON_DISCOUNT_TYPE;
  NBR_USER_LIMIT = NBR_USER_LIMIT;
  couponText: string = '';
  couponData: Coupon;
  isValidCoupon: boolean;
  ischeckCoupon: boolean = false;
  discountValue: number = 0;
  isVerySmallPriceTotal: boolean;
  senDataStep2: any;
  isLoadingPaymentTopup: boolean = false;

  constructor(
    private authService: AuthService,
    private subjectService: SubjectService,
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
    private changeDetector: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.subjectService.user.subscribe(data => {
      if (!data) return;
      this.userInfo = data;
    })
    this.subjectService.checkPaymentTopupDone.subscribe(data => {
      if (data) {
        this.close.emit();
        this.subjectService.checkPaymentTopupDone.next(false);
      }
    })
    this.subjectService.cart.subscribe(data => {
      if (data) this.cardInfo = data;
    })
    this.topupOnePayment = {
      name: "Buy 1 Credit",
      num_retake: 1,
      price: this.isDmCandidate ? this.settings.standard_direct_message_price : this.settings.standard_validation_price,
      // type: PAYMENT_TYPE.Credit
    };

  }
  
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  totlaPrice(topup) {
    if (!topup.price) return;
    return topup.price;
  }

  savePrice(topup) {
    if (!topup.num_retake) return;
    return this.settings.standard_validation_price * topup.num_retake - topup.price;
  }

  savePriceDmCandidate(topup) {
    if (!topup.num_dm) return;
    return this.settings.standard_direct_message_price * topup.num_dm - topup.price;
  }

  selectTopupPayment(topup) {
    topup = Object.assign({}, topup, { totalPrice: topup.price });
    this.selectTopup = topup;
  }

  closeModal(event) {
    this.close.emit();
  }

  progressOrder(modalPaymentConfirmation) {
    this.modalPaymentConfirmationRef = this.modalService.open(modalPaymentConfirmation, {
      windowClass: 'modal-payment-confirmation',
      size: 'lg'
    });
    this.close.emit();
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async submitPaymentProcess(topup, data) {
    if (this.isDmCandidate) data = Object.assign({}, data, { numCredit: topup.num_dm });
    else data = Object.assign({}, data, { numRetake: topup.num_retake });
    data = { ...data, notPayment: 1, coupon: this.couponData?.code || '' };

    const tokenCaptcha = await this.generateCaptchaV3();
    data['g-recaptcha-response'] = tokenCaptcha;

    if (this.isJobseeker) {
      this.paymentService.confirmPaymentCardJobseeker(data).subscribe(res => {
        this.authService.getUserInfo().subscribe((user) => { });
        this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
        this.close.emit();
      }, errorRes => {
        this.helperService.showToastError(errorRes);
      })
    } else {
      this.isLoadingPaymentTopup = true;
      this.paymentService.confirmPaymentCardEmployer(data).subscribe(res => {
        this.subjectService.isLoadingCard.next(false);
        this.isLoadingPaymentTopup = false;
        this.authService.getUserInfo().subscribe((user) => { });
        this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
        this.close.emit();
      }, errorRes => {
        this.helperService.showToastError(errorRes);
        this.isLoadingPaymentTopup = false;
      })
    }

    this.modalPaymentConfirmationRef?.close()
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
    console.log(this.selectTopup);
    let data = {
      paymentType: this.selectTopup.type && this.selectTopup.type == PAYMENT_TYPE.Credit ? PAYMENT_TYPE.Credit : PAYMENT_TYPE.Topup,
    }
    if (this.isDmCandidate) data = Object.assign({}, data, { numCredit: this.selectTopup.num_dm });
    else data = Object.assign({}, data, { numRetake: this.selectTopup.num_retake });
    this.senDataStep2 = {
      ...data,
      coupon: this.couponData,
      subTotal: this.totlaPriceSelectedTopup(),
      discountValue: this.getDiscountValueCoupon(),
      paymentType: data.paymentType
    }
    this.continuteStep(STEP_CREATE_JOB.STEP_0);
  }

  checkCoupon() {
    this.paymentService.checkCoupon({ coupon: this.couponText }).subscribe(data => {
      this.ischeckCoupon = true;
      if ((!data.isValid ||
        (data?.couponDetail && data.couponDetail.discount_for != COUPON_DISCOUNT_FOR.DIRECT_MESSAGE && data.couponDetail.discount_for != COUPON_DISCOUNT_FOR.RETAKE))) {
        this.isValidCoupon = false;
      } else this.isValidCoupon = true;
      this.couponData = this.isValidCoupon ? data.couponDetail : null;
      this.getDiscountValueCoupon();
      this.caclTotalPayCardWithCoupon();
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.couponData = null;
    })
  }

  getExpiredFromCoupon() {
    return moment(this.couponData.expired_to).format('L');
  }

  totlaPriceSelectedTopup() {
    return this.selectTopup?.totalPrice || 0;
  }

  caclTotalPayCardWithCoupon() {
    let totalPrice = 0;
    if (this.couponData && (!this.isValidCoupon || (this.couponData.discount_for != COUPON_DISCOUNT_FOR.DIRECT_MESSAGE && this.couponData.discount_for != COUPON_DISCOUNT_FOR.RETAKE))) {
      totalPrice = this.totlaPriceSelectedTopup();
    } else totalPrice = this.totlaPriceSelectedTopup() - (this.discountValue || 0);
    if (totalPrice <= MIN_VALUE_PRICE && totalPrice > 0) this.isVerySmallPriceTotal = true;
    return totalPrice > 0 ? totalPrice : 0;
  }

  getDiscountValueCoupon() {
    if (!this.couponData) return 0;
    if (this.couponData.discount_type == COUPON_DISCOUNT_TYPE.FixedDollar) {
      this.discountValue = this.couponData.discount_value;
      return this.discountValue;
    }
    const value = ((this.couponData.discount_value / 100) * this.totlaPriceSelectedTopup()).toFixed(2);
    const valueNumber = Number.parseFloat(value);
    this.discountValue = valueNumber > this.couponData.max_discount_value && this.couponData.max_discount_value != 0 ? this.couponData.max_discount_value : valueNumber;
    return this.discountValue;
  }

  paymentFreeCart() {
    let data = {
      paymentType: this.selectTopup.type && this.selectTopup.type == PAYMENT_TYPE.Credit ? PAYMENT_TYPE.Credit : PAYMENT_TYPE.Topup,
    }
    this.submitPaymentProcess(this.selectTopup, data);
  }

  checkConfirmPayment() {
    if (!this.couponData) return false;
    const totalPrice = this.totlaPriceSelectedTopup() - (this.discountValue || 0);
    return totalPrice <= MIN_VALUE_PRICE && totalPrice >= 0;
  }

}
