import { DEFAULT_WITHIN } from '../constants/config';
import { JobCategory } from './jobCategory';

export class Search {
  name: string;
}

export class SearchJob extends Search {
  location: number[];
  city: string;
  state: string;
  zipcode?: string
}

export class SearchJobEmployer extends SearchJob {
  createdAtFrom: string;
  createdAtTo: string;
  category: number | string;
  jobType: string;
  name: string;
}

export class SearchJobJobSeeker extends SearchJob {
  salaryFrom: number;
  salaryTo: number;
  salaryType: number;
  place: string;
  assessments: number[];
  // categories: Array<{
  //   id: number;
  //   name: string
  // }>;
  employer: {
    companyID: number;
    companyName: string;
  };
  jobType: number;
  within: any = DEFAULT_WITHIN.id;
  travel: number;
  percentTravelType: number;
  jobFallUnder: string;
  expiredDate: number;
  searchType: string;
}

export class SearchCandidate extends SearchJob{
  assessments: Array<{
    assessment_id: number;
    point: string
  }>;
  within: number = DEFAULT_WITHIN.id;
  salary: number;
  jobseekerId?: number;
}

export class SearchAssessment extends Search {
  category: number;
  onlyViewMyAssessment: number;
}
export class SearchConversation extends Search {
  // type = '';
  // isGroup = '1'
  searchType = 'default';
  isGroup = '0';
  groupId: number;
  q: string;
}

export class SearchAssessemntHomePage {
  page: number;
  pageSize: number;
  categoryId: any;
  isGetFromHomePage: number;
}