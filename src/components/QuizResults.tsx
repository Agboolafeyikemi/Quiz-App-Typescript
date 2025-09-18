import React from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { QuizResult, Quiz } from "../types";
import { useQueryClient } from "@tanstack/react-query";

interface LocationState {
  result: QuizResult;
  quiz: Quiz;
}

const QuizResults: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();
  const { result, quiz } = (location.state as LocationState) || {};

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRetake = () => {
    console.log("🔄 Retaking quiz with ID:", id);
    queryClient.removeQueries({ queryKey: ["quiz", id] });
    queryClient.invalidateQueries({ queryKey: ["quiz", id] }); // 🔥 force refetch

    navigate(`/quiz/${id}`, { replace: true, state: null }); // replace history so no stale state lingers
  };

  if (!result || !quiz) {
    return (
      <div className="quiz-results">
        <h2>Results not found</h2>
        <Link to="/">Back to Quizzes</Link>
      </div>
    );
  }

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return "green";
    if (percentage >= 60) return "orange";
    return "red";
  };

  return (
    <div className="quiz-results">
      <h2>Quiz Results</h2>
      <h3>{quiz.title}</h3>

      <div className="score-summary">
        <div className={`score-circle ${getScoreColor(result.percentage)}`}>
          <span className="percentage">{result.percentage}%</span>
          <span className="score-fraction">
            {result.score}/{result.totalQuestions}
          </span>
        </div>
      </div>

      <div className="results-details">
        <h4>Question Review</h4>
        {result.results.map((questionResult, index) => {
          const question = quiz.questions.find(
            (q) => q.id === questionResult.questionId
          );
          if (!question) return null;

          return (
            <div key={questionResult.questionId} className="question-result">
              <div
                className={`result-status ${
                  questionResult.isCorrect ? "correct" : "incorrect"
                }`}
              >
                <h5>Question {index + 1}</h5>
                <span className="status-icon">
                  {questionResult.isCorrect ? "✅" : "❌"}
                </span>
              </div>

              <p className="question-text">{question.question}</p>

              <div className="answer-comparison">
                <p>
                  <strong>Your Answer:</strong>
                  <span
                    className={
                      questionResult.isCorrect ? "correct" : "incorrect"
                    }
                  >
                    {questionResult.userAnswer || "Not answered"}
                  </span>
                </p>

                {!questionResult.isCorrect && (
                  <p>
                    <strong>Correct Answer:</strong>
                    <span className="correct">
                      {questionResult.correctAnswer}
                    </span>
                  </p>
                )}

                {question.explanation && (
                  <p className="explanation">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="results-actions">
        {/* <Link to={`/quiz/${id}`} state={null} className="retake-btn">
          Retake Quiz
        </Link> */}
        <button onClick={handleRetake} className="retake-btn">
          Retake Quiz
        </button>
        <Link to="/" className="home-btn">
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;
