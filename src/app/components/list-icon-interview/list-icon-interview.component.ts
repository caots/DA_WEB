import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ms-list-icon-interview',
  templateUrl: './list-icon-interview.component.html',
  styleUrls: ['./list-icon-interview.component.scss']
})

export class ListIconInterviewComponent implements OnInit {
  @Input() stage: any;
  reviewed: boolean = false;
  scheduled: boolean = false;
  phoneCall: boolean = false;
  followUpEmail: boolean = false;
  offerWasMade: boolean = false;
  interviewPlace: boolean = false;
  accepted: boolean = false;
  cvReviewed: boolean = false;
  online: boolean = false;
  pending: boolean = false;
  constructor() { }

  ngOnInit(): void {    
    if(this.stage) this.setIcons(this.stage.id);    
  }

  setIcons(id) {
    switch (id) {
      case 0:
        this.pending = true;
        break;
      case 1:
        this.reviewed = true;
        break;
      case 2:
        this.scheduled = true;
        break;
      case 3:
        this.phoneCall = true;
        break;
      case 4:
        this.followUpEmail = true;
        break;
      case 5:
        this.offerWasMade = true;
        break;
      case 6:
        this.interviewPlace = true;
        break;
      case 7:
        this.accepted = true;
        break;
      case 8:
        this.cvReviewed = true;
        break;
      case 9:
        this.online = true;
        break;
      default:
        this.pending = true;
        break;
    }
  }

  ngOnChanges() {
    this.reviewed = false;
    this.scheduled = false;
    this.phoneCall = false;
    this.followUpEmail = false;
    this.offerWasMade = false;
    this.interviewPlace = false;
    this.accepted = false;
    this.cvReviewed = false;
    this.online = false;
    this.pending = false;
    if(this.stage) this.setIcons(this.stage.id)
  }
}
