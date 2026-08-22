import { mbtiResults } from '../data/mbtiResults';
import { mbtiQuestions } from '../data/mbtiQuestions';
import { riasecQuestions } from '../data/riasecQuestions';

const riasecCareers: Record<string, { role: string, desc: string }[]> = {
  R: [
    { role: 'Kỹ sư Cơ điện / Chế tạo', desc: 'Làm việc trực tiếp với máy móc, công cụ và các quy trình kỹ thuật.' },
    { role: 'Kiến trúc sư hệ thống mạng', desc: 'Thích hợp với người thích xây dựng và bảo trì hạ tầng thực tế.' }
  ],
  I: [
    { role: 'Nhà phân tích Dữ liệu (Data Analyst)', desc: 'Nghiên cứu, tìm tòi và giải quyết các bài toán logic phức tạp.' },
    { role: 'Bác sĩ / Nhà nghiên cứu Khoa học', desc: 'Đam mê khám phá nguyên nhân và quy luật của sự vật.' }
  ],
  A: [
    { role: 'Giám đốc Sáng tạo (Creative Director)', desc: 'Tự do thể hiện ý tưởng độc đáo, thiết kế và nghệ thuật.' },
    { role: 'Chuyên gia UX/UI', desc: 'Kết hợp giữa cái đẹp và trải nghiệm người dùng.' }
  ],
  S: [
    { role: 'Chuyên gia Nhân sự (HR) / Đào tạo', desc: 'Gắn kết con người, lắng nghe và giúp đỡ người khác phát triển.' },
    { role: 'Giáo viên / Giảng viên', desc: 'Truyền đạt kiến thức và hỗ trợ cộng đồng.' }
  ],
  E: [
    { role: 'Giám đốc Điều hành (CEO) / Khởi nghiệp', desc: 'Khả năng lãnh đạo, thuyết phục và ra quyết định chiến lược.' },
    { role: 'Giám đốc Marketing / Sales', desc: 'Môi trường cạnh tranh, đàm phán và tạo ra lợi nhuận.' }
  ],
  C: [
    { role: 'Kế toán trưởng / Kiểm toán viên', desc: 'Làm việc với các con số, đòi hỏi tính chính xác và nguyên tắc cao.' },
    { role: 'Chuyên viên Phân tích Rủi ro', desc: 'Tuân thủ quy trình, đảm bảo hệ thống vận hành trơn tru không sai sót.' }
  ]
};

const riasecDescriptions: Record<string, string> = {
  R: 'Thực tế (Realistic): Thích hành động, làm việc với công cụ, máy móc.',
  I: 'Nghiên cứu (Investigative): Thích suy nghĩ, phân tích, tìm tòi logic.',
  A: 'Nghệ thuật (Artistic): Thích sáng tạo, tự do, biểu đạt cá nhân.',
  S: 'Xã hội (Social): Thích giúp đỡ, giao tiếp, truyền cảm hứng cho người khác.',
  E: 'Quản lý (Enterprising): Thích lãnh đạo, thuyết phục, cạnh tranh kinh doanh.',
  C: 'Nghiệp vụ (Conventional): Thích sự nguyên tắc, tổ chức, làm việc với dữ liệu chi tiết.'
};

export interface CareerMatchResult {
  topCareers: {
    name: string;
    score: number;
    description: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  personalityTraits: string[];
}

export function calculateCareerMatch(
  quizId: string, 
  answers: Record<string, string>
): CareerMatchResult {
  // Logic tính toán dựa trên loại bài test. 
  // Trong thực tế, hàm này sẽ phức tạp hơn và có thể xử lý tổng hợp nhiều bài test.
  
  if (quizId === 'riasec' && Object.keys(answers).length > 0) {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    Object.entries(answers).forEach(([qId, valStr]) => {
      const val = parseInt(valStr);
      if (isNaN(val)) return;
      const question = riasecQuestions.find(q => q.id === qId);
      if (question) {
        scores[question.dimension] += val;
      }
    });

    // Sắp xếp điểm số từ cao xuống thấp
    const sortedDimensions = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top1 = sortedDimensions[0][0];
    const top2 = sortedDimensions[1][0];
    const top3 = sortedDimensions[2][0];
    
    const hollandCode = `${top1}${top2}${top3}`;

    const topCareers = [
      { name: riasecCareers[top1][0].role, score: 95, description: `Phù hợp với nhóm ${top1} (Điểm cao nhất của bạn).\n${riasecCareers[top1][0].desc}` },
      { name: riasecCareers[top2][0].role, score: 88, description: `Phù hợp với nhóm ${top2}.\n${riasecCareers[top2][0].desc}` },
      { name: riasecCareers[top3][1].role, score: 82, description: `Phù hợp với nhóm ${top3}.\n${riasecCareers[top3][1].desc}` }
    ];

    return {
      topCareers,
      strengths: [riasecDescriptions[top1], riasecDescriptions[top2]],
      weaknesses: [],
      personalityTraits: [`Mã Holland của bạn là: ${hollandCode}`]
    };
  }

  if (quizId === 'mbti') {
    let axes: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    Object.entries(answers).forEach(([qId, valStr]) => {
      const val = parseInt(valStr);
      if (isNaN(val)) return;
      const question = mbtiQuestions.find(q => q.id.toString() === qId);
      if (question) {
        // 5: +2, 4: +1, 3: 0, 2: -1, 1: -2
        const score = (val - 3) * question.direction;
        axes[question.dimension] += score;
      }
    });

    let finalMBTI = '';
    finalMBTI += (axes.EI >= 0) ? 'E' : 'I';
    finalMBTI += (axes.SN >= 0) ? 'S' : 'N';
    finalMBTI += (axes.TF >= 0) ? 'T' : 'F';
    finalMBTI += (axes.JP >= 0) ? 'J' : 'P';

    const mbtiData = mbtiResults[finalMBTI] || mbtiResults['INTJ'];
    
    return {
      topCareers: [
        { name: `${finalMBTI} - ${mbtiData.name}`, score: 100, description: mbtiData.description }
      ],
      strengths: mbtiData.strengths,
      weaknesses: mbtiData.weaknesses,
      personalityTraits: []
    };
  }

  // Default mock result
  return {
    topCareers: [
      { name: 'Nghề nghiệp A', score: 85, description: 'Mô tả phù hợp...' },
      { name: 'Nghề nghiệp B', score: 75, description: 'Mô tả phù hợp...' }
    ],
    strengths: ['Điểm mạnh 1', 'Điểm mạnh 2'],
    weaknesses: ['Điểm yếu 1'],
    personalityTraits: ['Đặc điểm 1']
  };
}
