
import { environment } from 'src/environments/environment';

export const STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token',
  ROLE: 'role',
  USER_INFO: 'user_info'
}

export const JOBSEEKER_PAYMENT_REDIRECT = {
  imocha: 1,
  profile: 2,
  other: 3
}

export const RegexParten = {
  Email: '/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'
}

export const CUSTOM_ASSESSMENT_ID = 1;
export const CUSTOM_SELECT_ASSESSMENT_ID = -1;
export const ASSESSMENT_CUSTOM_CATEGORY = {
  assessmentId: CUSTOM_SELECT_ASSESSMENT_ID,
  categoryId: CUSTOM_ASSESSMENT_ID,
  name: "Custom Employer Assessments",
}

export const OPTIONS_AVATAR = {
  AVATAR_USER: 1,
  AVATAR_COMPANY: 2
};

export const EMPLOYER_PAYMENT = {
  private: 1,
  carts: 2,
  other: 3,
  messageTopup: 4,
  upgrade: 5
}

export const TAB_TYPE = {
  ACTIVE: '',
  CLOSE: 'expired',
  DRAFT: 'draft',
  CART: 'cart'
}

export const STATUS_CODE = {
  SUCCESS: 200,
  UNAUTHRRIZED: 401
}

export const API_STATUS = {
  SUCCESS: 1,
  ERROR: 0
}

export const USER_TYPE = {
  EMPLOYER: 0,
  JOB_SEEKER: 1,
  GUEST: 2,
  OTHER: 3
}

export const CONTACT_USER_TYPE = {
  EMPLOYER: 0,
  JOB_SEEKER: 1,
  OTHER: 2,
}

export const VERIFY_CODE_LENGTH = 5;
export const SETINGS_STEP = {
  COMPANY: 0,
  JOB_POSTING: 1,
  COMPLETE: 2
}
export const SETINGS_STEP_EMPLOYER = {
  ACCOUNT: 0,
  COMPANY: 1,
  COMPLETE: 2
}

export const SIGN_UP_STEP = {
  STEP0: 0,
  STEP1: 1,
  STEP2: 2,
  STEP3: 3
}

export const SKILL_STATUS = {
  INVALID: 'invalid',
  PASS: 'pass',
  WARNING: 'warning'
}
export const MAX_SIZE_IMAGE_UPLOAD = 5000000;
export const MIN_SIZE_IMAGE_UPLOAD = 15000;
export const ASSESSMENT_POINT_RANGE = {
  MIN: 1,
  MAX: 100
}
export const JOB_NUMBER_OPENING_RANGE = {
  MIN: 1,
  MAX: 99
}
export const MODE = {
  FULL: 'full',
  BASIC: 'basic'
}
export const PAYMENT_STATUS = {
  DEACTIVE: 0,
  ACTIVE: 1
}
export const PAGING = {
  MAX_ITEM: 10,
  MAX_ITEM_HOMEPAGE: 9,
  MAX_ITEM_CANDIDATE_HISTORY: 20,
  MAX_ITEM_NOTIFICATION: 6
}
export const CAPTCHA_ACTION = {
  LOGIN: 'login',
  REGISTER: 'register',
  PAYMENT: 'payment'
}
export const HTTP_METHOD = {
  GET: 'GET'
}
export const HOT_JOB_CONFIG = {
  NUMBER_ITEM: 6,
  KEY: 'hot'
}
export const CEO_TAG_CONFIG = {
  LADING_PAGE_JOBSEEKER: {
    TITLE: 'Search Jobs and Apply on MeasuredSkills',
    IMAGE: ``,
    DESCRIPTION: `MeasuredSkills is an online job board that matches highly qualified jobseekers to employers based on demonstrable skills instead of resumes.`
  },
  LADING_PAGE_EMPLOYER: {
    TITLE: 'Post your next job on MeasuredSkills',
    IMAGE: ``,
    DESCRIPTION: `We know the average job opening attracts 250 resumes and we know you only have the time to interview 2% of those. MeasuredSkills helps you take your hiring to the next level. Quickly and simply hire individuals with real skills.`
  },
  SIGNIN: {
    TITLE: 'Sign into MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: `Sign in to apply for jobs, view saved jobs, check your alerts and messages, and more. For employers, sign in to post jobs and find candidates. Don’t have an account? Sign up now.`
  },
  SIGNUP: {
    TITLE: 'Sign Up | MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: ``
  },
  CONTACT: {
    TITLE: 'Contact Us | MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: ''
  },
  TERM_OF_SERVICE: {
    TITLE: 'Term of Service | MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: ''
  },
  PRIVACY_POLICY: {
    TITLE: 'Privacy Policy | MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: ''
  },
  REPORT_STORY: {
    TITLE: 'Score Report | MeasuredSkills',
    IMAGE: `${environment.url_webapp}assets/images/logo-share.png`,
    DESCRIPTION: ''
  },
}
export const BOOKMARK_CONFIG = {
  BOOKMARK: 'follow',
  UN_BOOKMARK: 'unfollow'
}

export const JOB_STATUS = {
  Draft: 0,
  Active: 1,
  Inactive: 2,
  Closed: 3,
  UnPaid: 4,
};

export const JOB_ORDER = {
  BEST_MATCH: 6,
}

export const POINT_VALID_APPLY_JOB = 80;

export const ORDER_APPLICANTS = {
  APPLICANTS_DESC: 0,
  APPLICANTS_ASC: 1,
  SALARY_DESC: 2,
  SALARY_ASC: 3,
  SCORE_DESC: 4,
  SCORE_ASC: 5,
  HIGHEST_RATING: 6,
  LOWEST_RATING: 7
};
export const ASSESSMENT_STATUS = {
  validate: 0,
  retry: 1
}

export const ASSESSMENT_WEIGHT = {
  good: 80,
  medium: 65,
  bad: 0
}

export const COMPANY_PHOTOS = {
  NO_IMG_1: "Company Photo #1",
  NO_IMG_2: "Company Photo #2",
  NO_IMG_3: "Company Photo #3",
}
export const CHAT_CONTENT_TYPE = {
  Text: 0,
  Image: 1,
  File: 2,
  Complex: 3
};
export const UPLOAD_TYPE = {
  EmployerPhoto: "0",
  EmployerAvatar: "1",
  Chat: "2",
  QuesionImage: "3",
  CompanyAvatar: '4'
};
export const LIST_ICONS_REVIEW = {
  REVIEWED: "reviewed",
  SCHEDULED: "scheduled",
  PHONE_CALL: "phone-call",
  FOLLOW_UP_EMAIL: "follow-up-email",
  OFFER_WAS_MADE: "offer-was-made",
  INTEVIEW_PLACE: "interview-too-place",
  ACCEPTED: "accepted",
  CV_REVIEWED: "cv-reviewed",
  ONLINE: "online",
  PENDING: "pending",
};

export const APPLICANT_STAGE = [
  // { id: 0, icon: LIST_ICONS_REVIEW.PENDING, value: 'Pending' },  // Pending interview
  { id: 8, icon: LIST_ICONS_REVIEW.CV_REVIEWED, value: 'CV or resume was reviewed' }, // to indicate CV were reviewed
  { id: 1, icon: LIST_ICONS_REVIEW.REVIEWED, value: 'Additional documents were reviewed' },  // to indicate follow  up documents were reviewed
  { id: 4, icon: LIST_ICONS_REVIEW.FOLLOW_UP_EMAIL, value: 'A follow-up email was sent' }, // e-mail: to indicate follow up email was made
  { id: 2, icon: LIST_ICONS_REVIEW.SCHEDULED, value: 'A follow-up meeting is scheduled' },  // to indicate that a follow up is scheduled
  { id: 3, icon: LIST_ICONS_REVIEW.PHONE_CALL, value: 'A follow-up phone call was made' }, // telephone_receiver: to indicate follow up phone call was made
  { id: 9, icon: LIST_ICONS_REVIEW.ONLINE, value: 'An online meeting took place' }, // Online meeting
  { id: 6, icon: LIST_ICONS_REVIEW.INTEVIEW_PLACE, value: 'An in-person interview took place' }, // :office: or :briefcase: to indicate an in person interview took place
  { id: 5, icon: LIST_ICONS_REVIEW.OFFER_WAS_MADE, value: 'An offer was made to this candidate' }, // admission_tickets: or :dove_of_peace: to indicate offer was made
  { id: 7, icon: LIST_ICONS_REVIEW.ACCEPTED, value: 'An offer was accepted by this candidate' }, // handshake: for offer accepted by candidate
];

export const linkEmbedYoutube = 'https://www.youtube.com/embed/';

export const listIndustry = [
  "Accounting",
  "Airlines/Aviation",
  "Alternative Dispute Resolution",
  "Alternative Medicine",
  "Animation",
  "Apparel & Fashion",
  "Architecture & Planning",
  "Arts and Crafts",
  "Automotive ",
  "Aviation & Aerospace",
  "Banking",
  "Biotechnology ",
  "Broadcast Media",
  "Building Materials",
  "Business Supplies and Equipment",
  "Capital Markets",
  "Chemicals",
  "Civic & Social Organization",
  "Civil Engineering",
  "Commercial Real Estate",
  "Computer & Network Security",
  "Computer Games",
  "Computer Hardware ",
  "Computer Networking",
  "Computer Software ",
  "Construction",
  "Consumer Electronics",
  "Consumer Goods",
  "Consumer Services",
  "Cosmetics",
  "Dairy",
  "Defense & Space ",
  "Design",
  "Education Management",
  "E-Learning",
  "Electrical/Electronic Manufacturing",
  "Entertainment ",
  "Environmental Services ",
  "Events Services",
  "Executive Office",
  "Facilities Services",
  "Farming",
  "Financial Services ",
  "Fine Art",
  "Fishery",
  "Food & Beverages",
  "Food Production",
  "Fund-Raising",
  "Furniture ",
  "Gambling & Casinos",
  "Glass, Ceramics & Concrete",
  "Government Administration",
  "Government Relations",
  "Graphic Design",
  "Health, Wellness and Fitness ",
  "Higher Education",
  "Hospital & Health Care ",
  "Hospitality",
  "Human Resources ",
  "Import and Export",
  "Individual & Family Services",
  "Industrial Automation",
  "Information Services",
  "Information Technology and Services ",
  "Insurance ",
  "International Affairs",
  "International Trade and Development",
  "Internet ",
  "Investment Banking",
  "Investment Management",
  "Judiciary",
  "Law Enforcement",
  "Law Practice ",
  "Legal Services",
  "Legislative Office",
  "Leisure, Travel & Tourism",
  "Libraries",
  "Logistics and Supply Chain",
  "Luxury Goods & Jewelry ",
  "Machinery",
  "Management Consulting",
  "Maritime",
  "Market Research",
  "Marketing and Advertising",
  "Mechanical or Industrial Engineering",
  "Media Production",
  "Medical Devices ",
  "Medical Practice ",
  "Mental Health Care ",
  "Military ",
  "Mining & Metals",
  "Motion Pictures and Film",
  "Museums and Institutions",
  "Music ",
  "Nanotechnology",
  "Newspapers",
  "Non-Profit Organization Management",
  "Oil & Energy",
  "Online Media",
  "Outsourcing/Offshoring ",
  "Package/Freight Delivery",
  "Packaging and Containers",
  "Paper & Forest Products",
  "Performing Arts",
  "Pharmaceuticals",
  "Philanthropy",
  "Photography",
  "Plastics",
  "Political Organization",
  "Primary/Secondary Education",
  "Printing",
  "Professional Training & Coaching",
  "Program Development",
  "Public Policy",
  "Public Relations and Communications",
  "Public Safety",
  "Publishing ",
  "Railroad Manufacture",
  "Ranching",
  "Real Estate ",
  "Recreational Facilities and Services",
  "Religious Institutions",
  "Renewables & Environment",
  "Research",
  "Restaurants",
  "Retail",
  "Security and Investigations",
  "Semiconductors",
  "Shipbuilding",
  "Sporting Goods",
  "Sports",
  "Staffing and Recruiting ",
  "Supermarkets",
  "Telecommunications ",
  "Textiles",
  "Think Tanks",
  "Tobacco",
  "Translation and Localization",
  "Transportation/Trucking/Railroad ",
  "Utilities",
  "Venture Capital & Private Equity",
  "Veterinary",
  "Warehousing ",
  "Wholesale",
  "Wine and Spirits",
  "Wireless  ",
  "Writing and Editing",
  "Other/Not Listed"
];

export const OTHER_INDUSTRY = 'Other/Not Listed';

export const PERMISSION_TYPE = {
  OTHER: 0,
  CHANGE_JOB: 1,
  INFO_COMPANY: 2,
  CHAT: 3,
  BILLING_ANDPAYMENT: 4,
  CANDIDATE: 5
};
export const GROUP_TYPE = {
  Support: 0,
  Nomal: 1
};
export const GROUP_NOMAL_TYPE = {
  Nomal: 0,
  DirectMessage: 1
};
export const SEARCH_GROUP_TYPE = {
  Expired: "expired",
  Active: "default",
  All: ""
};


export const REPORT_EMPLOYER_MESSAGE = [
  {
    id: 0,
    title: 'Inappropriate/Abusive Behavior.',
    isCheckbox: false
  },
  {
    id: 1,
    title: 'Suspected Fraud/Scam.',
    isCheckbox: false
  },
  {
    id: 2,
    title: 'Employer is impersonating someone else.',
    isCheckbox: false
  },
  {
    id: 3,
    title: 'Other',
    isCheckbox: false
  },
]
export const listImageAcceptMessage = [
  'image/png', 'image/bmp', 'image/jpeg', 'image/tiff', 'image/gif'
]

export const listFileAcceptMessage = [
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv', 'application/rtf', "audio/mpeg", "video/mp4", "video/3gpp", "video/x-flv", "video/quicktime",
  "application/x-7z-compressed", "application/x-rar-compressed", "application/x-rar", "application/vnd.rar",
  "application/zip", "application/octet-stream", "application/x-zip-compressed", "multipart/x-zip", "application/x-compressed"
]

export const STATUS_APPLICANTS = {
  active: 1,
  withdrawn: 0
}

export const REPORT_APPLICANT_MESSAGE = [
  {
    id: 0,
    title: 'Inappropriate/Abusive Behavior',
    isCheckbox: false
  },
  {
    id: 1,
    title: 'Suspected Fraud/Scam',
    isCheckbox: false
  },
  {
    id: 2,
    title: 'Applicant is Impersonating Someone Else',
    isCheckbox: false
  },
  {
    id: 3,
    title: 'Other',
    isCheckbox: false
  },
]

export const PAYMENT_TYPE = {
  ValidateTest: 0,
  RetryValidateTest: 1,
  Topup: 2,
  Credit: 6,
  BuyMorePrivate: 7,
  BuyDmCandidate: 8,
  upgradeJob: 9
}

export const PAYMENT_TYPE_HISTORY = {
  0: 'Validate Test',
  1: 'Retry Test',
  2: 'Topup',
  3: 'StandardJob',
  4: 'HotJob',
  5: 'MultiJobs',
  6: 'Credit',
  7: 'BuyMorePrivate'
};

export const CHAT_HISTORY = 'chat_history';

export const EXPORT_TYPE = {
  excel: 1,
  pdf: 2
}

export const CARD_IMAGE = [
  { key: 'VISA', value: 'assets/images/payment_icon/visa.png' },
  { key: 'MC', value: 'assets/images/payment_icon/mastercard.png' },
  { key: 'JCB', value: 'assets/images/payment_icon/jcb.png' },
  { key: 'DISC', value: 'assets/images/payment_icon/discover.png' },
  { key: 'DC', value: 'assets/images/payment_icon/diners-club.png' },
  { key: 'AMEX', value: 'assets/images/payment_icon/american-express.png' }
]

export const QESTION_CUSTOME_ASSESSMENT = {
  MULTIPLE_CHOICE: 3,
  SINGLE_TEXTBOX: 2,
  CHECKBOXES: 1,
  TRUE_FALSE: 0
}
export const TYPE_QESTION_CUSTOME_ASSESSMENT = [
  { id: 1, value: 'Multiple Choice' },
  { id: 0, value: 'True/False' },
  { id: 2, value: 'Free Response Textbox' }
]

export const ASSESSMENTS_TYPE = { IMocha: 0, Custom: 1 };

export const MAX_ASSESSMENT_IMOCHA = 5;

export const MAX_ASSESSMENT_CANDIDATE = 5;

export const ASSESSMENTS_CUSTOM_QUESTION_ACTION = { Add: "Add", Update: "Update", Remove: "Remove" };

export const TAB_ASSESSMENT_JOBSEEKER = {
  catalogue: 0,
  custom: 1
}

export const TIME_COUNTER = {
  minus: 59,
  second: 59
}

export const SALARY_TYPE = [
  { id: 0, title: 'Per Year' },
  { id: 4, title: 'Per Hour' },
  { id: 3, title: 'Per Day' },
  { id: 2, title: 'Per Week' },
  { id: 1, title: 'Per Month' }
]

export const SALARY_PER_YEAR = 0;

export const PERCENT_TRAVEL = {
  ONSITE: 0,
  REMOTE: 1,
  HYBRID: 2
}

export const LIST_BENEFITS = [
  { id: 3, title: '401(k)', status: false },
  { id: 8, title: '401(k) Matching', status: false },
  { id: 2, title: 'Dental Insurance', status: false },
  { id: 9, title: 'Disability Insurance', status: false },
  { id: 12, title: 'Employee Discount', status: false },
  { id: 5, title: 'Flexible Schedule ', status: false },
  { id: 13, title: 'Flexible Spending Account', status: false },
  { id: 0, title: 'Health Insurance', status: false },
  { id: 7, title: 'Life Insurance', status: false },
  { id: 11, title: 'Referral Program', status: false },
  { id: 10, title: 'Retirement Plan', status: false },
  { id: 1, title: 'Paid Time Off (PTO)', status: false },
  { id: 6, title: 'Tuition Reimbursement', status: false },
  { id: 4, title: 'Vision Insurance', status: false },
]

export const JOB_SCHEDULE = [
  { id: 0, title: 'Eight (8) Hour Shift', status: false },
  { id: 1, title: 'Ten (10) Hour Shift', status: false },
  { id: 2, title: 'Twelve (12) Hour Shift', status: false },
  { id: 4, title: 'Monday through Friday', status: false },
  { id: 11, title: 'Monday through Thursday', status: false },
  { id: 3, title: 'Weekends', status: false },
  { id: 9, title: 'Day Shift', status: false },
  { id: 12, title: 'Mornings', status: false },
  { id: 13, title: 'Afternoons', status: false },
  { id: 14, title: 'Evenings', status: false },
  { id: 7, title: 'Night Shift', status: false },
  { id: 5, title: 'On Call', status: false },
  { id: 6, title: 'Holidays', status: false },
  { id: 8, title: 'Overtime', status: false },
  { id: 10, title: 'Other', status: false, other: true },
]

export const JOB_BONUS = [
  { id: 0, title: 'Signing Bonus', status: false },
  { id: 1, title: 'Commission Pay', status: false },
  { id: 2, title: 'Bonus Pay', status: false },
  { id: 3, title: 'Tips', status: false },
  { id: 4, title: 'Other', status: false, other: true },
]

export const CREATE_JOB_TYPE = {
  NONE: 0,
  SCRATCH: 1,
  TEMPLATE: 2
}

export const SCRATCH_JOB_TYPE = {
  NONE: 0,
  PRIVATE: 1,
  PUBLIC: 2
}

export const STEP_CREATE_JOB = {
  STEP_0: 0,
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3
}

export const ASSESSMENTS_CUSTOM_CONFIG = {
  TimeLimit: 360, //6 HOURS
  MaxNbrAnswer: 5,
  MaxNbrQuestion: 20,
  MsgLimitQuestion: 'The maximum number of questions that can be added to one assessment is 20.',
  LabelOrderAnswer: ['A.', 'B.', 'C.', 'D.', 'E.']
}

export const SEARCH_JOB_TYPE = {
  Bookmark: "bookmark",
  Recommended: "recommend",
  Expired: "expired",
  Hot: "hot",
  Applied: "applied",
  Draft: "draft",
  Default: "default",
  UnPaid: "unpaid",
  Closed: "closed",
  Inactive: "inactive",
  Setting: "setting",
  Active: "active",
  All: "all"
};

export const JOB_TYPE = [
  { value: 'Featured', id: 'featured' },
  { value: 'Urgent', id: 'urgent' },
  { value: 'Public', id: 'public' },
  { value: 'Private', id: 'private' }
];

export const CLOSE_MODAL_TYPE = {
  ICON: 0,
  BUTTON_CLOSE: 1
}

export const EMPLOYMENT_TYPE = [
  { id: 0, title: 'Full-time' },
  { id: 1, title: 'Part-time' },
  { id: 2, title: 'Contract' },
  { id: 3, title: 'Temporary' },
  { id: 4, title: 'Internship' }
];

export const PROPOSED_CONPENSATION = [
  { id: 0, title: 'Exact Rate' },
  { id: 1, title: 'Range' }
];

export const APPLICANT_PRIVATE_TYPE = {
  APPLICANT: 1,
  MESSAGE: 2,
  CONVERSATION: 3
}

export const EMPLOYMENT_TYPE_STR = {
  0: "Full-Time",
  1: "Part-Time",
  2: "Contract",
  3: "Temporary",
  4: "Internship"
}

export const JOB_TRAVEL_STR = {
  0: "On-site",
  1: "Remote",
  2: "Hybrid On-site/Remote"
}

export const REASON_REPORT_JOB = [
  {
    id: 0,
    title: 'It is offensive or discriminatory',
    isCheckbox: false
  },
  {
    id: 1,
    title: 'It seems like a fake job and/or a scam.',
    isCheckbox: false
  },
  {
    id: 2,
    title: 'It is inaccurate and/or misleading.',
    isCheckbox: false
  },
  {
    id: 3,
    title: 'It is an advertisement.',
    isCheckbox: false
  },
  {
    id: 4,
    title: 'Other',
    isCheckbox: false
  },
]

export const TAB_DASHBOARD_JOBSEEKER = {
  search: '',
  save: 'bookmark',
  applied: 'applied'
}

export const OTHER_OPTION = {
  SCHEDULE: 10
}

export const WITHIN_MILES = [
  { id: 10, value: 'within 10 miles' },
  { id: 25, value: 'within 25 miles' },
  { id: 50, value: 'within 50 miles' },
  { id: 100, value: 'within 100 miles' },
  { id: 250, value: 'within 250 miles' },
  { id: -1, value: 'Any Distance' },
]

export const DEFAULT_WITHIN = { id: 25, value: 'within 25 miles' };
export const ANY_DISTANCE_WITHIN = -1;

export const JOB_TRAVEL = [
  { id: 0, value: 'On-site' },
  { id: 1, value: 'Remote' },
  { id: 2, value: 'Hybrid' }
]

export const JOB_PERCENT_TRAVEL_TYPE = [
  { id: 0, value: '0-25%', min: 0, max: 25 },
  { id: 1, value: '26-50%', min: 26, max: 50 },
  { id: 2, value: '51-75%', min: 51, max: 75 },
  { id: 3, value: '75-100%', min: 75, max: 100 }
]

export const SIZE_IMAGE_JOBSEEKER = {
  width: 150,
  height: 150,
}

export const SIZE_IMAGE_EMPLOYER = {
  width: 350,
  height: 150,
}

export const SIZE_IMAGE_COMPANY = {
  width: 350,
  height: 200,
}

export const SIZE_ZOOM_IMAGE_JOBSEEKER = {
  width: 400,
  height: 400,
}

export const SIZE_ZOOM_IMAGE_EMPLOYER = {
  width: 800,
  height: 400,
}

export const SIZE_ZOOM_IMAGE_COMPANY_LOGO = {
  width: 700,
  height: 400,
}

export const EXPIRATION_DATE = [
  { key: 1, value: 'Within 24 hours' },
  { key: 3, value: 'Within 72 hours' },
  { key: 7, value: 'Within 7 days' },
  { key: 30, value: 'Within 30 days' },
  { key: 45, value: 'Within 45 days' }
]

export const TYPE_SEARCH_ADVANCE_JOBSEEKER = {
  CATEGORY: 0,
  ASKINGCOMPENSATION: 1,
  EMPLOYMENT_TYPE: 2,
  COMPANY: 3,
  WITHIN: 4,
  WORKPLACE: 5,
  PERCENT_TRAVEL: 6,
  INDUSTRY: 7,
  EXPIRATION_DATE: 8,
  CITY: 9
}

export const SORT_JOB_JOBSEEKER = [
  { id: 7, name: 'Expires Soonest' },
  { id: 8, name: 'Recently Posted' },
]
export const CHAT_GROUP_STATUS = {
  All: 0,
  Active: 1,
  Archived: 2
};

export const NOTIFICATION_STATUS = {
  ALL: -1,
  UN_READ: 0,
  READ: 1
};

export const SORT_EMPLOYER_FOLLOW = [
  { id: 0, name: 'Latest follow' },
  { id: 1, name: 'Earliest follow' },
  { id: 2, name: 'Employer name (A-Z)' },
  { id: 3, name: 'Employer name (Z-A)' }
]

export const SEARCH_JOBSEEKER_TYPE = [
  { id: '', value: 'default' },
  { id: 'bookmark', value: 'bookmark' },
  { id: 'applied', value: 'applied' }
]

export const LIST_TAB = [
  {
    id: '',
    name: 'Search Jobs'
  },
  {
    id: 'bookmark',
    name: 'Saved Jobs'
  },
  {
    id: 'applied',
    name: 'Applied Jobs'
  }
]

export const FOLLOW_TAB = { id: 'follow' };

export const ACTION_FOLLOW = {
  follow: 'follow',
  unfollow: 'unfollow'
}

export const CEO_TAG_REGISTER_CONFIG = {
  TITLE: 'Search Jobs and Apply on MeasuredSkills',
  IMAGE: '',
  DESCRIPTION: `MeasuredSkills is an online job board that matches highly qualified jobseekers to employers based on demonstrable skills instead of resumes.`
}

export const TAG_EMAIL_CREDITS = `Getting hired shouldn't be about putting the right keywords on a resume. Now it doesn't have to be. Make your next career move on MeauredSkills.com. Stand out from the competition and show employers you have the right skills for their job.\n`
export const TAG_EMAIL_CREDITS_SUBJECT = `I would like to invite you to find your next job on MeasuredSkills.com`

export const DEVICE_SERVICE = {
  MOBILE: 1,
  DESKTOP: 2
}

export const SEARCH_REMOTE = 'remote'

export const WIDTH_MOBILE = 576;

export const SHOW_ITEM_ASSESSMENT_HOME_PAGE = {
  MOBILE: 1,
  DESKTOP: 3
}

export const MAX_EMPLOYER_UNFOLLOW_WARNING_TEXT = 4;

export const NUMBER_FEATURE_JOB_HOMEPAGE = 6;

export const SHOW_AVATAR_JOBSEEKER = {
  ENABLE: 1,
  DISABLE: 0
}

export const TAB_JOBSEEKER_INFO = {
  MY_INFO: 'my-info',
  CANDIDATE_PROFILE: 'candidate-profile',
  DEMOGRAPHIC_SURVEY: 'pf-demographic-survey',
  SHARE_USER_HISTORY: 'share-user-history',
}
export const TAB_CANDIDATE = {
  ALL: 'all',
  SHORT_LISTED: 'ShortListed'
}

export const JOB_APPLICANT_TYPE = {
  Applicant: 0,
  InvitedCandidate: 1
};

export const USER_RESPONSIVENESS_THRESHOLD = {
  Employer: 10,
  Jobseeker: 3,
};

export const CUSTOM_DIMS_ANALYTICS = {
  Job: {
    IsPromoted: 'MS_is_promoted',
    TestCategory: 'MS_test_category',
    JobCategory: 'MS_job_category',
    EmployerWithResponsiveness: 'MS_is_responsiveness',
  }

};
export const EVENT_NAME_ANALYTICS = {
  ViewJob: 'MS_View_Job_Event',
  ClickBtn: "MS_Click_Btn_Event",
  SendFirstMessage: 'MS_Send_First_Message_Event',
  JobDuration: 'MS_Job_Duration_Event',
  JobDetail: 'MS_Job_Detail_Event',
  TestAddJob: 'MS_Test_Add_Job_Event',
  TestTake: 'MS_Test_Take_Event',
  JobseekerContactWeighting: 'MS_Jobseeker_Contact_Weighting_Event',
  DirectMessage: 'MS_Direct_Message_Event', // log test
  ResponsivenessScore: 'MS_Responsiveness_Score_Event',
  TestReTake: 'MS_Test_Retake_Event',
  ClickApply: 'MS_Click_Apply_Event',
  JSSearchJob: 'MS_JS_Search_Job_Event',
  EmployerFindCandidateSkill: 'MS_Employer_FindCandidate_Skill_Event',
  EmployerFindCandidateLocation: 'MS_Employer_FindCandidate_Location_Event',
  JobseekerSubcribeEmail: 'MS_Jobseeker_Subcribe_Email_Event',
  ReferralSuccess: 'MS_Referral_Success_Event',
};
export const EVENT_CATEGORY_ANALYTICS = {
  ViewJob: 'MS_View_Job_Category',
  SendFirstMessage: 'MS_Send_First_Message_Category',
  ClickBtnInLanding: 'MS_Click_In_Landing_Category',
  ClickBtnInEmployerLanding: "MS_Click_Btn_In_Employer_Landing_Category",
  ClickBtnInJobseekerLanding: "MS_Click_Btn_In_Jobseeker_Landing_Category",
  JobDuration: 'MS_Job_Duration_Category',
  TrackTestPopularity: 'MS_Track_Test_Popularity_Category',
  JobseekerContactWeighting: 'MS_Jobseeker_Contact_Weighting_Category',
  DirectMessage: 'MS_Direct_Message_Category',
  ResponsivenessScore: 'MS_Responsiveness_Score_Category',
  TestReTake: 'MS_Test_Retake_Category',
  ClickApply: 'MS_Click_Apply_Category',
  SearchJob: 'MS_Search_Job_Category',
  FindCandidate: 'MS_Find_Candidate_Category',
  JobDetail: 'MS_Job_Detail_Category',
  JobseekerSubcribeEmail: 'MS_Jobseeker_Subcribe_Email_Category',
  ReferralSuccess: 'MS_Referral_Success_Category',
};

export const TOTAL_TASKTEST_CUSTOM_ASSESSMENT = {
  DO_FIRST_TIME: 1,
  DO_SECOND_TIME: 2,
  DO_THIRD_TIME: 3
}

export const ONLY_VIEW_ASSESSMENT = {
  ONLY: 1,
  ALL: 0
}

export const NUMBER_OF_DAY_TO_RETRY_CUSTOM_ASSESSMMENT = 30;
export const TRACKING_RECRUITMENT_TYPE = [
  {
    id: 0,
    name: 'Unique Views'
  },
  {
    id: 1,
    name: 'Invitation'
  },
  {
    id: 2,
    name: 'Applications'
  },
  {
    id: 3,
    name: 'Applicants Messaged'
  },
  {
    id: 4,
    name: 'Applicants who Replied'
  },
  {
    id: 5,
    name: 'Offers'
  },
  {
    id: 6,
    name: 'Hires'
  },
  {
    id: 7,
    name: 'Employer Views'
  }
]
export const FILE_PREVIEW_TYPE = {
  mp3: 0,
  mp4: 1,
  otherVideo: 2,
  zip: 3,
  office: 4,
  other: 5
}

export const ADD_TIME_EXPIRED_JOB = {
  JOB_DETAILS: 5 * 60 * 60 * 1000,
  JOB_DASHBOARD: 5 * 60 * 1000,
}
export const USER_RESPONSIVE = {
  JOBSEEKER: 3,
  EMPLOYER: 10
}


export const USER_STATUS = {
  draft: 0,
  active: 1,
  deactive: 2
};

export const CONTENT_SAYING = [
  'After posting our opening on MeasuredSkills, we received applications from jobseekers who were qualified for exactly what we needed. We were able to message them directly  and hire the right person.',
  'After months of searching for a job, MeasuredSkills helped me find the perfect job. The skills assessments showed employers that I was qualified for their positions.',
  'I was tired of spending hours on job boards only to get rejected after submitting my resume. MeasuredSkills simplified my job search and helped me show employers I’m more than a resume.',
  'On paper, I don’t always look like the perfect job candidate. MeasuredSkills let me show off my skills and land me my dream job.',
  'As a hiring manager, I get so tired of sifting through hundreds of resumes. It was so refreshing to find and hire quality applicants through MeasuredSkills.'
]

export const CONTENT_SAYING_JOBSEEKER = [
  { name: 'Sam W.', content: 'After months of searching for a job, MeasuredSkills helped me find the perfect job. The skills assessments showed employers that I was qualified for their positions.', position: '' },
  { name: 'Sarah P.', content: 'I was tired of spending hours on job boards only to get rejected after submitting my resume. MeasuredSkills simplified my job search and helped me show employers I’m more than a resume.', position: '' },
  { name: 'Rick N.', content: 'On paper, I don’t always look like the perfect job candidate. MeasuredSkills let me show off my skills and land me my dream job.', position: '' },
]

export const CONTENT_SAYING_EMPLOYER = [
  { name: 'Laura M.', content: 'After posting our opening on MeasuredSkills, we received applications from jobseekers who were qualified for exactly what we needed. We were able to message them directly  and hire the right person.', position: 'Senior Technical Recruiter' },
  { name: 'Matthew T.', content: 'As a hiring manager, I get so tired of sifting through hundreds of resumes. It was so refreshing to find and hire quality applicants through MeasuredSkills.', position: 'General Manager' },
]

export const NOTIFICATION_TYPE = {
  PasswordChange: 0,
  AccountActiveInvite: 1,
  JobseekerIsInvited: 2,
  NewPostsJobseekers: 3,
  ReminderCompleteApplication: 4,
  ReminderSavedJobExpire: 5,
  ReferralCredit: 6
}

export const COUPON_EXPIRED_TYPE = {
  Limit: 0,
  Unlimit: 1
};

export const COUPON_DISCOUNT_FOR = {
  RETAKE: 0,
  JOB_POSTING: 1,
  DIRECT_MESSAGE: 2
};

export const COUPON_DISCOUNT_TYPE = {
  Percentage: 0,
  FixedDollar: 1
};

export const NBR_USER_LIMIT = {
  Limit: 1,
  Unlimit: 0
}

export const MIN_VALUE_PRICE = 1.39;


export const TAB_EMPLOYER_BILLINGS = {
  INFO_CARD: 1,
  BILLINGS: 2
}
export const JOB_SALARY_TYPE = {
  PerWeek: 2,
  PerMonth: 1,
  PerYear: 0,
  PerDay: 3,
  PerHour: 4
}
export const TEST_ASSESSMENT_IMOCHA = {
  NBR_FREE: 0,
  NBR_AVAIL: 1,
  NBR_UNAVAIL: 2
}

export const CUSTOM_ASSESSMENT_INTRUCTION_TEXT = {
  TEXT: `
  <div class="text-left">
    <h5 class="text-center mb-3"><b>Instructions</b></h5>
    <p class="intruction-assessment intruction-header"><span>General Instructions</span></p>
    <p class="intruction-assessment"><span>1.</span> <span>Make your best attempt to answer all questions in the allotted time (if there is a time limit). If the assessment is timed, the time limit applies to the entire assessment.</span></p>
    <p class="intruction-assessment"><span>2.</span> <span>You may answer questions in any order and return to answer skipped questions if there is time remaining.</span></p>
    <p class="intruction-assessment"><span>3.</span> <span>Your responses will automatically be submitted once the time has expired. If the assessment has no time limit, you must click Submit at the end of the assessment.</span></p>
    <p class="intruction-assessment"><span>4.</span> <span>Do not refresh your browser during the assessment. If you do or if you lose your internet connection before you click submit your answers will not be saved and you will have to restart the assessment.</span></p>
    <p class="intruction-assessment"><span>5.</span> <span>Refrain from consulting outside materials unless you have been given explicit permission by the employer to do so.</span></p>
  </div>
`}

export const CONFIRM_ASSESSMENT_TEST_NBR_UNAVAIL = `
<div class="confirm-assessment-test-nbr-unavail">
  <p class="intruction-apply-job">You are out of remaining free attempts for this assessment. Retaking this assessment will require one (1) retake credit. </p>
  <p class="intruction-apply-job">You can earn free retake credits by referring a friend or you can continue immediately and purchase a retake credit?</p>
  <p class="intruction-apply-job center-apply-job-modal">Do you want to continue?</p>
</div>
`;


export const REASON_UNSUBSCRIBE_EMAIL = {
  DONT_RECIVE: 1,
  NEVER_SIGNING: 2,
  RECIVE_MANY_EMAIL: 3,
  OTHER: 4,
}

export const DESCRIPTION_VIDEO = {
  JOBSEEKER: `It’s hard to show just how awesome you are on a resume. Getting hired shouldn't be about putting the right keywords on a resume. Now it doesn't have to be. That’s where MeasuredSkills comes in.`,
  EMPLOYER: `MeasuredSkills bridges the gap between skills and employment. Our job board platform empowers employers to hire candidates based on skills.`
}

export const KEY_VIDEO_LANDINGPAGE = {
  EMPLOYER: 'hPzZqFdFweI',
  JOBSEEKER: 'NdsQJwu6m9g'
}

export const REDIRECT_URL = {
  JOBSEEKER: ['/jobseeker', '/job-seeker', '/jobseekers', '/job-seekers'],
  EMPLOYER: ['/employer', '/employers']
}

export const LIST_QUESTION_SURVEY = {
  Race: {
    title: 'Race',
    description: 'To what race do you identify?',
    answers: [
      { id: 1, title: 'American Indian or Native Alaskan', isSelected: false },
      { id: 2, title: 'Asian', isSelected: false },
      { id: 3, title: 'Black or African American', isSelected: false },
      { id: 4, title: 'Native Hawaiian or Other Pacific Islander', isSelected: false },
      { id: 5, title: 'White', isSelected: false },
      { id: 6, title: 'Multiracial', isSelected: false },
      { id: 7, title: 'Other', isSelected: false },
      { id: 8, title: 'Prefer not to Answer', isSelected: false },
    ]
  },
  FormalEducation: {
    title: 'Formal Education',
    description: 'What is the highest level of formal education that you have completed?',
    answers: [
      { id: 1, title: 'Less than high school diploma', isSelected: false },
      { id: 2, title: 'High school diploma, GED, or equivalent', isSelected: false },
      { id: 3, title: 'Currently in trade, technical school, community college, or junior college', isSelected: false },
      { id: 4, title: 'Associate’s (2-year) degree (ex: A.A., A.S., A.A.S.)', isSelected: false },
      { id: 5, title: 'Currently in 4-year college or university ', isSelected: false },
      { id: 6, title: 'Bachelor’s (4-year) degree  (ex: A.B., B.A., B.S., B.E.)', isSelected: false },
      { id: 7, title: 'Currently in graduate or professional school', isSelected: false },
      { id: 8, title: 'Master’s degree (ex:, M.Sc., M.B.A., M.S., Sc. M., S.M)', isSelected: false },
      { id: 9, title: 'Professional degree (ex: J.D., M.D., Ed. D.) ', isSelected: false },
      { id: 10, title: 'Doctorate (ex: Ph. D., Sc. D.)', isSelected: false },
    ]
  },
  Ethnicity: {
    title: 'Ethnicity',
    description: 'Do you identify as Hispanic or Latino?',
    answers: [
      { id: 1, title: 'Yes', isSelected: false },
      { id: 2, title: 'No', isSelected: false },
      { id: 3, title: 'Prefer not to Answer', isSelected: false }
    ]
  },
  VeteranStatus: {
    title: 'Veteran Status',
    description: 'Are you a veteran of the United States Armed Forces?',
    answers: [
      { id: 1, title: 'Yes', isSelected: false },
      { id: 2, title: 'No', isSelected: false },
      { id: 3, title: 'Prefer not to Answer', isSelected: false }
    ]
  },
  SpecialVeteranStatus: {
    title: 'Special Veteran Status',
    description: 'If you answered yes to the previous question, please indicate if you fall under any of these categories. Please select all that apply.',
    answers: [
      { id: 1, title: 'Veteran of the Vietnam-Era'},
      { id: 2, title: 'Disabled Veteran'},
      { id: 3, title: 'Special Disabled Veteran'},
      { id: 4, title: 'Other Protected Veteran'},
      { id: 5, title: 'Prefer not to Answer'}
    ]
  },
  DisabilityStatus: {
    title: 'Disability Status',
    description: 'Do you have a handicap or disability as defined by the Americans with Disabilities Act (ADA)?',
    answers: [
      { id: 1, title: 'Yes', isSelected: false },
      { id: 2, title: 'No', isSelected: false },
      { id: 3, title: 'Prefer not to Answer', isSelected: false }
    ]
  }
}

export const PAYMENT_DRAFT_PRIVATE_JOB = 'payment';

export const USER_STORY_ROUTER = {
  POST_JOB: 1,
  FIND_CANDIDATE: 2,
  PREVIEW_ASESSMENT: 3,
  SAVELOCAL_LINK_PREVIEW: 'preview_assessment_link'
}