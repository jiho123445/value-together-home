import {
  OrgSettings,
  TimelineItem,
  ProgramItem,
  NoticeItem,
  GalleryItem,
  PopupItem,
  PartnerItem,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────
// 초기/기본 데이터
//
// 실제 기관 정보(주소, 대표자명, 설립연도, 사업자등록번호, 연혁, 실적 등)는
// 아직 확정되지 않았으므로 사실처럼 보이는 값을 지어내지 않습니다. 다만
// 사이트 레이아웃과 톤앤매너를 미리 확인할 수 있도록, 실제 사실 여부가
// 중요한 항목(소식/연혁/협력기관/갤러리처럼 "특정 사건"을 나타내는 항목)은
// 제목에 "[예시]" 표시를 붙인 샘플 콘텐츠로, 조합 자체의 사업 소개처럼
// 관리자가 스스로 정하는 항목(핵심가치·운영원칙·조직도·사업 소개 등)은
// 바로 쓸 수 있는 완성된 문구로 채워두었습니다. 주소/연락처/사업자등록번호/
// 후원계좌처럼 틀리면 안 되는 값은 관리자가 직접 입력하도록 비워두거나
// 누가 봐도 예시임을 알 수 있는 형식(OO, 000-00-00000 등)으로 남겨둡니다.
// 이미지도 실제 사진이 등록되기 전까지 쓸 수 있도록, 브랜드 컬러를 사용한
// 자체 제작 일러스트(/public/images)를 기본값으로 연결해 두었습니다.
// 관리자 페이지에서 언제든 실제 값으로 교체/삭제할 수 있습니다.
// ─────────────────────────────────────────────────────────────────────────

export const INITIAL_GALLERY_CATEGORIES: string[] = ['교육', '복지', '지역사회', '행사', '기타'];

export const INITIAL_SETTINGS: OrgSettings = {
  name: '사회적협동조합 가치함께',
  englishName: 'Value Together Social Cooperative',
  sloganMain: '함께 만드는 더 나은 일상, 함께 성장하는 지역사회',
  sloganSub: '사람과 지역사회를 연결하고, 함께 성장할 수 있는 사회적 가치를 만들어갑니다.',
  representativeTitle: '이사장',
  representativeName: '홍길동',
  representativeImageUrl: undefined,
  representativeGreeting:
    '안녕하십니까. 사회적협동조합 가치함께 홈페이지를 찾아주신 여러분께 진심으로 감사드립니다.\n\n' +
    '가치함께는 "사람이 사람을 돌보고, 이웃이 이웃과 연결되는 지역사회"를 꿈꾸며 만들어진 사회적협동조합입니다. 혼자서는 해결하기 어려운 돌봄과 교육, 일자리와 자립의 문제를 조합원과 지역주민이 함께 힘을 모아 풀어가고자 합니다.\n\n' +
    '저희는 화려한 성과보다 꾸준함을, 일회성 행사보다 오래 지속되는 관계를 만드는 일에 더 큰 가치를 둡니다. 작은 방문 하나, 짧은 교육 한 시간이 누군가에게는 하루를 버티는 힘이 될 수 있다는 믿음으로 사업을 이어가고 있습니다.\n\n' +
    '가치함께는 앞으로도 조합원 여러분과 지역사회의 목소리에 귀 기울이며, 투명하고 민주적인 운영으로 신뢰받는 사회적협동조합이 되도록 노력하겠습니다. 많은 관심과 참여를 부탁드립니다. 감사합니다.',
  logoUrl: undefined,
  heroImageUrl: '/images/hero-main.jpg',
  establishedYear: '2023',
  businessRegistrationNumber: '',
  address: 'OO도 OO시 OO구 OO로 00',
  mapEmbedUrl: undefined,
  phone: '033-000-0000',
  fax: '',
  email: 'info@valuetogether.example',
  operatingHours: '평일 09:00 - 18:00 (주말·공휴일 휴무)',
  bankAccounts: [],
  snsLinks: {},
  coreValues: [
    { id: 'val-people', title: '사람', description: '모든 사업의 중심에 사람을 둡니다.', icon: 'people' },
    { id: 'val-together', title: '함께', description: '조합원과 이용자, 협력기관이 함께 만듭니다.', icon: 'together' },
    { id: 'val-community', title: '지역사회', description: '지역과 함께 자라는 사업을 만듭니다.', icon: 'community' },
    { id: 'val-sustainability', title: '지속가능성', description: '단발성이 아닌 오래가는 구조를 만듭니다.', icon: 'sustainability' },
  ],
  operatingPrinciples: [
    {
      id: 'op-1',
      title: '조합원 중심의 민주적 운영',
      description: '출자 규모와 관계없이 조합원 1인 1표 원칙에 따라 모든 조합원이 동등하게 의사결정에 참여합니다.',
    },
    {
      id: 'op-2',
      title: '투명한 정보 공개',
      description: '예산과 결산, 주요 사업 성과를 조합원과 지역사회에 정기적으로 투명하게 공개합니다.',
    },
    {
      id: 'op-3',
      title: '지역사회와의 상생',
      description: '조합의 사업이 지역경제와 지역주민의 삶에 실질적으로 도움이 되는 방향을 우선으로 고려합니다.',
    },
    {
      id: 'op-4',
      title: '지속가능한 성장',
      description: '단기적인 성과보다 오래 지속될 수 있는 사업 구조와 재정 건전성을 지향합니다.',
    },
  ],
  orgChart: [
    { id: 'org-1', department: '이사회', role: '이사장', description: '조합의 주요 의사결정과 사업 전반을 감독합니다.', order: 1 },
    { id: 'org-2', department: '사무국', role: '사무국장', description: '조합 운영 전반, 행정 및 대외협력 업무를 총괄합니다.', order: 2 },
    { id: 'org-3', department: '교육사업팀', role: '팀장', description: '지역주민 대상 평생교육 프로그램을 기획·운영합니다.', order: 3 },
    { id: 'org-4', department: '돌봄복지사업팀', role: '팀장', description: '취약계층 돌봄과 통합 복지서비스 연계를 담당합니다.', order: 4 },
    { id: 'org-5', department: '지역사회사업팀', role: '팀장', description: '마을공동체 활성화와 지역 협력 네트워크를 운영합니다.', order: 5 },
    { id: 'org-6', department: '일자리자립지원팀', role: '팀장', description: '일자리 연계와 자립 지원 프로그램을 운영합니다.', order: 6 },
  ],
  purposeStatement:
    '사회적협동조합 가치함께는 지역사회 구성원 누구도 소외되지 않고, 필요한 돌봄과 배움, 일할 기회에 연결될 수 있도록 돕기 위해 설립되었습니다. 조합원과 지역주민이 함께 참여하고 함께 결정하는 협동조합 방식으로, 지속가능한 지역복지·교육·일자리 생태계를 만들어가는 것을 목적으로 합니다.',
  introStatement:
    '가치함께는 사회서비스, 교육, 지역사회, 돌봄복지, 일자리자립지원 등 여러 영역의 사업을 유기적으로 연결해 운영하는 사회적협동조합입니다. 한 사람의 삶에는 여러 문제가 동시에 얽혀 있는 경우가 많다는 것을 알기에, 개별 사업을 따로 운영하기보다 서로 연결된 지원 체계를 만들고자 노력합니다. 조합원, 이용자, 자원봉사자, 협력기관이 함께 만들어가는 조합으로 성장해 나가겠습니다.',
  galleryCategories: INITIAL_GALLERY_CATEGORIES,
  stats: {
    programCount: 6,
    partnerCount: 4,
  },
};

// 연혁: 실제 사실이 확정되기 전까지 "[예시]" 표시를 붙인 샘플로 구성해
// 히스토리 화면의 레이아웃(타임라인)을 미리 확인할 수 있도록 합니다.
// 관리자 설정 화면에서 실제 연혁으로 교체해 주세요.
export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'tl-1',
    year: '2023',
    title: '[예시] 사회적협동조합 가치함께 설립 준비',
    subtitle: '발기인 모임 및 창립총회 준비',
    description: '지역 내 돌봄·교육·일자리 문제에 관심 있는 주민들이 모여 협동조합 설립을 준비했습니다.',
    category: '설립',
    isMilestone: true,
  },
  {
    id: 'tl-2',
    year: '2023',
    title: '[예시] 사회적협동조합 인가',
    subtitle: '관할 관청 인가 완료',
    description: '협동조합기본법에 따라 사회적협동조합으로 정식 인가를 받고 조합원 모집을 시작했습니다.',
    category: '인증',
    isMilestone: true,
  },
  {
    id: 'tl-3',
    year: '2024',
    title: '[예시] 주요사업 본격 운영 개시',
    subtitle: '이웃돌봄·평생교육 프로그램 시작',
    description: '이웃돌봄 방문서비스와 생애주기별 평생교육 프로그램을 시작으로 주요사업 운영에 들어갔습니다.',
    category: '사업확장',
  },
  {
    id: 'tl-4',
    year: '2025',
    title: '[예시] 협력기관 네트워크 확대',
    subtitle: '지역 협력기관과 업무협약 체결',
    description: '지역 내 기관들과 협력관계를 넓히며 통합돌봄·일자리자립지원 사업 영역을 확장했습니다.',
    category: '기타',
  },
];

export const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: 'prog-01',
    code: '01',
    category: '사회서비스',
    title: '이웃돌봄 방문서비스',
    subtitle: '혼자 계신 어르신과 취약가구를 정기적으로 찾아갑니다',
    summary: '독거노인·취약가구를 정기적으로 방문해 안부를 확인하고, 필요한 자원과 서비스를 연계합니다.',
    details: [
      '정기 안부확인 방문 및 말벗·정서지원',
      '생활 실태 파악 및 필요 복지자원 연계',
      '위기 상황 조기 발견 시 관계기관 신속 연계',
    ],
    targetAudience: '지역 내 독거노인 및 돌봄이 필요한 가구',
    impactMessage: '정기적인 방문으로 위기 상황을 조기에 발견하고, 필요한 도움으로 빠르게 연결합니다.',
    iconName: 'HeartHandshake',
    imageUrl: '/images/programs/program-social-service.jpg',
    featuredOnHome: true,
    order: 1,
  },
  {
    id: 'prog-02',
    code: '02',
    category: '교육사업',
    title: '생애주기별 평생교육 프로그램',
    subtitle: '아이부터 어르신까지, 배움에는 나이가 없습니다',
    summary: '디지털 문해교육부터 인문학 강좌, 방과후 학습지원까지 전 연령을 위한 교육 프로그램을 운영합니다.',
    details: [
      '어르신 대상 디지털 문해교육(스마트폰·키오스크 등)',
      '지역주민 인문학·교양 강좌',
      '아동·청소년 방과후 학습지원',
    ],
    targetAudience: '지역주민 전 연령',
    impactMessage: '배움을 통해 지역주민 스스로 성장하고 서로 연결될 수 있는 기회를 만듭니다.',
    iconName: 'BookOpen',
    imageUrl: '/images/programs/program-education.jpg',
    featuredOnHome: true,
    order: 2,
  },
  {
    id: 'prog-03',
    code: '03',
    category: '지역사회사업',
    title: '마을공동체 활성화 사업',
    subtitle: '주민이 기획하고 주민이 참여하는 마을 활동',
    summary: '주민 제안 공모사업과 소모임 지원, 유휴공간을 활용한 커뮤니티 공간 운영으로 마을공동체를 활성화합니다.',
    details: [
      '주민 제안형 마을활동 공모 및 지원',
      '마을 소모임·동아리 활동 지원',
      '유휴공간을 활용한 주민 커뮤니티 공간 운영',
    ],
    targetAudience: '지역 주민 및 주민 소모임',
    impactMessage: '주민 스스로 지역의 문제를 발견하고 함께 해결해나가는 힘을 키웁니다.',
    iconName: 'Users',
    imageUrl: '/images/programs/program-community.jpg',
    featuredOnHome: true,
    order: 3,
  },
  {
    id: 'prog-04',
    code: '04',
    category: '돌봄복지사업',
    title: '통합돌봄 지원사업',
    subtitle: '일상생활이 어려운 이웃에게 필요한 복지서비스를 연결합니다',
    summary: '가사·간병 지원 연계와 사례관리를 통해 복지 사각지대를 줄이고 필요한 서비스로 촘촘히 연결합니다.',
    details: [
      '가사·간병 등 생활지원 서비스 연계',
      '복지 사각지대 발굴 및 초기 상담',
      '관계기관과의 협력을 통한 사례관리',
    ],
    targetAudience: '노인, 장애인, 취약계층 가구',
    impactMessage: '필요한 복지서비스를 놓치지 않도록 촘촘하게 연결합니다.',
    iconName: 'Umbrella',
    imageUrl: '/images/programs/program-care-welfare.jpg',
    featuredOnHome: true,
    order: 4,
  },
  {
    id: 'prog-05',
    code: '05',
    category: '일자리자립지원',
    title: '자립기반 일자리 지원사업',
    subtitle: '일할 기회가 곧 자립의 시작입니다',
    summary: '취업 역량강화 교육과 사회적 일자리 연계, 창업·자립 컨설팅으로 자립 기반 마련을 돕습니다.',
    details: [
      '취업 역량강화 교육 및 직무훈련',
      '사회적 일자리·연계 취업 지원',
      '소상공인 창업 및 자립 컨설팅',
    ],
    targetAudience: '경력단절여성, 청년, 취약계층 구직자',
    impactMessage: '지속가능한 일자리를 통해 스스로 서는 힘을 지원합니다.',
    iconName: 'Briefcase',
    imageUrl: '/images/programs/program-job-support.jpg',
    featuredOnHome: true,
    order: 5,
  },
  {
    id: 'prog-06',
    code: '06',
    category: '기타사업',
    title: '협동조합 네트워크 및 공익사업',
    subtitle: '협동의 가치를 지역사회 곳곳에 확산합니다',
    summary: '지역 내 협동조합·사회적경제 조직과의 협력 네트워크 운영과 공익 캠페인을 통해 협동의 가치를 확산합니다.',
    details: [
      '지역 협동조합·사회적경제 조직 간 협력 네트워크 운영',
      '사회적경제 인식 확산 캠페인',
      '지역사회 공익 캠페인 및 후원 연계 사업',
    ],
    targetAudience: '지역 내 사회적경제 조직 및 지역주민',
    impactMessage: '협동의 경험을 나누며 지역의 사회적경제 생태계를 함께 키워갑니다.',
    iconName: 'Sparkles',
    imageUrl: '/images/programs/program-etc.jpg',
    featuredOnHome: true,
    order: 6,
  },
];

// 소식: "[예시]"로 표시된 샘플입니다. 실제 공지/모집/사업소식이 등록되면
// 관리자 페이지에서 교체하거나 삭제해 주세요.
export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice-01',
    title: '[예시] 사회적협동조합 가치함께 홈페이지가 새롭게 열렸습니다',
    category: '공지사항',
    date: '2026-09-08',
    views: 0,
    isImportant: true,
    author: '관리자',
    content:
      '안녕하세요, 사회적협동조합 가치함께입니다.\n\n' +
      '조합의 사업 소개와 소식을 더 쉽게 전해드리기 위해 홈페이지를 새롭게 열었습니다. 주요사업 안내, 활동갤러리, 협력 및 참여 신청, 오시는 길·문의 등을 이곳에서 확인하실 수 있습니다.\n\n' +
      '앞으로도 조합의 소식을 꾸준히 전해드리겠습니다. 많은 관심 부탁드립니다.',
    attachments: [],
  },
  {
    id: 'notice-02',
    title: '[예시] 개인정보처리방침 및 이용약관을 확인해 주세요',
    category: '공지사항',
    date: '2026-09-08',
    views: 0,
    author: '관리자',
    content:
      '홈페이지 이용에 앞서 개인정보처리방침과 이용약관을 확인해 주시기 바랍니다. 문의·참여 신청 과정에서 수집되는 개인정보는 관련 법령에 따라 안전하게 관리됩니다. 자세한 내용은 하단의 개인정보처리방침 페이지에서 확인하실 수 있습니다.',
    attachments: [],
  },
  {
    id: 'notice-03',
    title: '[예시] 이웃돌봄 방문서비스 자원봉사자를 모집합니다',
    category: '모집공고',
    date: '2026-09-01',
    views: 0,
    author: '관리자',
    content:
      '이웃돌봄 방문서비스와 함께할 자원봉사자를 모집합니다.\n\n' +
      '모집대상: 지역 내 독거노인·취약가구 방문에 관심 있는 성인 누구나\n' +
      '활동내용: 정기 안부확인 방문, 말벗 활동 등\n' +
      '신청방법: "협력 및 참여" 메뉴의 자원봉사 신청서를 작성해 주세요.\n\n' +
      '자세한 일정과 절차는 신청 후 담당자가 개별 안내드립니다.',
    attachments: [],
  },
  {
    id: 'notice-04',
    title: '[예시] 생애주기별 평생교육 프로그램 강좌를 안내드립니다',
    category: '사업소식',
    date: '2026-08-20',
    views: 0,
    author: '관리자',
    content:
      '올해 하반기 평생교육 프로그램 강좌를 준비하고 있습니다. 디지털 문해교육, 인문학 강좌, 아동·청소년 방과후 학습지원 등 다양한 프로그램으로 구성될 예정입니다.\n\n' +
      '세부 일정과 신청 방법은 준비되는 대로 공지사항을 통해 다시 안내드리겠습니다.',
    attachments: [],
  },
  {
    id: 'notice-05',
    title: '[예시] 조합원 가입 안내 자료를 준비 중입니다',
    category: '자료실',
    date: '2026-08-05',
    views: 0,
    author: '관리자',
    content:
      '조합원 가입을 원하시는 분들을 위한 안내 자료(정관, 가입 절차 안내 등)를 준비하고 있습니다. 자료가 준비되는 대로 이 페이지에 첨부파일로 업로드해 드리겠습니다. 급하신 경우 "오시는 길·문의" 페이지를 통해 문의해 주세요.',
    attachments: [],
  },
];

// 활동갤러리: "[예시]" 샘플 이미지/설명입니다. 실제 활동 사진으로 교체해 주세요.
export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gallery-01',
    title: '[예시] 디지털 문해교육 현장',
    category: '교육',
    date: '2026-08-18',
    imageUrl: '/images/gallery/gallery-education-01.jpg',
    description: '어르신들을 대상으로 한 스마트폰 활용 교육 현장입니다.',
    location: '가치함께 교육실',
    author: '관리자',
  },
  {
    id: 'gallery-02',
    title: '[예시] 아동 방과후 학습지원',
    category: '교육',
    date: '2026-07-22',
    imageUrl: '/images/gallery/gallery-education-02.jpg',
    description: '지역 아동들과 함께한 방과후 학습지원 프로그램 모습입니다.',
    location: '가치함께 교육실',
    author: '관리자',
  },
  {
    id: 'gallery-03',
    title: '[예시] 이웃돌봄 방문서비스',
    category: '복지',
    date: '2026-08-05',
    imageUrl: '/images/gallery/gallery-welfare-01.jpg',
    description: '독거어르신 가정을 방문해 안부를 확인하는 활동 모습입니다.',
    location: '지역 내 방문가구',
    author: '관리자',
  },
  {
    id: 'gallery-04',
    title: '[예시] 통합돌봄 사례회의',
    category: '복지',
    date: '2026-06-30',
    imageUrl: '/images/gallery/gallery-welfare-02.jpg',
    description: '복지 사각지대 발굴을 위한 관계기관 합동 사례회의 모습입니다.',
    location: '가치함께 사무국',
    author: '관리자',
  },
  {
    id: 'gallery-05',
    title: '[예시] 마을공동체 소모임 활동',
    category: '지역사회',
    date: '2026-07-10',
    imageUrl: '/images/gallery/gallery-community-01.jpg',
    description: '주민들이 직접 기획한 마을 소모임 활동 현장입니다.',
    location: '마을 커뮤니티 공간',
    author: '관리자',
  },
  {
    id: 'gallery-06',
    title: '[예시] 유휴공간 커뮤니티 공간 조성',
    category: '지역사회',
    date: '2026-05-14',
    imageUrl: '/images/gallery/gallery-community-02.jpg',
    description: '유휴공간을 주민 커뮤니티 공간으로 새롭게 꾸민 모습입니다.',
    location: '마을 커뮤니티 공간',
    author: '관리자',
  },
  {
    id: 'gallery-07',
    title: '[예시] 협동조합의 날 행사',
    category: '행사',
    date: '2026-04-05',
    imageUrl: '/images/gallery/gallery-event-01.jpg',
    description: '조합원과 지역주민이 함께한 협동조합의 날 행사 현장입니다.',
    location: '가치함께 야외마당',
    author: '관리자',
  },
  {
    id: 'gallery-08',
    title: '[예시] 협력기관 업무협약식',
    category: '기타',
    date: '2026-03-12',
    imageUrl: '/images/gallery/gallery-etc-01.jpg',
    description: '지역 협력기관과의 업무협약(MOU) 체결식 모습입니다.',
    location: '가치함께 사무국',
    author: '관리자',
  },
];

// 협력기관: 실제 협력관계가 아닌 레이아웃 확인용 "[예시]" 샘플입니다.
// 실제 협력기관이 정해지면 관리자 페이지에서 이름/로고/링크를 등록해 주세요.
export const INITIAL_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-01',
    name: '[예시] 협력기관 1',
    logoUrl: '/images/partners/partner-sample-01.png',
    description: '지역 사회복지 분야 협력기관입니다. (예시)',
    order: 1,
  },
  {
    id: 'partner-02',
    name: '[예시] 협력기관 2',
    logoUrl: '/images/partners/partner-sample-02.png',
    description: '지역 교육 분야 협력기관입니다. (예시)',
    order: 2,
  },
  {
    id: 'partner-03',
    name: '[예시] 협력기관 3',
    logoUrl: '/images/partners/partner-sample-03.png',
    description: '지역 일자리 지원 분야 협력기관입니다. (예시)',
    order: 3,
  },
  {
    id: 'partner-04',
    name: '[예시] 협력기관 4',
    logoUrl: '/images/partners/partner-sample-04.png',
    description: '지역 사회적경제 네트워크 협력기관입니다. (예시)',
    order: 4,
  },
];

export const INITIAL_POPUPS: PopupItem[] = [];
