import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  PAGING,
} from 'src/app/constants/config';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { MESSAGE } from 'src/app/constants/message';
import { CardSettings } from 'src/app/interfaces/cardInfo';
@Component({
  selector: 'ms-search-assessment',
  templateUrl: './search-assessment.component.html',
  styleUrls: ['./search-assessment.component.scss']
})
export class SearchAssessmentComponent implements OnInit {
  @Output() next = new EventEmitter();
  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() validate = new EventEmitter();
  @Input() settingsCard: CardSettings;
  @Output() retry = new EventEmitter();
  @Output() getListAssessment = new EventEmitter();
  @Output() takeAssessment = new EventEmitter();
  @Input() dataAssessment: any;
  @Input() listSelectedAssessment: any;
  @Input() listCategory: Array<JobCategory>;
  @Input() querySearch: any;
  @Input() isSearching: boolean;
  @Input() isAdding: boolean;
  @Input() isLoadingListAssessment: boolean;
  isAddAssessment: boolean = false;
  paginationConfig: PaginationConfig;
  textWarningSearch: string = MESSAGE.NO_RESULT_SEARCH_JOB;

  constructor(
  ) { }

  ngOnInit(): void {
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }

  }

  goToAddAssessment() {
    this.next.emit();
  }

  addAssessment(assessment) {
    this.add.emit(assessment);
  }

  removeAssessment(assesment) {
    this.remove.emit(assesment);
  }

  validateAssessment(assessment) {
    this.validate.emit(assessment)
  }

  retryAssessment(assessment) {
    this.retry.emit(assessment)
  }

  isSelected(assessment) {
    let existed = this.listSelectedAssessment.find(item => {
      return item.assessmentId == assessment.assessment_id;
    })

    return existed ? true : false;
  }

  searchAssessment() {
    this.search.emit()
  }

  paginationAssessment(page) {
    this.paginationConfig.currentPage = page;
    this.getListAssessment.emit();
  }

  switchAssessment(e) {
    this.isAddAssessment = e
    // if (!e) {
    //   this.dataAssessment = this.dataAssessment

    // } else {
    //   this.dataAssessment = this.listSelectedAssessment
    // }
    this.takeAssessment.emit(e);
  }

}
