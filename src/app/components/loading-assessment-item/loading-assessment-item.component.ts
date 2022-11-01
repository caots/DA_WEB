import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-loading-assessment-item',
  templateUrl: './loading-assessment-item.component.html',
  styleUrls: ['./loading-assessment-item.component.scss']
})
export class LoadingAssessmentItemComponent implements OnInit {
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
