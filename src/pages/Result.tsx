import { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateMbtiResult } from '../utils/careerMatchingEngine';
import { aggregateCareerResults } from '../utils/careerAggregator';
import type { QuizResultData } from '../utils/careerAggregator';
import { UpsellCard } from '../components/quiz/UpsellCard';
import { QUIZ_DATA } from '../data/quizData';
import { RIASEC_LABELS, BIG_FIVE_LABELS, ABILITY_LABELS, WORK_VALUE_LABELS, ABILITY_LEVEL_LABELS, getScoreLabel } from '../types/constants';
import type { CareerMatchResult, DashboardSummary } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SaveToProfileModal } from '../components/quiz/SaveToProfileModal';

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const quiz = QUIZ_DATA[id || ''];
  const answers = location.state?.answers;
  const isPaid = location.state?.paid;

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [mbtiResult, setMbtiResult] = useState<CareerMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasPromptedSave, setHasPromptedSave] = useState(false);

  useEffect(() => {
    if (!answers || !isPaid) {
      navigate(`/checkout/${id}`, { state: { answers }, replace: true });
    }
  }, [answers, isPaid, id, navigate]);

  useEffect(() => {
    async function fetchResults() {
      if (quiz?.type === 'fun') {
        setMbtiResult(calculateMbtiResult(answers || {}));
        setLoading(false);
        return;
      }

      if (!user) {
        if (answers) {
          setSummary(aggregateCareerResults([{ quiz_id: id || '', answers, created_at: new Date().toISOString() } as QuizResultData]));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('quiz_results')
        .select('quiz_id, created_at, answers')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSummary(aggregateCareerResults(data as QuizResultData[]));
      }
      setLoading(false);
    }

    if (!authLoading && answers && isPaid) {
      fetchResults();
    }
  }, [user, authLoading, quiz, answers, id, isPaid]);

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

  const profile = summary?.profile;

  // Context mapping for Core Quizzes
  let contextTitle = '';
  let contextSubtitle = '';
  
  if (summary) {
    if (summary.completionRate === 1) {
      contextTitle = 'Bước khởi đầu tuyệt vời (1/4)';
      contextSubtitle = 'Đây là kết quả ban đầu của bạn. Hãy tiếp tục khám phá để hoàn thiện hồ sơ.';
    } else if (summary.completionRate === 2 || summary.completionRate === 3) {
      contextTitle = `Hồ sơ của bạn đang được hoàn thiện (${summary.completionRate}/4)`;
      contextSubtitle = 'Mỗi bài test mới sẽ giúp AI Career Advisor đưa ra gợi ý chính xác hơn.';
    } else if (summary.completionRate === 4) {
      contextTitle = 'Hồ sơ nghề nghiệp của bạn đã hoàn thiện (4/4)';
      contextSubtitle = 'Hệ thống đã có đủ dữ liệu để phân tích toàn diện. Bạn đã sẵn sàng xem Final Career Report!';
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-block text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            ← Về trang chủ
          </Link>
          
          {summary?.completionRate === 4 && (
            <Link 
              to="/report" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
            >
              Xem Final Career Report →
            </Link>
          )}
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
                <p className="text-slate-700 text-xl font-medium mt-6">{contextTitle}</p>
                <p className="text-slate-500 text-md mt-2">{contextSubtitle}</p>
                {profile && profile.completeness < 100 && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                    <span>📊</span>
                    <span>
                      Độ hoàn thiện hồ sơ: {profile.completeness}%
                    </span>
                  </div>
                )}
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

          {/* === PROFILE DETAILS (for core quizzes) === */}
          {quiz.type !== 'fun' && profile && (
            <div className="mb-10">
              {/* RIASEC Scores */}
              {profile.riasec && quiz.type === 'riasec' && (
                <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 mb-6">
                  <h3 className="text-lg font-bold text-teal-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🧬</span> Mã Holland: {profile.riasec.hollandCode}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Điểm số sở thích nghề nghiệp theo 6 nhóm Holland</p>
                  <div className="space-y-3">
                    {profile.riasec.ranking.map((dim) => {
                      const score = profile.riasec!.normalizedScores[dim];
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
              {profile.abilities && quiz.type === 'ability' && (
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 mb-6">
                  <h3 className="text-lg font-bold text-indigo-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> Bản đồ Năng lực
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Mức độ năng lực tư duy theo từng nhóm</p>
                  <div className="space-y-3">
                    {Object.entries(profile.abilities.normalizedScores)
                      .filter(([, v]) => v !== undefined)
                      .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
                      .map(([dim, score]) => {
                        const key = dim as keyof typeof ABILITY_LABELS;
                        const label = ABILITY_LABELS[key];
                        const level = profile.abilities!.levels[key];
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
              {profile.bigFive && quiz.type === 'big-five' && (
                <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 mb-6">
                  <h3 className="text-lg font-bold text-rose-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🎭</span> Hồ sơ Tính cách
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">5 chiều tính cách ảnh hưởng đến cách bạn làm việc</p>
                  <div className="space-y-4">
                    {(Object.keys(BIG_FIVE_LABELS) as Array<keyof typeof BIG_FIVE_LABELS>).map((dim) => {
                      const score = profile.bigFive!.normalizedScores[dim];
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
              {profile.workValues && quiz.type === 'work-values' && (
                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 mb-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">💎</span> Giá trị Cốt lõi
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Xếp hạng các giá trị bạn coi trọng nhất trong công việc</p>
                  <div className="space-y-3">
                    {profile.workValues.ranking.slice(0, 8).map((item, idx) => {
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
          )}

          {/* RECOMMENDATIONS & STRENGTHS */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* MBTI specific strengths/weaknesses layout */}
            {quiz.type === 'fun' && mbtiResult && (
              <div className="space-y-6">
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
            )}
            
            {/* Core engine recommendations layout */}
            {quiz.type !== 'fun' && summary && (
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🧭</span> 
                  Gợi ý nghề nghiệp từ AI Career Advisor
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {summary.recommendedCareers.slice(0, 4).map((career, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
                    >
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold rounded-bl-lg">
                          TOP 1 MATCH
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2 mt-2">
                        <h4 className="font-bold text-lg text-slate-800">{career.careerName}</h4>
                        <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md text-sm border border-teal-100">
                          {career.score} / 100
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${career.score}%` }}></div>
                      </div>
                      
                      <div className="space-y-3">
                        {career.reasons.length > 0 && (
                          <div className="text-sm">
                            <span className="font-semibold text-slate-700">Vì sao phù hợp: </span>
                            <span className="text-slate-600">{career.reasons[0]}</span>
                          </div>
                        )}
                        {career.strengths.length > 0 && (
                          <div className="text-sm">
                            <span className="font-semibold text-teal-700">Lợi thế: </span>
                            <span className="text-slate-600">{career.strengths[0]}</span>
                          </div>
                        )}
                        {career.concerns.length > 0 && (
                          <div className="text-sm">
                            <span className="font-semibold text-orange-700">Thử thách: </span>
                            <span className="text-slate-600">{career.concerns[0]}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* MBTI recommendations */}
            {quiz.type === 'fun' && mbtiResult && (
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
            )}
          </div>
        </motion.div>

        {/* Upsell Section */}
        {summary?.completionRate !== 4 && (
          <UpsellCard currentQuizId={id || ''} />
        )}
      </div>

      {user && location.state?.attempt_id && quiz?.type !== 'fun' && (
        <SaveToProfileModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          quizId={id || ''}
          attemptId={location.state.attempt_id}
        />
      )}
    </div>
  );
}
