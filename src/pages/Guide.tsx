import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, BrainCircuit, Users, Gem } from 'lucide-react';

export default function Guide() {
  const steps = [
    {
      icon: Compass,
      color: 'teal',
      title: 'Bước 1: Sở thích nghề nghiệp (RIASEC)',
      description: 'Khám phá xem bạn thực sự HỨNG THÚ với loại công việc nào. Một công việc mang lại sự hứng thú sẽ giúp bạn làm việc không biết mệt mỏi.',
      why: 'Đây là màng lọc đầu tiên và rộng nhất. Giúp thu hẹp từ hàng ngàn công việc xuống những lĩnh vực bạn muốn gắn bó lâu dài.'
    },
    {
      icon: BrainCircuit,
      color: 'indigo',
      title: 'Bước 2: Đánh giá năng lực (Ability)',
      description: 'Kiểm tra khả năng tư duy logic, xử lý số liệu, không gian. Sở thích phải đi đôi với năng lực thực thi.',
      why: 'Màng lọc thứ hai. Giúp loại bỏ những công việc bạn thích nhưng lại không phải là thế mạnh bẩm sinh của bạn, tránh sự thất vọng khi đi làm thực tế.'
    },
    {
      icon: Users,
      color: 'rose',
      title: 'Bước 3: Tính cách làm việc (Big Five)',
      description: 'Phân tích cách bạn phản ứng với áp lực, làm việc nhóm và tổ chức công việc.',
      why: 'Màng lọc thứ ba. Ví dụ: Bạn thích ngành Marketing (Bước 1) và có tư duy tốt (Bước 2), nhưng bạn lại rất hướng nội và dễ stress (Bước 3). Bạn sẽ hợp với vai trò Copywriter hơn là Event Manager.'
    },
    {
      icon: Gem,
      color: 'amber',
      title: 'Bước 4: Giá trị công việc (Work Values)',
      description: 'Tìm ra điều kiện môi trường làm bạn hạnh phúc (Tiền bạc, Quyền lực, Cân bằng cuộc sống, v.v.).',
      why: 'Màng lọc cuối cùng. Dù bạn giỏi và thích công việc đó, nhưng nếu môi trường không đáp ứng được giá trị cốt lõi của bạn, bạn sẽ sớm nghỉ việc.'
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
            Triết lý <span className="text-teal-600">Core Engine</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tại sao chúng tôi không chỉ cho bạn 1 bài test duy nhất? Sự nghiệp là một phương trình phức tạp, và để giải được nó, bạn cần đi qua 4 màng lọc chuẩn khoa học.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-200 via-indigo-200 to-amber-200 rounded-full hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12"
                >
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex-shrink-0 flex items-center justify-center bg-white shadow-lg border-4 border-white text-${step.color}-500 z-10`}>
                    <Icon className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex-grow relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-${step.color}-500 transition-all duration-300 group-hover:w-full group-hover:opacity-5`}></div>
                    <h3 className={`text-2xl font-bold text-slate-800 mb-3`}>{step.title}</h3>
                    <p className="text-slate-600 mb-4">{step.description}</p>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm font-medium text-slate-700">
                        <span className={`text-${step.color}-600 font-bold mr-2`}>Vì sao cần thiết?</span> 
                        {step.why}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">Câu hỏi thường gặp</h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <h4 className="text-xl font-bold text-teal-400 mb-2">Tôi làm bài test theo thứ tự khác có được không?</h4>
              <p className="text-slate-300">
                Hoàn toàn được! Bạn có thể làm từng bài riêng lẻ vào bất kỳ lúc nào. Tuy nhiên, việc đi theo đúng trình tự sẽ giúp bạn có cái nhìn logic hơn: bạn bắt đầu từ việc mình muốn gì (Sở thích), đến việc mình làm được gì (Năng lực), cách mình làm việc (Tính cách), và cuối cùng là môi trường mình phù hợp (Giá trị).
              </p>
            </div>
            
            <div className="w-full h-px bg-slate-700"></div>

            <div>
              <h4 className="text-xl font-bold text-orange-400 mb-2">Tại sao không gộp vào 1 bài test cho nhanh?</h4>
              <p className="text-slate-300">
                Bởi vì con người quá phức tạp để định nghĩa chỉ qua vài chục câu hỏi. Việc chia tách giúp thuật toán của chúng tôi phân tích chéo chính xác hơn, không bị thiên vị bởi một yếu tố đơn lẻ nào. Khi bạn hoàn thành đủ 4 bài, hệ thống sẽ tự động tổng hợp kết quả tại trang Dashboard (Lịch sử).
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/"
              className="inline-block bg-white text-slate-800 font-bold py-4 px-8 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Bắt đầu Hành trình ngay
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
