// ============================================================
// PROFILE PAYMENT PAGE — 129K unlock + 20K edit
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfileDetail } from '../hooks/useProfileDetail';
import { Button } from '../components/ui/Button';
import { PROFILE_PRICE } from '../types/constants';
import { confirmProfileUnlock } from '../services/paymentService';
import { generateReport } from '../services/careerReportService';

export default function ProfilePayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfileDetail(id);

  const [transferCode] = useState(`PF${Math.floor(Math.random() * 900000) + 100000}`);
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  // Bank Info (same as existing payment flow)
  const bankId = "tpbank";
  const accountNo = "0346134678";
  const amount = PROFILE_PRICE;
  const accountName = "Van Tien Thong";

  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${transferCode}&accountName=${encodeURIComponent(accountName)}`;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: `/profiles/${id}/payment` } });
    }
  }, [user, authLoading, navigate, id]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Hồ sơ không tồn tại</p>
      </div>
    );
  }

  if (profile.is_paid) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Hồ sơ đã được thanh toán!</h2>
        <p className="text-slate-500 mb-6">Career Blueprint của bạn đã sẵn sàng.</p>
        <Button onClick={() => navigate(`/profiles/${id}`)}>
          Xem hồ sơ
        </Button>
      </div>
    );
  }

  const handleManualVerify = async () => {
    if (!user || !id) return;
    setIsVerifying(true);

    try {
      // 1. Confirm profile unlock payment
      await confirmProfileUnlock(user.id, id);

      // 2. Generate career report from active version
      if (profile.active_version_id) {
        await generateReport(id, profile.active_version_id);
      }

      setSuccess(true);

      // Navigate after animation
      setTimeout(() => {
        navigate(`/profiles/${id}`, { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setIsVerifying(false);
    }
  };

  const handleSkipDev = async () => {
    // Skip (Dev) — same as manual verify
    await handleManualVerify();
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Thanh toán thành công! 🎉</h2>
          <p className="text-slate-500 text-lg">
            Career Blueprint đang được tạo... Chuyển hướng trong giây lát.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-6">
          <Link
            to={`/profiles/${id}`}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Quay lại hồ sơ
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-12"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Career Profile Unlock</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Mở khoá <span className="lovable-gradient-text">{profile.name}</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Thanh toán {PROFILE_PRICE.toLocaleString('vi-VN')}đ để nhận Báo cáo Định hướng Nghề nghiệp
              toàn diện — dựa trên 4 bài đánh giá bạn đã hoàn thành.
            </p>
          </div>

          {/* What you get */}
          <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 mb-10">
            <h3 className="font-bold text-teal-900 mb-3">Bao gồm:</h3>
            <ul className="space-y-2 text-sm text-teal-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Career Report toàn diện
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Top nghề nghiệp phù hợp nhất
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" /> Phân tích điểm mạnh & thách thức
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" /> 3 lượt cập nhật miễn phí
              </li>
            </ul>
          </div>

          {/* QR Payment */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
            <div className="w-64 h-64 flex-shrink-0 bg-white rounded-2xl p-2 shadow-sm border border-slate-100 relative">
              <img src={qrUrl} alt="Mã VietQR" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Quét QR để thanh toán</h3>
              <div className="space-y-3 text-slate-600">
                <p>Ngân hàng: <strong className="text-slate-800">TPBank (Tiên Phong Bank)</strong></p>
                <p>Số tài khoản: <strong className="text-slate-800">0346134678</strong></p>
                <p>Chủ tài khoản: <strong className="text-slate-800 uppercase">VAN TIEN THONG</strong></p>
                <p>Số tiền: <strong className="text-slate-800">{PROFILE_PRICE.toLocaleString('vi-VN')}đ</strong></p>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  <span>Nội dung chuyển khoản:</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-md tracking-wider">
                    {transferCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 border-t border-slate-100 pt-8">
            <Button
              onClick={handleManualVerify}
              disabled={isVerifying}
              className="w-full md:w-auto"
            >
              {isVerifying ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang xử lý...</>
              ) : `Tôi đã chuyển khoản ${PROFILE_PRICE.toLocaleString('vi-VN')}đ`}
            </Button>

            {/* Skip (Dev) - KEPT AS REQUIRED */}
            <button
              onClick={handleSkipDev}
              disabled={isVerifying}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium opacity-70 hover:opacity-100"
            >
              Skip (Dev)
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
