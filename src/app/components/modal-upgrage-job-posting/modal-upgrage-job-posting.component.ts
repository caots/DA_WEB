import * as moment from 'moment';
import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { Job } from 'src/app/interfaces/job';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { STEP_CREATE_JOB, JOB_NUMBER_OPENING_RANGE, CLOSE_MODAL_TYPE, TAB_TYPE, SALARY_TYPE, EMPLOYMENT_TYPE, COUPON_EXPIRED_TYPE, COUPON_DISCOUNT_FOR, NBR_USER_LIMIT, COUPON_DISCOUNT_TYPE, MIN_VALUE_PRICE, CAPTCHA_ACTION } from 'src/app/constants/config';
import { Coupon } from 'src/app/interfaces/coupon';
import { PaymentService } from 'src/app/services/payment.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MESSAGE } from 'src/app/constants/message';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';

@Injectable()
export class NgbDateCustomUpgradeParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = { day: <any>null, month: <any>null, year: <any>null }
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${HelperService.padNumber(date.month)}/${HelperService.padNumber(date.day)}/${date.year || ''}` :
      '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomUpgradeParserFormatter.formatDate(date);
  }
}
@Component({
  selector: 'ms-modal-upgrage-job-posting',
  templateUrl: './modal-upgrage-job-posting.component.html',
  styleUrls: ['./modal-upgrage-job-posting.component.scss']
})
export class ModalUpgrageJobPostingComponent implements OnInit {
  @Input() job: Job;
  @Input() settingsCard: CardSettings;
  @Output() close = new EventEmitter();

  step: number = STEP_CREATE_JOB.STEP_0;
  stepCreateJob = STEP_CREATE_JOB;
  initDateValue: any = CURRENT_DATE;
  initDateFeatureValue: any = CURRENT_DATE;
  currentExpireValue: any = CURRENT_DATE;
  placeHolderExpired: NgbDateStruct;
  maxExpireDateValue: any;
  expireDay: number = 1;
  expiredDate: Date;
  isCheckedUrgentHiring: boolean = false;
  valueUrgentHiring: number = 0;
  startHotJob: any;
  endHotJob: any;
  newDate: Date = new Date();
  hoveredDate: NgbDate | null = null;
  COUPON_EXPIRED_TYPE = COUPON_EXPIRED_TYPE;
  COUPON_DISCOUNT_FOR = COUPON_DISCOUNT_FOR;
  COUPON_DISCOUNT_TYPE = COUPON_DISCOUNT_TYPE;
  NBR_USER_LIMIT = NBR_USER_LIMIT;
  couponText: string = '';
  couponData: Coupon;
  isValidCoupon: boolean;
  discountValue: number = 0;
  isVerySmallPriceTotal: boolean;
  isLoadingUpgrade: boolean = false;
  subTotalCarts: number;
  senDataStep2: any;
  cardInfo: CardInfo;
  isAvailableExpired: boolean;
  oldFeatureDate: any[] = [];
  maxFeaturedDateStartOpen: any;
  totalPriceUpdate: any = 0;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private subjectService: SubjectService,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
    private cdRef : ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subjectService.cart.subscribe(data => {
      if (data) this.cardInfo = data;
    })
    if (this.job.is_make_featured == 0) {
      this.job.startHotJob = null;
      this.job.endHotJob = null;
    }
    if (new Date(this.job.expiredAt) > new Date()) {
      const nextDate = moment(new Date(this.job.expiredAt)).add(1, 'days');
      this.maxExpireDateValue = this.setMaxExpireDate(new Date(nextDate.format()), 45);
      this.currentExpireValue = this.setValueDatePicker(new Date(nextDate.format()));
      this.initDateValue = this.setValueDatePicker(new Date(nextDate.format()));
      //this.placeHolderExpired = this.setValueDatePicker(new Date(nextDate.format()));
      this.isAvailableExpired = true;
      this.maxFeaturedDateStartOpen = this.setValueDatePicker(new Date(this.job.expiredAt));
    } else {
      const nextDate = moment(new Date()).add(1, 'days');
      this.maxExpireDateValue = this.setMaxExpireDate(new Date(nextDate.format()), 45);
    }
    if (this.job.startHotJob && this.job.endHotJob && this.job.is_make_featured == 1) this.oldFeatureDate = this.getOldFeatureDates(this.job.startHotJob, this.job.endHotJob);
    // this.isCheckedUrgentHiring = this.job.addUrgentHiringBadge == 1;
    // this.valueUrgentHiring = this.job.addUrgentHiringBadge;
  }

  getOldFeatureDates(startDate, stopDate) {
    let dates = []
    const theDate = new Date(startDate)
    while (theDate < stopDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    return dates
  }

  checkValueUrgentHiring(value) {
    this.isCheckedUrgentHiring = !this.isCheckedUrgentHiring;
    this.valueUrgentHiring = value;
  }

  setMaxExpireDate(date, number) {
    date.setDate(new Date().getDate() + number);
    return this.setValueDatePicker(date);
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    this.expiredDate = myDate;
    let currentDate = this.isAvailableExpired ? new Date(this.job.expiredAt) : new Date();
    myDate.setHours(23, 59, 59, 999);
    currentDate.setHours(0, 0, 0, 0);
    const start = moment(currentDate);
    const end = moment(myDate);
    this.expireDay = end.diff(start, 'days');
    this.currentExpireValue = this.setValueDatePicker(myDate);
    this.placeHolderExpired = date;
  }

  setValueDatePicker(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  onDateSelection(date: NgbDate) {
    if (!this.startHotJob && !this.endHotJob) {
      this.startHotJob = this.convertNbDateToDate(date);
    } else if (this.startHotJob && !this.endHotJob && date && (date.after(this.formatFormDate(this.startHotJob)) || date.equals(this.formatFormDate(this.startHotJob)))) {
      this.endHotJob = this.convertNbDateToDate(date, true);
    } else {
      this.endHotJob = null;
      this.startHotJob = this.convertNbDateToDate(date);
    }
  }

  convertNbDateToDate(nbDate, isEndDate = false) {
    let date = `${nbDate.year}/${nbDate.month}/${nbDate.day}`;
    let result = new Date(date.toString());
    if (isEndDate) result.setHours(23, 59, 59, 999);
    return result;
  }

  getPriceByExpiredDate() {
    if (this.expireDay <= 0 || !this.placeHolderExpired) return 0;
    return this.expireDay * this.settingsCard?.standard_price;
  }

  getPriceByFeatureDate() {
    if (!this.startHotJob || !this.endHotJob) return 0;
    const start = moment(this.startHotJob);
    const end = moment(this.endHotJob);
    const days = end.diff(start, 'days') + 1;
    if (days <= 0) return 0;
    const subDays = this.checkOldFeatureDateJob(this.startHotJob, this.endHotJob);
    if (subDays == -1) return 0;
    return (days - subDays) * this.settingsCard?.featured_price;
  }

  checkOldFeatureDateJob(startHotJob, endHotJob) {
    if (this.job.startHotJob <= startHotJob && this.job.endHotJob >= endHotJob) return -1;
    if (this.job.endHotJob < startHotJob || this.job.startHotJob > endHotJob) return 0;
    if (this.job.endHotJob == startHotJob || this.job.startHotJob == endHotJob) return 1;
    if (startHotJob >= this.job.startHotJob && startHotJob <= this.job.endHotJob && endHotJob >= this.job.endHotJob) {
      const start = moment(startHotJob);
      const end = moment(this.job.endHotJob);
      const days = end.diff(start, 'days') + 1;
      return days;
    }

    if (this.job.startHotJob >= startHotJob && this.job.startHotJob <= endHotJob && this.job.endHotJob >= endHotJob) {
      const start = moment(this.job.startHotJob);
      const end = moment(endHotJob);
      const days = end.diff(start, 'days') + 1;
      return days;
    }

    if (this.job.startHotJob >= startHotJob && this.job.endHotJob <= endHotJob) {
      const start = moment(this.job.startHotJob);
      const end = moment(this.job.endHotJob);
      const days = end.diff(start, 'days') + 1;
      return days;
    }

    return 0;
  }

  closeModal(event = false) {
    this.close.emit(event);
  }

  continueBillingUpgrade() {
    if (!this.placeHolderExpired) this.expireDay = null;
    this.senDataStep2 = {
      jobs: [{
        id: this.job.id,
        expired_days: this.expireDay,
        is_make_featured: this.startHotJob && this.endHotJob ? 1 : 0,
        featured_start_date: this.startHotJob || null,
        featured_end_date: this.endHotJob || null,
        add_urgent_hiring_badge: this.valueUrgentHiring
      }],
      coupon: this.couponData,
      subTotal: this.calTotalUpgrade(),
      discountValue: this.getDiscountValueCoupon()
    }
    if (this.expireDay == 1) {
      const expiredDate = this.convertNbDateToDate(this.placeHolderExpired);
      this.senDataStep2.jobs[0]['expired_at'] = this.paymentService.addEndExpiredDays(expiredDate, 1).toISOString();
    }
    this.continuteStep(STEP_CREATE_JOB.STEP_0);
  }

  isHovered(date: NgbDate) {
    return this.startHotJob && !this.endHotJob && this.hoveredDate && date.after(this.formatFormDate(this.startHotJob)) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.endHotJob && date.after(this.formatFormDate(this.startHotJob)) && date.before(this.formatFormDate(this.endHotJob));
  }

  isRange(date: NgbDate) {
    return date.equals(this.formatFormDate(this.startHotJob)) || (this.endHotJob && date.equals(this.formatFormDate(this.endHotJob))) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  isHoliday(date: NgbDate) {
    if (this.oldFeatureDate.length <= 0) return '';
    const data = this.oldFeatureDate.find(featureDate => date.equals(this.formatFormDate(featureDate)));
    return data || '';
  }

  formatFormDate(date: Date): NgbDate {
    if (date) {
      return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      } as NgbDate
    }
    return;
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

  checkCoupon() {
    this.paymentService.checkCoupon({ coupon: this.couponText }).subscribe(data => {
      if ((!data.isValid ||
        (data?.couponDetail && data.couponDetail.discount_for != COUPON_DISCOUNT_FOR.JOB_POSTING))) {
        this.isValidCoupon = false;
      } else this.isValidCoupon = true;
      this.couponData = this.isValidCoupon ? data.couponDetail : null;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.couponData = null;
    })
  }

  getExpiredFromCoupon() {
    return moment(this.couponData.expired_to).format('L');
  }

  calTotalUpgrade() {
    const featurePrice = this.getPriceByFeatureDate() || 0;
    const ExpiredPrice = this.getPriceByExpiredDate() || 0;
    let hiringPrice = this.isCheckedUrgentHiring ? this.settingsCard.urgent_hiring_price : 0;
    if (this.job.addUrgentHiringBadge == 0 && this.placeHolderExpired) hiringPrice = hiringPrice * 2;
    return ExpiredPrice + featurePrice + hiringPrice;
  }

  caclTotalPayCardWithCoupon() {
    if (this.couponData && (!this.isValidCoupon || this.couponData.discount_for != COUPON_DISCOUNT_FOR.JOB_POSTING)) return this.calTotalUpgrade();
    const totalPrice = this.calTotalUpgrade() - (this.discountValue || 0);
    return totalPrice > 0 ? totalPrice : 0;
  }

  ngAfterViewChecked() {
    let totalPrice = this.calTotalUpgrade() - (this.discountValue || 0);
    if (totalPrice != this.totalPriceUpdate) { // check if it change, tell CD update view
      this.totalPriceUpdate = totalPrice;
      this.cdRef.detectChanges();
    }
  }

  checkConfirmPayment() {
    if(!this.couponData) return false;
    const totalPrice = this.calTotalUpgrade() - (this.discountValue || 0);
    return totalPrice <= MIN_VALUE_PRICE && totalPrice >= 0;
  }

  getDiscountValueCoupon() {
    if (!this.couponData) return 0;
    if (this.couponData.discount_type == COUPON_DISCOUNT_TYPE.FixedDollar) {
      this.discountValue = this.couponData.discount_value;
      return this.discountValue;
    }

    const value = ((this.couponData.discount_value / 100) * this.calTotalUpgrade()).toFixed(2);
    const valueNumber = Number.parseFloat(value);
    this.discountValue = valueNumber > this.couponData.max_discount_value && this.couponData.max_discount_value != 0 ? this.couponData.max_discount_value : valueNumber;
    return this.discountValue;
  }

  paymentFreeCart() {
    if (!this.placeHolderExpired) this.expireDay = null;
    const data = [{
      id: this.job.id,
      expired_days: this.expireDay,
      is_make_featured: this.startHotJob && this.endHotJob ? 1 : 0,
      featured_start_date: this.startHotJob || null,
      featured_end_date: this.endHotJob || null,
      add_urgent_hiring_badge: this.valueUrgentHiring
    }];
    if (this.expireDay == 1) {
      const expiredDate = this.convertNbDateToDate(this.placeHolderExpired);
      data[0]['expired_at'] = this.paymentService.addEndExpiredDays(expiredDate, 1).toISOString();
    }
    this.submitPaymentProcess(data);
  }

  generateCaptchaV3() {
    if (this.ceoService.checkLightHouseChorme()) return;
    return this.recaptchaV3Service.execute(CAPTCHA_ACTION.PAYMENT).toPromise();
  }

  async submitPaymentProcess(data) {
    const tokenCaptcha = await this.generateCaptchaV3();
    this.isLoadingUpgrade = true;
    const body = {
      jobs: data,
      notPayment: 1,
      coupon: this.couponData?.code || '',
      'g-recaptcha-response': tokenCaptcha
    }
    this.paymentService.confirmPaymentUpgradeUpdate(body).subscribe(res => {
      this.subjectService.isLoadingCard.next(false);
      this.isLoadingUpgrade = false;
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.close.emit(true)
    }, errorRes => {
      this.subjectService.isLoadingCard.next(false);
      this.isLoadingUpgrade = false;
      this.helperService.showToastError(errorRes);
    })
  }
}

const CURRENT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
}
