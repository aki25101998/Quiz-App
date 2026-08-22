import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_DATA } from '../data/quizData';
import { useQuiz } from '../hooks/useQuiz';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZ_DATA[id || ''];

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Không tìm thấy bài test.</div>;
  }

  const { 
    currentIndex, 
    answers, 
    progress, 
    handleAnswer, 
    nextQuestion,
    isLastQuestion 
  } = useQuiz(quiz.questions.length);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentQuestion = quiz.questions[currentIndex];

  const onSelectOption = (value: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    handleAnswer(currentQuestion.id, value);
    
    setTimeout(() => {
      if (!isLastQuestion) {
        nextQuestion();
        setIsTransitioning(false);
      } else {
        const finalAnswers = { ...answers, [currentQuestion.id]: value };
        navigate(`/checkout/${id}`, { state: { answers: finalAnswers, quiz_id: id } });
      }
    }, 400);
  };

  const handleSkip = () => {
    const mockAnswers: Record<string, string> = {};
    quiz.questions.forEach((q) => {
      mockAnswers[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
    });
    navigate(`/checkout/${id}`, { state: { answers: mockAnswers, quiz_id: id } });
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{quiz.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{quiz.description}</p>
          </div>
          <button 
            onClick={handleSkip}
            className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium opacity-70 hover:opacity-100"
          >
            Skip (Dev)
          </button>
        </div>
        <ProgressBar progress={progress} showLabel />
        <div className="text-slate-500 text-sm font-medium text-right">
          Câu {currentIndex + 1}/{quiz.questions.length}
        </div>
      </div>

      <div className="glass-panel p-8 md:p-12 relative min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 leading-relaxed text-center">
              {currentQuestion.text}
            </h2>

            {quiz.originalType === 'likert' ? (
              <div className="w-full max-w-2xl mx-auto mt-12">
                <div className="flex justify-between items-center px-1 mb-8">
                  <span className="text-sm md:text-base font-extrabold text-rose-500 uppercase tracking-widest text-left w-1/3">
                    {currentQuestion.options[0].label.replace(/^[^\wÀ-ỹ]+/, '').trim()}
                  </span>
                  <span className="text-sm md:text-base font-extrabold text-teal-500 uppercase tracking-widest text-right w-1/3">
                    {currentQuestion.options[currentQuestion.options.length - 1].label.replace(/^[^\wÀ-ỹ]+/, '').trim()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-100 -z-10 transform -translate-y-1/2 rounded-full hidden sm:block"></div>
                  {currentQuestion.options?.map((option: any, idx: number) => {
                    const likertEmojis = ['😖', '☹️', '😐', '🙂', '😍'];
                    const sizes = ['w-14 h-14 md:w-20 md:h-20 text-2xl md:text-4xl', 'w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl', 'w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl', 'w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl', 'w-14 h-14 md:w-20 md:h-20 text-2xl md:text-4xl'];
                    const colors = [
                      'border-rose-400 hover:bg-rose-50 text-rose-500',
                      'border-orange-400 hover:bg-orange-50 text-orange-500',
                      'border-slate-300 hover:bg-slate-50 text-slate-500',
                      'border-lime-400 hover:bg-lime-50 text-lime-500',
                      'border-teal-400 hover:bg-teal-50 text-teal-500'
                    ];

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onSelectOption(option.value)}
                          className={`rounded-full border-[3px] bg-white transition-all shadow-sm flex items-center justify-center ${sizes[idx]} ${colors[idx]}`}
                          title={option.label}
                        >
                          <span className="group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100">
                            {likertEmojis[idx]}
                          </span>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentQuestion.options?.map((option: any, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectOption(option.value)}
                    className="w-full text-left px-6 py-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-400 hover:text-teal-900 transition-all font-medium text-slate-700 text-base md:text-lg shadow-sm"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
