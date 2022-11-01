import { Assesment } from './assesment';
export class Applicants {
  userId: number;
  jobId: number;
  firstName: string;
  lastName: string;
  picture?: string;
  note?: string;
  stateName: string;
  title?: string;
  expiredAt: Date;
  cityName: string;
  listAssessment: Array<Assesment>;
  totalPoint: number;
  bookmarked?:  boolean;
  salary: string;
  benefits: string;
  assessmentsResult: any;
  jobSeekerRate: number;
  jobseekerId: number;
  stage: number;
  scheduleTime: Date;
  canViewProfile: number;
  can_view_profile?: number;
  canRateStars: number;
  group_id?: number;
  status: number;
  jobIsPrivate: number;
  type: number;
  job_seeker_user_responsive: number;
  jobseeker_is_deleted: number;
  jobseeker_user_status: number;
  jobseeker_is_user_deleted: number;
  salaryType?: number
}

export interface ShowApplicant{
  id: number;
  show: number;
}
