// ============================================================
// PROFILE DETAIL PAGE — Single profile view with versions, tests, quotas
// ============================================================

import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Lock, CheckCircle, Clock,
  RefreshCw, FileText, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfileDetail } from '../hooks/useProfileDetail';
import { useQuota } from '../hooks/useQuota';
import { Button } from '../components/ui/Button';
import {
  PROFILE_PRICE, ASSESSMENT_LABELS,
  REQUIRED_ASSESSMENTS
} from '../types/constants';

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, versions, currentReport, hasOutdatedReport, loading } = useProfileDetail(id);
  const { monthlyQuota } = useQuota(user?.id, id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: `/profiles/${id}` } });
    }
  }, [user, authLoading, navigate, id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 text-lg">Hồ sơ không tồn tại.</p>
        <Link to="/profiles" className="text-teal-600 font-medium mt-4 inline-block">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const activeVersion = profile.active_version;
  const assessmentSlots = REQUIRED_ASSESSMENTS.map(quizId => {
    const columnMap: Record<string, string> = {
      'riasec': 'riasec_attempt_id',
      'ability': 'ability_attempt_id',
      'big-five': 'big_five_attempt_id',
      'work-values': 'work_values_attempt_id',
    };
    const column = columnMap[quizId];
    const attemptId = activeVersion ? (activeVersion as any)[column] : null;
    return {
      quizId,
      label: ASSESSMENT_LABELS[quizId] || quizId,
      attemptId,
      filled: !!attemptId,
    };
  });

  const statusConfig: Record<string, { label: string; icon: any; bgClass: string }> = {
    DRAFT: { label: 'Đang xây dựng', icon: Clock, bgClass: 'bg-slate-100 text-slate-700' },
    READY: { label: 'Sẵn sàng mở khóa', icon: Lock, bgClass: 'bg-blue-100 text-blue-700' },
    PAID: { label: 'Đã thanh toán', icon: CheckCircle, bgClass: 'bg-emerald-100 text-emerald-700' },
    ARCHIVED: { label: 'Đã lưu trữ', icon: FileText, bgClass: 'bg-orange-100 text-orange-700' },
  };
  const status = statusConfig[profile.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back nav */}
      <div className="mb-8">
        <Link
          to="/profiles"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Tất cả hồ sơ
        </Link>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                {profile.name}
              </h1>
              {profile.description && (
                <p className="text-slate-300 text-sm">{profile.description}</p>
              )}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${status.bgClass}`}>
              <StatusIcon size={14} />
              {status.label}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-slate-400 text-xs font-medium mb-1">Hoàn thiện</p>
              <p className="text-2xl font-bold">{profile.completeness}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-slate-400 text-xs font-medium mb-1">Phiên bản</p>
              <p className="text-2xl font-bold">{profile.total_versions}</p>
            </div>
            {profile.is_paid && (
              <>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-xs font-medium mb-1">Lượt cập nhật</p>
                  <p className="text-2xl font-bold">{profile.revision_used}/{profile.revision_limit}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-xs font-medium mb-1">Free edits tháng này</p>
                  <p className="text-2xl font-bold">
                    {monthlyQuota ? `${monthlyQuota.used}/${monthlyQuota.limit}` : '—'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Outdated Report Warning */}
      {hasOutdatedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Hồ sơ đã được cập nhật</p>
            <p className="text-sm text-amber-700 mt-1">
              Báo cáo nghề nghiệp trước đó được tạo từ phiên bản cũ hơn. Nhấn "Tạo Báo Cáo Mới" để cập nhật.
            </p>
          </div>
        </motion.div>
      )}

      {/* Assessment Slots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 md:p-8 mb-8"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          Bài đánh giá trong Hồ sơ
        </h2>

        <div className="space-y-3">
          {assessmentSlots.map((slot) => (
            <div
              key={slot.quizId}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                slot.filled
                  ? 'bg-teal-50/50 border-teal-100'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {slot.filled ? (
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
                <span className={`font-medium ${slot.filled ? 'text-slate-800' : 'text-slate-500'}`}>
                  {slot.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {slot.filled ? (
                  <span className="text-xs text-teal-600 font-medium px-2 py-1 bg-teal-100 rounded-full">
                    ✓ Đã có
                  </span>
                ) : (
                  <Link
                    to={`/quiz/${slot.quizId}`}
                    className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 rounded-full transition-colors"
                  >
                    Làm bài <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 md:p-8 mb-8"
      >
        {profile.status === 'READY' && !profile.is_paid && (
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Hồ sơ đã hoàn thiện! 🎉
            </h3>
            <p className="text-slate-500 mb-6">
              Mở khóa Báo cáo Định hướng Nghề nghiệp đầy đủ.
            </p>
            <Button
              onClick={() => navigate(`/profiles/${id}/payment`)}
              variant="primary"
              size="lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              Mở khóa Career Blueprint — {PROFILE_PRICE.toLocaleString('vi-VN')}đ
            </Button>
          </div>
        )}

        {profile.is_paid && (
          <div className="text-center">
            {currentReport ? (
              <Button
                onClick={() => navigate(`/profiles/${id}/report/${currentReport.id}`)}
                variant="primary"
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Xem Career Report
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/profiles/${id}/report/generate`)}
                variant="primary"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Tạo Career Report
              </Button>
            )}
          </div>
        )}

        {profile.status === 'DRAFT' && profile.completeness < 100 && (
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Tiếp tục hoàn thiện hồ sơ
            </h3>
            <p className="text-slate-500 mb-4">
              Hoàn thành tất cả 4 bài đánh giá để mở khóa Career Blueprint.
            </p>
            {assessmentSlots.find(s => !s.filled) && (
              <Link
                to={`/quiz/${assessmentSlots.find(s => !s.filled)!.quizId}`}
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-900 transition-colors shadow-lg"
              >
                Làm bài tiếp theo <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        )}
      </motion.div>

      {/* Version History */}
      {versions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 md:p-8"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-slate-500" />
            Lịch sử Phiên bản
          </h2>

          <div className="space-y-3">
            {versions.map((version) => {
              const isActive = profile.active_version_id === version.id;
              const date = new Date(version.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              });

              return (
                <div
                  key={version.id}
                  className={`p-4 rounded-xl border ${
                    isActive
                      ? 'bg-teal-50/50 border-teal-200'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        Phiên bản {version.version_number}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{date}</span>
                  </div>
                  {version.created_reason && (
                    <p className="text-xs text-slate-500">{version.created_reason}</p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {version.riasec_attempt_id && (
                      <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded border border-teal-100">RIASEC</span>
                    )}
                    {version.ability_attempt_id && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">Ability</span>
                    )}
                    {version.big_five_attempt_id && (
                      <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100">Big Five</span>
                    )}
                    {version.work_values_attempt_id && (
                      <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-100">Work Values</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
