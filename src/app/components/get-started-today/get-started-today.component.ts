import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-get-started-today',
  templateUrl: './get-started-today.component.html',
  styleUrls: ['./get-started-today.component.scss']
})
export class GetStartedTodayComponent implements OnInit {
  @Input() userInfo: UserInfo;
  API_S3 = environment.api_s3;
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goToLogin(){
    this.router.navigate(['/register']);
  }

}
