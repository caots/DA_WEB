import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ms-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  userData: any;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(user => {
      this.userData = user;
    })
  }
}

