// ============================================================
// PROFILES PAGE — "Hồ sơ nghề nghiệp của tôi"
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, ChevronRight, Loader2, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfiles } from '../hooks/useProfiles';
import { Button } from '../components/ui/Button';
import { PROFILE_PRICE } from '../types/constants';

export default function Profiles() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profiles, loading, createProfile } = useProfiles(user?.id);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login', { state: { from: '/profiles' } });
    return null;
  }

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const profile = await createProfile(newName.trim());
      setNewName('');
      setShowCreate(false);
      navigate(`/profiles/${profile.id}`);
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo hồ sơ');
    } finally {
      setCreating(false);
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'Đang xây dựng', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    READY: { label: 'Sẵn sàng mở khóa', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    PAID: { label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ARCHIVED: { label: 'Đã lưu trữ', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Career Profiles</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Hồ Sơ Nghề Nghiệp
        </h1>
        <p className="text-slate-500 text-lg">
          Mỗi hồ sơ là một bản phân tích toàn diện, được tổng hợp từ nhiều bài đánh giá.
          Mở khóa báo cáo nghề nghiệp chỉ với {PROFILE_PRICE.toLocaleString('vi-VN')}đ.
        </p>
      </motion.div>

      {/* Create Profile Button or Form */}
      {!showCreate ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowCreate(true)}
          className="w-full mb-8 p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-teal-500" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-700 text-lg">Tạo Hồ sơ mới</p>
            <p className="text-sm text-slate-400">Bắt đầu xây dựng bản phân tích nghề nghiệp mới</p>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-teal-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
          <h3 className="font-bold text-slate-800 mb-3">Tạo Hồ sơ Nghề nghiệp</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder='VD: "Định hướng Đại học", "Career Discovery 2027"'
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-teal-500 focus:border-teal-500 mb-4"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-3">
            <Button onClick={handleCreate} disabled={!newName.trim() || creating}>
              {creating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tạo...</> : 'Tạo hồ sơ'}
            </Button>
            <button
              onClick={() => { setShowCreate(false); setNewName(''); }}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Huỷ
            </button>
          </div>
        </motion.div>
      )}

      {/* Profiles List */}
      {profiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-center"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Chưa có hồ sơ nào</h2>
          <p className="text-slate-500 mb-6">
            Tạo hồ sơ đầu tiên để bắt đầu hành trình khám phá nghề nghiệp.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => {
            const status = statusConfig[profile.status] || statusConfig.DRAFT;
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/profiles/${profile.id}`)}
                className="group bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {profile.is_paid ? (
                        <Sparkles className="w-6 h-6 text-teal-600" />
                      ) : (
                        <FolderOpen className="w-6 h-6 text-teal-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {profile.completeness}% hoàn thiện
                        </span>
                        {profile.is_paid && (
                          <span className="text-xs text-slate-400">
                            Cập nhật: {profile.revision_used}/{profile.revision_limit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {profile.status === 'READY' && (
                      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        {PROFILE_PRICE.toLocaleString('vi-VN')}đ
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 group-hover:border-teal-100 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>

                {/* Completeness Bar */}
                <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.completeness}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-1.5 rounded-full ${
                      profile.is_paid ? 'bg-emerald-500' :
                      profile.completeness === 100 ? 'bg-blue-500' : 'bg-teal-400'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {profiles.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-teal-600 font-medium transition-colors"
          >
            ← Về trang chủ để làm thêm bài đánh giá
          </Link>
        </div>
      )}
    </div>
  );
}
