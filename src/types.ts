export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
}

export enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  category: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
  }>;
}
