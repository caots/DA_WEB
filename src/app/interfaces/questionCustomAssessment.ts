import { QESTION_CUSTOME_ASSESSMENT } from "../constants/config";

export interface QuestionCustomAssessment {
  id?: number;
  weight?: any;
  question?: string;
  type?: number;
  image?: string;
  answer?: any;
  is_any_correct: boolean;
  listAnswerOptionMultiChioce: any[];
  listAnswerOptionCheckboxes: any[];
  listAnswerAlternative: any[];
  assessment_custom_id?: number;
  action?: string;
  status?: boolean;

}
export class DataUpdate {
  public id: number;
  name: string;
  description: string;
  instruction: string;
  duration: number;
  questions: number;
  questionList: Question[];

  constructor() {
    this.name = '';
    this.description = '';
    this.instruction = '';
    this.duration = 0;
    this.questions = 0;
    this.questionList = new Array<Question>();
  }
}

export class Question {
  type: number;
  title: string;
  weight: number;
  full_answers: any;
  title_image: string;
  is_any_correct: number;
  public answers: any;
  public id: number;
  public assessment_custom_id: number;
  public action: string;

  constructor() {
    this.type = QESTION_CUSTOME_ASSESSMENT.SINGLE_TEXTBOX;
    this.title = '';
    this.title_image = '';
    this.weight = 0;
    this.full_answers = new Array<FullAnswers>();
  }
}

export class FullAnswers {
  id: number;
  answer: string;
  is_true: number

  constructor() {
    this.id = 0;
    this.answer = '';
    this.is_true = 0;
  }
}

export function initData(): QuestionCustomAssessment {
  const dataQuestionTrueFalse = [
    { id: 1, answerName: 'True', status: true },
    { id: 2, answerName: 'False', status: false }
  ]
  const dataQuestionCheckboxs = [
    { answerName: '', status: false },
    { answerName: '', status: false },
    { answerName: '', status: false },
    { answerName: '', status: false }
  ];

  return {
    id: 0,
    weight: '',
    question: '',
    type: QESTION_CUSTOME_ASSESSMENT.CHECKBOXES,
    answer: '',
    image: '',
    is_any_correct: true,
    listAnswerOptionMultiChioce: dataQuestionTrueFalse,
    listAnswerOptionCheckboxes: dataQuestionCheckboxs,
    listAnswerAlternative: [],
    status: true
  }
}
