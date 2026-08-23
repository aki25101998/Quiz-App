import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_DATA } from '../data/quizData';
import { useQuiz } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import { useProfiles } from '../hooks/useProfiles';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProfileSelectModal } from '../components/quiz/ProfileSelectModal';
import { supabase } from '../lib/supabase';
import { attachAssessment } from '../services/profileVersionService';
import { createProfile } from '../services/profileService';
import { CORE_QUIZ_IDS } from '../types/constants';
import { Check, ChevronDown } from 'lucide-react';
export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZ_DATA[id || ''];
  const { user } = useAuth();
  const { profiles } = useProfiles(user?.id);

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Không tìm thấy bài test.</div>;
  }

  const { 
    currentIndex, 
    answers, 
    progress, 
    handleAnswer, 
    nextQuestion,
    isLastQuestion,
    setAnswers,
    setCurrentIndex
  } = useQuiz(quiz.questions.length);

  const [hasStarted, setHasStarted] = useState(!quiz.introContent);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, string> | null>(null);
  const [profileActionLoading, setProfileActionLoading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showSkipMenu, setShowSkipMenu] = useState(false);
  const currentQuestion = quiz.questions[currentIndex];

  const isCoreQuiz = (CORE_QUIZ_IDS as readonly string[]).includes(id || '');

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
        setAnswers(finalAnswers);
        setIsReviewing(true);
        setIsTransitioning(false);
      }
    }, 400);
  };

  // Skip (Dev)
  const handleSkip = (mode: number | 'random') => {
    const mockAnswers: Record<string, string> = {};
    quiz.questions.forEach((q) => {
      if (mode === 'random') {
        mockAnswers[q.id] = q.options[Math.floor(Math.random() * q.options.length)].value;
      } else {
        mockAnswers[q.id] = q.options[mode] ? q.options[mode].value : q.options[q.options.length - 1].value;
      }
    });
    setAnswers(mockAnswers);
    setIsReviewing(true);
    setShowSkipMenu(false);
    setCurrentIndex(quiz.questions.length - 1);
  };

  const handleFinalSubmit = () => {
    if (isCoreQuiz && user) {
      setCompletedAnswers(answers);
      setShowProfileModal(true);
    } else {
      navigate(`/checkout/${id}`, { state: { answers, quiz_id: id } });
    }
  };

  // Save quiz result to database (as assessment attempt)
  const saveAttempt = async (answersToSave: Record<string, string>): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase.from('quiz_results').insert({
      user_id: user.id,
      quiz_id: id,
      answers: answersToSave,
      is_paid: false, // assessment attempts are free; payment is per-profile
    }).select('id').single();

    if (error) {
      console.error('Failed to save attempt:', error);
      return null;
    }
    return data?.id || null;
  };

  // Handle profile selection from modal
  const handleSelectProfile = async (profileId: string) => {
    if (!completedAnswers || !user) return;
    setProfileActionLoading(true);

    try {
      const attemptId = await saveAttempt(completedAnswers);
      if (!attemptId) throw new Error('Failed to save attempt');

      await attachAssessment(profileId, id || '', attemptId);
      setShowProfileModal(false);
      navigate(`/profiles/${profileId}`);
    } catch (err) {
      console.error('Failed to attach assessment:', err);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setProfileActionLoading(false);
    }
  };

  // Handle create new profile + attach
  const handleCreateProfile = async (name: string) => {
    if (!completedAnswers || !user) return;
    setProfileActionLoading(true);

    try {
      const attemptId = await saveAttempt(completedAnswers);
      if (!attemptId) throw new Error('Failed to save attempt');

      const profile = await createProfile(user.id, name);
      await attachAssessment(profile.id, id || '', attemptId);
      setShowProfileModal(false);
      navigate(`/profiles/${profile.id}`);
    } catch (err) {
      console.error('Failed to create profile:', err);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setProfileActionLoading(false);
    }
  };

  // Handle save to history only
  const handleSaveHistoryOnly = async () => {
    if (!completedAnswers) return;
    setProfileActionLoading(true);

    try {
      await saveAttempt(completedAnswers);
      setShowProfileModal(false);
      // Navigate to legacy checkout for per-quiz result view
      navigate(`/checkout/${id}`, { state: { answers: completedAnswers, quiz_id: id } });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setProfileActionLoading(false);
    }
  };

  if (!hasStarted && quiz.introContent) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 tracking-tight">
              {quiz.introContent.title}
            </h1>
            
            <div className="space-y-4 mb-8">
              {quiz.introContent.body.map((paragraph, idx) => (
                <p key={idx} className="text-slate-600 text-lg leading-relaxed flex items-start gap-3">
                  <span className="text-teal-500 mt-1">✦</span>
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>

            <div className="bg-orange-50/80 border border-orange-200/60 p-6 rounded-2xl mb-10 shadow-sm">
              <p className="text-orange-800 font-medium leading-relaxed">
                {quiz.introContent.upsellText}
              </p>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-colors shadow-lg shadow-slate-900/20"
              >
                Bắt đầu làm bài <span className="ml-2">→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-20 px-4">
        <div className="mb-8 text-center pt-8">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Xem lại câu trả lời</h2>
          <p className="text-slate-500 text-lg">Bạn có thể điều chỉnh nhanh các lựa chọn trước khi nộp bài.</p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => (
            <div key={q.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                    {qIndex + 1}
                  </div>
                  <p className="text-lg font-medium text-slate-800 flex-1 pt-1">{q.text}</p>
                </div>
                
                {quiz.originalType === 'likert' ? (
                  <div className="w-full max-w-2xl mx-auto pl-12">
                    <div className="flex justify-between items-center px-2 mb-4">
                      <span className="text-[10px] md:text-xs font-bold text-rose-500 uppercase tracking-widest w-1/3 text-left leading-tight">
                        {q.options[0].label.replace(/^[^\wÀ-ỹ]+/, '').trim()}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest w-1/3 text-center leading-tight">
                        {q.options[Math.floor(q.options.length / 2)].label.replace(/^[^\wÀ-ỹ]+/, '').trim()}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-teal-500 uppercase tracking-widest w-1/3 text-right leading-tight">
                        {q.options[q.options.length - 1].label.replace(/^[^\wÀ-ỹ]+/, '').trim()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center relative">
                      <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2 rounded-full hidden sm:block"></div>
                      {q.options.map((opt, oIndex) => {
                        const isSelected = answers[q.id] === opt.value;
                        const colors = [
                          'bg-rose-100 border-rose-400 text-rose-500',
                          'bg-orange-100 border-orange-400 text-orange-500',
                          'bg-slate-100 border-slate-400 text-slate-600',
                          'bg-lime-100 border-lime-400 text-lime-500',
                          'bg-teal-100 border-teal-400 text-teal-500'
                        ];
                        const defaultColors = [
                          'bg-white border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-transparent',
                          'bg-white border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-transparent',
                          'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-transparent',
                          'bg-white border-lime-200 hover:border-lime-400 hover:bg-lime-50 text-transparent',
                          'bg-white border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-transparent'
                        ];
                        const colorClass = isSelected ? colors[oIndex] : defaultColors[oIndex];
                        
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleAnswer(q.id, opt.value)}
                            title={opt.label}
                            className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-[3px] transition-all flex items-center justify-center shadow-sm ${colorClass}`}
                          >
                            {isSelected && <Check className="w-5 h-5 md:w-7 md:h-7" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pl-12">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${answers[q.id] === opt.value ? 'border-teal-500 bg-teal-50 font-medium text-teal-900 shadow-[0_4px_12px_rgb(20,184,166,0.15)]' : 'border-slate-200 hover:border-teal-200 bg-white text-slate-600 hover:text-slate-900'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center sticky bottom-6 z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalSubmit}
            className="px-10 py-4 bg-slate-800 text-white font-bold text-lg rounded-full shadow-lg shadow-slate-900/20 hover:bg-slate-900 transition-colors flex items-center gap-2"
          >
            Hoàn thành <Check className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Select Modal */}
        <ProfileSelectModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profiles={profiles}
          quizTitle={quiz.title}
          onSelectProfile={handleSelectProfile}
          onCreateProfile={handleCreateProfile}
          onSaveHistoryOnly={handleSaveHistoryOnly}
          loading={profileActionLoading}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between relative z-50">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{quiz.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{quiz.description}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSkipMenu(!showSkipMenu)}
              className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium opacity-70 hover:opacity-100"
            >
              Skip (Dev) <ChevronDown className="w-3 h-3" />
            </button>
            {showSkipMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 overflow-hidden">
                {quiz.questions[0]?.options.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSkip(idx)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    Full {String.fromCharCode(65 + idx)}
                  </button>
                ))}
                <button
                  onClick={() => handleSkip('random')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-t border-slate-100 mt-1 pt-3"
                >
                  Random
                </button>
              </div>
            )}
          </div>
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
                    const sizeClass = 'w-14 h-14 md:w-20 md:h-20 text-2xl md:text-4xl';
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
                          transition={{ type: "spring", stiffness: 1000, damping: 15 }}
                          onClick={() => onSelectOption(option.value)}
                          className={`rounded-full border-[3px] bg-white transition-colors shadow-sm flex items-center justify-center ${sizeClass} ${colors[idx]}`}
                          title={option.label}
                        >
                          <span className="group-hover:scale-125 transition-transform duration-75">
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

      {/* Profile Select Modal — shown after completing a core quiz */}
      <ProfileSelectModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profiles={profiles}
        quizTitle={quiz.title}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onSaveHistoryOnly={handleSaveHistoryOnly}
        loading={profileActionLoading}
      />
    </div>
  );
}

