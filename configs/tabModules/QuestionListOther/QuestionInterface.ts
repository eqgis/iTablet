

export interface SurveyItemData {
  id: number,
  surveyname: string,
  remark: string,
  createdepart: string,
  surveystate: number,
  creator: string,
  createdate: string,
  }

export interface SurveyListData {
  records: Array<SurveyItemData>,
  total: number,
  size: number,
  current: number,
  orders: Array<any>,
  optimizeCountSql: boolean,
  hitCount: boolean,
  countId: any,
  maxLimit: any,
  searchCount: boolean,
  pages: number,
}

export interface QuestionData {
  id: number,
  quesname: string,
  quesremark: string
  questype: number,
  ordernum: number,
  creator: string
  createtime: any,
  isrequired: number,
  surveyid: number,
}

export interface OptionData {
  id: number,
  surveyid: number,
  questionid: number,
  opt: string,
  ordernum: number,
  questype: number,
}

export interface QuestionAndOptData {
  tbQuestion: QuestionData,
  tbQuestionOpts: Array<OptionData>,
}

export interface SurveyQuestionData {
  tbSurvey: SurveyItemData,
  quesAndOpts: Array<QuestionAndOptData>,
}

export interface AnswerData {
  createtime: string,
  depart: string,
  id: number,
  optid: number,
  questionid: number,
  questype: number,
  surveyid: number,
  voter: string,
}
 