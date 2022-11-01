import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Autoplay } from 'swiper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-job-employer',
  templateUrl: './job-employer.component.html',
  styleUrls: ['./job-employer.component.scss']
})
export class JobEmployerComponent implements OnInit {
  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  jobEmployerConfig = {
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
    breakpoints:{
      1023: { direction: "vertical", } ,
    },
  };

  jobEmployerConfigEnable = { ...this.jobEmployerConfig, mousewheel: true };
  enableSwipe: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  public onIndexChange(index: number) {
    // //console.log("Swiper index: ", index);
  }

  enableSwipeSlide(){
    this.enableSwipe = true;
  }
  API_S3 = environment.api_s3;


}
