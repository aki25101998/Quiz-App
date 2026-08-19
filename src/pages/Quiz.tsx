import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizzes } from '../data/quizzes';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!quiz || !quiz.questions[currentQuestionIndex]) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex] as any; // Cast to any to handle both types
  const isLikert = quiz.type === 'likert';

  const handleSelectOption = (value: string | number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    const finalAnswers = { ...answers, [currentQuestion.id]: value };
    
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        navigate(`/checkout/${id}`, { state: { answers: finalAnswers } });
      }
    }, 300);
  };

  const handleSkip = () => {
    const mockAnswers: Record<number, string | number> = {};
    if (isLikert) {
      quiz.questions.forEach((q) => {
        mockAnswers[q.id] = Math.floor(Math.random() * 5) - 2;
      });
    } else {
      quiz.questions.forEach((q: any) => {
        mockAnswers[q.id] = q.options[0].value;
      });
    }
    navigate(`/checkout/${id}`, { state: { answers: mockAnswers } });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl relative z-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/" 
              className="inline-block text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
            >
              ← Trang chủ
            </Link>
            <button 
              onClick={handleSkip}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium opacity-70 hover:opacity-100"
            >
              Skip nhanh (Dev)
            </button>
          </div>
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50">
            <div className="flex items-center text-slate-700 font-medium">
              <span className="mr-2 text-xl">{quiz.emoji}</span>
              {quiz.title}
            </div>
            <div className="text-slate-500 text-sm font-medium">
              Câu {currentQuestionIndex + 1}/{quiz.questions.length}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 leading-tight">
                {currentQuestion.text}
              </h2>

              {isLikert ? (
                <div className="flex flex-col items-center mt-12 mb-8">
                  <div className="flex justify-between items-center w-full max-w-lg mb-6">
                    <button onClick={() => handleSelectOption(-2)} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-red-300 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center group" aria-label="Rất không đồng ý">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-200 group-hover:bg-red-300 transition-colors"></div>
                    </button>
                    <button onClick={() => handleSelectOption(-1)} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-center group" aria-label="Không đồng ý">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-200 group-hover:bg-orange-300 transition-colors"></div>
                    </button>
                    <button onClick={() => handleSelectOption(0)} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-300 bg-slate-50 hover:bg-slate-200 transition-colors flex items-center justify-center group" aria-label="Trung lập">
                      <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                    </button>
                    <button onClick={() => handleSelectOption(1)} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-center group" aria-label="Đồng ý">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-200 group-hover:bg-green-300 transition-colors"></div>
                    </button>
                    <button onClick={() => handleSelectOption(2)} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-teal-300 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center justify-center group" aria-label="Rất đồng ý">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-200 group-hover:bg-teal-300 transition-colors"></div>
                    </button>
                  </div>
                  <div className="flex justify-between w-full max-w-lg text-sm md:text-base font-semibold">
                    <span className="text-red-500">Rất không đồng ý</span>
                    <span className="text-teal-600">Rất đồng ý</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentQuestion.options.map((option: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option.value)}
                      className="w-full text-left px-6 py-4 rounded-full border border-[#e6e2d6] bg-[#f8f6f1] hover:bg-[#eefcf2] hover:border-[#86efac] hover:text-[#166534] transition-all font-medium text-slate-700 text-base md:text-lg shadow-sm hover:shadow-md"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
