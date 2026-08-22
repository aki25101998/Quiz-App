import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Brain, Heart, Star, Sparkles, Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { aggregateCareerResults } from '../utils/careerAggregator';
import type { QuizResultData } from '../utils/careerAggregator';
import type { DashboardSummary } from '../types/types';
import { careerDatabase } from '../data/careerDatabase';
import { BIG_FIVE_LABELS, ABILITY_LABELS, WORK_VALUE_LABELS } from '../types/constants';

export default function FinalReport() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!user) {
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

    if (!authLoading) {
      fetchResults();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Đang tổng hợp báo cáo nghề nghiệp...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (summary?.completionRate !== 4) return <Navigate to="/" replace />; // Must complete all core tests

  const profile = summary.profile!;
  const topMatches = summary.recommendedCareers.slice(0, 5); // Top 5

  // SECTION 1: OVERVIEW DATA
  const topHolland = profile.riasec!.hollandCode;
  
  const topAbilities = Object.entries(profile.abilities!.normalizedScores)
    .filter(([, v]) => v !== undefined)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 3)
    .map(([k]) => ABILITY_LABELS[k as keyof typeof ABILITY_LABELS].name);
    
  const topPersonality = Object.entries(profile.bigFive!.normalizedScores)
    .filter(([, score]) => score >= 60)
    .map(([dim]) => BIG_FIVE_LABELS[dim as keyof typeof BIG_FIVE_LABELS].name);
    
  const topWorkValues = profile.workValues!.ranking.slice(0, 3).map(v => WORK_VALUE_LABELS[v.dimension].name);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link 
          to="/history" 
          className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium mb-6"
        >
          ← Trở lại Bảng điều khiển
        </Link>
      </div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-4"
        >
          FINAL CAREER REPORT
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Hồ Sơ Nghề Nghiệp Toàn Diện
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Bản phân tích chuyên sâu dựa trên Sở thích, Năng lực, Tính cách và Giá trị cốt lõi của bạn.
        </p>
      </div>

      {/* SECTION 1: PROFILE OVERVIEW */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Sparkles className="text-orange-400" /> Tổng Quan Hồ Sơ Của Bạn
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-teal-400 mb-2"><Target size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-1">Mã Holland</h3>
              <p className="text-3xl font-bold tracking-widest">{topHolland}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-indigo-400 mb-2"><Brain size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Thế mạnh Tư duy</h3>
              <ul className="text-sm font-medium space-y-1">
                {topAbilities.map((a, i) => <li key={i}>• {a}</li>)}
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-rose-400 mb-2"><Heart size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Đặc điểm Tính cách</h3>
              <ul className="text-sm font-medium space-y-1">
                {topPersonality.slice(0, 3).map((p, i) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-amber-400 mb-2"><Star size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Giá trị ưu tiên</h3>
              <ul className="text-sm font-medium space-y-1">
                {topWorkValues.map((v, i) => <li key={i}>• {v}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTIONS 6, 7, 8, 9, 10: TOP CAREER MATCHES */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Các Định Hướng Phù Hợp Nhất</h2>
          <p className="text-slate-600">Những nghề nghiệp có mức độ tương thích cao dựa trên phân tích tổng hợp hồ sơ của bạn.</p>
        </div>

        <div className="space-y-8">
          {topMatches.map((match, idx) => {
            const dbCareer = careerDatabase.find(c => c.id === match.careerId);
            const levelColors = {
              VERY_HIGH: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              HIGH: 'bg-teal-100 text-teal-800 border-teal-200',
              MODERATE: 'bg-blue-100 text-blue-800 border-blue-200',
              LOW: 'bg-slate-100 text-slate-800 border-slate-200',
            };
            const levelText = {
              VERY_HIGH: 'Rất Phù Hợp',
              HIGH: 'Phù Hợp',
              MODERATE: 'Tương Đối',
              LOW: 'Ít Phù Hợp',
            };
            
            return (
              <motion.div 
                key={match.careerId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl relative overflow-hidden"
              >
                {idx === 0 && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-bl-2xl shadow-md">
                    #1 TOP MATCH
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{match.careerName}</h3>
                    <p className="text-slate-500 font-medium">{dbCareer?.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border mb-2 ${levelColors[match.matchLevel]}`}>
                      {levelText[match.matchLevel]}
                    </div>
                    <div className="text-3xl font-extrabold text-slate-800">
                      {match.score}<span className="text-lg text-slate-400 font-medium">/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Why it fits & Strengths */}
                  <div className="space-y-6">
                    <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                      <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                        <CheckIcon /> Tại sao nghề này phù hợp?
                      </h4>
                      <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                        {match.reasons.map((r, i) => (
                          <li key={i} className="flex gap-2"><span className="text-teal-500">•</span> {r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <StarIcon /> Lợi thế của bạn
                      </h4>
                      <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                        {match.strengths.map((s, i) => (
                          <li key={i} className="flex gap-2"><span className="text-indigo-500">•</span> {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Challenges, Skills, Education */}
                  <div className="space-y-6">
                    {match.concerns.length > 0 && (
                      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                          <AlertIcon /> Thử thách tiềm năng
                        </h4>
                        <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                          {match.concerns.map((c, i) => (
                            <li key={i} className="flex gap-2"><span className="text-orange-500">•</span> {c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dbCareer && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Briefcase size={18} className="text-slate-600" /> Kỹ năng & Chuyên ngành
                        </h4>
                        
                        <div className="mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kỹ năng cần thiết</span>
                          <div className="flex flex-wrap gap-2">
                            {dbCareer.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm">{skill}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Ngành học tham khảo</span>
                          <div className="flex flex-wrap gap-2">
                            {dbCareer.education.map((edu, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 font-medium">{edu}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 11: NEXT STEPS */}
      <section className="bg-orange-50 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-orange-900 mb-6">Bước Tiếp Theo Của Bạn Là Gì?</h2>
        <p className="text-lg text-orange-800/80 max-w-2xl mx-auto mb-10">
          Hãy nhớ rằng, hệ thống này đưa ra những gợi ý phù hợp nhất ở thời điểm hiện tại, không phải là một "quyết định" đóng khung cuộc đời bạn.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">1</div>
            <h3 className="font-bold text-slate-800 mb-2">Nghiên cứu sâu hơn</h3>
            <p className="text-sm text-slate-600">Tìm hiểu chi tiết về top 3 nghề nghiệp được đề xuất: xu hướng thị trường, mức lương, môi trường làm việc.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">2</div>
            <h3 className="font-bold text-slate-800 mb-2">Trải nghiệm thực tế</h3>
            <p className="text-sm text-slate-600">Tham gia các câu lạc bộ, dự án thực tế hoặc trò chuyện với những người đang làm trong ngành.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">3</div>
            <h3 className="font-bold text-slate-800 mb-2">Trau dồi kỹ năng</h3>
            <p className="text-sm text-slate-600">Bắt đầu học các kỹ năng nền tảng được liệt kê trong báo cáo để xây dựng lợi thế cạnh tranh.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple icons
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);
