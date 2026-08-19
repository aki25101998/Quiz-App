import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { quizzes } from '../data/quizzes';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || {};
  const quiz = quizzes.find((q) => q.id === id);
  const { user, loading: authLoading } = useAuth();

  const [transferCode] = useState(`TN${Math.floor(Math.random() * 900000) + 100000}`);
  const [isVerifying, setIsVerifying] = useState(false);

  // Bank Info
  const bankId = "tpbank";
  const accountNo = "0346134678";
  const amount = 10000;
  const accountName = "Van Tien Thong";
  
  // VietQR API
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${transferCode}&accountName=${encodeURIComponent(accountName)}`;

  if (!quiz) return <div>Quiz không tồn tại</div>;

  const handleManualVerify = async () => {
    if (!user) return;
    setIsVerifying(true);
    
    try {
      // Create result record in database
      const { error } = await supabase.from('quiz_results').insert({
        user_id: user.id,
        quiz_id: id,
        answers: answers,
        is_paid: true
      });

      if (error) {
        console.error('Error saving result:', error);
        // We still proceed for now so user isn't stuck, or we could show an error message.
      }

      setTimeout(() => {
        setIsVerifying(false);
        navigate(`/result/${id}`, { state: { answers, paid: true } });
      }, 1500);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl relative z-10">
        
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-block text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            ← Trang chủ
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60"
        >
          {/* Header section */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 font-bold text-sm rounded-md mb-4">
              Đã xong! 🎉
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Kết quả của bạn đã sẵn sàng
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              {quiz.title} · Mở khoá bản phân tích đầy đủ (nhóm của bạn, điểm mạnh – điểm yếu, biểu đồ và lời khuyên riêng) với 10.000đ.
            </p>
          </div>

          {/* Blurred Fake Result Box */}
          <div className="bg-[#f8f7f5] rounded-2xl p-6 md:p-8 mb-10 flex flex-col gap-4 relative overflow-hidden select-none">
            <div className="h-6 w-3/4 bg-slate-200/60 rounded-full blur-[4px]"></div>
            <div className="h-4 w-full bg-slate-200/60 rounded-full blur-[4px]"></div>
            <div className="h-4 w-5/6 bg-slate-200/60 rounded-full blur-[4px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f7f5] opacity-50"></div>
          </div>

          {/* Payment Section OR Login Prompt */}
          {authLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center text-center bg-orange-50/50 rounded-2xl p-8 border border-orange-100 mb-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-orange-500">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Đăng nhập để tiếp tục</h3>
              <p className="text-slate-600 mb-6 max-w-md">
                Bạn cần đăng nhập tài khoản để lưu kết quả trắc nghiệm và tiến hành thanh toán.
              </p>
              <Link
                to="/login"
                state={{ from: location.pathname, answers }}
                className="px-8 py-3.5 rounded-full font-bold text-white lovable-gradient-btn shadow-lg shadow-orange-500/20 inline-flex items-center"
              >
                Đăng nhập ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
                {/* QR Code */}
                <div className="w-64 h-64 flex-shrink-0 bg-white rounded-2xl p-2 shadow-sm border border-slate-100 relative">
                  <img src={qrUrl} alt="Mã VietQR" className="w-full h-full object-contain rounded-xl" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Quét QR để thanh toán</h3>
                  <div className="space-y-3 text-slate-600">
                    <p>Ngân hàng: <strong className="text-slate-800">TPBank (Tiên Phong Bank)</strong></p>
                    <p>Số tài khoản: <strong className="text-slate-800">0346134678</strong></p>
                    <p>Chủ tài khoản: <strong className="text-slate-800 uppercase">VAN TIEN THONG</strong></p>
                    <p>Số tiền: <strong className="text-slate-800">10.000đ</strong></p>
                    <div className="flex items-center flex-wrap gap-2">
                      <span>Nội dung chuyển khoản:</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-md tracking-wider">
                        {transferCode}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                    Ghi đúng nội dung <strong className="text-slate-700">{transferCode}</strong> để hệ thống tự mở khoá. Bạn cũng có thể chuyển khoản bằng SMS Banking tới cùng số tài khoản với nội dung này.
                  </p>
                </div>
              </div>

              {/* Action button */}
              <div className="flex flex-col md:flex-row items-center gap-4 border-t border-slate-100 pt-8">
                <button
                  onClick={handleManualVerify}
                  disabled={isVerifying}
                  className={`px-8 py-3.5 rounded-full font-bold text-white lovable-gradient-btn shadow-lg shadow-orange-500/20 w-full md:w-auto ${isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isVerifying ? 'Đang kiểm tra...' : 'Tôi đã chuyển khoản'}
                </button>
                <span className="text-slate-500 text-sm">
                  Hệ thống tự kiểm tra mỗi 5 giây · Giữ nguyên trang này
                </span>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </div>
  );
}
