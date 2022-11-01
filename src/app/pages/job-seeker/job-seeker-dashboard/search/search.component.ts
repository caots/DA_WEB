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
  @Input() query: SearchJobJobSeeker;
  @Input() listCategory: Array<JobCategory>;
  @Input() listCategoryRoot: Array<JobCategory>;
  @Input() listAssessments: Array<Assesment>;
  @Input() listAssessmentSelected: Array<Assesment>;
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

    if (this.query.assessments && this.query.assessments.length > 0) {
      this.query.assessments = [...new Set(this.query.assessments)];
      this.query.assessments?.map(idAssessment => {
        if (idAssessment == CUSTOM_SELECT_ASSESSMENT_ID) {
          const indexCustomCategory = this.listCategory.findIndex(ca => ca.id === CUSTOM_ASSESSMENT_ID);
          if (indexCustomCategory < 0) return;
          this.listCategory[indexCustomCategory].isSelected = true;
          this.listAssessmentSelected.push(ASSESSMENT_CUSTOM_CATEGORY as Assesment);
        } else{
          let checkFirstAssessmentSelected = false;
          this.listCategory.map((ca, indexCa) => {
            const index = ca.listAssessment && ca.listAssessment.findIndex(assessment => assessment.assessmentId == idAssessment);
            if (index >= 0 && !checkFirstAssessmentSelected) {
              const assessmentSelected = this.listCategory[indexCa].listAssessment[index];
              this.listCategory[indexCa].listAssessment[index] = Object.assign({}, assessmentSelected, { selectedCandidate: true });
              this.listAssessmentSelected.push(this.listCategory[indexCa].listAssessment[index]);
              // disable to assessment duplicate
              const assessment = this.listCategory[indexCa].listAssessment[index];
              if(assessment.categories && assessment.categories.length > 0){
                this.updateDisableAssessment(assessment,  this.listCategory[indexCa]);
              } 
              // update select all category;
              ca.isShowListAssessment = true;
              if (ca.listAssessment.length > 0 && !ca.listAssessment.find(ass => !ass.selectedCandidate)) {
                ca.isSelected = true;
              }
              checkFirstAssessmentSelected = true;
            }
          })
        }
      })
    }
    this.listCategoryRoot = Object.assign([], this.listCategory);
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
    this.query.assessments = this.listAssessmentSelected.map(ass => { return ass.assessmentId });
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
      const index = this.listIdsEmplopyerFollowed && this.listIdsEmplopyerFollowed.findIndex(id => id == this.companyInfo.employerId);
      this.checkEmployerFollowed = index >= 0;
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
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.CITY:
        this.query.city = data;
        this.cityValue = data;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WITHIN:
        this.query.within = data.id;
        this.withinValue = data.value;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.WORKPLACE:
        this.query.travel = data.id;
        this.jobTravelValue = data.value;
        break;
      case this.TYPE_SEARCH_ADVANCE_JOBSEEKER.PERCENT_TRAVEL:
        this.query.percentTravelType = data.id;
        this.jobPercentTravelValue = data.value;
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

  followEmployer(status) {
    const action = status ? ACTION_FOLLOW.unfollow : ACTION_FOLLOW.follow;
    if (action == ACTION_FOLLOW.unfollow) this.onUnFollow(action, status);
    else this.onToggleFollowEmolyer(action, status);
  }

  async onUnFollow(action, status) {
    const isConfirmed = await this.helperService.confirmPopup(`Are you sure you want to unfollow ${this.companyInfo.companyName}?`, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.onToggleFollowEmolyer(action, status);
    }
  }

  goToLogin() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onToggleFollowEmolyer(action, status) {
    if (!this.user) {
      this.goToLogin();
      return;
    }
    this.jobService.followEmployer(this.companyInfo.employerId, action).subscribe(data => {
      this.helperService.showToastSuccess(action == ACTION_FOLLOW.follow ? MESSAGE.UPDATE_FOLLOW_SUCCESSFULY : MESSAGE.UPDATE_UNFOLLOW_SUCCESSFULY);
      this.checkEmployerFollowed = !status;
      this.jobService.getListIdCompanyFollowed().subscribe();
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  onSelectedCategory(category: JobCategory) {
    category.isSelected = !category.isSelected;
    if (category.id === CUSTOM_ASSESSMENT_ID) {
      if (!category.isSelected) {
        const index = this.listAssessmentSelected.findIndex(ass => ass.assessmentId === CUSTOM_SELECT_ASSESSMENT_ID);
        if (index >= 0) this.listAssessmentSelected.splice(index, 1);
      } else {
        this.listAssessmentSelected.push(ASSESSMENT_CUSTOM_CATEGORY as Assesment);
      }
    } else {
      category.listAssessment && category.listAssessment.map((assessment) => {
        if (!category.isSelected) {
          if (!assessment.selectedCandidate || assessment.disableDuplicate) { return; }
          assessment.selectedCandidate = false;
          const index = this.listAssessmentSelected.findIndex(ass => ass.assessmentId == assessment.assessmentId);
          if (index >= 0) this.listAssessmentSelected.splice(index, 1);
           // able to assessment duplicate
           if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
        } else {
          if (assessment.selectedCandidate || assessment.disableDuplicate) { return; }
          assessment.selectedCandidate = true;
          this.listAssessmentSelected.push(assessment);
          // disable to assessment duplicate
          if(assessment.categories && assessment.categories.length > 0) this.updateDisableAssessment(assessment, category);
        }
      });
    }
    this.listAssessmentSelected = this.listAssessmentSelected.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  checkSelectedListAssessment(category) {
    let check = false;
    if (category.isSelected) check = true;
    category.listAssessment && category.listAssessment.map((assessment, index) => {
      if (!assessment.selectedCandidate) {
        category.listAssessment[index].point = undefined;
        return check = false;
      }
    });
    return check;
  }

  onSelectedAssessemnt(assessment: Assesment, category: JobCategory) {
    const indexAssessment = category.listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
    if (indexAssessment < 0) return;
    const indexCategory = this.listCategory.findIndex(ca => ca.id == category.id);
    if (indexCategory < 0) return;

    this.listCategory[indexCategory].listAssessment[indexAssessment].selectedCandidate = !assessment.selectedCandidate;
    if (!assessment.selectedCandidate) {
      const index = this.listAssessmentSelected.findIndex(ass => ass.assessmentId == assessment.assessmentId);
      if (index >= 0) this.listAssessmentSelected.splice(index, 1);
      // able to assessment duplicate
      if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
    } else {
      this.listAssessmentSelected.push(assessment);
      // disable to assessment duplicate
      if(assessment.categories && assessment.categories.length > 0) this.updateDisableAssessment(assessment, category);
    }
    // update select all category;
    if (!assessment.selectedCandidate && category.isSelected) {
      category.isSelected = false;
    }
    if (category.listAssessment.length > 0 && !category.listAssessment.find(ass => !ass.selectedCandidate)) {
      category.isSelected = true;
    }
    // sort by name
    this.listAssessmentSelected = this.listAssessmentSelected.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
  }

  SearchAssessmentSuggest() {
    this.listCategory = [];
    this.listCategoryRoot.map(category => {
      let check = false;
      if (category.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) {
        check = true;
        this.listCategory.push(category);
        return;
      }
      category.listAssessment && category.listAssessment.map(assessment => {
        if (assessment.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) check = true
      })
      if (check) this.listCategory.push(category);
    })
  }

  removeAssessment(assessment: Assesment, index) {
    this.showSearchAssessment = false;
    const indexCategories = [];
    this.listCategory.forEach((ca, index) => {
      if(assessment.categories.some(item => item.category_id == ca.id)) indexCategories.push(index);
    })
    if(indexCategories.length <= 0) return;
    indexCategories.forEach(indexCategory => {
      if (this.listCategory[indexCategory].id === CUSTOM_ASSESSMENT_ID) {
        this.listCategory[indexCategory].isSelected = false;
      } else {
        const indexAssessment = this.listCategory[indexCategory].listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
        if (indexAssessment >= 0) {
          this.listCategory[indexCategory].isSelected = false;
          this.listCategory[indexCategory].listAssessment[indexAssessment].selectedCandidate = false;
          this.listCategory[indexCategory].listAssessment[indexAssessment].point = undefined;
        }
      }
    })
    this.listAssessmentSelected.splice(index, 1);
    // disable to assessment duplicate
    if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
  }

  updateDisableAssessment(assessment: Assesment, ca: JobCategory){
    this.listCategory.forEach((category, i) => {
      if (assessment.categories.some(item => item.category_id == category.id)) {
        const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
        if (index >= 0 && ca.id !== category.id) {
          category.listAssessment[index].disableDuplicate = true;
        }
      }      
    })
  }

  updateAbleAssessment(assessment: Assesment){
    this.listCategory.forEach((category, i) => {
      if (assessment.categories.some(item => item.category_id == category.id)) {
        const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
        if (index >= 0) category.listAssessment[index].disableDuplicate = false;
      }
    })
  }

}
