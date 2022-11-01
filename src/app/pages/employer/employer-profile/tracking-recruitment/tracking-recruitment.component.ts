import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { TRACKING_RECRUITMENT_TYPE } from 'src/app/constants/config';

import { HelperService } from 'src/app/services/helper.service';
import { JobService } from 'src/app/services/job.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'ms-tracking-recruitment',
  templateUrl: './tracking-recruitment.component.html',
  styleUrls: ['./tracking-recruitment.component.scss']
})
export class TrackingRecruitmentComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
  };
  dropdownList = [
    { item_id: 1, item_text: 'Overall Total' },
    { item_id: 2, item_text: 'Per Job Average' },
    { item_id: 3, item_text: 'Job A' },
    { item_id: 4, item_text: 'Job B' },
  ];
  followerHistory: {
    data: any[],
    label: string[];
  }
  recruitmentFunnel: any[];
  followerSelect = -7;
  recruitmentSelect = -30;
  followerSelects = [
    {
      id: 1,
      name: 'Last week',
      value: -7,
    },
    {
      id: 2,
      name: 'Last 30 days',
      value: -30,
    },
    {
      id: 3,
      name: 'Last 3 months',
      value: -90,
    },
    {
      id: 4,
      name: 'Last year',
      value: -365,
    },
    {
      id: 5,
      name: 'All time',
      value: 0
    },
  ];
  recruitmentSelects = [
    {
      id: 1,
      name: 'Last 30 days',
      value: -30,
    },
    {
      id: 2,
      name: 'Last 3 months',
      value: -90,
    },
    {
      id: 3,
      name: 'Last 6 months',
      value: -180,
    },
    {
      id: 4,
      name: 'Last year',
      value: -365,
    },
    {
      id: 5,
      name: 'All time',
      value: '',
    },
  ]
  totalFollower: number = 0;
  jobId = 0;
  jobList: any[];
  totalJob: number;
  chartOrksByStatus2 = {
    chartDataSets: [{
      data: [100, 0],
      borderWidth: 0,
      hoverBorderWidth: 0,
      backgroundColor: ['#4FB648', '#E6EDF5'],
    }],
    value: 0,
    chartSize: '250px',
    iconSize: '50px'
  }
  isFetchingData: boolean;
  totalEmployerViews: number = 0;
  constructor(
    private userService: UserService,
    private helperService: HelperService,
    private jobService: JobService,

    ) {

  }
  ngOnInit() {
    this.followerHistory = {
      data: [],
      label: []
    }
    // this.recruitmentFunnel = [{
    //   name: 'Unique users',
    //   data: [
    //     ['Website visits',    15654],
    //     ['Downloads',      10640],
    //     ['Requested price list', 1987],
    //     ['Invoice sent',      976],
    //     ['Finalized',       846]
    //   ]
    // }]
    this.getCurrentFollower();
    this.getFollowerHistory();
    this.getRecruitmentFunnel();
    this.getJobList();
  }
  getCurrentFollower() {
    this.isFetchingData = true;
    this.userService.getCurrentFollower().subscribe((data: any) => {
      this.totalFollower = data.totalFollower;
      this.totalEmployerViews = data.totalEmployerViews;
      this.chartOrksByStatus2.value = data.totalFollower;
      this.isFetchingData = false;
    }, err => {
      this.isFetchingData = false;
      this.helperService.showToastError(err);
    });
  }
  getFollowerHistory() {
    let fromDate = this.getFromDateByDateSelect();
    this.userService.getFollowerHistory(fromDate, this.followerSelect).subscribe((data: any) => {
      this.caclFollowerReport(data);
    }, err => {
      this.helperService.showToastError(err);
    });
  }
  getFromDateByDateSelect(isRecruitment = false) {
    if (isRecruitment) {
      const date = this.recruitmentSelect ? moment().utc().add(this.recruitmentSelect, 'days').format("YYYY-MM-DD HH:mm:ss") : '';
      return date;
    }
    return this.followerSelect ? moment().utc().add(this.followerSelect, 'days').format("YYYY-MM-DD HH:mm:ss") : '';
  }
  caclFollowerReport(res) {
    const followerSelectObj = this.followerSelects.find(x => x.value == this.followerSelect);
    const label = res.dates.map(date => {
      const dayMonthYear = date.split(' ')[0];
      if (!followerSelectObj.value) {
        return dayMonthYear;
      }
      return `${dayMonthYear.split('-')[1]}-${dayMonthYear.split('-')[2]}`
    })
    const followerHistory = {
      data: [
        { data: res.dataFollower, label: 'Follower Count' },
        { data: res.dataEmployerViews, label: 'Employer Page Views' },
      ],
      label
    } as any;
    this.followerHistory = followerHistory;
  }
  onChangeFollowerSelect(value) {
    this.getFollowerHistory();
  }
  getRecruitmentFunnel() {
    let fromDate = this.getFromDateByDateSelect(true);
    const jobId = this.jobId == -1 ? 0 : this.jobId;
    this.userService.getRecruitmentFunnel(fromDate, jobId).subscribe((data: any) => {
      this.caclRecruitmentFunnelReport(data);
    }, err => {
      this.helperService.showToastError(err);
    });
  }
  caclRecruitmentFunnelReport(data: any[]) {
    const totalMaping = data.map(point => {
      // avarage
      if (this.jobId == -1) {
        if (!point.total || !this.totalJob) { return 0.001; };
        return +(point.total/this.totalJob).toFixed(2);
      }
      return point.total ? point.total : 0.1
      
    })
    this.recruitmentFunnel = [{
      name: 'Total',
      data: [
        [TRACKING_RECRUITMENT_TYPE[0].name, totalMaping[0]],
        [TRACKING_RECRUITMENT_TYPE[1].name, totalMaping[1]],
        [TRACKING_RECRUITMENT_TYPE[2].name, totalMaping[2]],
        [TRACKING_RECRUITMENT_TYPE[3].name, totalMaping[3]],
        [TRACKING_RECRUITMENT_TYPE[4].name, totalMaping[4]],
        [TRACKING_RECRUITMENT_TYPE[5].name, totalMaping[5]],
        [TRACKING_RECRUITMENT_TYPE[6].name, totalMaping[6]],
      ]
    }]
  }
  onChangeRecruitmentFunnelSelect(value) {
    this.getRecruitmentFunnel();
  }
  onChangeSelectJob(value) {
    this.getRecruitmentFunnel();
  }
  getJobList() {
    this.jobService.getListJobsCompactForEmployer({pageSize: 1000}).subscribe(res => {
      this.jobList = res.listJob;
      this.totalJob= res.total
    });
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
