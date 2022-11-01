import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'ms-loading-billing-history',
  templateUrl: './loading-billing-history.component.html',
  styleUrls: ['./loading-billing-history.component.scss']
})
export class LoadingBillingHistoryComponent implements OnInit {
  @Input() numberCard: number;

  constructor() { }

  ngOnInit(): void {
  }

  getNumberCard() {
    let numberCard = [];
    for (let i = 1; i <= this.numberCard; i++) {
      numberCard.push(i);
    }  
    
    return numberCard;
  }

}
