import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'ms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  userInfo: UserInfo;

  constructor(
    private subjectService: SubjectService
  ) {    
  }  

  ngOnInit(): void {
    this.subjectService.user.subscribe(user => {
      this.userInfo = user;
    });
  }
}
