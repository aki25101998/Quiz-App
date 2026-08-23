import { useState } from 'react';

export function useQuiz(totalQuestions: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (questionId: string, answerValue: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return {
    currentIndex,
    answers,
    isLastQuestion,
    progress,
    handleAnswer,
    nextQuestion,
    prevQuestion,
    setAnswers,
    setCurrentIndex
  };
}
