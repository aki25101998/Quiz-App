import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, BrainCircuit, Users, Gem, Sparkles } from 'lucide-react';
import { QUIZ_DATA } from '../data/quizData';

export default function Home() {
  const coreQuizzes = [
    { ...QUIZ_DATA['riasec'], icon: Compass, color: 'teal' },
    { ...QUIZ_DATA['ability'], icon: BrainCircuit, color: 'indigo' },
    { ...QUIZ_DATA['big-five'], icon: Users, color: 'rose' },
    { ...QUIZ_DATA['work-values'], icon: Gem, color: 'amber' }
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
              if (!quiz.id) return null;
              
              const Icon = quiz.icon;
              const colorVariants: Record<string, string> = {
                teal: 'from-teal-50 to-white/70 border-teal-100/60 hover:border-teal-300 text-teal-600',
                indigo: 'from-indigo-50 to-white/70 border-indigo-100/60 hover:border-indigo-300 text-indigo-600',
                rose: 'from-rose-50 to-white/70 border-rose-100/60 hover:border-rose-300 text-rose-600',
                amber: 'from-amber-50 to-white/70 border-amber-100/60 hover:border-amber-300 text-amber-600'
              };
              
              const bgClass = colorVariants[quiz.color] || colorVariants.teal;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border flex flex-col group relative overflow-hidden ${bgClass.split(' text-')[0]}`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-32 h-32" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm text-${quiz.color}-500`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/60 shadow-sm ${bgClass.match(/text-\w+-600/)?.[0]}`}>
                      Bước {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{quiz.title}</h3>
                  <p className="text-slate-600 flex-grow mb-6 text-sm md:text-base leading-relaxed">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold bg-white/60 shadow-sm border border-white/40 ${bgClass.match(/text-\w+-600/)?.[0]}`}>
                        {quiz.questions.length} câu hỏi
                      </span>
                      <span className="text-slate-400 text-xs">
                        ~ {Math.ceil(quiz.questions.length * 0.3)} phút
                      </span>
                    </div>
                    <Link 
                      to={`/quiz/${quiz.id}`}
                      className={`font-bold text-sm group-hover:translate-x-2 transition-transform flex items-center ${bgClass.match(/text-\w+-600/)?.[0]}`}
                    >
                      Bắt đầu <span className="ml-1 md:ml-2">→</span>
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
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-br from-orange-50 to-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-orange-100/60 flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-24 h-24 text-orange-500" />
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm text-orange-500 mb-4">
                    <span className="text-2xl">🎭</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{quiz.title}</h3>
                  <p className="text-slate-600 flex-grow mb-6 text-sm md:text-base leading-relaxed">{quiz.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/60 shadow-sm border border-white/40 text-orange-600">
                        {quiz.questions.length} câu hỏi
                      </span>
                      <span className="text-slate-400 text-xs">
                        ~ {Math.ceil(quiz.questions.length * 0.2)} phút
                      </span>
                    </div>
                    <Link 
                      to={`/quiz/${quiz.id}`}
                      className="font-bold text-orange-600 text-sm group-hover:translate-x-2 transition-transform flex items-center"
                    >
                      Chơi ngay <span className="ml-1 md:ml-2">→</span>
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
