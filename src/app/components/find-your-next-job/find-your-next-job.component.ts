import { Input } from '@angular/core';
// 
import UsStates from "us-state-codes";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { PAGING, USER_TYPE } from 'src/app/constants/config';
import { CitiWithLatLon } from 'src/app/interfaces/job';
import { UserInfo } from 'src/app/interfaces/userInfo';
import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'ms-find-your-next-job',
  templateUrl: './find-your-next-job.component.html',
  styleUrls: ['./find-your-next-job.component.scss']
})
export class FindYourNextJobComponent implements OnInit {
  @Input() userInfo: UserInfo;
  API_S3 = environment.api_s3;
  searchName: string;
  place: string;
  listImage = [
    `${this.API_S3}/cdn/laptop_mockup1.webp`,
    `${this.API_S3}/cdn/laptop_mockup2.webp`,
    `${this.API_S3}/cdn/laptop_mockup3.webp`,
  ];
  listCountry: Array<string> = [];
  listState: string[] = [];
  autoCompleteData: string[] = [];
  citiesWithLatLon: CitiWithLatLon[];
  citiStates: string[];
  sentLocation: string;
  listZipCode: string[];

  constructor(
    private router: Router,
    private jobService: JobService,
    private helperService: HelperService,
  ) { }

  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  
  findNextJobConfig = {
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

  findNextJobConfigEnable = { ...this.findNextJobConfig, mousewheel: true };
  enableSwipe: boolean = false

  ngOnInit(): void {
    this.jobService.getAllCountry().subscribe(listCountry => {
      this.listCountry = listCountry;
      // this.autoCompleteData = this.autoCompleteData.concat(this.listCountry);
    })
    this.jobService.getAllState().subscribe(res => {
      this.listState = res;
      this.autoCompleteData = this.autoCompleteData.concat(this.listState);
    })
    this.jobService.getAllZipCode().subscribe(listZipCode => {
      this.listZipCode = listZipCode;
      this.autoCompleteData = this.autoCompleteData.concat(this.listZipCode);
    })
    this.jobService.getAllCitiesWithLatLon().subscribe(res => {
      this.citiStates = res.map(obj => obj.name);
      this.citiesWithLatLon = res;
      this.autoCompleteData = this.autoCompleteData.concat(this.citiStates);
    })
  }

  enableSwipSlide(){
    this.enableSwipe = true;
  }

  getLocation() {
    try {
      if (!this.place) {
        this.updateLocation();
        return;
      }
      const cityStateLatLon = this.citiesWithLatLon.find(obj => obj.name == this.place);
      // if select city and state
      if (cityStateLatLon) {
        const citySateArray = this.place.split(', ');
        const stateName = UsStates.getStateNameByStateCode(citySateArray[1]);
        this.updateLocation(citySateArray[0], stateName, cityStateLatLon.loc);
        return;
      }
      const city = this.listCountry.find(obj => obj == this.place);
      if (city) {
        this.updateLocation(city, '', []);
        return;
      }
      this.updateLocation();
    } catch (e) {
      this.updateLocation();
    }
  }
  updateLocation(city = '', state = '', location = []) {
    this.sentLocation = city;
  }

  searchJob() {
    this.getLocation();
    const queryParams = { q: this.searchName, pageSize: PAGING.MAX_ITEM, location: this.sentLocation, place: this.place };
    if (this.userInfo && this.userInfo.accountType == USER_TYPE.EMPLOYER) {
      // goto employer dashboard
      this.router.navigate(['/employer-dashboard'], { queryParams });
    } else {
      // goto job page
      this.router.navigate(['/job'], { queryParams });
    }
  }

  selectCountry = (text$: Observable<string>) => {
    return text$.pipe(
      distinctUntilChanged(),
      map(query => {
        return this.helperService.autoCompleteFilter(this.autoCompleteData, query, 10);
      })
    )
  }
}