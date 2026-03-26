export type TestType = {
  id: number;
  code: string | null;
  name: string;
  description: string;
  totalQuestions: number;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type TestTypeVersion = {
  version: number;
  totalQuestions: number;
};

export type TestTypeDetail = {
  id: number;
  code: string;
  name: string;
  description: string;
  totalQuestions: number;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  versions: TestTypeVersion[];
};

export type CreateTestTypeRequest = {
  name: string;
  description: string;
  totalQuestions: number;
};

export type ImportQuestionsResult = {
  totalRows: number;
  insertedQuestions: number;
  errors: string[];
};

export type TestQuestionAnswer = {
  id: number;
  questionId: number;
  orderIndex: number;
  answerContent: string;
  scoreKey: string;
  scoreValue: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type TestQuestion = {
  id: number;
  testTypeId: number;
  orderIndex: number;
  version: number;
  content: string;
  answerType: string;
  dimension: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  answers: TestQuestionAnswer[];
};

export type ActivateVersionResponse = null;