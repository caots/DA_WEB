import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { PaymentConvergeService } from './../../../services/payment-converge.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Injectable, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MESSAGE } from 'src/app/constants/message';
import { PaymentService } from 'src/app/services/payment.service';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts'
import { SubjectService } from 'src/app/services/subject.service';
import { CardInfo, CardSettings } from 'src/app/interfaces/cardInfo';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { Job } from 'src/app/interfaces/job';
import { USER_TYPE, JOBSEEKER_PAYMENT_REDIRECT, COUPON_DISCOUNT_TYPE, NBR_USER_LIMIT, TAB_TYPE, COUPON_DISCOUNT_FOR, PAYMENT_TYPE, EMPLOYER_PAYMENT, STEP_CREATE_JOB, COUPON_EXPIRED_TYPE, MIN_VALUE_PRICE, CAPTCHA_ACTION } from 'src/app/constants/config';
import { Coupon, SendDataPayment } from 'src/app/interfaces/coupon';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CeoService } from 'src/app/services/ceo.service';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

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
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}
@Component({
  selector: 'ms-shopping-card',
  templateUrl: './shopping-card.component.html',
  styleUrls: ['./shopping-card.component.scss']
})
export class ShoppingCardComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  modalPaymentConfirmationRef: NgbModalRef;
  modalEditJobRef: NgbModalRef;
  isChecked: boolean = false;
  isLoadingCards: boolean = true;
  listCards: ItemJobCarts[] = [];
  settingsCard: CardSettings;
  editingJob: Job;
  checkValidDate: boolean = true;
  subScriptions: Subscription[] = [];
  cardInfo: CardInfo;
  listLevel: Array<JobLevel> = [];
  listCategory: Array<JobCategory> = [];
  listAssessment: Array<Assesment> = [];
  isAddingJob: boolean;
  isSaveCard = 1;
  isLoadingCard: boolean;
  isPriveJob: boolean;
  typeTabs = TAB_TYPE;
  numberOfApplciant: any = 1;
  isDetail: boolean = true;
  userType = USER_TYPE;
  isCheckPaiedJob: boolean = false;

  constructor(
    private calendar: NgbCalendar,
    private _location: Location,
    private router: Router,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private helperService: HelperService,
    private jobService: JobService,
    private subjectService: SubjectService,
    private paymentConvergeService: PaymentConvergeService,
    private cdr: ChangeDetectorRef,
    private recaptchaV3Service: ReCaptchaV3Service,
    private ceoService: CeoService,
  ) { }

  ngOnInit(): void {
    this.checkJobPaymentCart();
    this.getAllCards();
    this.getCardSettings();
    this.getCardInfo();
    this.getDataMaster();
    this.subjectService.isSaveCard.subscribe((res) => {
      this.isSaveCard = res;
    })
    this.subjectService.isLoadingCard.subscribe((res) => {
      //console.log(res);
      this.isLoadingCard = res;
    })
  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  changeNumberPrivateJob(number, card: ItemJobCarts) {
    card.privateApplicants = (!number || number == '' || number <= 0) ? 1 : number;
    this.updatePrivateJob(card);
  }

  checkJobPaymentCart() {
    this.subjectService.jobsCart.subscribe(jobIds => {
      //console.log(jobIds);
      if (!jobIds || !this.listCards) return;
      let idsRm = [];
      jobIds.map(job => {
        idsRm.push(job.id);
      })
      const listNewCards = this.listCards.filter(card => !idsRm.includes(card.id));
      this.listCards = listNewCards;
    })
  }


  getAllCards(isPayment = false) {
    this.isLoadingCards = true;
    const listCardsSubscrition = this.paymentService.getAllJobInCard().subscribe(cards => {
      this.listCards = cards;
      this.checkExpiredDateJob();
      this.subjectService.listCard.next(cards);
      this.isLoadingCards = false;
      if(isPayment) this.router.navigate(['/employer-dashboard']);
    }, errorRes => {
      this.isLoadingCards = false;
    })
    this.subScriptions.push(listCardsSubscrition);
  }

  checkExpiredDateJob(){
    this.listCards.map((cart, index) => {
      if(cart.jobExpiredDays == 1){
        this.listCards[index].jobExpiredAt = this.paymentService.addEndExpiredDays(new Date(), 2).toISOString();
      }
    })
  }

  getCardSettings() {
    this.paymentService.getSettingsPayment().subscribe(res => {
      this.settingsCard = res;
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

  increasePercentTravel(cartJob: ItemJobCarts, type) {
    if (this.numberOfApplciant == '' || !this.numberOfApplciant) this.numberOfApplciant = 1;
    if (type) {
      this.numberOfApplciant += 1;
    } else {
      this.numberOfApplciant -= 1;
      if (this.numberOfApplciant <= 1) this.numberOfApplciant = 1;
    }
    if (cartJob.privateApplicants == this.numberOfApplciant) return;
    cartJob.privateApplicants = this.numberOfApplciant;
    this.updatePrivateJob(cartJob);
  }

  deleteItemCard(card: ItemJobCarts) {
    const deleteCardSubscrition = this.paymentService.deleteJobCarts(card.id).subscribe(res => {
      this.helperService.showToastSuccess(MESSAGE.DELETE_JOB_CARD_SUCCESSFULLY);
      this.getAllCards();
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
    this.subScriptions.push(deleteCardSubscrition);
  }

  onDateSelection(date: NgbDate, card: ItemJobCarts) {
    let index = this.listCards.findIndex(c => c.id === card.id);
    if (!card.startHotJob && !card.endHotJob) {
      this.listCards[index].startHotJob = this.convertNbDateToDate(date, 1);;
    } else if (card.startHotJob && !card.endHotJob && date && (date.after(this.formatFormDate(card.startHotJob)) || date.equals(this.formatFormDate(card.startHotJob)))) {
      this.listCards[index].endHotJob = this.convertNbDateToDate(date, 2);
      this.checkValidDate = true;
    } else {
      this.listCards[index].endHotJob = null;
      this.checkValidDate = false;
      this.listCards[index].startHotJob = this.convertNbDateToDate(date, 1);
    }
    // check date hot job and expired date    
    if (this.listCards[index].startHotJob && this.listCards[index].endHotJob) {
      if (this.listCards[index].startHotJob < this.listCards[index].maxStartHotJob ||
        this.listCards[index].endHotJob > this.listCards[index].maxEndHotJob
      ) {
        this.listCards[index].warningDate = MESSAGE.WARNING_HOT_JOB_CARD;
        this.listCards[index].startHotJob = null;
        this.listCards[index].endHotJob = null;
        this.updateJobFeaturedDate(card, false);
        this.checkValidDate = false;
      } else {
        this.listCards[index].warningDate = null;
        this.updateJobFeaturedDate(card, true);
      }
    }
  }

  updateJobFeaturedDate(card: ItemJobCarts, type) {
    //console.log(card);
    let data = {
      is_private: card.isPrivate,
      featured_end_date: type ? new Date(card.endHotJob).toISOString() : null,
      featured_start_date: type ? new Date(card.startHotJob).toISOString() : null,
      is_make_featured: type ? 1 : 0,
      add_urgent_hiring_badge: card.isUrgentHiring
    }
    this.jobService.editHotJob(data, card.jobId).subscribe(res => {
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  updatePrivateJob(card: ItemJobCarts) {
    let data = {
      is_private: card.isPrivate,
      private_applicants: card.privateApplicants
    }
    this.jobService.editHotJob(data, card.jobId).subscribe(res => {
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    })
  }

  async submitPaymentProcess(data) {
    const body = {
      listCarts: data,
    }    
    this.isLoadingCard = true;
    const confirmPaymentSubscrition = this.paymentService.confirmPaymentCard(body).subscribe(res => {
      this.getAllCards(true);
      this.helperService.showToastSuccess(MESSAGE.CONFIRM_PAYEMNT_SUCCESSFULY);
      this.isLoadingCard = false;
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.isLoadingCard = false;
    })
    this.subScriptions.push(confirmPaymentSubscrition);
  }

  isHovered(date: NgbDate, card: ItemJobCarts) {
    return card.startHotJob && !card.endHotJob && this.hoveredDate && date.after(this.formatFormDate(card.startHotJob)) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate, card) {
    return card.endHotJob && date.after(this.formatFormDate(card.startHotJob)) && date.before(this.formatFormDate(card.endHotJob));
  }

  isRange(date: NgbDate, card) {
    return date.equals(this.formatFormDate(card.startHotJob)) || (card.endHotJob && date.equals(this.formatFormDate(card.endHotJob))) || this.isInside(date, card) || this.isHovered(date, card);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  showCalendar(card) {
    this.listCards.forEach(item => {
      if (card.id === item.id) {
        item['isCheckedHotJob'] = !item.isCheckedHotJob;
        this.updateJobFeaturedDate(card, item.isCheckedHotJob);
        return;
      }
    });
  }

  getListIdJobCard() {
    let result = [];
    this.listCards.map(card => {
      if (card.jobSelected) {
        result.push({ id: card.id });
      }
    })
    return result;
  }

  selectItemCard(card) {
    this.listCards.forEach(item => {
      if (card.id === item.id) {
        item['jobSelected'] = !item.jobSelected;
        return;
      }
    });
  }

  daysNumberHotJob(startDate, endDate) {
    return this.helperService.daysNumberHotJob(startDate, endDate);
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

  changeUrgentHiring(cart) {
    cart.isUrgentHiring = cart.isUrgentHiring == 1 ? 0 : 1;
    this.updateJobFeaturedDate(cart, cart.isCheckedHotJob);
  }

  convertNbDateToDate(nbDate, type) {
    // 1: start date, 2: end date
    let date = `${nbDate.year}/${nbDate.month}/${nbDate.day}`;
    let result = new Date(date.toString());
    if (type === 1) {
      result.setHours(0, 0, 0, 0);
    } else {
      result.setHours(23, 59, 59, 999);
    }
    return result;
  }

  confirmPaymentInfo() {
    return this.helperService.confirmPayment(this.listCards, this.settingsCard);
  }

  onBackDashboard() {
    if (this.isCheckPaiedJob) this.router.navigate(['/employer-dashboard']);
    else this._location.back();
  }

  ngOnDestroy() {
    this.subScriptions.forEach((sub) => sub.unsubscribe());
  }

  openModalEditJob(modalEditJob) {
    //this.editingJob = job;
    this.modalEditJobRef = this.modalService.open(modalEditJob, {
      windowClass: 'modal-add-new-job',
      size: 'xl'
    })
  }

  openModalViewDetail(modalViewDetail) {
    this.modalEditJobRef = this.modalService.open(modalViewDetail, {
      windowClass: 'modal-view-detail',
      size: 'xl'
    })
  }

  editJob(data) {
    this.isAddingJob = true;
    this.jobService.editJob(data.job, data.id).subscribe(res => {
      this.modalEditJobRef.close();
      this.isAddingJob = false;
      this.getAllCards();
      this.helperService.showToastSuccess(MESSAGE.UPDATE_JOB_SUCCESSFULY);
    }, err => {
      this.isAddingJob = false;
      this.helperService.showToastError(err);
    })
  }

  findJobById(jobId) {
    this.jobService.getjobDetailsEmployer(jobId).subscribe(jobDetails => {
      this.editingJob = jobDetails;
      this.isPriveJob = jobDetails.isPrivate == 1;
      document.getElementById('open-modal-job').click();
    }, errorRes => {
      this.helperService.showToastError(errorRes);
    });
  }


  getDataMaster() {
    this.subjectService.listAssessment.subscribe((res) => {
      this.listAssessment = res;
    })
    this.subjectService.listLevel.subscribe((res) => {
      this.listLevel = res;
    })
    this.subjectService.listCategory.subscribe((res) => {
      this.listCategory = res;
    })
  }

  paymentFreeCart() {
    this.submitPaymentProcess(this.listCards);
  }
}