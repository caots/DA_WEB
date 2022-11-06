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
  userInfo: UserInfo;  
  constructor(
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
   
  }

}
