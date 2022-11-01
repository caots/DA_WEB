import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Assesment } from 'src/app/interfaces/assesment';

@Component({
  selector: 'ms-assessments-tag',
  templateUrl: './assessments-tag.component.html',
  styleUrls: ['./assessments-tag.component.scss']
})

export class AssessmentsTagComponent implements OnInit {
  @Input() assesment: Assesment;
  @Input() isAdded: boolean;
  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  addAssesment() {
    this.add.emit(this.assesment);
  }

  editAssesment() {
    this.edit.emit(this.assesment);
  }

  deleteAssesment() {
    this.delete.emit(this.assesment);
  }
}