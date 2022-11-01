import { Component, OnInit } from '@angular/core';
import { DESCRIPTION_VIDEO, KEY_VIDEO_LANDINGPAGE } from 'src/app/constants/config';
import { CardSettings } from 'src/app/interfaces/cardInfo';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-landing-employer',
  templateUrl: './landing-employer.component.html',
  styleUrls: ['./landing-employer.component.scss']
})

export class LandingEmployerComponent implements OnInit {
  settingsCard: CardSettings;
  userInfo: UserInfo;
  description: string = DESCRIPTION_VIDEO.EMPLOYER;
  keyVideo: string = KEY_VIDEO_LANDINGPAGE.EMPLOYER;
  
  constructor(
    private subjectService: SubjectService
  ) {
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.subjectService.settingsCard.subscribe(data => {
      if (!data) return;
      this.settingsCard = data;
    })
    this.subjectService.user.subscribe(data => {
      if (!data) return;
      this.userInfo = data;
    })
  }
}
