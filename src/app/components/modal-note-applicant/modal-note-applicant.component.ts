import { Component, OnInit, Input, Output, EventEmitter, Injectable} from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { MESSAGE } from 'src/app/constants/message';
import { APPLICANT_STAGE, PERMISSION_TYPE } from 'src/app/constants/config';
import { TimeService } from 'src/app/services/time.service';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { PermissionService } from 'src/app/services/permission.service';

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
  selector: 'ms-modal-note-applicant',
  templateUrl: './modal-note-applicant.component.html',
  styleUrls: ['./modal-note-applicant.component.scss']
})
export class ModalNoteApplicantComponent implements OnInit {
  @Output() changeNote = new EventEmitter();
  @Output() close = new EventEmitter();
  @Input() userId: number;
  @Input() userData: UserInfo;
  @Input() data: any;
  comment: string;
  schedule: any;
  stage: number;
  listStages: any = APPLICANT_STAGE;
  checkRequire: boolean = false;
  isChecked: boolean = false;
  placeHolderExpired: NgbDateStruct;
  isCallingApi: boolean = false;
  stageName: string;
  time = { hour: 13, minute: 30 };
  meridian = true;
  strTime: string;
  stageIcon: any;
  initDateValue: any = CURRENT_DATE;
  permission = PERMISSION_TYPE;


  constructor(
    public formatter: NgbDateParserFormatter,
    public permissionService: PermissionService,
    private applicantsService: ApplicantsService,
    private helperService: HelperService,
    private timeService: TimeService,
  ) {

  }

  ngOnInit(): void {
    this.stageIcon = "---Please select status---";
    if (this.data) {
      this.comment = this.data.note;
      this.stage = this.data.stage;
      this.schedule = this.data.scheduleTime;
      this.placeHolderExpired = this.data.scheduleTime ? this.setValueDatePicker(this.data.scheduleTime) : null;
      this.listStages.forEach(element => {
        if (element.id === this.stage) {
          this.stageIcon = element;
        }
      });

      if (this.strTime) {
        this.strTime = this.timeService.formatAMPM(this.data.scheduleTime);
      }

      if (this.data.scheduleTime) {
        this.time = {
          hour: this.data.scheduleTime.getHours(),
          minute: this.data.scheduleTime.getMinutes()
        };
      }

    }
  }

  closeModal(status) {
    this.close.emit(status);
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    myDate.setHours(this.time.hour, this.time.minute);
    this.strTime = this.timeService.formatAMPM(myDate)
    this.schedule = myDate;
    this.placeHolderExpired = this.setValueDatePicker(myDate);
  }

  setValueDatePicker(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  submit() {
    this.isCallingApi = true;
    let myDate = null;
    if(this.schedule){
      myDate = new Date(this.schedule);
      myDate.setHours(this.time.hour, this.time.minute);
      this.strTime = this.timeService.formatAMPM(myDate)
    }
    
    let data = {
      note: this.comment,
      schedule: myDate,
      stage: this.stage
    }
    this.changeNote.emit(this.comment);
    const companyId = this.userData.company_id;
    const jobId = this.data.jobId;
    this.applicantsService.addNote(Number(this.userId), data, jobId, companyId).subscribe(res => {
      this.closeModal(true);
      this.helperService.showToastSuccess(MESSAGE.ADD_NOTE_APPLICANTS);
    }, errorRes => {
      this.helperService.showToastError(errorRes);
      this.isCallingApi = false;
    });
  }

  selectInterViewStatus(stage) {
    if (stage.id === 0) {
      this.stage = null;
    }
    else {
      this.stage = stage.id;
    }
    this.stageIcon = stage;
  }
}

const CURRENT_DATE = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
}
