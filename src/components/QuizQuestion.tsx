import React from "react";
import { QuizQuestion as QuizQuestionType, QuestionType } from "../types";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerChange,
}) => {
  const handleAnswerSelect = (answer: string) => {
    onAnswerChange(question.id, answer);
  };

  return (
    <div className="quiz-question">
      <div className="question-header">
        <h3>{question.question}</h3>
        <div className="question-meta">
          <span className={`difficulty ${question.difficulty}`}>
            {question.difficulty}
          </span>
          <span className="category">{question.category}</span>
        </div>
      </div>

      <div className="question-options">
        {question.options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type={
                question.type === QuestionType.MULTIPLE_CHOICE
                  ? "radio"
                  : "radio"
              }
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => handleAnswerSelect(option)}
              className="option-input"
            />
            <span className="option-text">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
