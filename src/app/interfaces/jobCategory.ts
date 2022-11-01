import { Assesment } from "./assesment";

export interface JobCategory {
  id: number;
  name: string;
  listAssessment?: Assesment[];
  isShowListAssessment?: boolean;
  isSelected?: boolean;
}