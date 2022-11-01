import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { JobService } from 'src/app/services/job.service';
import { FollowCompany } from 'src/app/interfaces/job';
import { SubjectService } from 'src/app/services/subject.service';
import { PaginationConfig } from 'src/app/interfaces/paginattionConfig';
import { LIST_TAB, PAGING, SORT_EMPLOYER_FOLLOW, MAX_EMPLOYER_UNFOLLOW_WARNING_TEXT } from 'src/app/constants/config';
import { Search } from 'src/app/interfaces/search';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'ms-follow-employers',
  templateUrl: './follow-employers.component.html',
  styleUrls: ['./follow-employers.component.scss']
})
export class FollowEmployersComponent implements OnInit {
  orderBy: number;
  isLoadingListCompany: boolean;
  isDelete = false;
  listTab: any = LIST_TAB;
  listSort = SORT_EMPLOYER_FOLLOW;
  listCompanyFollow: FollowCompany[];
  querySearch: Search;
  paginationConfig: PaginationConfig;
  searchType: String;
  isCheckAllEmployer: boolean = false;
  listIdsEmplopyerFollowed: number[];

  constructor(
    private jobService: JobService,
    private subjectService: SubjectService,
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private previousRouteService: PreviousRouteService,
  ) {
    this.querySearch = new Search();
  }

  ngOnInit(): void {
    this.subjectService.listIdEmployerFollows.subscribe(data => {
      if (!data) return;
      this.listIdsEmplopyerFollowed = data;
    });
    this.paginationConfig = {
      currentPage: 0,
      totalRecord: 0,
      maxRecord: PAGING.MAX_ITEM
    }
    this.activatedRoute.queryParams.subscribe(params => {
      let page = 1;
      if (params && params.page) {
        page = parseInt(params.page);
      }
      if (params && params.searchType) {
        if (this.listTab.find(tab => params.searchType == tab.id)) {
          this.searchType = params.searchType;
        }
      }
      if (params && params.q) this.querySearch.name = params.q;
      if (params && params.orderNo) this.orderBy = params.orderNo;

      if (Number.isInteger(page) && page >= 1) {
        this.paginationConfig.currentPage = page - 1;
      }
      this.getAllCompanyFollow();
    })

  }

  changeSort(sort) {
    if (this.orderBy == sort.id) return;
    this.orderBy = sort.id;
    this.getAllCompanyFollow();
  }

  getSearchCondition() {
    let condition: any = {
      searchType: this.searchType,
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.maxRecord,
      orderNo: this.orderBy
    }

    if (this.querySearch.name) {
      condition.q = this.querySearch.name;
    }

    if (this.orderBy !== undefined) {
      condition.orderNo = this.orderBy;
    }
    return condition;
  }

  searchCompanyFollow() {
    this.getAllCompanyFollow();
  }

  getAllCompanyFollow() {
    this.isLoadingListCompany = true;
    const condition = this.getSearchCondition();
    const conditionChangePage = Object.assign({}, condition, { page: 0 });
    const query = this.jobService._convertObjectToQuery(conditionChangePage);
    this.previousRouteService.replaceStage(`/job?${query}`);
    this.jobService.getListCompoanyFollowed(condition).subscribe(res => {
      this.isLoadingListCompany = false;
      this.paginationConfig.totalRecord = res.total;
      this.listCompanyFollow = res.listCompany;
    }, err => {
      this.isLoadingListCompany = false;
      this.helperService.showToastError(err);
    })
  }

  paginationJob(page) {
    this.router.navigate([], {
      queryParams: {
        page: page + 1,
        searchType: this.searchType,
      }
    })
  }

  clearFilter() {
    this.querySearch = new Search();
    this.orderBy = undefined;
    this.isCheckAllEmployer = false;
  }

  onUnFollowEmployer() {
    let ids = [];
    let employerIds = [];
    this.listCompanyFollow.map(employer => {
      if (employer.isSelected) {
        ids.push(employer.id);
        employerIds.push(employer.employer_id);
      }
    })
    this.isDelete = true;
    this.jobService.unfollowListEmployer(ids).subscribe(res => {
      this.isDelete = false;
      this.clearFilter();
      //this.getAllCompanyFollow();
      this.clearListUnfollow(ids, employerIds);
      this.helperService.showToastSuccess(MESSAGE.UPDATE_UNFOLLOW_SUCCESSFULY);
    }, err => {
      this.isDelete = false;
      this.helperService.showToastError(err);
    })
  }

  clearListUnfollow(ids, employerIds) {
    if (!ids || ids.length <= 0) return;
    this.listCompanyFollow = this.listCompanyFollow.filter(company => !ids.includes(company.id));
    this.listIdsEmplopyerFollowed = this.listIdsEmplopyerFollowed.filter(id => !employerIds.includes(id));
    this.subjectService.listIdEmployerFollows.next(this.listIdsEmplopyerFollowed);
  }

  ChangeCheckAllEmplyer(isCheckAllEmployer) {
    this.isCheckAllEmployer = !isCheckAllEmployer;
    this.listCompanyFollow.forEach(employer => {
      employer.isSelected = this.isCheckAllEmployer;
    })
  }

  async unFollow() {
    const indexCheckSelect = this.listCompanyFollow.findIndex(employer => employer.isSelected == true);
    if (indexCheckSelect < 0) return;
    let countCheckUnfollow = 0;
    let textNameCompany = '';
    this.listCompanyFollow.map(employer => {
      if (employer.isSelected) {
        countCheckUnfollow += 1;
        textNameCompany += `${employer.company_name}, `;
      }
    })
    if (countCheckUnfollow >= MAX_EMPLOYER_UNFOLLOW_WARNING_TEXT) textNameCompany = `${countCheckUnfollow} employers`;
    else textNameCompany = this.replaceLast(textNameCompany, ',', '');
    const messageConfirm = `Are you sure you want to unfollow ${textNameCompany}?`;
    const isConfirmed = await this.helperService.confirmPopup(messageConfirm, MESSAGE.BTN_YES_TEXT);
    if (isConfirmed) {
      this.onUnFollowEmployer();
    }
  }

  replaceLast(x, y, z){
    let a = x.split("");
    a[x.lastIndexOf(y)] = z;
    return a.join("");
  }
  

}
