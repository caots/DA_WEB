import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ms-loading-job-draft',
  templateUrl: './loading-job-draft.component.html',
  styleUrls: ['./loading-job-draft.component.scss']
})
export class LoadingJobDraftComponent implements OnInit {

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
