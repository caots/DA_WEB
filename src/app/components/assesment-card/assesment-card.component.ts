import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Assesment } from 'src/app/interfaces/assesment';

@Component({
  selector: 'ms-assesment-card',
  templateUrl: './assesment-card.component.html',
  styleUrls: ['./assesment-card.component.scss']
})

export class AssesmentCardComponent implements OnInit {
  @Input() isSelected: boolean;
  @Input() assesment: Assesment;
  @Output() add = new EventEmitter();
  @Output() remove = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  addToJob() {
    this.add.emit(this.assesment);
  }

  removeToJob() {
    this.remove.emit(this.assesment);
  }
}
