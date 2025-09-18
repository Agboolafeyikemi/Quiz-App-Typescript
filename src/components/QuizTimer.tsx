import React, { useEffect, useRef } from "react";

interface QuizTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
}

const QuizTimer: React.FC<QuizTimerProps> = ({
  timeRemaining,
  onTimeUp,
  setTimeRemaining,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    // Reset the timeUp flag when timeRemaining changes (new quiz)
    if (timeRemaining > 0) {
      hasCalledTimeUp.current = false;
    }

    // Don't start timer if timeRemaining is 0 or less
    if (timeRemaining <= 0) {
      if (!hasCalledTimeUp.current && timeRemaining !== 0) {
        // Only call onTimeUp if we haven't called it before and timeRemaining isn't the initial 0
        hasCalledTimeUp.current = true;
        onTimeUp();
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start the countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          // Time is up!
          if (!hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            // Use setTimeout to avoid calling onTimeUp during render
            setTimeout(() => onTimeUp(), 0);
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRemaining, onTimeUp, setTimeRemaining]);

  const formatTime = (seconds: number): string => {
    if (seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 60) return "red"; // Last minute
    if (timeRemaining <= 300) return "orange"; // Last 5 minutes
    return "green";
  };

  return (
    <div className={`quiz-timer ${getTimerColor()}`}>
      <span>Time Remaining: </span>
      <span className="timer-display">{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default QuizTimer;
