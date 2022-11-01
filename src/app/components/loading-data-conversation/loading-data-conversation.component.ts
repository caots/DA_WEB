import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-loading-data-conversation',
  templateUrl: './loading-data-conversation.component.html',
  styleUrls: ['./loading-data-conversation.component.scss']
})
export class LoadingDataConversationComponent implements OnInit {

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
