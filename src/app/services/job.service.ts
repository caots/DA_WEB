import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { environment } from 'src/environments/environment';
import { Item } from 'src/app/interfaces/item';
import { Company, companySearch } from 'src/app/interfaces/company';
import { CitiWithLatLon, Job } from 'src/app/interfaces/job';
import { JobLevel } from 'src/app/interfaces/jobLevel';
import { JobCategory } from 'src/app/interfaces/jobCategory';
import { Assesment } from 'src/app/interfaces/assesment';
import { HelperService } from 'src/app/services/helper.service';
import { SubjectService } from 'src/app/services/subject.service';
import { EMPLOYMENT_TYPE_STR, JOB_TRAVEL_STR, SORT_JOB_JOBSEEKER, SALARY_TYPE, PROPOSED_CONPENSATION, ANY_DISTANCE_WITHIN, JOB_SALARY_TYPE, TAB_TYPE } from '../constants/config';

@Injectable({
  providedIn: 'root'
})

export class JobService {
  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
    private subjectService: SubjectService
  ) { }

  getListJobLevel(): Observable<JobLevel[]> {
    const url = `${environment.api_url}jobs/levels`;
    return this.httpClient.get<JobLevel[]>(url).pipe(map((cards: any) => {
      let results = cards.map(data => {
        return data;
      })
      this.subjectService.listLevel.next(results);
      return results;
    }))
  }


  addDaysToDate(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getListCategory(): Observable<JobCategory[]> {
    const url = `${environment.api_url}jobs/categories`;
    return this.httpClient.get<JobCategory[]>(url).pipe(map((cards: any) => {
      let results = cards.map(data => {
        return data;
      })
      this.subjectService.listCategory.next(results);
      return results;
    }))
  }

  getListAssessMentByCate(cateId): Observable<Assesment[]> {
    const url = `${environment.api_url}jobs/requiredAssessments/${cateId}`;
    return this.httpClient.get<Assesment[]>(url).pipe(map(listAssessment => {
      return listAssessment.map(assessment => {
        return this._mapAssessment(assessment);
      })
    }))
  }

  getListAssessMent(): Observable<Assesment[]> {
    const url = `${environment.api_url}jobs/requiredAssessments/0`;
    return this.httpClient.get<Assesment[]>(url).pipe(map(listAssessment => {
      let results = listAssessment.map(assessment => {
        return this._mapAssessment(assessment);
      })
      this.subjectService.listAssessment.next(results);
      return results;
    }))
  }
  preparePropertyJob(job) {
    if (!job.city_name) { job.city_name = ''; }
    if (!job.state_name) { job.state_name = ''; }
    if (!job.job_fall_under) { job.job_fall_under = ''; }
    return job;
  }
  createJob(job) {
    const url = `${environment.api_url}jobs`;
    job = this.preparePropertyJob(job);
    return this.httpClient.post(url, job);
  }

  editJob(job, id) {
    const url = `${environment.api_url}jobs/${id}`;
    job = this.preparePropertyJob(job);
    return this.httpClient.put(url, job);
  }

  editHotJob(job, id) {
    const url = `${environment.api_url}jobs/${id}/hotOrPrivateJob`;
    return this.httpClient.put(url, job);
  }

  followEmployer(id, action) {
    const url = `${environment.api_url}jobseeker-follows/${id}/${action}`;
    return this.httpClient.post(url, {});
  }

  duplicateJob(id) {
    const url = `${environment.api_url}jobs/${id}/duplicate`;
    return this.httpClient.put(url, {});
  }

  getlistSortJobEmployer(isDraftTab: boolean): Array<Item> {
    if (isDraftTab) return [
      { "id": 0, "name": "Newest Created " }, { "id": 1, "name": "Oldest Posted " }
    ]
    return [
      { "id": 0, "name": "Recently Posted " }, { "id": 1, "name": "Earliest Posted " }
    ]
  }

  getListSortJob(): Array<Item> {
    return SORT_JOB_JOBSEEKER;
  }

  async getTotalJob(): Promise<Array<any>> {
    const result = [];
    const listStatus = ['', 'bookmark', 'applied'];
    for (let i = 0; i < listStatus.length; i++) {
      result.push({
        id: listStatus[i],
        total: await this.getTotalJobByStatus(listStatus[i])
      })
    }

    return result;
  }

  deleteSpecialText(str: string) {
    return str.toString().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  }

  async getTotalJobByStatus(type): Promise<number> {
    const query = { searchType: type }
    const res = await this.getListJobOfJobSeeker(query).toPromise();
    return res.total;
  }

  getListJob(option): Observable<{ listJob: Array<Job>, total: number }> {
    const url = `${environment.api_url}jobs?${this._convertObjectToQuery(option, true)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listJob: data.results.map(item => this._mapJob(item))
      }
    }))
  }

  getListJobDraft(): Observable<Job[]> {
    const url = `${environment.api_url}jobs/draft`;
    return this.httpClient.get(url).pipe(map((jobs: any) => {
      return jobs.map(job => {
        return this._mapJob(job);
      })
    }))
  }

  getListJobOfJobSeeker(option) {
    if (option.salaryFrom && option.salaryType) {
      option.salaryFrom = this.convertSalary(option.salaryFrom, option.salaryType);
    }
    if (option.salaryTo && option.salaryType) {
      option.salaryTo = this.convertSalary(option.salaryTo, option.salaryType);
    }
    option.salaryType = JOB_SALARY_TYPE.PerHour;
    const url = `${environment.api_url}jobs/list?${this._convertObjectToQuery(option, true)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        cities: data.cities,
        listJob: data.results.map(item => this._mapJob(item))
      }
    }))
  }

  getListCompoanyFollowed(option) {
    const url = `${environment.api_url}jobseeker-follows?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listCompany: data.results.map(item => this._mapCompanyFollow(item))
      }
    }))
  }

  getListIdCompanyFollowed() {
    const url = `${environment.api_url}jobseeker-follows/ids`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      this.subjectService.listIdEmployerFollows.next(data);
      return data;
    }))
  }

  getCompanySearchDetails(id): Observable<Job> {
    const url = `${environment.api_url}jobs/${id}/company`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return this._mapCompanySearchDetails(data);
    }))
  }

  getListCompanyOfJobSeeker(params): Observable<companySearch[]> {
    const url = `${environment.api_url}jobs/companies?${this._convertObjectToQuery(params)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data.results.map(company => {
        return this._mapCompanySearchJobseeker(company);
      })
    }))
  }

  getListIndustriesOfJobSeeker(): Observable<string[]> {
    const url = `${environment.api_url}jobs/industries/all`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }))
  }

  // getListCityOfJobSeeker(params, searchType): Observable<string[]> {
  //   const url = `${environment.api_url}jobs/cities/${searchType}?${this._convertObjectToQuery(params)}`;
  //   return this.httpClient.get(url).pipe(map((data: any) => {
  //     return data.cities;
  //   }))
  // }

  deleteJob(id) {
    const url = `${environment.api_url}jobs/${id}`;
    return this.httpClient.delete(url);
  }
  getAllCitiesWithLatLon() {
    return this.httpClient.get<CitiWithLatLon[]>('./assets/data/cities-with-latlon.json');
  }
  getAllCountry() {
    return this.httpClient.get<string[]>('./assets/data/counties.json');
  }

  getAllState() {
    return this.httpClient.get<string[]>('./assets/data/states.json');
  }

  getAllStateByUS() {
    return this.httpClient.get<any[]>('./assets/data/stateByUS.json');
  }

  getAllCityByUS() {
    return this.httpClient.get<any[]>('./assets/data/cityByUS.json');
  }

  getAllCity() {
    return this.httpClient.get<any[]>('./assets/data/city.json');
  }

  getAllZipCode() {
    return this.httpClient.get<string[]>('./assets/data/zipcodesUS.json');
  }

  getAllFallUnder() {
    return this.httpClient.get<string[]>('./assets/data/job-fall-under.json');
  }

  makeBookMark(id, type) {
    const url = `${environment.api_url}jobs/${id}/bookmarks/${type}`;
    return this.httpClient.get(url);
  }

  getListBookmark(): Observable<number[]> {
    const url = `${environment.api_url}jobs/bookmarks`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data.jobIds;
    }))
  }

  getjobDetails(id): Observable<Job> {
    const url = `${environment.api_url}jobs/${id}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return this._mapJob(data);
    }))
  }

  getjobDetailsEmployer(id): Observable<Job> {
    const url = `${environment.api_url}jobs/employer/${id}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return this._mapJob(data);
    }))
  }

  getListJobsFromThisEmployer(option) {
    const url = `${environment.api_url}jobs/list?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listJob: data.results.map(item => this._mapJob(item))
      }
    }))
  }
  getListJobsCompactForEmployer(option) {
    const url = `${environment.api_url}jobs/getJobsCompact?${this._convertObjectToQuery(option)}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listJob: data.results.map(item => this._mapJob(item))
      }
    }))
  }

  getCompanyDetails(id): Observable<Company> {
    const url = `${environment.api_url}jobs/${id}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return this._mapCompany(data);
    }))
  }

  reportCompany(data) {
    const url = `${environment.api_url}reports/company`;
    return this.httpClient.post(url, data);
  }

  reportJob(data) {
    const url = `${environment.api_url}jobs/report`;
    return this.httpClient.post(url, data);
  }

  applyJob(id, data) {
    const url = `${environment.api_url}applicants/${id}/apply`
    return this.httpClient.post(url, data);
  }


  clickApplyJob(id) {
    const url = `${environment.api_url}notifications/clickApplyJob/${id}`
    return this.httpClient.get(url);
  }

  drawJob(id) {
    const url = `${environment.api_url}applicants/${id}/drawJob`;
    return this.httpClient.delete(url);
  }

  unfollowListEmployer(body) {
    const url = `${environment.api_url}jobseeker-follows`;
    return this.httpClient.request('delete', url, { body: { ids: body.toString() } });
  }

  switchSalaryType(type) {
    return SALARY_TYPE.find(salaryType => salaryType.id == type).title;
  }

  switchProposedCompensation(type) {
    return type === PROPOSED_CONPENSATION[1].id;
  }

  switchSalary(string) {
    if (!string || string == '') return;
    return string.toString().indexOf(',') >= 0 ? string.replace(/\,/g, '') : string;
  }

  private _mapAssessment(data): Assesment {
    return {
      id: data.id,
      name: data.name,
      categoryId: data.category_id,
      categoryName: data.category_name,
      description: data.description,
      time: data.duration,
      type: data.type,
      point: data.point,
      assessmentId: data.assessment_id,
      duration: data.duration,
      categories: data.categories
    } as Assesment;
  }

  _convertObjectToQuery(obj, isSearchJObseeker = false) {
    let query = '';
    for (let key in obj) {
      if (obj[key] !== undefined) {
        if (query) {
          if (isSearchJObseeker && key === 'assessments' && obj[key] != 'undefined') query += `&${key}=[${obj[key]}]`;
          else query += `&${key}=${obj[key]}`;
        } else {
          query += `${key}=${obj[key]}`;
        }
      }
    }

    return query;
  }

  generateLinkPrivateJob(job: Job) {
    return `${environment.url_webapp}job/${job.urlSeo}`;
  }

  convertSalary(salary, salaryType = 0) {
    salaryType = typeof salaryType === 'string' ? Number.parseInt(salaryType) : salaryType;
    switch (salaryType) {
      case JOB_SALARY_TYPE.PerHour:
        salary = salary;
        break;
      case JOB_SALARY_TYPE.PerDay:
        salary = salary / 8;
        break;
      case JOB_SALARY_TYPE.PerYear:
        salary = salary / 2080;
        break;
      case JOB_SALARY_TYPE.PerMonth:
        salary = salary / 173.33;
        break;
      case JOB_SALARY_TYPE.PerWeek:
        salary = salary / 40;
        break;
    }
    return `${Math.round((salary + Number.EPSILON) * 100) / 100}`;
  }

  private _mapJobAssessment(data): Assesment {
    return {
      id: data.id,
      name: data.assessments_name,
      point: data.point,
      assessmentId: data.assessment_id,
      type: data.assessment_type,
      status: data.status,
      created_at: data.created_at ? new Date(data.created_at) : null,
      instruction: data.instruction || '',
      assessments_instruction: data.assessments_instruction || ''
    } as Assesment;
  }

  private _mapCompanySearchDetails(data): Job {
    return {
      address: data.address_line,
      cityName: data.city_name,
      ceoName: data.employer_ceo_name,
      ceoPicture: `${data.employer_ceo_picture}`,
      companyFacebook: data.employer_company_facebook,
      companyName: data.employer_company_name,
      companyPhoto: data.employer_company_photo,
      stateName: data.state_name,
      yearFounded: data.employer_year_founded,
      revenueSizeMin: data.employer_revenue_min,
      revenueSizeMax: data.employer_revenue_max,
      employerSizeMin: data.employer_company_size_min,
      employerSizeMax: data.employer_company_size_max,
      twitterPage: data.employer_company_twitter,
      companyVideo: data.employer_company_video,
      companyWebsite: data.employer_company_url,
      employerDescription: data.employer_description,
      employerId: data.employer_id,
      industry: data.employer_industry,
      companyLogo: `${data.employer_profile_picture}`,
      employerFirstName: data.employer_first_name,
      employerLastName: data.employer_last_name,
      employerUserResponsive: data.employer_user_responsive,
      urlSeo: this.deleteSpecialText(this.helperService.convertToSlugUrl(data.employer_company_name, data.employer_id)),
    } as Job
  }

  private _mapJob(data): Job {
    if (!data.job_assessments) { data.job_assessments = []; }
    return {
      id: data.id,
      title: data.title,
      is_applied: data.is_applied,
      salary: data.salary,
      description: data.desciption,
      qualifications: data.qualifications,
      benefits: data.benefits,
      nbrOpen: data.nbr_open,
      views: data.views,
      status: data.status,
      createdAt: data.created_at ? new Date(data.created_at) : null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
      expiredAt: data.expired_at ? new Date(data.expired_at) : null,
      endHotJob: data.featured_end_date ? new Date(data.featured_end_date) : null,
      startHotJob: data.featured_start_date ? new Date(data.featured_start_date) : null,
      cityName: data.city_name,
      stateName: data.state_name,
      expiredDays: data.expired_days,
      levelName: data.job_levels_name,
      categoryName: data.jobs_category_name,
      levelId: data.jobs_level_id,
      totalApplicants: data.total_applicants,
      categoryId: data.jobs_category_ids,
      employerId: data.employer_id,
      employerDescription: data.employer_description,
      employerSizeMin: data.employer_company_size_min,
      employerSizeMax: data.employer_company_size_max,
      companyName: data.employer_company_name,
      companyLogo: `${data.employer_profile_picture}`,
      listAssessment: data.job_assessments.map(assessment => this._mapJobAssessment(assessment)),
      urlSeo: this.deleteSpecialText(this.helperService.convertToSlugUrl(data.title, data.id)),
      urlCompanySeo: this.deleteSpecialText(this.helperService.convertToSlugUrl(data.employer_company_name, data.id)),
      totalView: data.toal_view,
      industry: data.employer_industry,
      revenueSizeMin: data.employer_revenue_min,
      revenueSizeMax: data.employer_revenue_max,
      yearFounded: data.employer_year_founded,
      companyPhoto: data.employer_company_photo,
      ceoPicture: `${data.employer_ceo_picture}`,
      ceoName: data.employer_ceo_name,
      companyWebsite: data.employer_company_url,
      companyFacebook: data.employer_company_facebook,
      twitterPage: data.employer_company_twitter,
      companyVideo: data.employer_company_video,
      addUrgentHiringBadge: data.add_urgent_hiring_badge ? data.add_urgent_hiring_badge : 0,
      privateApplicants: data.private_applicants ? data.private_applicants : 0,
      isPrivate: data.is_private,
      scheduleJob: data.schedule_job,
      specificPercentTravel: data.specific_percent_travel_type >= 0 ? data.specific_percent_travel_type : null,
      isSpecificPercentTravel: data.is_specific_percent_travel,
      percentTravel: data.percent_travel ? data.percent_travel : 0,
      jobFallUnder: data.job_fall_under,
      bonus: data.bonus,
      salaryType: data.salary_type,
      salaryMin: data.salary_min,
      salaryMax: data.salary_max,
      statusCheckTemplate: false,
      address: data.address_line,
      proposedCompensation: data.proposed_conpensation,
      employmentType: data.employment_type ? data.employment_type : null,
      isPercentTravel: data.is_specific_percent_travel ? data.is_specific_percent_travel : 0,
      proposedConpensation: data.proposed_conpensation ? data.proposed_conpensation : 0,
      employmentTypeText: data.employment_type != null ? EMPLOYMENT_TYPE_STR[data.employment_type] : null,
      jobTravel: data.percent_travel !== null ? JOB_TRAVEL_STR[data.percent_travel] : null,
      isDuplicateAssessment: false,
      stage: data.applicant_stage,
      scheduleTime: data.applicant_scheduleTime ? new Date(data.applicant_scheduleTime) : null,
      group_id: data.group_id ? data.group_id : 0,
      can_rate_stars: data.can_rate_stars ? data.can_rate_stars : 0,
      isApplied: data.isApplied,
      isInvited: data.isInvited,
      employerUserResponsive: data.employer_user_responsive || 0,
      is_make_featured: data.is_make_featured || 0,
      company_city_name: data.company_city_name,
      company_state_name: data.company_state_name,
      is_crawl: data.is_crawl,
      is_crawl_text_status: data.is_crawl_text_status
    } as Job;
  }

  private _mapCompany(data): Company {
    return {
      companyID: data.employer_id,
      companyName: data.employer_company_name,
      companyLogo: `${data.employer_profile_picture}`,
      minSize: data.employer_company_size_min,
      maxSize: data.employer_company_size_max,
      description: data.employer_description,
    } as Company;
  }

  private _mapCompanySearchJobseeker(data): companySearch {
    return {
      companyID: data.company_id,
      companyName: data.company_name,
      companProfilePicture: data?.company_profile_picture,
    } as companySearch;
  }

  private _mapCompanyFollow(data): FollowCompany {
    return {
      company_image: `${data.company_image}`,
      company_name: data.company_name,
      created_at: data.created_at ? new Date(data.created_at) : null,
      employer_id: data.employer_id,
      id: data.id,
      job_seeker_id: data.job_seeker_id,
      status: data.status,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      isSelected: false
    } as FollowCompany;
  }
}

export interface FollowCompany {
  company_image?: string;
  company_name: string;
  created_at: Date;
  employer_id: number;
  id: number;
  job_seeker_id: number;
  status: number;
  updated_at: Date;
}