import { useLocation, Navigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateCareerMatch } from '../utils/careerMatchingEngine';
import { UpsellCard } from '../components/quiz/UpsellCard';
import { QUIZ_DATA } from '../data/quizData';
import { RIASEC_LABELS, BIG_FIVE_LABELS, ABILITY_LABELS, WORK_VALUE_LABELS, ABILITY_LEVEL_LABELS, getScoreLabel } from '../types/constants';
import type { CareerMatchResult } from '../types/types';

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const quiz = QUIZ_DATA[id || ''];
  const answers = location.state?.answers;
  const isPaid = location.state?.paid;

  if (!quiz) return <div className="text-center py-20">Quiz không tồn tại</div>;

  // Protect route
  if (!answers || !isPaid) {
    return <Navigate to={`/checkout/${id}`} state={{ answers }} replace />;
  }

  const matchResult: CareerMatchResult = calculateCareerMatch(id || '', answers);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-6">
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
            <p className="text-slate-500 text-lg">Dựa trên những gì bạn đã trả lời, đây là phân tích dành riêng cho bạn.</p>
            {matchResult.profile && matchResult.profile.confidence < 100 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                <span>📊</span>
                <span>
                  Độ chính xác: {matchResult.profile.confidence}% — Hoàn thành thêm bài test để tăng độ chính xác
                </span>
              </div>
            )}
          </div>

          {/* === PROFILE DETAILS (for core quizzes) === */}
          {quiz.type !== 'fun' && matchResult.profile && (
            <div className="mb-10">
              {/* RIASEC Scores */}
              {matchResult.profile.riasec && quiz.type === 'riasec' && (
                <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 mb-6">
                  <h3 className="text-lg font-bold text-teal-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🧬</span> Mã Holland: {matchResult.profile.riasec.hollandCode}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Điểm số sở thích nghề nghiệp theo 6 nhóm Holland</p>
                  <div className="space-y-3">
                    {matchResult.profile.riasec.ranking.map((dim) => {
                      const score = matchResult.profile!.riasec!.normalizedScores[dim];
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
              {matchResult.profile.abilities && quiz.type === 'ability' && (
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 mb-6">
                  <h3 className="text-lg font-bold text-indigo-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> Bản đồ Năng lực
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Mức độ năng lực tư duy theo từng nhóm</p>
                  <div className="space-y-3">
                    {Object.entries(matchResult.profile.abilities.normalizedScores)
                      .filter(([, v]) => v !== undefined)
                      .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
                      .map(([dim, score]) => {
                        const key = dim as keyof typeof ABILITY_LABELS;
                        const label = ABILITY_LABELS[key];
                        const level = matchResult.profile!.abilities!.levels[key];
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
              {matchResult.profile.bigFive && quiz.type === 'big-five' && (
                <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 mb-6">
                  <h3 className="text-lg font-bold text-rose-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">🎭</span> Hồ sơ Tính cách
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">5 chiều tính cách ảnh hưởng đến cách bạn làm việc</p>
                  <div className="space-y-4">
                    {(Object.keys(BIG_FIVE_LABELS) as Array<keyof typeof BIG_FIVE_LABELS>).map((dim) => {
                      const score = matchResult.profile!.bigFive!.normalizedScores[dim];
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
              {matchResult.profile.workValues && quiz.type === 'work-values' && (
                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 mb-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">💎</span> Giá trị Cốt lõi
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Xếp hạng các giá trị bạn coi trọng nhất trong công việc</p>
                  <div className="space-y-3">
                    {matchResult.profile.workValues.ranking.slice(0, 8).map((item, idx) => {
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

          <div className="grid md:grid-cols-2 gap-8">
            {/* Điểm mạnh & Điểm yếu */}
            <div className="space-y-6">
              <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💪</span> Điểm mạnh của bạn
                </h3>
                <ul className="space-y-2">
                  {matchResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2"></div>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {matchResult.weaknesses.length > 0 && (
                <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span> Cần lưu ý
                  </h3>
                  <ul className="space-y-2">
                    {matchResult.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Kết quả chính (Nghề nghiệp hoặc Tính cách) */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {quiz.type === 'fun' ? 'Kết quả chi tiết' : 'Nghề nghiệp phù hợp nhất'}
              </h3>
              <div className="space-y-4">
                {matchResult.topCareers.map((career, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
                  >
                    {idx === 0 && quiz.type !== 'fun' && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-bl-lg">
                        TOP 1
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-800">{career.name}</h4>
                      {quiz.type !== 'fun' && (
                        <span className="font-bold text-teal-600">{career.score}%</span>
                      )}
                    </div>
                    {quiz.type !== 'fun' && (
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${career.score}%` }}></div>
                      </div>
                    )}
                    <p className="text-sm text-slate-600 whitespace-pre-line">{career.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upsell Section */}
        <UpsellCard currentQuizId={id || ''} />

      </div>
    </div>
  );
}
