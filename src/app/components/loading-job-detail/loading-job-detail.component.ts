import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ms-loading-job-detail',
  templateUrl: './loading-job-detail.component.html',
  styleUrls: ['./loading-job-detail.component.scss']
})

export class LoadingJobDetailComponent implements OnInit {
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
