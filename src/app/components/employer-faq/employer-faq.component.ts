import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-employer-faq',
  templateUrl: './employer-faq.component.html',
  styleUrls: ['./employer-faq.component.scss']
})
export class EmployerFaqComponent implements OnInit {
  isShowQa: boolean = false;
  API_S3 = environment.api_s3;
  
  constructor() { }

  ngOnInit(): void {
  }
  public isCollapsedBusiness = true;
  public isCollapsedAssessment = true;
  public isCollapsedCompare = true;
  public isCollapsedAssessment2 = true;
  public isCollapsedAssessment4 = true;
  public isCollapsedAssessment5 = true;
  public isCollapsedAssessment6 = true;
  public isCollapsedAssessment7 = true;
  public isCollapsedAssessment8 = true;
  public isCollapsedAssessment9 = true;
  public isCollapsedAssessment10 = true;
  public isCollapsedAssessment12 = true;
  public isCollapsedAssessment13 = true;
  public isCollapsedAssessment14 = true;
  public isCollapsedAssessment15 = true;
  public isCollapsedAssessment16 = true;
  public isCollapsedAssessment17 = true;

  viewMoreFQA(){
    this.isShowQa = !this.isShowQa;
  }

  scroll() {
    const el = document.getElementById('footer');
    el.scrollIntoView({behavior: "smooth"});
  }

}
