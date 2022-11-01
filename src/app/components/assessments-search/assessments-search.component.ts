import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ASSESSMENT_CUSTOM_CATEGORY, CUSTOM_ASSESSMENT_ID, CUSTOM_SELECT_ASSESSMENT_ID } from 'src/app/constants/config'
import { JobCategory } from 'src/app/interfaces/jobCategory';

@Component({
  selector: 'ms-assessments-search',
  templateUrl: './assessments-search.component.html',
  styleUrls: ['./assessments-search.component.scss']
})
export class AssessmentsSearchComponent implements OnInit {
  // dropdownSettings: IDropdownSettings = {};
  @Input() query: any;
  @Input() listCategory: Array<JobCategory>;
  @Input() isSearching: boolean;
  @Output() search = new EventEmitter();
  @Output() takeAssessment = new EventEmitter();
  ngModalCategory: any;
  isTakeAssessment: boolean = false;
  ASSESSMENT_CUSTOM_CATEGORY = ASSESSMENT_CUSTOM_CATEGORY;

  constructor() { }

  ngOnInit(): void {
    this.ngModalCategory = this.query.category && this.query.category.length > 0 ? this.query.category[0].id : 0;
    // this.dropdownSettings = {
    //   singleSelection: true,
    //   idField: 'id',
    //   textField: 'name',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 2,
    //   allowSearchFilter: true
    // }
  }

  submit() {
    this.search.emit();
  }

  onSelect(id) {
    let resultsCategory = [];
    if (id != "") {
      if (id == CUSTOM_ASSESSMENT_ID) {
        resultsCategory.push({ id, name: 'Custom Employer Assessments' });
      } else {
        const category = this.listCategory.find(ca => ca.id == id);
        if (category) resultsCategory.push(category);
      }
    }
    this.query.category = resultsCategory;
    document.getElementById('form-search').focus();
    this.search.emit();
  }

  changeTakeAssessment(e) {
    this.isTakeAssessment = e;    
    this.takeAssessment.emit(e);
  }

}
