import { useQuery, useMutation } from "@tanstack/react-query";
import { quizApi } from "../api";
import { QuizResult } from "../types";

// Query Keys
export const QUERY_KEYS = {
  QUIZZES: ["quizzes"] as const,
  QUIZ: (id: string) => ["quiz", id] as const,
} as const;

// Get all quizzes
export const useQuizzes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZZES,
    queryFn: quizApi.getAllQuizzes,
  });
};

// Get single quiz
export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZ(id),
    queryFn: () => quizApi.getQuizById(id),
    enabled: !!id, // Only run if id exists
    staleTime: 0, // Data is immediately considered stale
    gcTime: 0, // ⬅️ use gcTime instead of cacheTime in v5
    refetchOnMount: "always",
  });
};

// Submit quiz mutation
export const useSubmitQuiz = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: string;
      answers: Record<string, string>;
    }) => quizApi.submitQuiz(quizId, answers),

    onSuccess: (data: QuizResult) => {
      // Could invalidate queries or update cache here
      console.log("Quiz submitted successfully:", data);
    },

    onError: (error) => {
      console.error("Error submitting quiz:", error);
    },
  });
};
