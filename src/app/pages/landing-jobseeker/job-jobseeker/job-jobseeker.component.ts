import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-job-jobseeker',
  templateUrl: './job-jobseeker.component.html',
  styleUrls: ['./job-jobseeker.component.scss']
})
export class JobJobseekerComponent implements OnInit {
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  jobJobseekerConfig = {
    direction: "horizontal",
    slidesPerView: 1,
    keyboard: true,
    scrollbar: false,
    navigation: false,
    pagination: this.pagination,
    centeredSlides: false,
    spaceBetween: 0,
    autoplay: false,
    loop: false,
    breakpoints: {
      1023: { direction: "vertical", },
    },
  };

  jobJobseekerConfigEnable = { ...this.jobJobseekerConfig, mousewheel: true };
  enableSwipe: boolean = false;
  API_S3 = environment.api_s3;
  
  constructor() { }

  ngOnInit(): void {
  }
  public onIndexChange(index: number) {
    // //console.log("Swiper index: ", index);
  }
  onAbleSwipe() {
    this.enableSwipe = true;
  }

}
