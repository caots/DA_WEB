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
  isLoadingUpgrade: boolean = false;
  cardInfo: CardInfo;
  isAvailableExpired: boolean;
  oldFeatureDate: any[] = [];
  maxFeaturedDateStartOpen: any;
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

  closeModal(event = false) {
    this.close.emit(event);
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

  async submitPaymentProcess(data) {
    this.isLoadingUpgrade = true;
    const body = {
      jobs: data
    }
    this.paymentService.confirmPaymentUpgradeUpdate(body).subscribe(res => {
      this.isLoadingUpgrade = false;
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.close.emit(true)
    }, errorRes => {
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
