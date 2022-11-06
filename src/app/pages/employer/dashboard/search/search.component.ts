import * as moment from 'moment';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { NgbDateStruct, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PERMISSION_TYPE, JOB_TYPE, CUSTOM_ASSESSMENT_ID, ASSESSMENT_CUSTOM_CATEGORY, CUSTOM_SELECT_ASSESSMENT_ID, TAB_TYPE } from 'src/app/constants/config';
import { Item } from 'src/app/interfaces/item';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { SearchJobEmployer } from 'src/app/interfaces/search';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
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
  selector: 'ms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  public isCollapsed = true;
  @Input() isShow: boolean;
  @Input() orderBy: number;
  @Input() type: string;
  @Input() isSearching: boolean;
  @Input() query: SearchJobEmployer;
  @Input() listCategory: Array<JobCategory>;
  @Input() activeTab: string;
  @Output() search = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() orderByChange = new EventEmitter<number>();
  @Output() showModalAddNewJobFromScratchOrTemplate = new EventEmitter();
  errorMessage: string;
  listSort: Array<Item> = [];
  listSortDraftTab: Array<Item> = [];
  listCountry: Array<string> = [];
  permission = PERMISSION_TYPE;
  CUSTOM_ASSESSMENT_ID = CUSTOM_ASSESSMENT_ID;
  jobTypes = JOB_TYPE;
  TAB_TYPE = TAB_TYPE;
  fromDate: string;
  toDate: string;
  userData: any;
  listJobTypes: string[] = [];

  constructor(
    private authService: AuthService,
    public permissionService: PermissionService,
    private helperService: HelperService,
    private jobService: JobService,
  ) {
  }

  ngOnInit(): void {
    this.query = {...this.query, category: this.query.category ? +this.query.category : ''}
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
    this.listSort = this.jobService.getlistSortJobEmployer(false);
    this.listSortDraftTab = this.jobService.getlistSortJobEmployer(true);
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
  }

  changeTypeJob(value) {
    let checkType = false;
    let checkIndex = -1;
    for (let index = 0; index < this.listJobTypes.length; index++) {
      if (this.listJobTypes[index] == value) {
        checkType = true;
        checkIndex = index;
        break;
      }
    }
    if (checkType) {
      this.listJobTypes.splice(checkIndex, 1);
    } else {
      this.listJobTypes.push(value);
    }
    this.query.jobType = this.listJobTypes.toString();
  }

  onDateSelectionFrom(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    this.fromDate = String(myDate.getTime());
    this.query.createdAtFrom = String(myDate);
  }

  onDateSelectionTo(date: NgbDate) {
    let myDate = new Date(date.year, date.month - 1, date.day);
    this.toDate = String(myDate.getTime());
    this.query.createdAtTo = String(myDate);
  }

  toogleShowSearch() {
    this.errorMessage = '';
    this.isShowChange.emit(!this.isShow);
    setTimeout(() => {
      if (!this.isShow) {
        this.reset.emit();
      }
    }, 100);
  }

  changeSort(sort) {
    if (this.orderBy == sort.id) {
      this.orderByChange.emit(undefined);
    } else {
      this.orderByChange.emit(sort.id);
    }

    if (!this.checkValidSearch()) {
      return;
    }

    this.search.emit(this.query);
  }

  submit() {
    if (!this.checkValidSearch()) {
      return;
    }
    this.search.emit(this.query);
  }

  checkValidSearch() {
    if (this.query.createdAtTo && this.query.createdAtFrom && this.isShow) {
      if (this.fromDate > this.toDate) {
        this.errorMessage = `Created Date should be greater than ${moment(new Date(this.query.createdAtFrom)).format('YYYY-MM-DD')}`;
        return false;
      }
    }

    this.errorMessage = '';
    return true;
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.listCountry, query);
      })
    )
  }

  showModalAddNewJobFromScratchOrtemplate() {
    this.showModalAddNewJobFromScratchOrTemplate.emit();
  }
}
