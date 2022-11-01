import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ms-share-user-history',
  templateUrl: './share-user-history.component.html',
  styleUrls: ['./share-user-history.component.scss']
})
export class ShareUserHistoryComponent implements OnInit {
  listReportLinks: any[] = []
  modalShareUserHistoryRef: NgbModalRef;
  isSaveLink: number = -1;
  reportUser: any;
  isGetListReports: boolean = false;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.getAllListUserStory();
  }

  getAllListUserStory() {
    this.isGetListReports = true;
    this.userService.getAllUserStory().subscribe((data: any) => {
      this.listReportLinks = data;
      if(this.listReportLinks && this.listReportLinks.length > 0){
        this.listReportLinks = this.listReportLinks.map(report => {
          report.assessment = JSON.parse(report.assessment);
          return report;
        })
      }
      this.isGetListReports = false;
    }, err => {
      this.helperService.showToastError(err);
      this.isGetListReports = false;
    })
  }

  createNewLink(modalShareUserHistory) {
    this.modalShareUserHistoryRef = this.modalService.open(modalShareUserHistory, {
      windowClass: 'modal-report-company',
      size: 'l'
    })
  }

  saveModalReportLink(saved = false) {
    this.reportUser = null;
    this.modalShareUserHistoryRef.close();
    if(saved) this.getAllListUserStory();
  }

  editItem(item, modalShareUserHistory){
    this.reportUser = item;
     this.modalShareUserHistoryRef = this.modalService.open(modalShareUserHistory, {
      windowClass: 'modal-report-company',
      size: 'l'
    })
  }

  copyItem(item){
    const url = `${location.protocol}//${location.host}/user-story?token=${item.token}`;
    this.copyToClipboard(url);
    this.isSaveLink = item.id;
    setTimeout(() => {
      this.isSaveLink = -1;
    }, 1500);
  }

  copyToClipboard(str){
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  async deleteItem(item){
    const isConfirm = await this.helperService.confirmPopup(MESSAGE.TITLE_CONFIRM_DELETE_REPORT, MESSAGE.BTN_YES_TEXT, MESSAGE.BTN_NO_TEXT);
    if (isConfirm) {
      this.userService.deleteUserStory(item.id).subscribe((data: any) => {
        this.helperService.showToastSuccess(MESSAGE.DELETED_REPORTS);
        this.getAllListUserStory();
      }, err => {
        this.helperService.showToastError(err);
      })
    }
  }

}
