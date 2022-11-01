import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-loading-conversation',
  templateUrl: './loading-conversation.component.html',
  styleUrls: ['./loading-conversation.component.scss']
})
export class LoadingConversationComponent implements OnInit {

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
