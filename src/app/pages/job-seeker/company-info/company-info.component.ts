import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Company } from 'src/app/interfaces/company';
import { JobService } from 'src/app/services/job.service';
import { HelperService } from 'src/app/services/helper.service';
import { CeoService } from 'src/app/services/ceo.service';
import { SubjectService } from 'src/app/services/subject.service';

import { UserInfo } from 'src/app/interfaces/userInfo';

@Component({
  selector: 'ms-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})

export class CompanyInfoComponent implements OnInit {
  companyDetails: Company;
  isCallingApi: boolean;
  modalReportCompanyRef: NgbModalRef;
  user: UserInfo;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private jobService: JobService,
    private ceoService: CeoService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.isCallingApi = true;
    this.activatedRoute.paramMap.subscribe(params => {
      const url = params.get('slug');
      if (url) {
        const id = this.helperService.getIdFromSlugUrl(url);
        this.jobService.getCompanyDetails(Number(id)).subscribe(res => {
          this.companyDetails = res;
          this.isCallingApi = false;
          this.ceoService.changeMetaTag([{
            title: 'title',
            content: this.companyDetails.companyName
          }, {
            title: 'description',
            content: this.companyDetails.description
          }, {
            title: 'image',
            content: this.companyDetails.companyLogo
          }])
        }, errorRes => {
          this.helperService.showToastError(errorRes);
        })
      }
    })

    this.subjectService.user.subscribe(user => {
      this.user = user;
    })
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  showModalReportCompany(modalReportCompany) {
    if (this.user) {
      this.modalReportCompanyRef = this.modalService.open(modalReportCompany, {
        windowClass: 'modal-report-company',
        size: 'l'
      })
    } else {
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    this.location.back();
  }
}
