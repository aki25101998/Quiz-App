import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { QUIZ_DATA } from '../data/quizData';
import { aggregateCareerResults } from '../utils/careerAggregator';

type QuizResult = {
  id: string;
  quiz_id: string;
  created_at: string;
  is_paid: boolean;
  answers: Record<string, string>;
};

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [usedAttemptIds, setUsedAttemptIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa kết quả này?')) return;
    
    setDeletingId(id);
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .eq('id', id);

    if (!error) {
      setResults(prev => prev.filter(r => r.id !== id));
    } else {
      alert('Có lỗi xảy ra khi xóa');
    }
    setDeletingId(null);
  };

  const handleClearAll = async () => {
    if (!user) return;
    if (!confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ lịch sử làm bài?')) return;
    
    setIsDeletingAll(true);
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setResults([]);
    } else {
      alert('Có lỗi xảy ra khi xóa');
    }
    setIsDeletingAll(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('quiz_results')
        .select('id, quiz_id, created_at, is_paid, answers')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setResults(data);
      }

      // Fetch used attempt IDs
      const { data: versionsData } = await supabase
        .from('profile_versions')
        .select('riasec_attempt_id, ability_attempt_id, big_five_attempt_id, work_values_attempt_id')
        .in('profile_id', (
          await supabase.from('profiles').select('id').eq('user_id', user.id)
        ).data?.map(p => p.id) || []);

      if (versionsData) {
        const usedIds = new Set<string>();
        versionsData.forEach(v => {
          if (v.riasec_attempt_id) usedIds.add(v.riasec_attempt_id);
          if (v.ability_attempt_id) usedIds.add(v.ability_attempt_id);
          if (v.big_five_attempt_id) usedIds.add(v.big_five_attempt_id);
          if (v.work_values_attempt_id) usedIds.add(v.work_values_attempt_id);
        });
        setUsedAttemptIds(usedIds);
      }

      setLoading(false);
    }
    
    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Lịch sử làm bài & Phân tích</h1>
          <p className="text-slate-600">Theo dõi hành trình và xem định hướng tổng hợp của bạn</p>
        </div>
        {results.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isDeletingAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors text-sm font-medium disabled:opacity-50 border border-red-100"
          >
            {isDeletingAll ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={16} />
            )}
            {isDeletingAll ? 'Đang xóa...' : 'Xóa tất cả'}
          </button>
        )}
      </motion.div>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span className="text-teal-400">AI</span> Career Advisor
            </h2>
            
            {(() => {
              const summary = aggregateCareerResults(results);
              return (
                <div className="mt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-teal-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(summary.completionRate / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-teal-400 whitespace-nowrap">{summary.completionRate}/4 Core</span>
                  </div>
                  
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{summary.statusMessage}</h3>
                    <p className="text-slate-300 leading-relaxed">{summary.advice}</p>
                  </div>

                  {/* RIASEC mini profile if available */}
                  {summary.profile?.riasec && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
                      <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-3">
                        Mã Holland: {summary.profile.riasec.hollandCode}
                      </h4>
                      <div className="grid grid-cols-6 gap-2">
                        {summary.profile.riasec.ranking.map((dim) => {
                          const score = summary.profile!.riasec!.normalizedScores[dim];
                          return (
                            <div key={dim} className="text-center">
                              <div className="text-xs font-bold text-white mb-1">{dim}</div>
                              <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                                <div 
                                  className="bg-teal-400 h-1.5 rounded-full"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-400">{score}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {summary.recommendedCareers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Nghề nghiệp đề xuất ({summary.profile?.completeness || 0}% hoàn thiện)
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {summary.recommendedCareers.map((career, idx) => (
                          <span key={idx} className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-sm font-medium">
                            {career.careerName} · {career.score}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {summary.completionRate < 4 && (
                    <div className="mt-8 text-center md:text-left">
                      <Link 
                        to={`/quiz/${summary.missingCore[0]}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-full transition-colors shadow-lg shadow-teal-500/20"
                      >
                        Tiếp tục hành trình <ChevronRight size={18} className="ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}

      {results.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-center"
        >
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Chưa có dữ liệu</h2>
          <p className="text-slate-600 mb-6">Bạn chưa hoàn thành bài trắc nghiệm nào. Hãy thử làm một bài nhé!</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
          >
            Khám phá bài test
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => {
            const quizInfo = QUIZ_DATA[result.quiz_id];
            const date = new Date(result.created_at).toLocaleDateString('vi-VN', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            });
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                onClick={() => navigate(`/result/${result.quiz_id}`, { state: { answers: result.answers, paid: result.is_paid } })}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {quizInfo?.emoji || '📝'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">
                      {quizInfo?.title || 'Bài trắc nghiệm'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Clock size={14} />
                      <span>{date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {usedAttemptIds.has(result.id) ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                      <FileText size={16} />
                      Đã dùng trong Hồ sơ
                    </div>
                  ) : result.is_paid ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <CheckCircle size={16} />
                      Đã thanh toán (Legacy)
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                      <AlertCircle size={16} />
                      Chưa gắn hồ sơ
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleDelete(e, result.id)}
                      disabled={deletingId === result.id}
                      className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all z-10"
                      title="Xóa bài làm này"
                    >
                      {deletingId === result.id ? (
                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
