import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Assesment } from 'src/app/interfaces/assesment';
import { JobCategory } from 'src/app/interfaces/jobCategory';

@Component({
  selector: 'ms-add-new-assessment',
  templateUrl: './add-new-assessment.component.html',
  styleUrls: ['./add-new-assessment.component.scss']
})

export class AddNewAssessmentComponent implements OnInit {
  filterCondition: FilterCondition;
  @Input() listCategory: Array<JobCategory> = [];
  @Input() listAssessment: Array<Assesment> = [];
  @Input() listSelectedAssesment: Array<Assesment> = [];
  @Output() add = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() remove = new EventEmitter();

  constructor(
  ) { 
    this.filterCondition = {
      name: "",
      category: ""
    }
  }

  ngOnInit(): void {
  }  

  closeModal() {
    this.close.emit();
  }  

  addAssessment(assessment) {
    this.add.emit(assessment);
  }

  removeAssessment(assesment) {
    this.remove.emit(assesment);
  }

  isSelected(assesment) {
    let existed = this.listSelectedAssesment.find(item => {
      return item.id == assesment.id;
    })

    return existed ? true : false;    
  }
}

class FilterCondition {
  name: string;
  category: string;
}