export interface Message {
  isReadAll: any;
  id: number;
  content: string;
  content_type: number;
  created_at: string;
  deleted_at?: string;
  group_id: number;
  last_seen?: string;
  mime_type?: string;
  updated_at?: string;
  user_acc_type: number;
  user_company_name: string;
  user_employer_id: number;
  user_employer_title: string;
  user_first_name: string;
  user_id: number;
  user_last_name: string;
  user_profile_picture?: string;
  isRead?: string;
  content_html?: string;
}
export interface Conversation {
  can_view_profile?: number;
  company_id?: number;
  group_deleted_at?: string;
  group_id: number;
  group_type: number;
  jobSeeker_first_name: string;
  jobSeeker_id: number;
  jobSeeker_last_name: string;
  jobSeeker_profile_picture: string;
  job_id?: number;
  job_salary?: number;
  job_title: string;
  msg_content: string;
  msg_content_html?: string;
  msg_content_type: number;
  msg_mime_type?: string;
  msg_id: number;
  msg_last_time_send_message: string;
  msg_sender_first_name: string;
  msg_sender_id: number;
  msg_sender_last_name: string;
  msg_sender_profile_picture: string;
  ower_id: number;
  read_message_id?: number;
  company_name: string;
  company_profile_picture: string;
  job_is_private: number;
  job_applicant_id: number;
  job_seeker_rate?: number;
  total_point?: number;
  chat_groups_status?: number;
  group_nomal_type: number;
  company_user_responsive?: number;
  job_seeker_user_responsive?: number;
  jobseeker_is_deleted: number;
  jobseeker_user_status: number;
}
export interface SocketMessage {
  group_id: number;
  current_user: {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    acc_type: number;
    company_name: string;
    employer_title: string;
    employer_id: number
  };
  message_id?: number;
  job_id: number;
  content: string;
  mime_type?: string;
  content_type: number;
  updated_user_id: number;
  can_view_profile?: number;
  content_html?: string;
}
export interface GroupInfo {
  can_view_profile: any;
  company_id: number;
  created_at: string;
  deleted_at: string;
  id: number;
  job_id: number;
  member_id: number;
  name: string;
  ower_id: number;
  type: number;
  updated_at: string;
  group_nomal_type: number;
}

export interface FileDrop {
  url?: string;
  type?: number;
  mime_type?: string;
  name?: string;
}