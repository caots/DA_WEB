import { Component, Input, OnInit } from '@angular/core';
import { USER_TYPE } from 'src/app/constants/config';

@Component({
  selector: 'ms-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() isEmployer: boolean;
  @Input() isJobSeeker: boolean;
  USER_TYPE = USER_TYPE;
  disableButtonForm: boolean;
  defaultTypeValue: number;
  constructor(
  ) { }

  ngOnInit(): void {
    this.defaultTypeValue = this.isJobSeeker ? USER_TYPE.JOB_SEEKER : USER_TYPE.EMPLOYER;
    
  }
}
