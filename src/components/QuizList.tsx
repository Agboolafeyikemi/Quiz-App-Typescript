import React from "react";
import { Link } from "react-router-dom";
import { useQuizzes } from "../hooks/useQuizzes";
import { DifficultyLevel } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const QuizList: React.FC = () => {
  const { data: quizzes, isLoading, error } = useQuizzes();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return "green";
      case DifficultyLevel.MEDIUM:
        return "orange";
      case DifficultyLevel.HARD:
        return "red";
      default:
        return "gray";
    }
  };
  console.log(quizzes, "quizzes");

  return (
    <div className="quiz-list">
      <h2>Available Quizzes</h2>

      {quizzes && quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <div className="quiz-grid">
          {quizzes?.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>

              <div className="quiz-info">
                <span>Questions: {quiz.questions.length}</span>
                <span>Time: {quiz.timeLimit} minutes</span>
                <span
                  className="difficulty"
                  style={{
                    color: getDifficultyColor(quiz.questions[0]?.difficulty),
                  }}
                >
                  {quiz.questions[0]?.difficulty || "Mixed"}
                </span>
              </div>

              <Link to={`/quiz/${quiz.id}`} className="start-quiz-btn">
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
