import axios from "axios";
import { Quiz, QuizResult } from "./types.ts";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const quizApi = {
  // Get all quizzes
  getAllQuizzes: async (): Promise<Quiz[]> => {
    const { data } = await apiClient.get("/quizzes");
    return data;
  },

  // Get specific quiz
  getQuizById: async (id: string): Promise<Quiz> => {
    const { data } = await apiClient.get(`/quizzes/${id}`);
    return data;
  },

  // Submit quiz answers
  submitQuiz: async (
    quizId: string,
    answers: Record<string, string>
  ): Promise<QuizResult> => {
    const { data } = await apiClient.post(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return data;
  },
};
