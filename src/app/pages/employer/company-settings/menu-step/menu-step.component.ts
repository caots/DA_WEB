import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SETINGS_STEP_EMPLOYER } from 'src/app/constants/config';

@Component({
  selector: 'ms-menu-step',
  templateUrl: './menu-step.component.html',
  styleUrls: ['./menu-step.component.scss']
})

export class MenuStepComponent implements OnInit {
  @Input() step: number;
  @Output() changeStep = new EventEmitter();

  stepConfig = SETINGS_STEP_EMPLOYER;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeStep(step){
    this.changeStep.emit(step);
  }

}