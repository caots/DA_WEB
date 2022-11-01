import { Component, Input, OnInit } from '@angular/core';
import { STEP_CREATE_JOB } from 'src/app/constants/config';
import { CardInfo } from 'src/app/interfaces/cardInfo';

@Component({
  selector: 'ms-modal-step-shopping-cart',
  templateUrl: './modal-step-shopping-cart.component.html',
  styleUrls: ['./modal-step-shopping-cart.component.scss']
})
export class ModalStepShoppingCartComponent implements OnInit {
  @Input() step: number;
  @Input() isUpgradeJob: boolean;
  @Input() isAddApplicants: boolean;
  @Input() isPaymentTopupEmployer: boolean;
  @Input() isDirectMessage: boolean;
  @Input() isShoppingCard: boolean;
  @Input() cardInfo: CardInfo;
  stepCreateJob = STEP_CREATE_JOB;
  
  constructor() { }

  ngOnInit(): void {
  }

}
