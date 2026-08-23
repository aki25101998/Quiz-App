// ============================================================
// PROFILE REPORT PAGE — Immutable Career Report from ProfileVersion
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Brain, Heart, Star, Sparkles, Briefcase, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfileDetail } from '../hooks/useProfileDetail';
import { getReport, generateReport } from '../services/careerReportService';
import type { CareerReport, ReportSnapshot } from '../types/profileTypes';
import { careerDatabase } from '../data/careerDatabase';
import { Button } from '../components/ui/Button';

export default function ProfileReport() {
  const { id: profileId, reportId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfileDetail(profileId);

  const [report, setReport] = useState<CareerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      if (!profileId) return;

      if (reportId && reportId !== 'generate') {
        // Fetch existing report
        const data = await getReport(reportId);
        setReport(data);
        setLoading(false);
      } else if (reportId === 'generate' && profile?.active_version_id) {
        // Generate new report
        setGenerating(true);
        try {
          const newReport = await generateReport(profileId, profile.active_version_id);
          setReport(newReport);
        } catch (err) {
          console.error('Failed to generate report:', err);
        } finally {
          setGenerating(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (!authLoading && !profileLoading) {
      fetchReport();
    }
  }, [profileId, reportId, profile, authLoading, profileLoading]);

  if (authLoading || profileLoading || loading || generating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          {generating ? 'Đang tạo báo cáo nghề nghiệp...' : 'Đang tải báo cáo...'}
        </p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 text-lg mb-4">Không tìm thấy báo cáo.</p>
        <Link to={`/profiles/${profileId}`} className="text-teal-600 font-medium">
          ← Quay lại hồ sơ
        </Link>
      </div>
    );
  }

  const snapshot = report.report_snapshot as ReportSnapshot;
  const isOutdated = report.status === 'OUTDATED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link
          to={`/profiles/${profileId}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium mb-6"
        >
          <ArrowLeft size={16} /> Trở lại Hồ sơ
        </Link>
      </div>

      {/* Outdated Warning */}
      {isOutdated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Báo cáo đã cũ</p>
            <p className="text-sm text-amber-700 mt-1">
              Hồ sơ nghề nghiệp đã được cập nhật. Báo cáo này được tạo từ phiên bản {snapshot.version_number}.
            </p>
            <Button
              onClick={() => navigate(`/profiles/${profileId}/report/generate`)}
              variant="primary"
              size="sm"
              className="mt-3"
            >
              Tạo Báo Cáo Mới
            </Button>
          </div>
        </motion.div>
      )}

      {/* Title */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-4"
        >
          CAREER REPORT · Phiên bản {snapshot.version_number}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Hồ Sơ Nghề Nghiệp
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {profile?.name || 'Career Blueprint'}
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Tạo lúc: {new Date(snapshot.generated_at).toLocaleDateString('vi-VN', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>

      {/* Profile Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full" />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Sparkles className="text-orange-400" /> Tổng Quan Hồ Sơ
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-teal-400 mb-2"><Target size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-1">Mã Holland</h3>
              <p className="text-3xl font-bold tracking-widest">
                {snapshot.profile_overview.hollandCode || '—'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-indigo-400 mb-2"><Brain size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Thế mạnh Tư duy</h3>
              <ul className="text-sm font-medium space-y-1">
                {snapshot.profile_overview.topAbilities.map((a, i) => <li key={i}>• {a}</li>)}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-rose-400 mb-2"><Heart size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Đặc điểm Tính cách</h3>
              <ul className="text-sm font-medium space-y-1">
                {snapshot.profile_overview.topPersonality.slice(0, 3).map((p, i) => <li key={i}>• {p}</li>)}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-amber-400 mb-2"><Star size={24} /></div>
              <h3 className="text-slate-300 text-sm font-medium mb-2">Giá trị ưu tiên</h3>
              <ul className="text-sm font-medium space-y-1">
                {snapshot.profile_overview.topWorkValues.map((v, i) => <li key={i}>• {v}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Career Matches */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Các Định Hướng Phù Hợp Nhất</h2>
          <p className="text-slate-600">
            Dựa trên phân tích tổng hợp hồ sơ phiên bản {snapshot.version_number}.
          </p>
        </div>

        <div className="space-y-8">
          {snapshot.career_matches.map((match, idx) => {
            const dbCareer = careerDatabase.find(c => c.id === match.careerId);
            const levelColors: Record<string, string> = {
              VERY_HIGH: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              HIGH: 'bg-teal-100 text-teal-800 border-teal-200',
              MODERATE: 'bg-blue-100 text-blue-800 border-blue-200',
              LOW: 'bg-slate-100 text-slate-800 border-slate-200',
            };
            const levelText: Record<string, string> = {
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

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{match.careerName}</h3>
                    <p className="text-slate-500 font-medium">{dbCareer?.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border mb-2 ${levelColors[match.matchLevel] || ''}`}>
                      {levelText[match.matchLevel] || match.matchLevel}
                    </div>
                    <div className="text-3xl font-extrabold text-slate-800">
                      {match.score}<span className="text-lg text-slate-400 font-medium">/100</span>
                    </div>
                  </div>
                </div>

                {/* Dimension Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-center relative">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sở thích</div>
                    <div className="text-xl font-bold text-teal-700">{match.dimensionScores.riasec || 0}%</div>
                    <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match.dimensionScores.riasec || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="bg-teal-500 h-full" 
                      />
                    </div>
                  </div>
                  <div className="text-center relative md:border-l md:border-slate-200 md:pl-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Năng lực</div>
                    <div className="text-xl font-bold text-indigo-700">{match.dimensionScores.ability || 0}%</div>
                    <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match.dimensionScores.ability || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-indigo-500 h-full" 
                      />
                    </div>
                  </div>
                  <div className="text-center relative md:border-l md:border-slate-200 md:pl-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tính cách</div>
                    <div className="text-xl font-bold text-rose-700">{match.dimensionScores.personality || 0}%</div>
                    <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match.dimensionScores.personality || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="bg-rose-500 h-full" 
                      />
                    </div>
                  </div>
                  <div className="text-center relative md:border-l md:border-slate-200 md:pl-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Giá trị</div>
                    <div className="text-xl font-bold text-amber-700">{match.dimensionScores.workValues || 0}%</div>
                    <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${match.dimensionScores.workValues || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="bg-amber-500 h-full" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {match.reasons.length > 0 && (
                      <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                        <h4 className="font-bold text-teal-900 mb-3">✓ Tại sao phù hợp?</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          {match.reasons.map((r, i) => (
                            <li key={i} className="flex gap-2"><span className="text-teal-500">•</span> {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {match.strengths.length > 0 && (
                      <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-3">★ Lợi thế</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
                          {match.strengths.map((s, i) => (
                            <li key={i} className="flex gap-2"><span className="text-indigo-500">•</span> {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {match.concerns.length > 0 && (
                      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                        <h4 className="font-bold text-orange-900 mb-3">⚠ Thử thách</h4>
                        <ul className="space-y-2 text-slate-700 text-sm">
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
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kỹ năng</span>
                          <div className="flex flex-wrap gap-2">
                            {dbCareer.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Ngành học</span>
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

      {/* Next Steps */}
      <section className="bg-orange-50 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-orange-900 mb-6">Bước Tiếp Theo</h2>
        <p className="text-lg text-orange-800/80 max-w-2xl mx-auto mb-10">
          Báo cáo này là bản phân tích tại thời điểm tạo. Bạn có thể cập nhật hồ sơ và tạo báo cáo mới bất cứ lúc nào.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">1</div>
            <h3 className="font-bold text-slate-800 mb-2">Nghiên cứu sâu hơn</h3>
            <p className="text-sm text-slate-600">Tìm hiểu chi tiết về top 3 nghề nghiệp được đề xuất.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">2</div>
            <h3 className="font-bold text-slate-800 mb-2">Trải nghiệm thực tế</h3>
            <p className="text-sm text-slate-600">Tham gia dự án thực tế hoặc trò chuyện với người trong ngành.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold mb-4">3</div>
            <h3 className="font-bold text-slate-800 mb-2">Trau dồi kỹ năng</h3>
            <p className="text-sm text-slate-600">Bắt đầu học các kỹ năng nền tảng để xây dựng lợi thế cạnh tranh.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
