// ============================================================
// PROFILE SELECT MODAL — After quiz completion
// "Bạn muốn lưu kết quả này vào Profile nào?"
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FolderOpen, Clock, Check } from 'lucide-react';
import type { ProfileWithMeta } from '../../types/profileTypes';
import { Button } from '../ui/Button';

interface ProfileSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ProfileWithMeta[];
  quizTitle: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
  onSaveHistoryOnly: () => void;
  loading?: boolean;
}

export const ProfileSelectModal: React.FC<ProfileSelectModalProps> = ({
  isOpen,
  onClose,
  profiles,
  quizTitle,
  onSelectProfile,
  onCreateProfile,
  onSaveHistoryOnly,
  loading = false,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newProfileName.trim()) return;
    onCreateProfile(newProfileName.trim());
    setNewProfileName('');
    setShowCreateForm(false);
  };

  const handleSelect = (profileId: string) => {
    setSelectedId(profileId);
    onSelectProfile(profileId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Lưu kết quả vào Hồ sơ
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{quizTitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* Existing Profiles */}
                {profiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Hồ sơ của bạn
                    </h4>
                    {profiles.map((profile) => (
                      <motion.button
                        key={profile.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(profile.id)}
                        disabled={loading}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedId === profile.id
                            ? 'border-teal-400 bg-teal-50/50'
                            : 'border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {profile.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  profile.status === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : profile.status === 'READY'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {profile.status === 'PAID' ? 'Đã thanh toán' :
                                   profile.status === 'READY' ? 'Sẵn sàng' : 'Đang xây dựng'}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {profile.completeness}% hoàn thiện
                                </span>
                              </div>
                            </div>
                          </div>
                          {selectedId === profile.id && loading ? (
                            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                          ) : selectedId === profile.id ? (
                            <Check className="w-5 h-5 text-teal-500" />
                          ) : null}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Create New Profile */}
                {!showCreateForm ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowCreateForm(true)}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-700">Tạo Hồ sơ mới</p>
                      <p className="text-xs text-slate-400">Bắt đầu một hành trình khám phá nghề nghiệp mới</p>
                    </div>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/30 space-y-3"
                  >
                    <label className="text-sm font-semibold text-slate-700">
                      Tên hồ sơ
                    </label>
                    <input
                      type="text"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="VD: Định hướng Đại học"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-teal-500 focus:border-teal-500 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreate} variant="primary" size="sm" disabled={!newProfileName.trim() || loading}>
                        {loading ? 'Đang tạo...' : 'Tạo & Lưu'}
                      </Button>
                      <button
                        onClick={() => { setShowCreateForm(false); setNewProfileName(''); }}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
                      >
                        Huỷ
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs text-slate-400 font-medium">hoặc</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Save to History Only */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onSaveHistoryOnly}
                  disabled={loading}
                  className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-600">Chỉ lưu vào Lịch sử</p>
                    <p className="text-xs text-slate-400">Không thêm vào hồ sơ nào. Bạn có thể thêm sau.</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
