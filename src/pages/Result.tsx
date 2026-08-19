import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Share2, Award, ArrowRight, Sparkles } from 'lucide-react';
import { quizzes } from '../data/quizzes';
import { mbtiResults } from '../data/mbtiResults';

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const answers = location.state?.answers || {};
  const paid = location.state?.paid || false;
  const quiz = quizzes.find((q) => q.id === id);

  if (!paid) {
    return <Navigate to={`/checkout/${id}`} state={{ answers }} replace />;
  }

  if (!quiz) return <div>Quiz không tồn tại</div>;

  // Simple logic to determine result: find the most frequent value for normal quizzes
  const counts: Record<string, number> = {};
  Object.values(answers).forEach((val) => {
    counts[val as string] = (counts[val as string] || 0) + 1;
  });

  let resultTitle = '';
  let resultDescription = '';
  let resultStrengths: string[] = [];
  let resultWeaknesses: string[] = [];

  if (id === 'mbti') {
    let axes: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

    if (quiz?.type === 'likert') {
      Object.entries(answers).forEach(([qId, val]) => {
        const question = quiz.questions.find(q => q.id === parseInt(qId)) as any;
        if (question && typeof val === 'number') {
           axes[question.dimension] += (val * question.direction);
        }
      });
    }

    let finalMBTI = '';
    finalMBTI += (axes.EI >= 0) ? 'E' : 'I';
    finalMBTI += (axes.SN >= 0) ? 'S' : 'N';
    finalMBTI += (axes.TF >= 0) ? 'T' : 'F';
    finalMBTI += (axes.JP >= 0) ? 'J' : 'P';

    const mbtiData = mbtiResults[finalMBTI] || mbtiResults['INTJ'];
    resultTitle = `${finalMBTI} - ${mbtiData.name}`;
    resultDescription = mbtiData.description;
    resultStrengths = mbtiData.strengths;
    resultWeaknesses = mbtiData.weaknesses;
  } else {
    let maxVal = '';
    let maxCount = -1;
    Object.entries(counts).forEach(([val, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxVal = val;
      }
    });

    resultTitle = {
      riasec: `Nhóm nghề: ${maxVal || 'Linh hoạt'}`,
      disc: `Phong cách: ${maxVal || 'Thích ứng'}`,
      enneagram: `Động lực chính: Loại ${maxVal || 'Trung bình'}`,
      mi: `Trí thông minh: ${maxVal || 'Đa dạng'}`
    }[id as string] || 'Kết quả của bạn';

    resultDescription = "Dựa trên các câu trả lời của bạn, chúng tôi nhận thấy bạn là một người có tư duy độc lập và khả năng thích ứng cao. Bạn thường có xu hướng phân tích vấn đề một cách thấu đáo trước khi đưa ra quyết định. Tuy nhiên, trong những tình huống đòi hỏi sự sáng tạo, bạn cũng thể hiện được sự linh hoạt đáng kinh ngạc.";
  }

  const upsellQuiz = quiz.upsellQuizId ? quizzes.find(q => q.id === quiz.upsellQuizId) : null;

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="max-w-3xl w-full bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-center relative z-10"
      >
        <div className="mx-auto w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Award className="w-10 h-10 text-teal-500" />
        </div>
        
        <h2 className="text-xl md:text-2xl text-slate-500 font-medium mb-2">{quiz.title}</h2>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-800">
          {resultTitle}
        </h1>

        <div className="bg-[#f8f7f5] rounded-2xl p-6 md:p-8 mb-8 text-left border border-[#e6e2d6]">
          <h3 className="text-2xl font-bold mb-4 text-slate-800">Phân tích chi tiết:</h3>
          <p className="text-slate-600 leading-relaxed text-lg mb-6 whitespace-pre-line">
            {resultDescription}
          </p>
          
          {id === 'mbti' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center">
                  <span className="mr-2">✨</span> Điểm mạnh
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {resultStrengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                <h4 className="font-bold text-red-700 mb-2 flex items-center">
                  <span className="mr-2">⚡</span> Điểm yếu
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {resultWeaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Upsell Ecosystem Block */}
        {upsellQuiz && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-6 md:p-8 mb-10 text-left border border-teal-100 shadow-inner relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-32 h-32 text-teal-600" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white text-orange-600 font-bold text-xs rounded-full mb-4 shadow-sm border border-orange-100 uppercase tracking-wider">
                Bước tiếp theo
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                Để bức tranh tính cách của bạn hoàn thiện 100%...
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                {quiz.upsellMessage}
              </p>
              
              <Link 
                to={`/quiz/${upsellQuiz.id}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-white lovable-gradient-btn shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
              >
                Tiếp tục khám phá {upsellQuiz.title}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="py-4 px-8 rounded-full font-bold text-white lovable-gradient-btn shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <Share2 className="w-5 h-5 mr-2" />
            Chia sẻ kết quả
          </button>
          <Link to="/" className="py-4 px-8 rounded-full font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
