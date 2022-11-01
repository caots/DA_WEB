import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { ASSESSMENTS_TYPE, PAGING, PERMISSION_TYPE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CustomAssessment } from 'src/app/interfaces/assesment';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { PermissionService } from 'src/app/services/permission.service';
@Component({
  selector: 'ms-custom-assessments',
  templateUrl: './custom-assessments.component.html',
  styleUrls: ['./custom-assessments.component.scss']
})
export class CustomAssessmentsComponent implements OnInit {
  @Input() userData: UserInfo;
  paramsService = PARAMS;
  listCustomAssessment: CustomAssessment[];
  isLoadingAssessment: boolean;
  paginationConfig: PaginationConfig;
  permission = PERMISSION_TYPE;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private helperService: HelperService,
    public permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
    //console.log(this.userData);
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.getAllCustomeAssessment(this.paramsService);
  }

  getAllCustomeAssessment(params) {
    this.isLoadingAssessment = true;
    this.assessmentService.getListCustomAssessment(params).subscribe(data => {
      this.isLoadingAssessment = false;
      this.listCustomAssessment = data.listCustomAssessment;
      this.paginationConfig.totalRecord = data.total;
    }, err => {
      this.isLoadingAssessment = false;
      this.helperService.showToastError(err);
    })
  }

  paginationAssessment(page) {
    this.paginationConfig.currentPage = page;
    let params = Object.assign({}, this.paramsService, { page: page })
    this.getAllCustomeAssessment(params);
  }

  onEditCustomAssessment(isEdit, customAssessment: CustomAssessment) {
    // edit & preview
    this.router.navigate(['/add-custom-assessments'], { queryParams: { id: customAssessment.id, isEdit: isEdit } });
  }

  addCustomAssessment() {
    this.router.navigate(['/add-custom-assessments']);
  }

  onDuplicateCustom(customAssessment: CustomAssessment) {
    this.assessmentService.getCustomAssessmentDetails(customAssessment.id, ASSESSMENTS_TYPE.Custom).subscribe(data => {
      const body = this.convertDataBody(data);
      delete body?.format;
      this.onCreateCustomAssessment(body);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  convertDataBody(data){
    delete data['created_at'];
    delete data['assessment_id'];
    delete data['updated_at'];
    delete data['category_id'];
    delete data['category_name'];
    delete data['id'];
    data.questionList.map((question, index) => {
      delete data.questionList[index].created_at;
      delete data.questionList[index].updated_at;
      delete data.questionList[index].assessment_custom_id;
      delete data.questionList[index].id;
    })
    return data;
  }

  onDeleteCustomAssessment(customAssessment: CustomAssessment) {
    if (customAssessment.totalJob > 0) return;
    this.assessmentService.deleteCustomAssessment(customAssessment.id).subscribe(data => {
      this.helperService.showToastSuccess(MESSAGE.DELETE_CUSTOM_ASSESSMENT_SUCCESSFULLY);
      this.getAllCustomeAssessment(this.paramsService);
    }, err => {
      this.helperService.showToastError(err);
    })
  }

  onCreateCustomAssessment(data) {
    this.assessmentService.createCustomAssessment(data).subscribe(data => {
      this.helperService.showToastSuccess(MESSAGE.DUPLICATE_ASSESSMENT_SUCCESSFULLY);
      this.getAllCustomeAssessment(this.paramsService);
    }, err => {
      this.helperService.showToastError(err);
    })
  }
}

const PARAMS = {
  page: 0,
  pageSize: 10,
}