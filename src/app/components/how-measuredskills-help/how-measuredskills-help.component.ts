import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-how-measuredskills-help',
  templateUrl: './how-measuredskills-help.component.html',
  styleUrls: ['./how-measuredskills-help.component.scss']
})
export class HowMeasuredskillsHelpComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  API_S3 = environment.api_s3;
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  measureHelpConfig = {
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
  };

  measureHelpConfigEnable = { ...this.measureHelpConfig , mousewheel: true }

  
  chartOrksByStatus1 = {
    chartDataSets: [{
      data: [70, 30],
      borderWidth: 0,
      hoverBorderWidth: 0,
      backgroundColor: ['#2668A8', '#E6EDF5'],
    }],
    value: '70%',
    chartSize: '200px',
    iconSize: '50px'
  }
  chartOrksByStatus2 = {
    chartDataSets: [{
      data: [42, 58],
      borderWidth: 0,
      hoverBorderWidth: 0,
      backgroundColor: ['#63CD00', '#E6EDF5'],
    }],
    value: '42%',
    chartSize: '200px',
    iconSize: '50px'
  }
  enableSwipe: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onAbleSwipe() {
    this.enableSwipe = true;
  }

}
