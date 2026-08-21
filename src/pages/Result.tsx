import { useLocation, Navigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateCareerMatch } from '../utils/careerMatchingEngine';
import { UpsellCard } from '../components/quiz/UpsellCard';
import { QUIZ_DATA } from '../data/quizData';

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

  const matchResult = calculateCareerMatch(id || '', answers);

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
          </div>

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
