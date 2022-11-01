import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-freqently-asked-questions',
  templateUrl: './freqently-asked-questions.component.html',
  styleUrls: ['./freqently-asked-questions.component.scss']
})
export class FreqentlyAskedQuestionsComponent implements OnInit {
  isShowQa: boolean = false;
  API_S3 = environment.api_s3;
  
  constructor() { }

  ngOnInit(): void {
  }
  public isCollapsedBusiness = true;
  public isCollapsedAssessment = true;
  public isCollapsedCompare = true;
  public isCollapsedAssessment4 = true;
  public isCollapsedAssessment5 = true;
  public isCollapsedAssessment6 = true;
  public isCollapsedAssessment7 = true;

  viewMoreFQA(){
    this.isShowQa = !this.isShowQa;
  }

  scroll() {
    const el = document.getElementById('footer');
    el.scrollIntoView({behavior: "smooth"});
  }
}
