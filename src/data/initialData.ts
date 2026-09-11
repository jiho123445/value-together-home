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
// 아직 확정되지 않았으므로 절대로 사실처럼 보이는 값을 지어내지 않습니다.
// 아래 값들은 전부 "관리자 설정 화면에서 입력 필요"라고 명확히 표시되는
// 플레이스홀더이며, 관리자가 로그인해 콘텐츠 관리 화면에서 실제 값으로
// 채우면 됩니다. programs/notices/gallery 항목만 화면 레이아웃을 미리
// 확인할 수 있도록 "예시" 라벨이 붙은 1개씩의 샘플을 포함합니다.
// ─────────────────────────────────────────────────────────────────────────

export const INITIAL_GALLERY_CATEGORIES: string[] = ['교육', '복지', '지역사회', '행사', '기타'];

export const INITIAL_SETTINGS: OrgSettings = {
  name: '사회적협동조합 가치함께',
  englishName: 'Value Together Social Cooperative',
  sloganMain: '함께 만드는 더 나은 일상, 함께 성장하는 지역사회',
  sloganSub: '사람과 지역사회를 연결하고, 함께 성장할 수 있는 사회적 가치를 만들어갑니다.',
  representativeTitle: '이사장',
  representativeName: '관리자 입력 필요',
  representativeImageUrl: undefined,
  representativeGreeting:
    '이사장 인사말은 관리자 설정 화면에서 입력해 주세요. 조합의 설립 취지와 방문자에게 전하고 싶은 메시지를 자유롭게 작성하실 수 있습니다.',
  logoUrl: undefined,
  heroImageUrl: undefined,
  establishedYear: '',
  businessRegistrationNumber: '',
  address: '주소를 관리자 설정에서 입력해 주세요',
  mapEmbedUrl: undefined,
  phone: '',
  fax: '',
  email: '',
  operatingHours: '평일 09:00 - 18:00 (주말, 공휴일 휴무) — 관리자 설정에서 수정 가능',
  bankAccounts: [],
  snsLinks: {},
  coreValues: [
    { id: 'val-people', title: '사람', description: '모든 사업의 중심에 사람을 둡니다.', icon: 'people' },
    { id: 'val-together', title: '함께', description: '조합원과 이용자, 협력기관이 함께 만듭니다.', icon: 'together' },
    { id: 'val-community', title: '지역사회', description: '지역과 함께 자라는 사업을 만듭니다.', icon: 'community' },
    { id: 'val-sustainability', title: '지속가능성', description: '단발성이 아닌 오래가는 구조를 만듭니다.', icon: 'sustainability' },
  ],
  operatingPrinciples: [
    { id: 'op-1', title: '투명한 운영', description: '조합의 운영 원칙을 관리자 설정에서 입력해 주세요.' },
    { id: 'op-2', title: '민주적 의사결정', description: '조합의 운영 원칙을 관리자 설정에서 입력해 주세요.' },
  ],
  orgChart: [
    { id: 'org-1', department: '이사회', role: '이사장', description: '', order: 1 },
    { id: 'org-2', department: '사무국', role: '사무국장', description: '', order: 2 },
  ],
  purposeStatement: '설립 목적을 관리자 설정에서 입력해 주세요.',
  introStatement: '조합 소개 문구를 관리자 설정에서 입력해 주세요.',
  galleryCategories: INITIAL_GALLERY_CATEGORIES,
  stats: {},
};

// 연혁은 실제 사실이 확정되기 전까지 빈 배열로 시작합니다. 지어낸 연도를
// 넣는 대신, 관리자가 실제 연혁을 하나씩 등록하도록 구조만 준비합니다.
export const INITIAL_TIMELINE: TimelineItem[] = [];

export const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: 'prog-sample-01',
    code: '01',
    category: '사회서비스',
    title: '[예시] 사업명을 입력해 주세요',
    subtitle: '관리자 페이지에서 실제 사업으로 교체됩니다',
    summary: '이 카드는 레이아웃 확인용 예시입니다. 관리자 설정에서 실제 사업 내용으로 수정하거나 삭제해 주세요.',
    details: ['세부 내용 1', '세부 내용 2'],
    targetAudience: '관리자 입력 필요',
    impactMessage: '관리자 입력 필요',
    iconName: 'HeartHandshake',
    imageUrl: undefined,
    featuredOnHome: true,
    order: 1,
  },
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice-sample-01',
    title: '[예시] 홈페이지가 새롭게 열렸습니다',
    category: '공지사항',
    date: new Date().toISOString().split('T')[0],
    views: 0,
    isImportant: true,
    author: '관리자',
    content:
      '이 글은 화면 레이아웃 확인용 예시 공지입니다. 관리자 페이지에서 실제 공지 내용으로 수정하거나 삭제해 주세요.',
    attachments: [],
  },
];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_PARTNERS: PartnerItem[] = [];

export const INITIAL_POPUPS: PopupItem[] = [];
