import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface UpsellCardProps {
  currentQuizId: string;
}

export const UpsellCard: React.FC<UpsellCardProps> = ({ currentQuizId }) => {
  const navigate = useNavigate();
  
  // Logic to determine the next quiz
  let nextQuizId = '';
  let title = '';
  let description = '';
  let price = '19.000đ';

  if (currentQuizId === 'riasec') {
    nextQuizId = 'ability';
    title = 'Bạn đã biết mình thích gì. Nhưng bạn có biết mình thực sự mạnh ở đâu?';
    description = 'Bài test Năng lực (Ability Test) sẽ giúp bạn khám phá khả năng xử lý vấn đề, tư duy logic của mình để xem nó có khớp với sở thích không.';
  } else if (currentQuizId === 'ability') {
    nextQuizId = 'big-five';
    title = 'Năng lực là một chuyện, cách bạn làm việc lại là chuyện khác.';
    description = 'Khám phá tính cách làm việc (Big Five) để biết bạn hợp với vai trò nào trong nhóm.';
  } else if (currentQuizId === 'big-five') {
    nextQuizId = 'work-values';
    title = 'Một công việc phù hợp chưa chắc đã làm bạn hạnh phúc.';
    description = 'Bài test Giá trị công việc sẽ giúp bạn tìm ra điều bạn thực sự coi trọng: Tiền bạc, Tự do hay Sáng tạo?';
  } else if (currentQuizId === 'mbti') {
    nextQuizId = 'riasec';
    title = 'MBTI chỉ là khởi đầu. Bạn có muốn biết nghề nghiệp thực sự của mình?';
    description = 'Hãy bắt đầu Hành trình Khám phá Nghề nghiệp với bài test RIASEC - chuẩn mực vàng trong định hướng nghề nghiệp.';
  } else {
    // If all tests are done, upsell premium report
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white text-center relative overflow-hidden shadow-2xl mt-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        
        <h3 className="text-2xl font-bold mb-4 relative z-10">Premium Career Blueprint</h3>
        <p className="text-slate-300 mb-6 max-w-lg mx-auto relative z-10">
          Tổng hợp toàn bộ kết quả để đưa ra định hướng nghề nghiệp chuẩn xác nhất cho riêng bạn.
        </p>
        <Button onClick={() => alert('Chức năng đang phát triển')} variant="primary" size="lg" className="relative z-10">
          Mở khóa toàn bộ chỉ với 49.000đ
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-orange-50/50 rounded-2xl p-6 md:p-8 border border-orange-100 mt-12 text-center"
    >
      <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 mb-4 shadow-sm">
        <Lock className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
      
      <Button 
        onClick={() => navigate(`/quiz/${nextQuizId}`)} 
        variant="primary"
      >
        Mở khoá bài tiếp theo ({price})
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
};
