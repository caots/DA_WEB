export class Company {
  companyID: number;
  companyName: string;
  companyLogo?: string;
  minSize: number;
  maxSize: number;
  description?: string;
}

export interface companySearch {
  companyID: number;
  companyName: string;
  companProfilePicture: string;
}