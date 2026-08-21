import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { QUIZ_DATA } from '../data/quizData';

type QuizResult = {
  id: string;
  quiz_id: string;
  created_at: string;
  is_paid: boolean;
  answers: Record<string, string | number>;
};

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

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
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Lịch sử làm bài</h1>
        <p className="text-slate-600">Xem lại các bài trắc nghiệm bạn đã hoàn thành</p>
      </motion.div>

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
                  {result.is_paid ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                      <CheckCircle size={16} />
                      Đã thanh toán
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                      <AlertCircle size={16} />
                      Chưa thanh toán
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-100 transition-all">
                    <ChevronRight size={20} />
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
