import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ms-modal-share-user-history',
  templateUrl: './modal-share-user-history.component.html',
  styleUrls: ['./modal-share-user-history.component.scss']
})
export class ModalShareUserHistoryComponent implements OnInit {
  @Input() reportUser: any;
  @Input() listReportLinks: any[] = [];
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();
  isCallingApi: boolean = false;
  isLoadingListAssessment: boolean = false;
  nameReport: string = '';
  listMyAssessment: any[] = [];
  listSelectedAssessment: any[] = [];
  isSubmitted: boolean = false;
  
  constructor(
    private userService: UserService,
    private helperService: HelperService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.getListMyAssessments();
    if(this.reportUser){
      this.nameReport = this.reportUser.name;
      if(this.reportUser.assessment && this.reportUser.assessment.length > 0){
        this.reportUser.assessment.map(assessment => {
          this.listSelectedAssessment.push({
            id: assessment.id,
            name: assessment.name,
            weight: assessment.weight
          });
        })
      }
    }else this.nameReport = this.generateNameReport();
  }

  selectAllReportDefaults(){
    this.listMyAssessment.map(assessment => {
      this.listSelectedAssessment.push({
        id: assessment.id,
        name: assessment.name,
        weight: assessment.weight
      });
    })
  }

  getListMyAssessments() {
    this.isLoadingListAssessment = true;
    this.assessmentService.getListMyAssessment().subscribe(data => {
      this.listMyAssessment = data;
      this.isLoadingListAssessment = false;
      if(!this.reportUser) this.selectAllReportDefaults();
    }, err => {
      this.helperService.showToastError(err);
      this.isLoadingListAssessment = false;
    })
  }

  closeModal() {
    this.reportUser = null;
    this.close.emit();
  }

  submit() {
    this.isSubmitted = true;
    if(this.listSelectedAssessment.length == 0 ) return;

    if(!this.nameReport && !this.reportUser){
      this.nameReport = `Report${this.listReportLinks?.length ? this.listReportLinks.length + 1 : 1}`;
    }else if(!this.nameReport && this.reportUser){
      this.nameReport = this.reportUser.name;
    } else {
      const isSaved = true;
      this.nameReport = this.generateNameReport(isSaved);
    }
    
    const body = {
      name: this.nameReport,
      assessment: JSON.stringify(this.listSelectedAssessment)
    }
    this.isCallingApi = true;
    if(this.reportUser){
     this.updateReport(body);
    }else{
      this.createNewReport(body);
    }
   
  }

  updateReport(body){
    this.userService.uppdateUserStory(this.reportUser.id, body).subscribe((data: any) => {
      this.helperService.showToastSuccess(MESSAGE.SAVED_REPORTS);
      this.save.emit();
      this.reportUser = null;
      this.isCallingApi = false;
      this.isSubmitted = false;
    }, err => {
      this.helperService.showToastError(err);
      this.isCallingApi = false;
      this.isSubmitted = false;
    })
  }

  createNewReport(body){
    this.userService.createUserStory(body).subscribe((data: any) => {
      this.helperService.showToastSuccess(MESSAGE.SAVED_REPORTS);
      this.save.emit();
      this.reportUser = null;
      this.isCallingApi = false;
      this.isSubmitted = false;
    }, err => {
      this.helperService.showToastError(err);
      this.isCallingApi = false;
      this.isSubmitted = false;
    })
  }

  generateNameReport(isSaved = false){
    let nameReport = this.nameReport || '';
    if(this.reportUser && nameReport == this.reportUser.name) return nameReport;
    if(!isSaved){ 
      // create report
      nameReport = `Report${this.listReportLinks?.length ? this.listReportLinks.length + 1 : 1}`;
    }else{ 
      // save report
      if(!this.listReportLinks.length || this.listReportLinks.length == 0) return nameReport;
      const indexDupplicate = this.listReportLinks.findIndex(report => report.name == nameReport);
      if(indexDupplicate >= 0) nameReport = `${nameReport}_${new Date().getTime()}`;
    }
    return nameReport;
  }

  colorWeightAssessment(weight) {
    return this.assessmentService.colorWeightAssessment(weight)
  }

  onSelectedAssessment(assessment) {
    const newAssessment = {
      id: assessment.id,
      name: assessment.name,
      weight: assessment.weight
    }
    if (this.listSelectedAssessment.length > 0) {
      const index = this.listSelectedAssessment.findIndex(assessmentSelect => assessmentSelect.id == assessment.id);
      if (index < 0) this.listSelectedAssessment.push(newAssessment);
      else this.listSelectedAssessment.splice(index, 1);
    } else this.listSelectedAssessment.push(newAssessment);
  }

  checkSelectedAssessment(assessment) {
    let check = false;
    if (this.listSelectedAssessment.length > 0) {
      const index = this.listSelectedAssessment.findIndex(assessmentSelect => assessmentSelect.id == assessment.id);
      if (index >= 0) check = true;
    }
    return check;
  }
}
