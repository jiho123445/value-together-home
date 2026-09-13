// ─────────────────────────────────────────────────────────────────────────
// 가치함께 데이터 모델
//
// 메뉴 구조 관련 설계 노트: 요청하신 8개 메뉴 안에는 실질적으로 같은 내용을
// 가리키는 항목이 섞여 있습니다 (예: "사업소식"의 공지사항/사업소식/모집공고/
// 자료실과 "알림마당"의 공지사항/보도자료/활동소식/자료실, "오시는 길"과
// "문의하기"). 방문자 입장에서 같은 성격의 글이 두 군데 메뉴로 흩어지면
// 오히려 혼란스러우므로, 이 코드베이스에서는 아래처럼 6개 상단 메뉴로
// 통합했습니다. 콘텐츠 종류는 하나도 빠짐없이 카테고리/구분 필드로
// 포함되어 있습니다.
//   1. 가치함께 소개 (about)
//   2. 주요사업 (business)
//   3. 소식 (news)            — 공지사항·사업소식·모집공고·보도자료·자료실
//   4. 활동갤러리 (gallery)
//   5. 협력 및 참여 (partners) — 조합원참여·자원봉사·후원협력·기관협력 + 협력기관 소개
//   6. 오시는 길·문의 (contact) — 위치/연락처 + 일반·사업·협력 문의
// ─────────────────────────────────────────────────────────────────────────

export interface CoreValue {
  id: string;
  title: string; // 예: '사람', '함께', '지역사회', '지속가능성'
  description: string;
  /** components/icons/CoreValueIcon.tsx 에 정의된 아이콘 키 */
  icon: 'people' | 'together' | 'community' | 'sustainability';
  /** 핵심가치 대표 실사 이미지 URL */
  imageUrl?: string;
}

export interface OperatingPrinciple {
  id: string;
  title: string;
  description: string;
}

export interface OrgChartItem {
  id: string;
  /** 조직 단위명 (예: 이사회, 사무국, 교육사업팀) */
  department: string;
  /** 대표 직책 (선택, 예: 이사장, 팀장) */
  role?: string;
  description?: string;
  order: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  category?: '설립' | '인증' | '사업확장' | '수상' | '기타';
  imageUrl?: string;
  isMilestone?: boolean;
}

export type ProgramCategory =
  | '주사업'
  | '기타사업'
  | '장애인 활동 지원 인재 양성'
  | '노인 관련 민간 자격증 발급'
  | '주민 역량 강화 및 교육'
  | '사회복지 위탁사업'
  | '조합원·직원 교육'
  | '조합 간 협력'
  | '홍보·지역사회사업';

export interface ProgramItem {
  id: string;
  code: string; // '01', '02', '03' ... 카드 표시용 일련번호
  category: ProgramCategory;
  /** 정관상 주사업/기타사업 구분 */
  businessType?: '주사업' | '기타사업';
  title: string;
  subtitle: string;
  summary: string;
  details: string[];
  targetAudience: string;
  impactMessage: string;
  iconName: string; // lucide-react 아이콘 이름
  badge?: string;
  imageUrl?: string;
  /** 메인 페이지 "주요사업" 카드에 노출할지 여부 (최대 6개 권장) */
  featuredOnHome?: boolean;
  order: number;
}

export interface NoticeAttachment {
  name: string;
  url?: string;
  size?: string;
  type?: string;
}

export type NoticeCategory = '공지사항' | '사업소식' | '모집공고' | '보도자료' | '자료실';

export interface NoticeItem {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  views: number;
  content: string;
  isImportant?: boolean;
  author: string;
  attachments?: NoticeAttachment[];
  /** 보도자료 카테고리일 때 원문 기사 링크 (외부 언론사 사이트) */
  externalUrl?: string;
  /** 보도자료 카테고리일 때 언론사명 */
  outlet?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string; // galleryCategories 배열 중 하나 (관리자가 자유롭게 관리)
  date: string;
  imageUrl: string; // 대표 사진 (커버 이미지)
  images?: string[]; // 여러 장의 사진 (다중 사진 지원)
  storagePath?: string;
  storagePaths?: string[];
  description: string;
  location?: string;
  author?: string;
}

export interface PopupItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

/** 협력기관 소개 (관리자가 직접 등록/관리하는 공개 목록 — 개인정보 없음) */
export interface PartnerItem {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  order: number;
}

export type ParticipationType = '조합원가입' | '자원봉사' | '후원협력' | '기관협력';

/**
 * 협력 및 참여 페이지에서 방문자가 제출하는 신청서. 이름/연락처 등 개인정보를
 * 포함하므로 공개 문서(content/settings 등)에는 절대 저장하지 않고 별도
 * 컬렉션(participations)에 저장하며, Firestore Rules로 "생성만 공개 허용,
 * 읽기/수정/삭제는 관리자만"이 강제됩니다 (firestore.rules 참고).
 */
export interface GovernanceDocument {
  id: string;
  category: '경영공시' | '정관·규정' | '총회' | '이사회' | '사업계획' | '결산·사업보고' | '기부금 공개' | '기타';
  year: string;
  title: string;
  description?: string;
  fileUrl: string;
  storagePath?: string;
  fileName: string;
  fileSize?: number;
  publishedAt: string;
  isPublic: boolean;
  order: number;
}

export interface MeetingRecord {
  id: string;
  type: '총회' | '이사회';
  year: string;
  title: string;
  date: string;
  summary?: string;
  documentIds?: string[];
  isPublic: boolean;
  order: number;
}

export interface MembershipApplication {
  id: string;
  memberType: '생산자조합원' | '소비자조합원' | '직원조합원' | '자원봉사자조합원' | '후원자조합원';
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  desiredShareCount: number;
  privacyAgreed: boolean;
  createdAt: string;
  status: '신청접수' | '자격확인' | '가입승인' | '출자금납입확인' | '가입완료' | '반려';
}

export interface DonationInquiry {
  id: string;
  donorName: string;
  phone: string;
  email?: string;
  amount: number;
  purpose?: string;
  receiptRequested: boolean;
  privacyAgreed: boolean;
  createdAt: string;
  status: '접수완료' | '확인중' | '처리완료';
}

export interface BusinessResult {
  id: string;
  year: string;
  programId?: string;
  title: string;
  summary: string;
  participantCount?: number;
  sessionCount?: number;
  completionCount?: number;
  customMetrics?: { label: string; value: string }[];
  isPublic: boolean;
  order: number;
}

export interface SocialValueMetric {
  id: string;
  year: string;
  label: string;
  value: string;
  unit?: string;
  description?: string;
  isPublic: boolean;
  order: number;
}

export interface ParticipationApplication {
  id: string;
  type: ParticipationType;
  name: string;
  phone: string;
  email: string;
  organization?: string; // 기관 협력 신청 시 소속 기관명
  message?: string;
  privacyAgreed: boolean;
  createdAt: string;
  status: '접수완료' | '확인중' | '처리완료';
}

export type InquiryType = '일반문의' | '사업문의' | '협력문의';

export interface ContactInquiry {
  id: string;
  type: InquiryType;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
  createdAt: string;
  status: '대기중' | '답변완료';
}

export interface DebugLog {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  holder: string;
}

export interface OrgStats {
  /** 관리자가 직접 입력하는 지표. 실제 수치가 없으면 필드를 비워두면
   * 홈페이지에서 해당 항목이 자동으로 숨겨집니다 (허위 수치 표시 방지). */
  participantCount?: number;
  partnerCount?: number;
  programCount?: number;
  cumulativeActivityCount?: number;
}

export interface OrgSettings {
  name: string;
  englishName: string;
  sloganMain: string;
  sloganSub: string;
  /** 대표자 직함 (예: 이사장, 대표이사 — 조합 정관에 맞게 관리자가 지정) */
  representativeTitle: string;
  representativeName: string;
  representativeImageUrl?: string;
  representativeGreeting?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  establishedYear: string;
  /** 사업자(고유번호) 등록번호 — 관리자 입력 전까지는 비워둠 */
  businessRegistrationNumber?: string;
  businessTypeLabel?: string;
  address: string;
  mapEmbedUrl?: string;
  phone: string;
  fax?: string;
  email: string;
  operatingHours: string;
  bankAccounts?: BankAccount[];
  snsLinks: {
    naver?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  coreValues: CoreValue[];
  operatingPrinciples: OperatingPrinciple[];
  orgChart: OrgChartItem[];
  purposeStatement?: string; // 설립 목적 소개 문구
  introStatement?: string; // 조합 소개 문구
  galleryCategories: string[];
  stats: OrgStats;
}

export type ActiveTab =
  | 'main'
  | 'about'
  | 'business'
  | 'news'
  | 'gallery'
  | 'partners'
  | 'contact'
  | 'membership'
  | 'donation'
  | 'governance'
  | 'social-value'
  | 'privacy'
  | 'terms'
  | 'news-detail'
  | 'gallery-detail'
  | 'business-detail'
  | 'not-found';

export type AboutSubTab = 'greeting' | 'intro' | 'history' | 'organization' | 'principles';
