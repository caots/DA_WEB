import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PAGING, USER_TYPE } from 'src/app/constants/config';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})

export class SlidersComponent implements OnInit {
  @Input() userInfo: UserInfo
  searchName: string;
  API_S3 = environment.api_s3;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  searchInputSlider() {
    const queryParams = { q: this.searchName, pageSize: PAGING.MAX_ITEM };
    if (this.userInfo && this.userInfo.accountType == USER_TYPE.EMPLOYER) {
      // goto employer dashboard
      this.router.navigate(['/employer-dashboard'], { queryParams });
    } else {
      // goto job page
      this.router.navigate(['/job'], { queryParams });
    }
  }

}
