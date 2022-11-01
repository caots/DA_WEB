import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVENT_CATEGORY_ANALYTICS, EVENT_NAME_ANALYTICS, PAGING } from 'src/app/constants/config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.scss']
})

export class SlidersComponent implements OnInit {
  searchName: string;
  eventClickBtn = EVENT_NAME_ANALYTICS.ClickBtn;
  eventClickCategory = EVENT_CATEGORY_ANALYTICS.ClickBtnInLanding;
  API_S3 = environment.api_s3;
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  searchInputSlider() {
    const queryParams = { q: this.searchName, pageSize: PAGING.MAX_ITEM };
    this.router.navigate(['/job'], { queryParams });
  }


}
