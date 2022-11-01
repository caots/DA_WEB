import * as moment from 'moment';
import { Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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
import { Assesment } from 'src/app/interfaces/assesment';

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
  @Input() listCategoryRoot: Array<JobCategory>;
  @Input() listAssessments: Array<Assesment>;
  @Input() listAssessmentSelected: Array<Assesment>;
  @Output() search = new EventEmitter();
  @Output() reset = new EventEmitter();
  // @Output() showModalAdd = new EventEmitter();
  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() orderByChange = new EventEmitter<number>();
  @Output() showModalAddNewJobFromScratchOrTemplate = new EventEmitter();
  listCategoryCoppied: Array<JobCategory>;
  errorMessage: string;
  listSort: Array<Item> = [];
  listSortDraftTab: Array<Item> = [];
  listCountry: Array<string> = [];
  dropdownSettings: IDropdownSettings = {};
  permission = PERMISSION_TYPE;
  CUSTOM_ASSESSMENT_ID = CUSTOM_ASSESSMENT_ID;
  jobTypes = JOB_TYPE;
  TAB_TYPE = TAB_TYPE;
  fromDate: string;
  toDate: string;
  userData: any;
  listJobTypes: string[] = [];
  nameAssessmentSearch: string = '';
  showSearchAssessment: boolean = true;

  constructor(
    private authService: AuthService,
    public permissionService: PermissionService,
    private helperService: HelperService,
    private jobService: JobService,
  ) {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    }
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
    this.listSort = this.jobService.getlistSortJobEmployer(false);
    this.listSortDraftTab = this.jobService.getlistSortJobEmployer(true);
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
    })
    if (this.query.assessments && this.query.assessments.length > 0) {
      this.query.assessments = [...new Set(this.query.assessments)];
      this.query.assessments.map(idAssessment => {
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
                const isGetFromUrl = true;
                this.updateDisableAssessment(assessment,  this.listCategory[indexCa], isGetFromUrl);
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
      });
    }
    this.listCategoryRoot = Object.assign([], this.listCategory);
    this.listCategoryCoppied = [...this.listCategory];
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

  addJob() {
    // this.showModalAdd.emit();
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

    this.search.emit();
  }

  submit() {
    if (!this.checkValidSearch()) {
      return;
    }
    this.query.assessments = this.listAssessmentSelected.map(ass => { return ass.assessmentId });
    this.search.emit();
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
    const indexCategory = this.listCategoryCoppied.findIndex(ca => ca.id == category.id);
    if (indexCategory < 0) return;

    this.listCategoryCoppied[indexCategory].listAssessment[indexAssessment].selectedCandidate = !assessment.selectedCandidate;
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

  updateDisableAssessment(assessment: Assesment, ca: JobCategory, isGetFromUrl = false){
    if(isGetFromUrl){
      this.listCategory.forEach((category, i) => {
        if (assessment.categories.some(item => item.category_id == category.id)) {
          const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
          if (index >= 0 && ca.id !== category.id) {
            category.listAssessment[index].disableDuplicate = true;
          }
        }      
      })
    }else{
      this.listCategoryCoppied.forEach((category, i) => {
        if (assessment.categories.some(item => item.category_id == category.id)) {
          const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
          if (index >= 0 && ca.id !== category.id) {
            category.listAssessment[index].disableDuplicate = true;
          }
        }      
      })
    }
  }

  updateAbleAssessment(assessment: Assesment){
    this.listCategoryCoppied.forEach((category, i) => {
      if (assessment.categories.some(item => item.category_id == category.id)) {
        const index = category.listAssessment && category.listAssessment.findIndex(as => as.assessmentId == assessment.assessmentId);
        if (index >= 0) category.listAssessment[index].disableDuplicate = false;
      }
    })
  }

  SearchAssessmentSuggest() {
    this.listCategoryCoppied = [];
    this.listCategoryRoot.map(category => {
      let check = false;
      if (category.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) {
        check = true;
        this.listCategoryCoppied.push(category);
        return;
      }
      category.listAssessment && category.listAssessment.map(assessment => {
        if (assessment.name.toLocaleLowerCase().search(this.nameAssessmentSearch.toLocaleLowerCase()) > -1) check = true
      })
      if (check) this.listCategoryCoppied.push(category);
    })
  }

  removeAssessment(assessment: Assesment, index) {
    this.showSearchAssessment = false;
    const indexCategories = [];
    this.listCategoryCoppied.forEach((ca, index) => {
      if(assessment.categories.some(item => item.category_id == ca.id)) indexCategories.push(index);
    })
    if(indexCategories.length <= 0) return;
    indexCategories.forEach(indexCategory => {
      if (this.listCategoryCoppied[indexCategory].id === CUSTOM_ASSESSMENT_ID) {
        this.listCategoryCoppied[indexCategory].isSelected = false;
      } else {
        const indexAssessment = this.listCategoryCoppied[indexCategory].listAssessment.findIndex(ass => ass.assessmentId == assessment.assessmentId);
        if (indexAssessment >= 0) {
          this.listCategoryCoppied[indexCategory].isSelected = false;
          this.listCategoryCoppied[indexCategory].listAssessment[indexAssessment].selectedCandidate = false;
          this.listCategoryCoppied[indexCategory].listAssessment[indexAssessment].point = undefined;
        }
      }
    })
    
    this.listAssessmentSelected.splice(index, 1);

    // disable to assessment duplicate
    if(assessment.categories && assessment.categories.length > 0) this.updateAbleAssessment(assessment);
  }

}
