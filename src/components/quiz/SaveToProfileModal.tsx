import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Clock, FileText, CheckCircle, QrCode } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getProfiles, createProfile } from '../../services/profileService';
import { attachAssessment } from '../../services/profileVersionService';
import { processProfileEdit, confirmPayment } from '../../services/paymentService';
import { useAuth } from '../../hooks/useAuth';
import type { ProfileWithMeta, Payment } from '../../types/profileTypes';
import { PROFILE_EDIT_PRICE } from '../../types/constants';

interface SaveToProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (profileId: string) => void;
  quizId: string;
  attemptId: string;
}

export const SaveToProfileModal: React.FC<SaveToProfileModalProps> = ({
  isOpen,
  onClose,
  quizId,
  attemptId,
  onSaved,
}) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // 20K Payment Flow State
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [transferCode, setTransferCode] = useState('');
  const [pendingPayment, setPendingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadProfiles();
    }
  }, [isOpen, user]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await getProfiles(user!.id);
      setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryOnly = () => {
    onClose();
  };

  const handleCreateProfile = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      const newProfile = await createProfile(user.id, `Hồ sơ mới (${new Date().toLocaleDateString('vi-VN')})`);
      await attachAssessment(newProfile.id, quizId, attemptId);
      onSaved(newProfile.id);
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo hồ sơ');
      setProcessing(false);
    }
  };

  const handleSelectProfile = async (profile: ProfileWithMeta) => {
    setProcessing(true);
    setError('');

    try {
      if (!profile.is_paid) {
        // Draft profile: Just attach (free)
        await attachAssessment(profile.id, quizId, attemptId);
        onSaved(profile.id);
      } else {
        // Paid profile: Orchestration via processProfileEdit
        const result = await processProfileEdit(user!.id, profile.id, quizId, attemptId);
        if (result.isFree) {
          onSaved(profile.id);
        } else {
          // Requires 20k payment
          setSelectedProfileId(profile.id);
          setPendingPayment(result.payment!);
          setTransferCode(result.payment!.transfer_code);
          setShowPayment(true);
          setProcessing(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật hồ sơ');
      setProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedProfileId || !pendingPayment) return;
    setProcessing(true);
    try {
      // Mock payment verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      await confirmPayment(pendingPayment.id);
      onSaved(selectedProfileId);
    } catch (err: any) {
      setError(err.message || 'Lỗi xác nhận thanh toán');
      setProcessing(false);
    }
  };

  if (showPayment) {
    const bankId = "tpbank";
    const accountNo = "0346134678";
    const amount = PROFILE_EDIT_PRICE;
    const accountName = "Van Tien Thong";
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${transferCode}&accountName=${encodeURIComponent(accountName)}`;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán Cập nhật Hồ sơ">
        <div className="flex flex-col items-center text-center space-y-4">
          <QrCode className="w-12 h-12 text-teal-500" />
          <h3 className="font-bold text-lg text-slate-800">Cập nhật hồ sơ</h3>
          <p className="text-slate-600 text-sm">
            Bạn đã dùng hết lượt cập nhật miễn phí trong tháng. Phí cập nhật hồ sơ đã thanh toán là <strong>{PROFILE_EDIT_PRICE.toLocaleString('vi-VN')}đ</strong>.
          </p>
          
          <div className="w-48 h-48 bg-white p-2 border border-slate-200 rounded-xl">
            <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          
          <div className="text-sm text-slate-700 bg-slate-50 w-full p-3 rounded-lg border border-slate-100 text-left">
            <p>Ngân hàng: <strong>TPBank</strong></p>
            <p>Số TK: <strong>{accountNo}</strong></p>
            <p>Nội dung CK: <strong className="text-teal-600">{transferCode}</strong></p>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleConfirmPayment}
            disabled={processing}
          >
            {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {processing ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản'}
          </Button>
          <button 
            onClick={() => setShowPayment(false)}
            className="text-sm text-slate-500 hover:text-slate-700 mt-2"
            disabled={processing}
          >
            Quay lại
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lưu kết quả bài test">
      <div className="space-y-4">
        <p className="text-slate-600 text-sm mb-4">
          Bạn muốn dùng kết quả này như thế nào? Kết quả cũng đã được lưu vào lịch sử cá nhân.
        </p>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2 max-h-[40vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
            </div>
          ) : (
            profiles.map(profile => (
              <button
                key={profile.id}
                disabled={processing}
                onClick={() => handleSelectProfile(profile)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${profile.is_paid ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {profile.is_paid ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{profile.name}</h4>
                    <p className="text-xs text-slate-500">
                      {profile.is_paid ? 'Hồ sơ Official' : 'Đang xây dựng'} • Hoàn thiện {profile.completeness}%
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
          <button
            onClick={handleCreateProfile}
            disabled={processing || loading}
            className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 hover:text-teal-600 text-slate-600 justify-center transition-colors font-medium text-sm disabled:opacity-50"
          >
            {processing && !selectedProfileId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Tạo Hồ sơ mới
          </button>
          
          <button
            onClick={handleHistoryOnly}
            disabled={processing}
            className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 justify-center transition-colors font-medium text-sm disabled:opacity-50"
          >
            <Clock className="w-4 h-4" />
            Chỉ lưu vào Lịch sử
          </button>
        </div>
      </div>
    </Modal>
  );
};
