import { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateMbtiResult } from '../utils/careerMatchingEngine';
import { calculateRiasecScores } from '../utils/scoring/riasecScoring';
import { calculateAbilityScores } from '../utils/scoring/abilityScoring';
import { calculateBigFiveScores } from '../utils/scoring/bigFiveScoring';
import { calculateWorkValueScores } from '../utils/scoring/workValuesScoring';
import { UpsellCard } from '../components/quiz/UpsellCard';
import { QUIZ_DATA } from '../data/quizData';
import { abilityQuestions } from '../data/abilityQuestions';
import { bigFiveQuestions } from '../data/bigFiveQuestions';
import { workValuesQuestions } from '../data/workValuesQuestions';
import { RIASEC_LABELS, BIG_FIVE_LABELS, ABILITY_LABELS, WORK_VALUE_LABELS, ABILITY_LEVEL_LABELS, getScoreLabel } from '../types/constants';
import type { CareerMatchResult, RiasecResult, AbilityResult, BigFiveResult, WorkValueResult } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { SaveToProfileModal } from '../components/quiz/SaveToProfileModal';

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const quiz = QUIZ_DATA[id || ''];
  const answers = location.state?.answers;
  const isPaid = location.state?.paid;

  const [mbtiResult, setMbtiResult] = useState<CareerMatchResult | null>(null);
  const [riasecResult, setRiasecResult] = useState<RiasecResult | null>(null);
  const [abilityResult, setAbilityResult] = useState<AbilityResult | null>(null);
  const [bigFiveResult, setBigFiveResult] = useState<BigFiveResult | null>(null);
  const [workValuesResult, setWorkValuesResult] = useState<WorkValueResult | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasPromptedSave, setHasPromptedSave] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!answers || !isPaid) {
      navigate(`/checkout/${id}`, { state: { answers }, replace: true });
    }
  }, [answers, isPaid, id, navigate]);

  useEffect(() => {
    if (!answers) return;
    
    if (quiz?.type === 'fun') {
      setMbtiResult(calculateMbtiResult(answers));
    } else if (quiz?.type === 'riasec') {
      setRiasecResult(calculateRiasecScores(answers));
    } else if (quiz?.type === 'ability') {
      setAbilityResult(calculateAbilityScores(answers, abilityQuestions));
    } else if (quiz?.type === 'big-five') {
      setBigFiveResult(calculateBigFiveScores(answers, bigFiveQuestions));
    } else if (quiz?.type === 'work-values') {
      setWorkValuesResult(calculateWorkValueScores(answers, workValuesQuestions));
    }
    
    setLoading(false);
  }, [quiz, answers]);

  useEffect(() => {
    if (!loading && quiz?.type !== 'fun' && !hasPromptedSave && user) {
      setShowSaveModal(true);
      setHasPromptedSave(true);
    }
  }, [loading, quiz, hasPromptedSave, user]);

  if (!quiz) return <div className="text-center py-20">Quiz không tồn tại</div>;
  if (!answers || !isPaid) return null; // Wait for redirect
  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl relative z-10">
        {savedProfileId && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 text-xl">✅</span>
              <p className="text-emerald-800 font-medium">Kết quả đã được lưu thành công vào Hồ sơ!</p>
            </div>
            <Link to={`/profiles/${savedProfileId}`} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ml-4">
              Xem Hồ sơ →
            </Link>
          </motion.div>
        )}
        
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-block text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            ← Về trang chủ
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-12 mb-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
              Kết quả <span className="lovable-gradient-text">{quiz.title}</span>
            </h1>
            
            {quiz.type === 'fun' ? (
              <p className="text-slate-500 text-lg">Dựa trên những gì bạn đã trả lời, đây là phân tích dành riêng cho bạn.</p>
            ) : (
              <div>
                <p className="text-slate-700 text-xl font-medium mt-6">Khám phá chi tiết kết quả của bạn</p>
                <p className="text-slate-500 text-md mt-2">Đây là kết quả của bài test đơn lẻ. Hãy lưu vào Hồ sơ Định hướng để nhận báo cáo nghề nghiệp tổng hợp.</p>
              </div>
            )}
            
            {quiz.type !== 'fun' && user && (
              <div className="mt-6">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors shadow-lg"
                >
                  <span className="text-lg">💾</span> Lưu vào Hồ sơ định hướng
                </button>
              </div>
            )}
          </div>

          {/* === SINGLE TEST RESULTS === */}
          <div className="mb-10">
            {/* RIASEC Scores */}
            {riasecResult && quiz.type === 'riasec' && (
              <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 mb-6">
                <h3 className="text-lg font-bold text-teal-900 mb-1 flex items-center gap-2">
                  <span className="text-2xl">🧬</span> Mã Holland: {riasecResult.hollandCode}
                </h3>
                <p className="text-sm text-slate-500 mb-4">Điểm số sở thích nghề nghiệp theo 6 nhóm Holland</p>
                <div className="space-y-3">
                  {riasecResult.ranking.map((dim) => {
                    const score = riasecResult.normalizedScores[dim];
                    const label = RIASEC_LABELS[dim];
                    return (
                      <div key={dim} className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-teal-700 text-sm">{dim}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">{label.name}</span>
                            <span className="text-sm font-bold text-slate-800">{score}</span>
                          </div>
                          <div className="w-full bg-teal-100 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="bg-teal-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ability Scores */}
            {abilityResult && quiz.type === 'ability' && (
              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 mb-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-1 flex items-center gap-2">
                  <span className="text-2xl">🧠</span> Bản đồ Năng lực
                </h3>
                <p className="text-sm text-slate-500 mb-4">Mức độ năng lực tư duy theo từng nhóm</p>
                <div className="space-y-3">
                  {Object.entries(abilityResult.normalizedScores)
                    .filter(([, v]) => v !== undefined)
                    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
                    .map(([dim, score]) => {
                      const key = dim as keyof typeof ABILITY_LABELS;
                      const label = ABILITY_LABELS[key];
                      const level = abilityResult.levels[key];
                      return (
                        <div key={dim} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-700">{label?.name || dim}</span>
                              <div className="flex items-center gap-2">
                                {level && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                    {ABILITY_LEVEL_LABELS[level]}
                                  </span>
                                )}
                                <span className="text-sm font-bold text-slate-800">{score}</span>
                              </div>
                            </div>
                            <div className="w-full bg-indigo-100 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-indigo-500 h-2 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Big Five Scores */}
            {bigFiveResult && quiz.type === 'big-five' && (
              <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 mb-6">
                <h3 className="text-lg font-bold text-rose-900 mb-1 flex items-center gap-2">
                  <span className="text-2xl">🎭</span> Hồ sơ Tính cách
                </h3>
                <p className="text-sm text-slate-500 mb-4">5 chiều tính cách ảnh hưởng đến cách bạn làm việc</p>
                <div className="space-y-4">
                  {(Object.keys(BIG_FIVE_LABELS) as Array<keyof typeof BIG_FIVE_LABELS>).map((dim) => {
                    const score = bigFiveResult.normalizedScores[dim];
                    const label = BIG_FIVE_LABELS[dim];
                    const levelText = getScoreLabel(score);
                    return (
                      <div key={dim}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-700">{label.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">{levelText}</span>
                            <span className="text-sm font-bold text-slate-800">{score}</span>
                          </div>
                        </div>
                        <div className="w-full bg-rose-100 rounded-full h-2 mb-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-rose-500 h-2 rounded-full"
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          {score >= 60 ? label.highDesc : label.lowDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Work Values Scores */}
            {workValuesResult && quiz.type === 'work-values' && (
              <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 mb-6">
                <h3 className="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
                  <span className="text-2xl">💎</span> Giá trị Cốt lõi
                </h3>
                <p className="text-sm text-slate-500 mb-4">Xếp hạng các giá trị bạn coi trọng nhất trong công việc</p>
                <div className="space-y-3">
                  {workValuesResult.ranking.slice(0, 8).map((item, idx) => {
                    const label = WORK_VALUE_LABELS[item.dimension];
                    return (
                      <div key={item.dimension} className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">{label?.name || item.dimension}</span>
                            <span className="text-sm font-bold text-slate-800">{item.score}</span>
                          </div>
                          <div className="w-full bg-amber-100 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * idx }}
                              className="bg-amber-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* MBTI specific layout (Fun quizzes) */}
          <div className="grid md:grid-cols-2 gap-8">
            {quiz.type === 'fun' && mbtiResult && (
              <div className="space-y-6 md:col-span-2">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
                    <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">💪</span> Điểm mạnh của bạn
                    </h3>
                    <ul className="space-y-2">
                      {mbtiResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2"></div>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🎯</span> Cần lưu ý
                    </h3>
                    <ul className="space-y-2">
                      {mbtiResult.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Kết quả chi tiết</h3>
                  <div className="space-y-4">
                    {mbtiResult.topCareers.map((career, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-slate-800">{career.name}</h4>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-line">{career.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upsell Section */}
        {quiz?.type !== 'fun' && (
          <UpsellCard currentQuizId={id || ''} />
        )}
      </div>

      {user && location.state?.attempt_id && quiz?.type !== 'fun' && (
        <SaveToProfileModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSaved={(profileId) => {
            setShowSaveModal(false);
            setSavedProfileId(profileId);
          }}
          quizId={id || ''}
          attemptId={location.state.attempt_id}
        />
      )}
    </div>
  );
}

