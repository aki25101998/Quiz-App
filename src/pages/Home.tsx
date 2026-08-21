import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QUIZ_DATA } from '../data/quizData';

export default function Home() {
  const coreQuizzes = [
    QUIZ_DATA['riasec'],
    QUIZ_DATA['ability'],
    QUIZ_DATA['big-five'],
    QUIZ_DATA['work-values']
  ];

  const funQuizzes = [
    QUIZ_DATA['mbti']
  ];

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
            <span className="mr-2">✦</span> Hành trình định hướng nghề nghiệp chuẩn khoa học
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight"
          >
            Sự nghiệp của bạn, <span className="lovable-gradient-text">thiết kế</span> bởi dữ liệu
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Làm bài hoàn toàn miễn phí. Khám phá toàn diện sở thích, năng lực, tính cách và giá trị cốt lõi của bạn để tìm ra con đường sự nghiệp tối ưu nhất.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/quiz/riasec"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white lovable-gradient-btn rounded-full shadow-lg shadow-teal-500/20"
            >
              Bắt đầu Hành Trình <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </div>

        {/* CORE ENGINE SECTION */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
            <span className="text-teal-500 mr-2">●</span> Core Engine: Hành trình Khám phá Nghề nghiệp
          </h2>
          <p className="text-slate-500 mb-6">4 bài đánh giá thiết yếu giúp tìm ra công việc phù hợp với bản chất thật của bạn.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {coreQuizzes.map((quiz, index) => {
              if (!quiz) return null;
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-teal-100/50 flex flex-col group relative overflow-hidden"
                >
                  <div className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-wide">
                    Bước {index + 1}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h3>
                  <p className="text-slate-500 flex-grow mb-8 text-sm md:text-base">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <Link 
                      to={`/quiz/${quiz.id}`}
                      className="text-teal-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center"
                    >
                      Làm bài <span className="ml-1">→</span>
                    </Link>
                  </div>
                  <Link to={`/quiz/${quiz.id}`} className="absolute inset-0 z-10" aria-label={`Làm bài ${quiz.title}`}></Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FUN TESTS SECTION */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
            <span className="text-orange-500 mr-2">🎭</span> Khám phá tính cách (Giải trí)
          </h2>
          <p className="text-slate-500 mb-6">Những bài test vui nhộn để hiểu thêm về bản thân và chia sẻ cùng bạn bè.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {funQuizzes.map((quiz, index) => {
              if (!quiz) return null;
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-orange-100/50 flex flex-col group relative overflow-hidden"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{quiz.title}</h3>
                  <p className="text-slate-500 flex-grow mb-8 text-sm md:text-base">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <Link 
                      to={`/quiz/${quiz.id}`}
                      className="text-orange-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center"
                    >
                      Chơi ngay <span className="ml-1">→</span>
                    </Link>
                  </div>
                  <Link to={`/quiz/${quiz.id}`} className="absolute inset-0 z-10" aria-label={`Chơi ngay ${quiz.title}`}></Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
