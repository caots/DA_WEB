export interface Assesment {
  id: number;
  name: string;
  assessmentId: number;
  assessment_id: number;
  time?: number;
  point?: number;
  categoryName?: string;
  categoryId?: number;
  description?: string;
  type?: number;
  duration?: number;
  assessments_name?: string;
  assessments_questions?: string;
  created_at: Date;
  current_testInvitationId: number;
  current_testStatus: string;
  current_testUrl?: string;
  is_deleted: number;
  job_seeker_id: number;
  status: number;
  totalTake: number;
  updated_at?: Date;
  weight?: number;
  selectJobStatus?: boolean;
  selectedShowHistory: boolean;
  questions?: number;
  job_seeker_assessments_current_testStatus: string;
  format: string;
  category_name: string;
  selectedCandidate: boolean;
  categoryIndex: number;
  candidate_point: number;
  job_seeker_assessments_time: Date;
  instruction: string;
  assessments_instruction: string;
  categories?: {
    category_id: number
  }[];
  disableDuplicate: boolean;
  categoriesName: string[];
}

export interface ResultCustumAssessment {
  assessment_id: number;
  assessment_type: number;
  created_at: Date;
  current_testInvitationId?: number;
  current_testStatus?: string;
  current_testUrl?: string;
  do_exam_at?: string;
  id: number;
  is_deleted: number;
  job_seeker_id: number;
  status: number;
  totalTake: number;
  updated_at: Date;
  weight: number;
}

export interface CustomAssessment {
  assessment_id: number;
  category_id: number;
  category_name: string;
  created_at: Date;
  description: string;
  duration: number;
  employer_id: number;
  id: number;
  name: string;
  questions: number;
  status: string;
  type: number;
  updated_at: Date;
  totalJob: number;
}

export interface AssessmentHistory {
  attemptedOnUtc: Date;
  status: string;
  assessmentId: number;
  weight: number;
}
