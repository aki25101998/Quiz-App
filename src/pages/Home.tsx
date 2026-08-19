import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { quizzes } from '../data/quizzes';

export default function Home() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-slate-200/60 shadow-sm text-sm text-slate-600 mb-8 backdrop-blur-sm"
          >
            <span className="mr-2">✦</span> Hơn 5 bài test khoa học giúp bạn hiểu chính mình
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight"
          >
            Bạn thật sự là <span className="lovable-gradient-text">kiểu người</span> nào?
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Làm bài hoàn toàn miễn phí. Chỉ khi muốn xem bản phân tích chi tiết – điểm mạnh, điểm yếu, nghề hợp và lời khuyên riêng – bạn mới cần mở khoá 10.000đ.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/quiz/mbti"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white lovable-gradient-btn rounded-full shadow-lg shadow-orange-500/20"
            >
              Bắt đầu ngay <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-10">
          {quizzes.map((quiz, index) => {
            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/50 flex flex-col group relative overflow-hidden"
              >
                <div className="text-4xl mb-4">{quiz.emoji}</div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h2>
                <p className="text-slate-500 flex-grow mb-8 text-sm md:text-base">{quiz.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="px-3 py-1.5 bg-slate-100/80 text-slate-600 rounded-full text-xs font-medium">
                    {quiz.stats}
                  </span>
                  <Link 
                    to={`/quiz/${quiz.id}`}
                    className="text-[#f97316] font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center"
                  >
                    Làm thử <span className="ml-1">→</span>
                  </Link>
                </div>
                {/* Subtle hover overlay to match the original feel */}
                <Link to={`/quiz/${quiz.id}`} className="absolute inset-0 z-10" aria-label={`Làm thử ${quiz.title}`}></Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/50 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Miễn phí làm bài</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Trả lời hết câu hỏi mà không mất đồng nào.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">10.000đ mở kết quả</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Quét mã QR ngân hàng, mở khoá tự động trong vài giây.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Phân tích chi tiết</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Điểm mạnh, điểm yếu, biểu đồ và lời khuyên riêng cho bạn.
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center mt-12 text-slate-400 text-sm">
          Kết quả mang tính tham khảo, giúp bạn hiểu bản thân rõ hơn.
        </div>
      </div>
    </div>
  );
}
