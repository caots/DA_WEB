import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { APPLICANT_STAGE, JOB_APPLICANT_TYPE, PERMISSION_TYPE, USER_RESPONSIVE, STATUS_APPLICANTS } from 'src/app/constants/config';
import { ASSESSMENT_WEIGHT } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { ApplicantsService } from 'src/app/services/applicants.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MessageService } from 'src/app/services/message.service';
import { Applicants } from 'src/app/interfaces/applicants';
import { AssessmentService } from 'src/app/services/assessment.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'ms-applicant-item',
  templateUrl: './applicant-item.component.html',
  styleUrls: ['./applicant-item.component.scss']
})
export class ApplicantItemComponent implements OnInit {
  @Input() applicant: any;
  @Input() userData: any;
  @Output() bookApplicant = new EventEmitter();
  @Output() reloadNote = new EventEmitter();
  modalNoteApplicantRef: NgbModalRef;
  assessmentWeight: any = ASSESSMENT_WEIGHT;
  numberStar: Array<number> = Array.from(Array(5).keys());
  listStages: any[] = APPLICANT_STAGE;
  stageName: string;
  permission = PERMISSION_TYPE;
  statusApplicant = STATUS_APPLICANTS;
  USER_RESPONSIVE = USER_RESPONSIVE;
  typeCandidate: boolean;
  salaryType: string;

  constructor(
    private router: Router,
    public asssessmentService: AssessmentService,
    private modalService: NgbModal,
    private helperService: HelperService,
    private applicantsService: ApplicantsService,
    public permissionService: PermissionService,
    private messageService: MessageService,
    private jobService: JobService
  ) { }

  ngOnInit(): void {
    this.typeCandidate = this.applicant.type == JOB_APPLICANT_TYPE.InvitedCandidate;
    this.salaryType = this.jobService.switchSalaryType(this.applicant.salaryType);
    this.listStages.forEach(element => {
      if (element.id === this.applicant.stage) {
        this.stageName = element;
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  openModalNoteApplicant(modalNoteApplicant) {
    this.modalNoteApplicantRef = this.modalService.open(modalNoteApplicant, {
      windowClass: 'modal-interview-schedule',
      size: 'lg'
    })
  }

  bookMark() {
    this.bookApplicant.emit(this.applicant);
  }

  getJobseekerPoint(job_seeker_point: number, job_assessments_point: number) {
    if(job_seeker_point === null) {
      return "N/A";
    }
    return ((job_seeker_point / job_assessments_point) * 100).toFixed(0);
  }

  changeNote(note) {
    this.applicant.note = note;
  }

  closeModalNote(status) {
    this.modalNoteApplicantRef.close();
    this.reloadNote.emit(status);
  }

  redirectToMessageCenter(applicant: Applicants) {
    this.messageService.redirectToMessageCenter(applicant);
  }
}
