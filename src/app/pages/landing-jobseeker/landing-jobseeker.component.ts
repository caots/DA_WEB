import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DESCRIPTION_VIDEO, KEY_VIDEO_LANDINGPAGE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CeoService } from 'src/app/services/ceo.service';
import { SubjectService } from 'src/app/services/subject.service';
@Component({
  selector: 'ms-landing-jobseeker',
  templateUrl: './landing-jobseeker.component.html',
  styleUrls: ['./landing-jobseeker.component.scss']
})
export class LandingJobseekerComponent implements OnInit {
  @ViewChild('pointShowPopup') pointShowPopup: ElementRef;
  userInfo: UserInfo;
  renderVideo: boolean = true;
  description: string = DESCRIPTION_VIDEO.JOBSEEKER;
  keyVideo: string = KEY_VIDEO_LANDINGPAGE.JOBSEEKER;
  isShowPopupSingup: boolean = false;
  firstCall: number = 1;
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (window.scrollY >= 300 && !this.isShowPopupSingup && this.firstCall == 1&& !this.userInfo) {
      this.isShowPopupSingup = true;
      this.firstCall++;
    }
  }
  constructor(
    private ceoService: CeoService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    if (this.ceoService.checkUserAgentBot()) this.renderVideo = false;
    this.subjectService.user.subscribe(data => {
      if (!data) return;
      this.userInfo = data;
      this.isShowPopupSingup = false;
    });
    setTimeout(() => {
      if (!this.isShowPopupSingup && this.firstCall == 1 && !this.userInfo) {
        this.isShowPopupSingup = true;
        this.firstCall++;
      }
    }, 5000)
  }

  close() {
    this.isShowPopupSingup = false;
    return;
  }

}
