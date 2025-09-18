import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz, useSubmitQuiz } from "../hooks/useQuizzes";
import QuizQuestion from "./QuizQuestion";
import QuizTimer from "./QuizTimer";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const QuizTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useQuiz(id!);
  const submitQuizMutation = useSubmitQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

//   console.log(quiz, "dede");
  // Initialize timer when quiz loads
  useEffect(() => {
    if (!quiz) return; // wait for fresh quiz before resetting
    console.log("🔍 Resetting quiz state for quiz:", quiz.id);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    setIsQuizStarted(true);
  }, [quiz?.id]); // depend on quiz.id to trigger only on fresh fetch

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!quiz) return <div>Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("🔍 Submitting quiz:", {
      quizId: quiz.id,
      answers,
      answeredCount: Object.keys(answers).length,
    });

    submitQuizMutation.mutate(
      { quizId: quiz.id, answers },
      {
        onSuccess: (result) => {
          // Navigate to results page with the result data\console.log('🔍 Submission successful, navigating to results');
          console.log("🔍 Submission successful, navigating to results");
          navigate(`/results/${quiz.id}`, {
            state: { result, quiz },
          });
        },
        onError: (error) => {
          console.error("🚨 Submission error:", error);
        },
      }
    );
  };

  const handleTimeUp = () => {
    if (!isQuizStarted) {
      console.log("⚠️ Timer fired but quiz not started yet, ignoring...");
      return;
    }

    console.log("⏰ Time is up! Auto-submitting...");
    handleSubmit();
  };

  const getAnsweredCount = (): number => {
    return Object.keys(answers).length;
  };

  // Don't render the quiz content until we have valid quiz data and time is set
  if (!isQuizStarted || timeRemaining === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="quiz-taking">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <QuizTimer
          timeRemaining={timeRemaining}
          onTimeUp={handleTimeUp}
          setTimeRemaining={setTimeRemaining}
        />
      </div>

      <div className="quiz-progress">
        <div className="span">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span>
            Answered: {getAnsweredCount()}/{quiz.questions.length}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id]}
        onAnswerChange={handleAnswerChange}
      />

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-btn prev-btn"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitQuizMutation.isPending}
            className="submit-btn"
          >
            {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button onClick={handleNext} className="nav-btn next-btn">
            Next
          </button>
        )}
      </div>

      {submitQuizMutation.error && (
        <ErrorMessage error={submitQuizMutation.error as Error} />
      )}
    </div>
  );
};

export default QuizTaking;
