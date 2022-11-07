import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import UsStates from "us-state-codes";

import { TYPE_SEARCH_ADVANCE_JOBSEEKER, CUSTOM_ASSESSMENT_ID, ASSESSMENT_CUSTOM_CATEGORY, CUSTOM_SELECT_ASSESSMENT_ID, SEARCH_REMOTE, WIDTH_MOBILE, JOB_ORDER, DEFAULT_WITHIN, ACTION_FOLLOW, PERCENT_TRAVEL, JOB_TRAVEL_STR, WITHIN_MILES, SALARY_TYPE, SALARY_PER_YEAR } from 'src/app/constants/config';
import { Item } from 'src/app/interfaces/item';
import { Assesment } from 'src/app/interfaces/assesment';
import { SearchJobJobSeeker } from 'src/app/interfaces/search';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { CitiWithLatLon, Job } from 'src/app/interfaces/job';
import { companySearch } from 'src/app/interfaces/company';
import { SubjectService } from 'src/app/services/subject.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MESSAGE } from 'src/app/constants/message';
import { faLess } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'ms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  public isCollapsed3 = false;
  public isCollapsed2 = false;
  public isCollapsed1 = false;
  @Input() isShow: boolean;
  @Input() orderBy: number;
  @Input() isSearching: boolean;
  @Input() query: SearchJobJobSeeker
  @Input() user: any;
  @Input() employmentType: any;
  @Input() listCompany: companySearch[];
  @Input() listCity: string[];
  @Input() jobPercentTravel: any;
  @Input() jobTravel: any;
  @Input() expirationDate: any;
  @Input() withinMiles: any;
  @Input() listFallUnder: Array<string> = [];
  @Output() search = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() orderByChange = new EventEmitter<number>();
  @Output() isSearchingChange = new EventEmitter<boolean>();
  errorMessage: string;
  listSort: Array<Item> = [];
  listCountry: Array<string> = [];
  dropdownSettings: IDropdownSettings = {};
  citiesWithLatLon: CitiWithLatLon[];
  citiStates: string[];
  place: string;
  autoCompleteData: string[] = [];
  listState: string[] = [];
  companyValue: string;
  cityValue: string;
  jobTypeValue: string;
  withinValue: string;
  jobTravelValue: string;
  jobPercentTravelValue: string;
  jobFallUnderValue: string;
  expirationDateValue: string;
  offeredComFromValue: any;
  offeredComToValue: any;
  TYPE_SEARCH_ADVANCE_JOBSEEKER = TYPE_SEARCH_ADVANCE_JOBSEEKER;
  DEFAULT_WITHIN = DEFAULT_WITHIN;
  companyInfo: Job;
  isLoadingCompanyDetails: boolean = false;
  checkEmployerFollowed: boolean = false;
  listIdsEmplopyerFollowed: any[];
  listZipCode: string[];
  hiddenOnlyStateWithin: boolean = false;
  salaryType = SALARY_TYPE;
  valueSalaryType: number = SALARY_PER_YEAR;
  CUSTOM_ASSESSMENT_ID = CUSTOM_ASSESSMENT_ID;
  checkDeviceMobileWidth: boolean = false;
  nameAssessmentSearch: string = '';
  showSearchAssessment: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private jobService: JobService,
    private helperService: HelperService,
    private subjectService: SubjectService,
  ) {
    this.checkDeviceMobileWidth = window.innerWidth <= WIDTH_MOBILE;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    if (this.checkDeviceMobileWidth) this.dropdownSettings.itemsShowLimit = 1;
  }

  ngOnInit(): void {
    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.listIdsEmplopyerFollowed = data;
    })
    this.subjectService.tabListJobJobSeeker.subscribe(data => {
      if (data != null) this.clearValueSearch();
      this.place = '';
    });
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
      this.autoCompleteData = this.autoCompleteData.concat(this.listZipCode);
    })
    this.jobService.getAllState().subscribe(res => {
      this.listState = res;
      this.autoCompleteData = this.autoCompleteData.concat(this.listState);
    })
    this.jobService.getAllCitiesWithLatLon().subscribe(res => {
      this.citiStates = res.map(obj => obj.name);
      this.citiesWithLatLon = res;
      this.autoCompleteData = this.autoCompleteData.concat(this.citiStates);
    })
    this.autoCompleteData = this.autoCompleteData.concat(SEARCH_REMOTE);

    this.listSort = this.jobService.getListSortJob();
    if (!this.user) {
      this.listSort = this.listSort.filter(item => item.id !== JOB_ORDER.BEST_MATCH);
    }
    this.setParamsSearch();
  }

  selectOptionSalary(value) {
    this.valueSalaryType = value;
  }

  setParamsSearch() {
    // set default value
    if (!this.query.within) { this.query.within = DEFAULT_WITHIN.id };
    // check value
    if (this.query.place) {
      this.place = this.query.place;
      if (this.place == SEARCH_REMOTE) {
        this.query.travel = PERCENT_TRAVEL.REMOTE;
        this.jobTravelValue = JOB_TRAVEL_STR[PERCENT_TRAVEL.REMOTE];
      }
    }
    if (this.query.employer) {
      const company = this.listCompany.find(co => co.companyID == this.query.employer.companyID);
      if (company) this.companyValue = company.companyName;
      this.findCompanyInfo();
    }

    if (this.query.city && !this.query.place) {
      this.cityValue = this.query.city;
    }
    if (this.query.jobType) {
      const type = this.employmentType.find(type => type.id == this.query.jobType);
      if (type) this.jobTypeValue = type.title;
    }
    if (this.query.within) {
      const within = this.withinMiles.find(w => w.id == this.query.within);
      if (within) this.withinValue = within.value;
    }
    if (this.query.travel) {
      const job = this.jobTravel.find(job => job.id == this.query.travel);
      if (job) this.jobTravelValue = job.value;
    }
    if (this.query.percentTravelType) {
      const job = this.jobPercentTravel.find(job => job.id == this.query.percentTravelType);
      if (job) this.jobPercentTravelValue = job.value;
    }
    if (this.query.jobFallUnder) {
      const fallUnder = this.listFallUnder.find(job => job == this.query.jobFallUnder);
      if (fallUnder) this.jobFallUnderValue = fallUnder;
    }
    if (this.query.expiredDate) {
      const expired = this.expirationDate.find(date => date.key == this.query.expiredDate);
      if (expired) this.expirationDateValue = expired.value;
    }
    if (this.query.salaryFrom) {
      this.offeredComFromValue = this.query.salaryFrom;
    }
    if (this.query.salaryTo) {
      this.offeredComToValue = this.query.salaryTo;
    }
    if (this.query.salaryType) {
      this.valueSalaryType = this.query.salaryType;
    }
  }

  clearValueSearch() {
    this.jobTypeValue = undefined;
    // this.withinValue = undefined;
    this.jobTravelValue = undefined;
    this.jobPercentTravelValue = undefined;
    this.jobFallUnderValue = undefined;
    this.expirationDateValue = undefined;
    this.companyValue = undefined;
    this.cityValue = undefined;
    this.resetSalary(false);
    // set default wwithin
    this.query.within = DEFAULT_WITHIN.id;
    this.withinValue = DEFAULT_WITHIN.value;
  }

  clearFilter() {
    this.reset.emit();
    this.clearValueSearch();
  }

  toogleShowSearch() {
    this.errorMessage = '';
    this.isShowChange.emit(!this.isShow);
    // setTimeout(() => {
    //   if (!this.isShow) {
    //     this.reset.emit();
    //   }
    // }, 100);
    // if (!this.isShow) this.clearValueSearch();
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
    this.search.emit();
  }

  submit() {
    if (!this.checkValidSearch()) {
      return;
    }
    if (this.place == SEARCH_REMOTE) {
      this.query.travel = PERCENT_TRAVEL.REMOTE;
      this.jobTravelValue = JOB_TRAVEL_STR[PERCENT_TRAVEL.REMOTE];
      this.updateLocation();
    } else this.getLocation();

    if (this.place && !this.query.city && this.query.state) {
      this.hiddenOnlyStateWithin = true;
      this.query.within = '';
    } else {
      this.hiddenOnlyStateWithin = false;
      this.query.within = this.query.within ? this.query.within : DEFAULT_WITHIN.id;
    }
    this.isSearchingChange.emit(true);
    if (this.place) this.cityValue = undefined;
    this.search.emit();
  }

  changeSearchLocation(value) {
    this.place = value;
    this.getLocation();
    this.hiddenOnlyStateWithin = this.place && !this.query.city && this.query.state ? true : false;
  }

  getLocation() {
    try {
      if (!this.place) {
        this.updateLocation();
        return;
      }
      const cityStateLatLon = this.citiesWithLatLon.find(obj => obj.name == this.place);
      // if select city and state
      if (cityStateLatLon) {
        const citySateArray = this.place.split(', ');

        const stateName = UsStates.getStateNameByStateCode(citySateArray[1]);
        this.updateLocation(citySateArray[0], stateName, cityStateLatLon.loc);
        return;
      }
      const state = this.listState.find(obj => obj == this.place);
      if (state) {
        this.updateLocation('', state, []);
        return;
      }
      const city = this.listCountry.find(obj => obj == this.place);
      if (city) {
        this.updateLocation(city, '', []);
        return;
      }
      // zipcode
      try {
        const zipcode = parseInt(this.place);
        if (typeof zipcode == 'number') {
          this.updateLocation('', '', [], `${zipcode}`);
        }
      } catch (e) {
        this.updateLocation();
      }
    } catch (e) {
      this.updateLocation();
    }
  }
  updateLocation(city = '', state = '', location = [], zipcode = '') {
    this.query.state = state;
    this.query.city = city;
    this.query.location = location;
    this.query.zipcode = zipcode;
    this.query.place = this.place;
  }
  checkValidSearch() {
    if (this.query.salaryFrom && this.query.salaryTo && +this.query.salaryFrom > +this.query.salaryTo) {
      this.errorMessage = `Offered Compensation should be greater than ${this.query.salaryFrom}`;
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.autoCompleteData, query, 10);
      })
    )
  }

  resetSalary(isFilterData = true) {
    this.offeredComFromValue = '';
    this.offeredComToValue = '';
    isFilterData && this.filterData(null, TYPE_SEARCH_ADVANCE_JOBSEEKER.ASKINGCOMPENSATION);
  }

  findCompanyInfo() {
    if(!this.query.employer.companyID) return;
    this.isLoadingCompanyDetails = true;
    this.jobService.getCompanySearchDetails(this.query.employer.companyID).subscribe(data => {
      this.companyInfo = data;
      this.isLoadingCompanyDetails = false;
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingCompanyDetails = false;
    });
  }

  removeFilterItem(type) {
    switch (Number.parseInt(type)) {
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.ASKINGCOMPENSATION:
        // this.query.salaryTo = this.offeredComToValue;
        // this.query.salaryFrom = this.offeredComFromValue;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.EMPLOYMENT_TYPE:
        this.query.jobType = undefined;
        this.jobTypeValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.COMPANY:
        this.query.employer = undefined;
        this.companyValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.CITY:
        this.query.city = undefined;
        this.cityValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WITHIN:
        this.query.within = DEFAULT_WITHIN.id;
        this.withinValue = DEFAULT_WITHIN.value;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WORKPLACE:
        this.query.travel = undefined;
        this.jobTravelValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.PERCENT_TRAVEL:
        this.query.percentTravelType = undefined;
        this.jobPercentTravelValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.INDUSTRY:
        this.query.jobFallUnder = undefined;
        this.jobFallUnderValue = undefined;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.EXPIRATION_DATE:
        // this.query.expiredDate = data.key;
        // this.expirationDateValue = data.value;
        break;
    }
    this.search.emit();
  }

  getCompensationValue(offeredComFromValue, offeredComToValue) {
    if (offeredComFromValue && offeredComToValue) return `${offeredComFromValue} - ${offeredComToValue}`;
    if (offeredComFromValue && !offeredComToValue) return `${offeredComFromValue} +`;
    if (!offeredComFromValue && offeredComToValue) return `${offeredComToValue} -`;
    return 'Offered Compensation';
  }

  filterData(data, type) {
    switch (Number.parseInt(type)) {
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.ASKINGCOMPENSATION:
        this.query.salaryTo = this.offeredComToValue;
        this.query.salaryFrom = this.offeredComFromValue;
        this.query.salaryType = this.valueSalaryType;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.EMPLOYMENT_TYPE:
        this.query.jobType = data.id;
        this.jobTypeValue = data.title;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.COMPANY:
        this.query.employer = data;
        this.companyValue = data.companyName;
        this.findCompanyInfo();
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WITHIN:
        this.query.within = data.id;
        this.withinValue = data.value;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WORKPLACE:
        this.query.travel = data.id;
        this.jobTravelValue = data.value;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.INDUSTRY:
        this.query.jobFallUnder = data;
        this.jobFallUnderValue = data;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.EXPIRATION_DATE:
        this.query.expiredDate = data.key;
        this.expirationDateValue = data.value;
        break;
    }
    this.search.emit();
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
