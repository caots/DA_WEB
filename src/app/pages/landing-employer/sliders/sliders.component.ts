import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USER_TYPE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { CeoService } from 'src/app/services/ceo.service';
import { HelperService } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ms-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})

export class SlidersComponent implements OnInit {
  @Input() userInfo: UserInfo;
  isLoadingBtn: boolean;  
  USER_TYPE = USER_TYPE;
  disableButtonForm: boolean;
  API_S3 = environment.api_s3;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this.router.navigate(['/register']);
  }

}
