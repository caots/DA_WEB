import { get } from 'lodash';
import * as moment from 'moment';
import UsStates from "us-state-codes";
import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { JOB_NUMBER_OPENING_RANGE, STEP_CREATE_JOB, JOB_SCHEDULE, PERCENT_TRAVEL, JOB_PERCENT_TRAVEL_TYPE, OTHER_OPTION } from 'src/app/constants/config';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { HelperService } from 'src/app/services/helper.service';
import { NgbDate, NgbDateStruct, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Job } from 'src/app/interfaces/job';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { SubjectService } from 'src/app/services/subject.service';
import { JobService } from 'src/app/services/job.service';
import { ItemJobCarts } from 'src/app/interfaces/itemJobCarts'

@Injectable()

export class NgbDateCustomStepParserFormatter extends NgbDateParserFormatter {
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
    return NgbDateCustomStepParserFormatter.formatDate(date);
  }
}
@Component({
  selector: 'ms-create-job-step2',
  templateUrl: './create-job-step2.component.html',
  styleUrls: ['./create-job-step2.component.scss']
})
export class CreateJobStep2Component implements OnInit {
  @Input() activeTab: string;
  @Input() tabType: any;
  @Input() editModalJob: boolean;
  @Input() shoppingCart: boolean;
  @Input() settingsCard: CardSettings;
  @Input() isSaveDraft: boolean;
  @Input() isPriveJob: boolean;
  @Input() isTemplate: boolean;
  @Input() isNotEditField: boolean;
  @Input() job: Job;
  @Input() formAddNewJob: FormGroup;
  listCity: Array<any> = [];
  @Input() listFallUnder: Array<string> = [];
  listState: Array<any> = [];
  @Input() listLevel: Array<JobLevel> = [];
  @Output() continuteStep = new EventEmitter();
  @Output() backStep = new EventEmitter();
  @Output() submitDraft = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Input() isAddingJob: boolean;
  @Input() isSubmited: boolean;

  card: any;
  hoveredDate: NgbDate | null = null;
  expireDay: number;
  checkedDatepicker: boolean = false;
  currentExpireValue: any = CURRENT_DATE;
  placeHolderExpired: NgbDateStruct;
  initDateValue: any = CURRENT_DATE;
  maxExpireDateValue: any;
  openingNumberRange = JOB_NUMBER_OPENING_RANGE;
  jobSchedules = JOB_SCHEDULE;
  JOB_PERCENT_TRAVEL_TYPE = JOB_PERCENT_TRAVEL_TYPE;
  percentTravel = PERCENT_TRAVEL;
  valuePercentTravel = PERCENT_TRAVEL.ONSITE;
  isCheckedUrgentHiring: boolean = false;
  valueUrgentHiring: number = 0;
  listScheduleJob: any[] = [];
  specifyText: string = '';
  // defaultSpecificPercentTravel: any = 50;
  isShowErrorStep2: boolean = false;
  jobStatus = TAB_TYPE;
  listCityStore: any[] = [];
  selectedExpiredDate: any;
  startHotJob: any;
  endHotJob: any;
  newDate: Date = new Date();
  showTextExpirePrice: boolean = true;
  listCards: ItemJobCarts[] = [];
  checkShowFeatureDate: boolean = false;

  constructor(
    private calendar: NgbCalendar,
    private jobService: JobService,
    private subjectService: SubjectService,
    private helperService: HelperService,
    public formatter: NgbDateParserFormatter,
  ) { }

  ngOnInit(): void {
    this.bindingCreateData();
    // check swicth step in header
    this.subjectService.switchStepCreateJob.subscribe(data => {
      if (!data) return;
      if (STEP_CREATE_JOB.STEP_2 < data.next) {
        this.helperService.markFormGroupTouched(this.formAddNewJob);
        this.bindingCreateData();
        if (this.checkSwicthStep()) {
          console.log('false step 3');
          this.subjectService.isAllowNextStepCreateJob.next(false);
        }
      }
    });
    if(this.activeTab == this.jobStatus.ACTIVE && this.job?.is_make_featured == 1) this.checkShowFeatureDate = true;
  }

  bindingCreateData() {
    this.maxExpireDateValue = this.setMaxExpireDate(new Date(), 45);
    this.jobSchedules.map((data, index) => {
      this.jobSchedules[index].status = false;
    });
    if (this.job && this.isTemplate) {
      // valuePercentTravel
      this.valuePercentTravel = this.job.percentTravel;
      // this.defaultSpecificPercentTravel = this.job.specificPercentTravel;
      this.isCheckedUrgentHiring = this.job.addUrgentHiringBadge == 1;
      this.valueUrgentHiring = this.job.addUrgentHiringBadge;
      // schedule for this job
      this.listScheduleJob = JSON.parse(this.job.scheduleJob);
      if (this.listScheduleJob) {
        this.jobSchedules.map((schedule, index) => {
          this.listScheduleJob.map(data => {
            if (data.id == schedule.id) this.jobSchedules[index].status = true;
            if (data.id == OTHER_OPTION.SCHEDULE) this.specifyText = data.title;
          })
        })
        this.setValueScheduleJobToForm();
      } else {
        this.listScheduleJob = [];
      }
      // expired days
      if (this.job.expiredAt) {
        this.placeHolderExpired = this.setValueDatePicker(this.job.expiredAt);
        this.selectedExpiredDate = this.placeHolderExpired;
        let timeDiff = Math.abs(this.job.expiredAt.getTime() - new Date().getTime());
        this.expireDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
      } else {
        this.expireDay = this.job.expiredDays;
        this.setExpiredDate(this.job);
      }
      // feature job
      if (this.job.startHotJob) this.startHotJob = this.job.startHotJob;
      if (this.job.endHotJob) this.endHotJob = this.job.endHotJob;
      if (this.isTemplate && !this.editModalJob && !this.shoppingCart) this.clearDataDateInNewJobTemplate();
    }
    this.valueUrgentHiring = this.formAddNewJob.get('urgentHiringBadge').value;
    this.isCheckedUrgentHiring = this.formAddNewJob.get('urgentHiringBadge').value == 1 ? true : false;
    this.bindingDataScheule();
    if (this.formAddNewJob.get('expiredDays').value) {
      this.expireDay = this.formAddNewJob.get('expiredDays').value;
      this.setExpiredDate();
    }

    this.formAddNewJob.get('expiredDays').setValue(this.expireDay);
    if (this.formAddNewJob.get('percentTravel').value) this.valuePercentTravel = this.formAddNewJob.get('percentTravel').value;
    const specificPercentTravelTYpe = this.formAddNewJob.get('specificPercentTravelType').value || this.formAddNewJob.get('specificPercentTravelType').value >= 0 ? this.formAddNewJob.get('specificPercentTravelType').value : "";
    this.formAddNewJob.get('specificPercentTravelType').setValue(specificPercentTravelTYpe);
    if (this.formAddNewJob.get('startHotJob').value) this.startHotJob = this.formAddNewJob.get('startHotJob').value;
    if (this.formAddNewJob.get('endHotJob').value) this.endHotJob = this.formAddNewJob.get('endHotJob').value;
    this.getDataCity();
  }

  clearDataDateInNewJobTemplate() {
    this.job.expiredAt = null;
    this.expireDay = null;
    this.job.startHotJob = null;
    this.job.endHotJob = null;
    this.showTextExpirePrice = false;
    this.placeHolderExpired = CURRENT_DATE;
    this.startHotJob = null;
    this.endHotJob = null;

  }

  bindingDataScheule() {
    this.listScheduleJob = [];
    if (this.formAddNewJob.get('scheduleJob').value) {
      this.jobSchedules.map((data, index) => {
        this.formAddNewJob.get('scheduleJob').value.map(schedule => {
          if (data.id == schedule.id) {
            this.jobSchedules[index].status = true;
            this.listScheduleJob.push(this.jobSchedules[index]);
          }
          if (schedule.id == this.findOtherScheduleJob()) this.specifyText = data.title;
        })
      });
    }
  }

  setExpiredDate(job = null) {
    if (!job) {
      this.placeHolderExpired = this.setMaxExpireDate(new Date(), this.expireDay);
      this.selectedExpiredDate = this.placeHolderExpired;
      return;
    }
    let jobDateUpdate = this.job.updatedAt ? this.job.updatedAt.getTime() : this.job.createdAt.getTime();
    let timeDiff = Math.abs(new Date().getTime() - jobDateUpdate);
    let dateCurrent = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (this.expireDay) this.placeHolderExpired = this.setMaxExpireDate(new Date(), this.expireDay - dateCurrent + 1);
    this.selectedExpiredDate = this.placeHolderExpired;
  }

  checkRequireValue(form) {
    if (form.openings && form.openings != '' && (
      Number.parseInt(form.openings) < JOB_NUMBER_OPENING_RANGE.MIN ||
      Number.parseInt(form.openings) > JOB_NUMBER_OPENING_RANGE.MAX)) return true;
    if (form.city == '' || !form.city) return true;
    if (form.state == '' || !form.state) return true;
    if (form.fallUnder == '' || !form.fallUnder) return true;
    return false;
  }

  checkMinMaxValue(form) {
    if (form.openings && form.openings != '' && (
      Number.parseInt(form.openings) < JOB_NUMBER_OPENING_RANGE.MIN ||
      Number.parseInt(form.openings) > JOB_NUMBER_OPENING_RANGE.MAX)) return true;
    return false;
  }

  getPriceByExpiredDate() {
    if (this.expireDay <= 0) return 0;
    return this.expireDay * this.settingsCard?.standard_price
  }

  getPriceByFeatureDate() {
    if (!this.startHotJob || !this.endHotJob) return -1;
    const start = moment(this.startHotJob);
    const end = moment(this.endHotJob);
    const days = end.diff(start, 'days') + 1;
    if (days <= 0) return 0;
    return days * this.settingsCard?.featured_price;
  }

  checkValueUrgentHiring(value) {
    this.isCheckedUrgentHiring = !this.isCheckedUrgentHiring;
    this.valueUrgentHiring = value;
    this.formAddNewJob.get('urgentHiringBadge').setValue(this.valueUrgentHiring);
  }

  selectSchedule(schedule) {
    const index = this.jobSchedules.findIndex(c => c.id === schedule.id);
    this.jobSchedules[index].status = !schedule.status;
    if (!this.jobSchedules[index].status && this.listScheduleJob.length > 0) {
      const index = this.listScheduleJob.findIndex(c => c.id === schedule.id);
      this.listScheduleJob.splice(index, 1);
    } else {
      this.listScheduleJob.push(schedule);
    }
    this.setValueScheduleJobToForm();
  }

  findOtherScheduleJob() {
    const job = this.jobSchedules.find(job => job?.other == true);
    if (!job) return null;
    return job.id;
  }

  checkSwicthStep() {
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    if (!this.isPriveJob && (this.checkRequireValueSwitch(this.formAddNewJob) || this.expireDay <= 0)) return true;
    if (this.isPriveJob && this.checkMinMaxSwitchValue(this.formAddNewJob)) return true;
    return false;
  }

  checkRequireValueSwitch(form) {
    if (form.get('openings').value && form.get('openings').value != '' && (
      Number.parseInt(form.get('openings').value) < JOB_NUMBER_OPENING_RANGE.MIN ||
      Number.parseInt(form.get('openings').value) > JOB_NUMBER_OPENING_RANGE.MAX)) return true;
    if (form.get('city').value == '' || !form.get('city').value) return true;
    if (form.get('state').value == '' || !form.get('state').value) return true;
    if (form.get('fallUnder').value == '' || !form.get('fallUnder').value) return true;
    return false;
  }

  checkMinMaxSwitchValue(form) {
    if (form.get('openings').value && form.get('openings').value != '' && (
      Number.parseInt(form.get('openings').value) < JOB_NUMBER_OPENING_RANGE.MIN ||
      Number.parseInt(form.get('openings').value) > JOB_NUMBER_OPENING_RANGE.MAX)) return true;
    return false;
  }

  continuteStep2(form) {
    this.isShowErrorStep2 = true;
    this.checkedDatepicker = true;
    this.subjectService.isAllowNextStepCreateJob.next(true);
    this.helperService.markFormGroupTouched(this.formAddNewJob);
    if (!this.isPriveJob && (this.checkRequireValue(form) || !this.expireDay || this.expireDay <= 0)) return;
    if (this.isPriveJob && this.checkMinMaxValue(form)) return;

    this.formAddNewJob.get('percentTravel').setValue(this.valuePercentTravel);
    this.formAddNewJob.get('urgentHiringBadge').setValue(this.valueUrgentHiring);
    this.formAddNewJob.get('startHotJob').setValue(this.startHotJob);
    this.formAddNewJob.get('endHotJob').setValue(this.endHotJob);
    this.setValueScheduleJobToForm(true);
    this.continuteStep.emit({ step: STEP_CREATE_JOB.STEP_2, next: null });
  }

  setValueScheduleJobToForm(submit = false) {
    if (this.listScheduleJob) {
      this.listScheduleJob.map((schedule, index) => {
        if (schedule.id == this.findOtherScheduleJob()) this.listScheduleJob[index].title = this.specifyText;
        if (submit) delete this.listScheduleJob[index].status;
      })
    }
    this.formAddNewJob.get('scheduleJob').setValue(this.listScheduleJob);
    this.bindingDataScheule();
  }

  onItemChange(value) {
    this.valuePercentTravel = value;
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    let currentDate = new Date();
    myDate.setHours(23, 59, 59, 999);
    currentDate.setHours(0, 0, 0, 0);
    var timeDiff = Math.abs(myDate.getTime() - currentDate.getTime());
    this.expireDay = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
    this.formAddNewJob.get('expiredDays').setValue(this.expireDay);
    this.currentExpireValue = this.setValueDatePicker(myDate);
    this.placeHolderExpired = date;
    this.selectedExpiredDate = this.placeHolderExpired;
    this.showTextExpirePrice = true;
  }

  setMaxExpireDate(date, number) {
    date.setDate(new Date().getDate() + number);
    return this.setValueDatePicker(date);
  }

  setValueDatePicker(date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  selectFallUnder = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listFallUnder, query);
      })
    )
  }

  selectState(value) {
    const stateName = value;
    this.formAddNewJob.get('city').setValue('');
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
      const index = this.listState.findIndex(state => state == this.formAddNewJob.get('state').value);
      if (index >= 0) {
        const code = UsStates.getStateCodeByStateName(this.listState[index]);
        this.listCity = this.listCityStore.filter(res => res.adminCode == code);
      }
    })
  }

  addSaveDraft() {
    this.formAddNewJob.get('percentTravel').setValue(this.valuePercentTravel);
    this.formAddNewJob.get('urgentHiringBadge').setValue(this.valueUrgentHiring);
    this.formAddNewJob.get('startHotJob').setValue(this.startHotJob);
    this.formAddNewJob.get('endHotJob').setValue(this.endHotJob);
    this.setValueScheduleJobToForm(true);
    this.submitDraft.emit();
  }

  backToStep() {
    this.backStep.emit();
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

  onDateSelection(date: NgbDate) {
    if (!this.startHotJob && !this.endHotJob) {
      this.startHotJob = this.convertNbDateToDate(date);;
    } else if (this.startHotJob && !this.endHotJob && date && (date.after(this.formatFormDate(this.startHotJob)) || date.equals(this.formatFormDate(this.startHotJob)))) {
      this.endHotJob = this.convertNbDateToDate(date);
    } else {
      this.endHotJob = null;
      this.startHotJob = this.convertNbDateToDate(date);
    }
    this.formAddNewJob.get('startHotJob').setValue(this.startHotJob);
    this.formAddNewJob.get('endHotJob').setValue(this.endHotJob);
  }

  convertNbDateToDate(nbDate) {
    // 1: start date, 2: end date
    let date = `${nbDate.year}/${nbDate.month}/${nbDate.day}`;
    let result = new Date(date.toString());
    return result;
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

  selectFeatureJob(checked) {
    if (!checked) {
      this.startHotJob = null;
      this.endHotJob = null;
    }
  }

  saveEditJobActive(){
    this.isSubmited = true;
    this.submit.emit(this.isSubmited);
  }

}

const CURRENT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate() + 1
}

const TAB_TYPE = {
  ACTIVE: '',
  CLOSE: 'expired',
  DRAFT: 'draft'
}

