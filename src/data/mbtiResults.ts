export type MBTIResult = {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
};

export const mbtiResults: Record<string, MBTIResult> = {
  INTJ: {
    id: "INTJ",
    name: "Nhà Khoa Học (Architect)",
    description: "Bạn là một trong những kiểu tính cách hiếm nhất và có năng lực chiến lược xuất sắc nhất. INTJ mang trong mình sự kết hợp độc đáo giữa trí tưởng tượng bay bổng và sự quyết đoán logic. Bạn không bao giờ chấp nhận vạn vật ở vẻ bề ngoài mà luôn đặt câu hỏi 'Tại sao?'. Bạn sống trong một thế giới của các ý tưởng và kế hoạch, coi cuộc đời như một bàn cờ khổng lồ cần được giải mã.\n\nTrong công việc, bạn hướng tới sự hoàn hảo và hiệu suất tối đa. Bạn không thích làm việc với những người thiếu năng lực hoặc bị gò bó bởi các quy tắc cứng nhắc thiếu tính logic. Tuy nhiên, trong các mối quan hệ, bạn đôi khi bị đánh giá là lạnh lùng và khó gần vì bạn ưu tiên sự thật hơn là cảm xúc.",
    strengths: [
      "Tư duy chiến lược và phân tích vấn đề sắc bén",
      "Khả năng làm việc độc lập với sự tự tin cao",
      "Quyết tâm mãnh liệt và không bao giờ bỏ cuộc",
      "Cởi mở với các ý tưởng mới nếu chúng có tính logic",
      "Làm việc cực kỳ năng suất và tối ưu hóa hệ thống tốt"
    ],
    weaknesses: [
      "Quá cầu toàn và đôi khi đòi hỏi sự hoàn hảo phi lý",
      "Hay phán xét những người thiếu năng lực",
      "Thiếu sự nhạy cảm và tinh tế trong các tình huống cảm xúc",
      "Khó khăn trong việc mở lòng và kết bạn mới",
      "Đôi khi kiêu ngạo vì quá tự tin vào trí tuệ của bản thân"
    ]
  },
  INTP: {
    id: "INTP",
    name: "Nhà Tư Duy (Logician)",
    description: "Bạn là hiện thân của sự tò mò trí tuệ vô tận. Đối với INTP, thế giới này là một hệ thống phức tạp chứa đầy những mảnh ghép đang chờ được lắp ráp. Bạn không quan tâm đến những điều tầm thường hằng ngày mà luôn đắm chìm trong những giả thuyết, các lý thuyết khoa học hoặc những ý tưởng táo bạo.\n\nBạn rất linh hoạt, sáng tạo và có khả năng phát hiện ra những điểm bất hợp lý mà người khác dễ bỏ qua. Dù vậy, bạn thường gặp khó khăn trong việc biến ý tưởng thành hành động thực tế vì tâm trí bạn luôn bận rộn nhảy sang một ý tưởng mới thú vị hơn. Trong giao tiếp, bạn thích sự thật thà tuyệt đối và ghét những màn dạo đầu (small talk) sáo rỗng.",
    strengths: [
      "Óc phân tích sắc sảo và khả năng tư duy trừu tượng tuyệt vời",
      "Trí tưởng tượng phong phú và tư duy vô cùng sáng tạo",
      "Cởi mở, linh hoạt và không thích sự gò bó",
      "Luôn tìm kiếm sự thật và tính khách quan",
      "Nhiệt huyết với những chủ đề mà bạn thực sự quan tâm"
    ],
    weaknesses: [
      "Dễ bị phân tâm và thường hay bỏ dở các dự án",
      "Thường gặp khó khăn trong việc tuân thủ các quy tắc xã hội",
      "Có xu hướng xa lánh mọi người và tự nhốt mình trong thế giới riêng",
      "Hay do dự vì nhìn thấy quá nhiều mặt của một vấn đề",
      "Thiếu sự thấu cảm với cảm xúc của người xung quanh"
    ]
  },
  ENTJ: {
    id: "ENTJ",
    name: "Người Chỉ Huy (Commander)",
    description: "Bạn sinh ra để làm người dẫn đường. ENTJ là những nhà lãnh đạo bẩm sinh với sức hút mạnh mẽ, sự tự tin và tham vọng ngút ngàn. Bạn có khả năng nhìn nhận ra các lỗ hổng trong bất kỳ hệ thống nào và ngay lập tức nghĩ ra giải pháp tối ưu. Đối với bạn, không có mục tiêu nào là quá lớn nếu bạn có đủ thời gian và nguồn lực.\n\nTrong môi trường làm việc, bạn được kính trọng vì sự quyết đoán và khả năng truyền cảm hứng. Bạn đánh giá cao hiệu suất, năng lực và không ngần ngại 'chỉ điểm' những người làm việc thiếu hiệu quả. Dù bạn có thể bị coi là lạnh lùng hay tàn nhẫn trong một số tình huống, nhưng tận sâu bên trong, mục tiêu của bạn luôn là sự thành công chung của cả tập thể.",
    strengths: [
      "Năng lực lãnh đạo bẩm sinh và sức hút mạnh mẽ",
      "Cực kỳ hiệu quả, tổ chức tốt và quyết đoán",
      "Tự tin cao độ và ý chí kiên cường không lùi bước",
      "Tư duy chiến lược xuất sắc, luôn nhìn được bức tranh tổng thể",
      "Khả năng phát hiện và tối ưu hóa các quy trình lỗi"
    ],
    weaknesses: [
      "Có thể trở nên độc đoán, bướng bỉnh và áp đặt",
      "Thiếu kiên nhẫn với những sai sót hoặc người chậm chạp",
      "Thường bỏ qua hoặc đánh giá thấp cảm xúc của người khác",
      "Có xu hướng xem nhẹ những quan điểm không dựa trên logic",
      "Dễ trở nên tàn nhẫn khi muốn đạt được mục tiêu bằng mọi giá"
    ]
  },
  ENTP: {
    id: "ENTP",
    name: "Người Tranh Luận (Debater)",
    description: "Bạn là một 'vị luật sư của quỷ' chính hiệu. Không có gì kích thích ENTP hơn việc phá vỡ các luận điểm cũ, lật lại vấn đề và đưa ra những góc nhìn hoàn toàn mới. Bạn thông minh, sắc bén và có khiếu hài hước độc đáo. Tư duy nhanh nhẹn giúp bạn dễ dàng làm chủ mọi cuộc hội thoại.\n\nBạn là người khởi xướng các ý tưởng xuất chúng, nhưng thường cảm thấy nhàm chán khi phải thực thi các chi tiết nhỏ nhặt. Bạn thích những thử thách mới lạ, không ngại rủi ro và luôn tìm cách vượt qua mọi giới hạn. Trong các mối quan hệ, bạn cần những người có thể bắt kịp tốc độ tư duy và sẵn sàng tranh luận một cách văn minh với bạn.",
    strengths: [
      "Nhanh trí, sắc bén và có vốn kiến thức phong phú",
      "Tư duy cực kỳ sáng tạo, không bị trói buộc bởi truyền thống",
      "Khả năng giao tiếp tuyệt vời và rất có sức hút",
      "Luôn dồi dào năng lượng khi được làm việc với các ý tưởng mới",
      "Dễ dàng thích nghi với mọi sự thay đổi"
    ],
    weaknesses: [
      "Rất hay tranh cãi, thậm chí ở những vấn đề không cần thiết",
      "Kém trong việc tập trung vào các chi tiết thực thi (execution)",
      "Nhanh chóng cảm thấy nhàm chán và bỏ dở công việc",
      "Đôi khi quá vô tâm và vô tình làm tổn thương người khác",
      "Không thích các công việc mang tính lặp đi lặp lại"
    ]
  },
  INFJ: {
    id: "INFJ",
    name: "Người Cố Vấn (Advocate)",
    description: "Dù là nhóm tính cách hiếm nhất thế giới (chỉ chiếm khoảng 1-2%), INFJ luôn để lại những dấu ấn sâu sắc. Bạn sở hữu một trực giác đáng kinh ngạc, có khả năng nhìn thấu tâm can của người khác nhưng vẫn giữ được sự ấm áp và trắc ẩn. Không giống như những người mơ mộng thông thường, bạn có khả năng lên kế hoạch cụ thể để biến lý tưởng của mình thành hiện thực.\n\nBạn là một người lắng nghe tuyệt vời, thường trở thành nơi trút bầu tâm sự của bạn bè. Tuy nhiên, bạn cũng cực kỳ kín tiếng về thế giới nội tâm của mình và cần nhiều không gian riêng tư để sạc lại năng lượng. Bạn sống một cuộc đời sâu sắc, luôn tìm kiếm những giá trị chân thực và ý nghĩa cốt lõi của sự tồn tại.",
    strengths: [
      "Trực giác nhạy bén, dễ dàng thấu hiểu người khác",
      "Sáng tạo và giàu trí tưởng tượng nhưng vẫn rất thực tế",
      "Đam mê và kiên định với các giá trị đạo đức",
      "Khả năng truyền cảm hứng và thuyết phục người khác nhẹ nhàng",
      "Luôn tìm kiếm sự hòa hợp và muốn làm thế giới tốt đẹp hơn"
    ],
    weaknesses: [
      "Cực kỳ nhạy cảm với những lời chỉ trích",
      "Dễ bị kiệt sức (burnout) vì luôn nhận lấy nỗi đau của người khác",
      "Quá cầu toàn, luôn thấy mọi thứ chưa đủ tốt",
      "Rất khó mở lòng và giữ khoảng cách nhất định với xung quanh",
      "Có xu hướng né tránh xung đột ngay cả khi cần thiết"
    ]
  },
  INFP: {
    id: "INFP",
    name: "Người Hòa Giải (Mediator)",
    description: "Bạn là một nhà thơ, một kẻ mộng mơ với trái tim nhân hậu. INFP nhìn nhận thế giới qua một lăng kính ngập tràn hy vọng và lý tưởng. Bề ngoài, bạn có thể tĩnh lặng, nhút nhát và dè dặt, nhưng bên trong lại là một ngọn lửa đam mê mãnh liệt. Bạn luôn khao khát tìm ra ý nghĩa thực sự của cuộc sống và đóng góp một điều gì đó tốt đẹp cho nhân loại.\n\nBạn ghét sự giả tạo và luôn sống thật với giá trị cốt lõi của mình. Trong công việc, bạn không bị thúc đẩy bởi tiền bạc hay danh vọng, mà là bởi cảm giác được cống hiến cho một mục đích cao cả. Mặc dù rất bao dung và linh hoạt, bạn sẽ phản ứng cực kỳ mạnh mẽ nếu các giá trị đạo đức của bạn bị xâm phạm.",
    strengths: [
      "Trái tim đầy tình yêu thương và sự thấu cảm sâu sắc",
      "Giàu trí tưởng tượng, có năng khiếu nghệ thuật và ngôn từ",
      "Tư duy cởi mở, bao dung và tôn trọng sự khác biệt",
      "Luôn trung thành với các giá trị đạo đức và niềm tin cá nhân",
      "Khát khao cống hiến vì một mục đích cao cả"
    ],
    weaknesses: [
      "Quá mơ mộng và dễ bị tổn thương khi đối diện với thực tế phũ phàng",
      "Thiếu tính tổ chức và thường gặp khó khăn với các deadline",
      "Hay tự trách bản thân khi mọi việc không như ý muốn",
      "Dễ bị chìm đắm trong cảm xúc tiêu cực",
      "Khó khăn trong việc xử lý dữ liệu khô khan và số liệu logic"
    ]
  },
  ENFJ: {
    id: "ENFJ",
    name: "Nhân Vật Chính (Protagonist)",
    description: "Bạn sinh ra để tỏa sáng và truyền cảm hứng. ENFJ là những người ấm áp, chân thành và có sức hút tự nhiên khiến người khác luôn muốn ở gần. Bạn thực sự quan tâm đến sự phát triển của mọi người xung quanh và sẵn sàng dành nhiều thời gian, công sức để giúp họ khai phá tiềm năng.\n\nTrong các tập thể, bạn thường là người gắn kết mọi người, giải quyết các mâu thuẫn và định hướng nhóm đi tới mục tiêu chung. Tuy nhiên, sự quan tâm thái quá đôi khi khiến bạn ôm đồm quá nhiều rắc rối của người khác vào mình. Bạn cần học cách đặt ra ranh giới để không tự vắt kiệt năng lượng của bản thân.",
    strengths: [
      "Kỹ năng giao tiếp và thuyết phục vô cùng xuất sắc",
      "Khả năng lãnh đạo bẩm sinh, biết cách truyền cảm hứng",
      "Sự thấu cảm cao độ, luôn nhận ra cảm xúc của người xung quanh",
      "Đáng tin cậy, trung thành và tận tụy với các mối quan hệ",
      "Luôn tỏa ra năng lượng tích cực và ấm áp"
    ],
    weaknesses: [
      "Dễ bị tổn thương nếu không nhận được sự công nhận xứng đáng",
      "Có xu hướng hi sinh bản thân quá mức vì người khác",
      "Thường gặp khó khăn trong việc đưa ra các quyết định lý trí phũ phàng",
      "Lòng tự trọng phụ thuộc nhiều vào việc người khác nghĩ gì về mình",
      "Hay suy nghĩ thái quá (overthink) về những lời nhận xét"
    ]
  },
  ENFP: {
    id: "ENFP",
    name: "Người Truyền Cảm Hứng (Campaigner)",
    description: "Bạn là một luồng gió tự do, ngập tràn sức sống và sự nhiệt huyết. Đối với ENFP, cuộc sống là một cuộc phiêu lưu vĩ đại chứa đựng vô vàn kết nối bí ẩn. Bạn có thể hòa nhập vào bất kỳ đám đông nào nhờ tính cách hòa đồng, quyến rũ và nụ cười luôn rạng rỡ trên môi.\n\nBạn là người khởi tạo các phong trào, luôn có những ý tưởng điên rồ và thú vị. Dù vậy, bạn thường đánh mất sự hứng thú khi phải bắt tay vào xử lý các chi tiết tỉ mỉ hay các công việc hành chính khô khan. Cảm xúc của bạn vô cùng mãnh liệt, bạn trải nghiệm niềm vui sâu sắc nhưng cũng có thể rơi vào nỗi buồn một cách nhanh chóng khi cảm thấy mất tự do.",
    strengths: [
      "Trí tưởng tượng cực kỳ phong phú và không giới hạn",
      "Rất thân thiện, nhiệt tình và được nhiều người yêu mến",
      "Tư duy linh hoạt, luôn tìm thấy các khả năng mới",
      "Khả năng giao tiếp và kể chuyện (storytelling) xuất sắc",
      "Luôn tò mò và khao khát học hỏi những điều mới mẻ"
    ],
    weaknesses: [
      "Dễ dàng mất tập trung và nhảy từ dự án này sang dự án khác",
      "Thiếu tính kỷ luật và kỹ năng quản lý thời gian kém",
      "Dễ bị stress khi phải làm việc trong môi trường quá gò bó",
      "Hay suy diễn và overthink về ý định của người khác",
      "Có thể quá bốc đồng trong các quyết định quan trọng"
    ]
  },
  ISTJ: {
    id: "ISTJ",
    name: "Người Trách Nhiệm (Logistician)",
    description: "Bạn là trụ cột của bất kỳ tổ chức hay gia đình nào. ISTJ chiếm một phần lớn trong dân số, nổi bật với sự thực tế, tính logic và tinh thần trách nhiệm không thể lay chuyển. Bạn làm việc dựa trên dữ kiện, số liệu và các quy tắc đã được kiểm chứng thay vì những phỏng đoán mông lung.\n\nBạn giữ lời hứa bằng mọi giá. Khi đã nhận việc, bạn sẽ hoàn thành nó một cách tận tụy nhất dù có phải hi sinh thời gian cá nhân. Tuy nhiên, sự kỷ luật thép này đôi khi khiến bạn trở nên cứng nhắc và bảo thủ. Bạn cần một môi trường rõ ràng, minh bạch, nơi sự cống hiến của bạn được tôn trọng đúng mực.",
    strengths: [
      "Sự tận tụy, trung thực và tinh thần trách nhiệm tuyệt đối",
      "Kỹ năng tổ chức, sắp xếp công việc cực kỳ ngăn nắp",
      "Luôn giữ bình tĩnh, thực tế và có tư duy logic sắc bén",
      "Làm việc bền bỉ và không bao giờ bỏ cuộc giữa chừng",
      "Tôn trọng truyền thống, luật lệ và sự ổn định"
    ],
    weaknesses: [
      "Khá bảo thủ và rất khó chấp nhận sự thay đổi",
      "Đôi khi cứng nhắc, thiếu sự linh hoạt trong các tình huống bất ngờ",
      "Gặp khó khăn lớn trong việc bày tỏ hoặc thấu hiểu cảm xúc",
      "Hay phán xét những người có lối sống bốc đồng hoặc thiếu tổ chức",
      "Có xu hướng tự ôm đồm mọi việc vì không tin tưởng người khác"
    ]
  },
  ISFJ: {
    id: "ISFJ",
    name: "Người Bảo Vệ (Defender)",
    description: "Bạn là một người hùng thầm lặng. Dù mang chữ I (Hướng nội), bạn lại có kỹ năng xã hội tuyệt vời và các mối quan hệ sâu sắc. ISFJ là những người ấm áp, chu đáo và luôn đặt hạnh phúc của người thân lên trên lợi ích cá nhân. Trí nhớ của bạn rất đáng nể, đặc biệt là trong việc nhớ sinh nhật, sở thích hay những chi tiết nhỏ về những người bạn quan tâm.\n\nBạn là người lao động cần mẫn, luôn đảm bảo mọi thứ diễn ra trơn tru mà không đòi hỏi sự chú ý hay ngợi khen. Tuy nhiên, lòng tốt của bạn đôi khi bị người khác lợi dụng. Bạn cần học cách nói 'Không' và dành thời gian chăm sóc cho chính nhu cầu nội tâm của bản thân mình.",
    strengths: [
      "Cực kỳ tận tâm, chu đáo và đáng tin cậy",
      "Kỹ năng thực hành xuất sắc, chú ý đến từng chi tiết nhỏ nhất",
      "Rất trung thành và sẵn sàng bảo vệ những người mình yêu thương",
      "Trí nhớ tốt về những dữ kiện thực tế và thông tin về con người",
      "Giỏi trong việc tạo ra một môi trường an toàn và ấm áp"
    ],
    weaknesses: [
      "Quá khiêm tốn, dẫn đến việc không được ghi nhận đúng năng lực",
      "Hay ôm mọi nỗi buồn vào lòng và tự chịu đựng",
      "Có xu hướng ôm đồm quá tải công việc vì sợ mất lòng người khác",
      "Ngần ngại trước sự thay đổi và những điều không chắc chắn",
      "Dễ bị lợi dụng lòng tốt và sự nhiệt tình"
    ]
  },
  ESTJ: {
    id: "ESTJ",
    name: "Người Quản Lý (Executive)",
    description: "Bạn là đại diện tiêu biểu cho sự nề nếp, truyền thống và phẩm giá. ESTJ là những nhà quản lý xuất sắc, biết cách gắn kết mọi người và tổ chức công việc một cách hoàn hảo nhất. Bạn nhìn nhận thế giới qua lăng kính của luật lệ và sự thật rõ ràng, bạn mong đợi mọi người xung quanh cũng giữ thái độ sống nguyên tắc như vậy.\n\nTrong các dự án phức tạp, bạn luôn là người đứng ra nhận trách nhiệm phân chia công việc, lập kế hoạch chi tiết và đốc thúc mọi người hoàn thành đúng tiến độ. Sự thẳng thắn và tính thực tế giúp bạn giải quyết vấn đề cực kỳ nhanh chóng. Dù vậy, bạn nên cố gắng tinh tế hơn để không làm tổn thương những người nhạy cảm trong đội ngũ.",
    strengths: [
      "Kỹ năng quản lý, phân bổ nguồn lực và lãnh đạo xuất sắc",
      "Cực kỳ tận tâm, chịu khó và luôn hoàn thành mục tiêu",
      "Tính thực tế cao, thẳng thắn và quyết đoán",
      "Tôn trọng trật tự, tính minh bạch và sự an toàn",
      "Giỏi trong việc biến những ý tưởng thành các kế hoạch khả thi"
    ],
    weaknesses: [
      "Thiếu linh hoạt và bướng bỉnh trước các ý kiến đi ngược truyền thống",
      "Đôi khi quá nguyên tắc và cứng nhắc trong cách đánh giá",
      "Khó khăn trong việc thấu cảm và bộc lộ cảm xúc",
      "Quá coi trọng địa vị xã hội và cách người khác nhìn nhận mình",
      "Thường tạo ra áp lực lớn cho cấp dưới hoặc những người xung quanh"
    ]
  },
  ESFJ: {
    id: "ESFJ",
    name: "Người Cung Cấp (Consul)",
    description: "Bạn là trái tim của cộng đồng. ESFJ là kiểu người cực kỳ phổ biến, thân thiện, cởi mở và luôn sẵn lòng giúp đỡ mọi người. Bạn thường là người đứng ra tổ chức các buổi tiệc tùng, duy trì liên lạc với bạn bè và đảm bảo mọi người đều cảm thấy vui vẻ, thoải mái.\n\nBạn là người thực tế, thích lo liệu những điều hữu hình, từ việc chuẩn bị một bữa ăn ngon đến việc quan tâm sức khỏe của người thân. Bạn rất nhạy cảm với cách người khác đánh giá mình và khao khát sự công nhận. Lời khuyên dành cho bạn là đừng để giá trị bản thân phụ thuộc quá nhiều vào sự hài lòng của những người xung quanh.",
    strengths: [
      "Kỹ năng kết nối cộng đồng và xây dựng mối quan hệ tuyệt vời",
      "Ấm áp, tận tụy và luôn tràn đầy năng lượng tích cực",
      "Rất có trách nhiệm với gia đình và công việc",
      "Thực tế, chu đáo và chú ý đến những nhu cầu nhỏ nhất của người khác",
      "Luôn tìm cách tạo ra sự hòa hợp và tránh các mâu thuẫn"
    ],
    weaknesses: [
      "Quá bận tâm đến những gì người khác nghĩ về mình",
      "Dễ bị tổn thương bởi các lời chỉ trích, dù là nhỏ nhất",
      "Có xu hướng phán xét những lối sống khác biệt với số đông",
      "Gặp khó khăn trong việc đưa ra các quyết định mang tính lý trí cứng rắn",
      "Thường hi sinh nhu cầu của bản thân để làm hài lòng tập thể"
    ]
  },
  ISTP: {
    id: "ISTP",
    name: "Nhà Thám Hiểm (Virtuoso)",
    description: "Bạn là một nhà chế tạo bẩm sinh, luôn khao khát được khám phá thế giới bằng chính đôi tay và khối óc của mình. ISTP sở hữu sự kết hợp kỳ lạ giữa tính logic lạnh lùng và tính tự phát táo bạo. Bạn có thể im lặng quan sát, tích lũy năng lượng, rồi bất ngờ bùng nổ trong một hành động đột phá.\n\nBạn rất linh hoạt, không thích bị trói buộc bởi các luật lệ hay kế hoạch dài hạn. Trong các tình huống khủng hoảng, bạn là người giữ được cái đầu lạnh nhất và tìm ra giải pháp xử lý kỹ thuật xuất sắc. Tuy nhiên, tính cách khó đoán và sự riêng tư tuyệt đối khiến người khác rất khó để thực sự thấu hiểu bạn.",
    strengths: [
      "Cực kỳ linh hoạt, dễ dàng thích nghi với mọi hoàn cảnh",
      "Giữ bình tĩnh tuyệt đỉnh trong các tình huống khẩn cấp",
      "Tư duy logic sắc bén, kỹ năng giải quyết vấn đề thực tế xuất sắc",
      "Trực tiếp, không vòng vo và rất độc lập",
      "Đầy sáng tạo trong việc sử dụng công cụ và kỹ thuật"
    ],
    weaknesses: [
      "Rất dễ cảm thấy nhàm chán và khó duy trì sự cam kết lâu dài",
      "Không thích các nguyên tắc, luật lệ hoặc việc phải báo cáo",
      "Cực kỳ khép kín, rất khó để chia sẻ cảm xúc cá nhân",
      "Hay có những hành động bốc đồng hoặc chấp nhận rủi ro không cần thiết",
      "Thiếu sự nhạy cảm, đôi khi những câu nói đùa của bạn làm tổn thương người khác"
    ]
  },
  ISFP: {
    id: "ISFP",
    name: "Người Nghệ Sĩ (Adventurer)",
    description: "Bạn là một nghệ sĩ đích thực, không nhất thiết phải cầm cọ vẽ, mà nghệ thuật thể hiện ở cách bạn sống. ISFP luôn muốn phá vỡ các ranh giới truyền thống, sống trọn vẹn trong khoảnh khắc hiện tại và cảm nhận thế giới qua một lăng kính giàu thẩm mỹ.\n\nBạn rất quyến rũ, điềm tĩnh và vô cùng bao dung. Bạn không thích kiểm soát người khác và cũng căm ghét việc bị kiểm soát. Bạn luôn tìm kiếm những trải nghiệm mới mẻ, từ những chuyến du lịch ngẫu hứng đến những sở thích mạo hiểm. Dù vậy, bạn thường gặp khó khăn lớn trong việc định hướng tương lai dài hạn hoặc đối mặt với các vấn đề tài chính khô khan.",
    strengths: [
      "Rất quyến rũ, thân thiện và ấm áp",
      "Nhạy bén với nghệ thuật, có gu thẩm mỹ tinh tế tuyệt vời",
      "Tư duy bao dung, cởi mở, không phán xét người khác",
      "Giàu trí tưởng tượng và sự đam mê",
      "Linh hoạt và biết cách tận hưởng những điều nhỏ bé trong cuộc sống"
    ],
    weaknesses: [
      "Rất ghét sự ràng buộc và các kế hoạch dài hạn",
      "Dễ bị stress và áp lực trước những mâu thuẫn khốc liệt",
      "Lòng tự trọng dễ bị dao động bởi cảm xúc tức thời",
      "Thiếu khả năng lên kế hoạch tài chính và sự nghiệp vững chắc",
      "Đôi khi quá độc lập đến mức tự cô lập bản thân"
    ]
  },
  ESTP: {
    id: "ESTP",
    name: "Người Khởi Nghiệp (Entrepreneur)",
    description: "Bạn luôn là tâm điểm của sự chú ý nhờ nguồn năng lượng dồi dào và phong thái tự tin. ESTP sống để hành động. Bạn không thích ngồi thảo luận về những lý thuyết dài dòng; bạn muốn xắn tay áo lên và lao vào làm ngay lập tức. Bạn là những 'chiến binh' thực thụ, nhạy bén nắm bắt mọi cơ hội trước mắt.\n\nBạn rất giỏi đọc vị người khác và phản ứng cực kỳ nhanh nhạy. Những tình huống rủi ro không làm bạn sợ hãi mà ngược lại, còn kích thích bạn hơn. Tuy nhiên, tính cách sống vì hiện tại đôi khi khiến bạn bỏ qua bức tranh tổng thể hoặc vướng vào những rắc rối do không tính toán kỹ hậu quả.",
    strengths: [
      "Dũng cảm, năng động và luôn tiên phong trong hành động",
      "Nhạy bén, sắc sảo và có kỹ năng xã hội vô song",
      "Rất trực tiếp, thẳng thắn và không đạo đức giả",
      "Linh hoạt và ứng biến cực tốt trong các môi trường thay đổi nhanh",
      "Sức hấp dẫn cá nhân lớn, dễ dàng kết nối và thuyết phục mọi người"
    ],
    weaknesses: [
      "Thiếu kiên nhẫn với các vấn đề mang tính lý thuyết hoặc chi tiết",
      "Thường hành động bốc đồng và đánh giá thấp những rủi ro lâu dài",
      "Rất khó tuân thủ các quy định, luật lệ cứng nhắc",
      "Có xu hướng bỏ lỡ bức tranh toàn cảnh vì quá tập trung vào hiện tại",
      "Đôi khi bỏ qua cảm xúc của người khác để đạt được mục tiêu nhanh chóng"
    ]
  },
  ESFP: {
    id: "ESFP",
    name: "Người Trình Diễn (Entertainer)",
    description: "Bạn là một ngọn pháo hoa rực rỡ, luôn mang đến niềm vui và tiếng cười cho mọi người. Không ai yêu đời và biết cách tận hưởng cuộc sống hơn ESFP. Bạn bị hấp dẫn bởi những trải nghiệm mới, vẻ đẹp thẩm mỹ, thời trang và những cuộc vui bất tận.\n\nSự thân thiện và hào phóng của bạn khiến bạn được vô vàn người yêu mến. Dù trông có vẻ mải chơi, bạn thực sự rất giỏi quan sát và nắm bắt tâm lý người khác. Vấn đề lớn nhất của bạn là trốn tránh các trách nhiệm khó khăn. Khi đối mặt với rắc rối, bạn có xu hướng gạt nó sang một bên hoặc bỏ đi tìm kiếm niềm vui khác thay vì giải quyết triệt để.",
    strengths: [
      "Tràn đầy năng lượng, lạc quan và vô cùng táo bạo",
      "Kỹ năng giao tiếp xuất chúng, dễ dàng làm bạn với bất kỳ ai",
      "Rất thực tế, nhạy bén với thẩm mỹ và cái đẹp",
      "Luôn là nguồn động viên và mang lại niềm vui cho mọi người",
      "Khả năng quan sát tinh tế những thay đổi nhỏ trong cảm xúc của người khác"
    ],
    weaknesses: [
      "Cực kỳ dễ bị phân tâm và không thích tập trung lâu",
      "Kỹ năng lập kế hoạch dài hạn (tài chính, sự nghiệp) rất kém",
      "Hay né tránh các cuộc đối đầu và xung đột căng thẳng",
      "Thường bỏ qua hoặc lười biếng xử lý các vấn đề mang tính lý trí phức tạp",
      "Tìm kiếm sự thỏa mãn tức thời thay vì phần thưởng trong tương lai"
    ]
  }
};
