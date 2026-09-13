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
// 2026-09-13 기준 공개 가능한 기관 식별정보는 사용자가 제공한
// 고유번호증을 기준으로 반영합니다. 설립연도·연혁·전화·이메일·후원계좌·
// 실제 사업실적처럼 첨부 자료로 확인되지 않은 값은 임의로 만들지 않고
// 비워두거나 공개 실적 섹션에서 숨깁니다. 소식/연혁/협력기관/갤러리 등
// 특정 사건을 나타내는 기존 샘플 콘텐츠에는 [예시] 표기를 유지합니다.
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
  representativeName: '장상섭',
  representativeImageUrl: undefined,
  representativeGreeting:
    '안녕하십니까. 사회적협동조합 가치함께입니다.\n\n' +
    '가치함께는 조합원 등의 복리증진과 지역사회 복지서비스 향상을 위해 설립된 사회적협동조합입니다. 장애인·노인 등 취약계층을 위한 지역사업과 주민의 역량 강화를 위한 교육, 지역사회와의 협력을 통해 더불어 사는 지역사회에 기여하고자 합니다.\n\n' +
    '정관에서 정한 주사업을 충실히 수행하고, 조합원과 지역사회가 함께 참여하고 성장할 수 있도록 투명하고 책임 있는 운영을 이어가겠습니다. 감사합니다.',
  logoUrl: undefined,
  heroImageUrl: '/images/hero-main.jpg',
  establishedYear: '',
  businessRegistrationNumber: '351-82-00767',
  businessTypeLabel: '수익사업을 하지 않는 비영리법인',
  address: '강원특별자치도 홍천군 북방면 홍천로 38-9',
  mapEmbedUrl: undefined,
  phone: '',
  fax: '',
  email: '',
  operatingHours: '',
  bankAccounts: [],
  snsLinks: {},
  coreValues: [
    {
      id: 'val-people',
      title: '사람',
      description: '모든 사업의 중심에 사람을 둡니다.',
      icon: 'people',
      imageUrl: '/images/core-values/core-people.jpg',
    },
    {
      id: 'val-together',
      title: '함께',
      description: '조합원과 이용자, 협력기관이 함께 만듭니다.',
      icon: 'together',
      imageUrl: '/images/core-values/core-together.jpg',
    },
    {
      id: 'val-community',
      title: '지역사회',
      description: '지역과 함께 자라는 사업을 만듭니다.',
      icon: 'community',
      imageUrl: '/images/core-values/core-community.jpg',
    },
    {
      id: 'val-sustainability',
      title: '지속가능성',
      description: '단발성이 아닌 오래가는 구조를 만듭니다.',
      icon: 'sustainability',
      imageUrl: '/images/core-values/core-sustainability.jpg',
    },
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
    { id: 'org-board', department: '이사회', role: '이사장 포함', description: '조합의 주요 의사결정과 운영을 담당합니다.', order: 1 },
  ],
  purposeStatement:
    '사회적협동조합 가치함께는 조합원 등의 복리증진과 지역사회 복지서비스 향상을 위해, 장애인·노인 등 취약계층을 위한 지역사업과 사회복지 전문가로서 더불어 사는 지역사회에 기여하는 것을 목적으로 합니다.',
  introStatement:
    '가치함께는 사람과 지역사회가 함께 성장할 수 있도록 협동의 방식으로 필요한 사업과 자원을 연결해 나가는 사회적협동조합입니다. 정관에서 정한 주사업을 중심으로 장애인 활동 지원 인재 양성, 노인 관련 민간 자격증 발급, 주민 역량 강화 및 교육사업을 추진하고, 지역사회와의 협력과 공익적 활동을 이어갑니다.',
  galleryCategories: INITIAL_GALLERY_CATEGORIES,
  stats: {},
};

// 첨부 자료로 확인되지 않은 연혁은 비워 둡니다. 실제 연혁은 관리자 화면에서 등록합니다.
export const INITIAL_TIMELINE: TimelineItem[] = [];

export const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: 'prog-main-01', code: '01', category: '장애인 활동 지원 인재 양성', businessType: '주사업',
    title: '장애인 활동 지원 인재 양성', subtitle: '장애인 활동 지원 현장에서 필요한 인재를 양성합니다',
    summary: '장애인 활동 지원과 관련된 인재를 양성하고 지역사회 돌봄 인력 기반을 넓히는 사업입니다.',
    details: ['활동 지원 관련 교육과 인재 양성', '현장 중심의 역량 강화', '지역사회 서비스와의 연계'],
    targetAudience: '장애인 활동 지원 분야에 관심 있는 주민 및 교육 참여자',
    impactMessage: '전문성과 책임감을 갖춘 지역 인재가 장애인과 지역사회를 지원할 수 있도록 돕습니다.',
    iconName: 'HeartHandshake', featuredOnHome: true, order: 1,
  },
  {
    id: 'prog-main-02', code: '02', category: '노인 관련 민간 자격증 발급', businessType: '주사업',
    title: '노인 관련 민간 자격증 발급', subtitle: '노인복지 현장에 필요한 역량과 학습 기회를 제공합니다',
    summary: '정관에서 정한 노인 관련 민간 자격증 발급 사업을 통해 교육과 역량 개발의 기회를 제공합니다.',
    details: ['노인 관련 교육과정 운영', '민간 자격 관련 안내 및 발급', '지역사회 인력 역량 강화'],
    targetAudience: '노인 관련 분야에 관심 있는 교육 참여자',
    impactMessage: '지역사회에서 노인을 이해하고 지원할 수 있는 역량을 키웁니다.',
    iconName: 'GraduationCap', featuredOnHome: true, order: 2,
  },
  {
    id: 'prog-main-03', code: '03', category: '주민 역량 강화 및 교육', businessType: '주사업',
    title: '주민 역량 강화 및 교육', subtitle: '주민의 배움과 참여가 지역사회의 힘이 되도록 합니다',
    summary: '주민의 역량을 높이고 지역사회 참여를 촉진하기 위한 교육사업을 운영합니다.',
    details: ['주민 역량 강화 교육', '조합원 및 지역주민 대상 교육', '지역사회 참여와 협력 기회 확대'],
    targetAudience: '조합원 및 지역주민',
    impactMessage: '배움과 참여를 통해 주민이 지역사회의 변화를 함께 만드는 기반을 마련합니다.',
    iconName: 'BookOpen', featuredOnHome: true, order: 3,
  },
  {
    id: 'prog-other-01', code: '04', category: '사회복지 위탁사업', businessType: '기타사업',
    title: '사회복지 관련 위탁사업', subtitle: '국가와 지방자치단체와 함께 지역사회 복지를 수행합니다',
    summary: '국가 및 지방자치단체로부터 위탁받은 사회복지 관련 사업을 수행합니다.',
    details: ['사회복지 관련 위탁사업 수행', '지역 수요에 맞는 서비스 운영', '공공기관과의 협력'],
    targetAudience: '지역사회 구성원', impactMessage: '지역의 복지 수요에 맞는 공익적 서비스를 안정적으로 수행합니다.',
    iconName: 'Building2', featuredOnHome: true, order: 4,
  },
  {
    id: 'prog-other-02', code: '05', category: '조합원·직원 교육', businessType: '기타사업',
    title: '조합원·직원 상담 및 교육', subtitle: '조합 구성원의 성장과 참여를 지원합니다',
    summary: '조합원과 직원에 대한 상담·교육·훈련 및 정보 제공 사업을 추진합니다.',
    details: ['조합원 상담', '직원 교육 및 훈련', '사업 관련 정보 제공'],
    targetAudience: '조합원 및 직원', impactMessage: '조합 구성원의 역량을 높여 민주적이고 책임 있는 운영을 돕습니다.',
    iconName: 'Users', featuredOnHome: true, order: 5,
  },
  {
    id: 'prog-other-03', code: '06', category: '조합 간 협력', businessType: '기타사업',
    title: '조합 간 협력 및 지역사회 홍보', subtitle: '협동의 가치를 지역사회와 함께 확산합니다',
    summary: '조합 간 협력과 조합 홍보, 지역사회를 위한 공익적 활동을 추진합니다.',
    details: ['조합 간 협력사업', '조합 홍보', '지역사회를 위한 공익활동'],
    targetAudience: '협동조합 및 지역사회', impactMessage: '협동의 경험을 나누고 지역사회와 함께 지속가능한 기반을 만들어갑니다.',
    iconName: 'Share2', featuredOnHome: true, order: 6,
  },
];

export const INITIAL_GOVERNANCE_DOCUMENTS = [];
export const INITIAL_MEETINGS = [];
export const INITIAL_BUSINESS_RESULTS = [];
export const INITIAL_SOCIAL_VALUE_METRICS = [];

// 실제 게시 전에는 비워 둡니다. 운영자료는 관리자에서 등록합니다.
export const INITIAL_NOTICES: NoticeItem[] = [];

// 실제 활동 사진이 등록되기 전까지 비워 둡니다.
export const INITIAL_GALLERY: GalleryItem[] = [];

// 실제 협력기관이 확인되기 전까지 비워 둡니다.
export const INITIAL_PARTNERS: PartnerItem[] = [];

export const INITIAL_POPUPS: PopupItem[] = [];
