import { FoundationSettings, TimelineItem, ProgramItem, NoticeItem, GalleryItem, PopupItem } from '../types';

export const INITIAL_GALLERY_CATEGORIES: string[] = ['교육', '복지', '지역사회', '행사', '협력'];

export const INITIAL_SETTINGS: FoundationSettings = {
  name: '사회적협동조합 가치함께',
  englishName: 'Value Together Social Cooperative',
  chairmanName: '대표자 정보 입력',
  chairmanImageUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85',
  familyCenterImageUrl: '',
  chairmanGreeting: '사람과 지역이 함께 성장할 수 있는 사회적 가치를 만들겠습니다. 가치함께는 협동과 연대의 힘으로 더 나은 일상을 만들어 갑니다.',
  sloganMain: '사람이 만드는 오늘, 함께 만드는 더 나은 내일',
  sloganSub: '사람과 가치, 지역이 함께하는 사회적협동조합 가치함께',
  establishedYear: '정보 입력',
  reorganizedYear: '',
  address: '주소 정보 입력',
  phone: '전화번호 입력',
  fax: '',
  email: '이메일 입력',
  operatingHours: '평일 09:00 - 18:00',
  bankAccounts: [],
  snsLinks: { naver: '', facebook: '', instagram: '', youtube: '' },
  galleryCategories: INITIAL_GALLERY_CATEGORIES,
};

export const INITIAL_TIMELINE: TimelineItem[] = [
  { year: '설립', title: '사회적협동조합 가치함께 출범', subtitle: '함께 만드는 사회적 가치의 시작', description: '사람과 지역사회의 지속가능한 성장을 위해 협동과 연대의 가치를 바탕으로 출발합니다.', category: '출범', isMilestone: true },
  { year: '사업확대', title: '지역사회 기반 사회서비스 확대', subtitle: '필요한 곳에 필요한 연결을', description: '지역의 필요를 발굴하고 교육·돌봄·복지·일자리 등 다양한 사회서비스와 연결합니다.', category: '사업확대' },
  { year: '현재', title: '함께 성장하는 지역 플랫폼', subtitle: '사람·기관·지역을 연결', description: '조합원과 이용자, 지역기관이 함께 참여하는 지속가능한 협력 생태계를 만들어 갑니다.', category: '사업확대', isMilestone: true }
];

export const INITIAL_PROGRAMS: ProgramItem[] = [
  { id: 'prog-01', code: '01', title: '사회서비스', subtitle: '필요한 사람에게 필요한 서비스를', summary: '지역주민의 다양한 욕구에 맞춘 맞춤형 사회서비스를 기획하고 연결합니다.', details: ['지역 수요 기반 서비스 기획', '취약계층 맞춤형 지원', '기관·전문가 자원 연계', '이용자 중심 서비스 개선'], iconName: 'HeartHandshake', targetAudience: '지역주민 및 사회서비스 이용자', impactMessage: '서비스가 필요한 순간, 적절한 연결이 일상을 바꿉니다.', badge: '돌봄과 복지' },
  { id: 'prog-02', code: '02', title: '교육·평생학습', subtitle: '배움이 성장으로 이어지도록', summary: '아동·청소년·성인 누구나 참여할 수 있는 실용적 교육과 평생학습을 지원합니다.', details: ['디지털·AI 활용 교육', '직업능력 및 역량개발', '맞춤형 평생학습 프로그램', '지역 교육기관 협력'], iconName: 'BookOpen', targetAudience: '아동·청소년·성인·지역기관', impactMessage: '배움의 기회를 넓혀 개인의 성장과 지역의 경쟁력을 함께 높입니다.', badge: '배움과 성장' },
  { id: 'prog-03', code: '03', title: '일자리·자립지원', subtitle: '자립할 수 있는 기반을 함께', summary: '역량개발과 일자리 연계를 통해 지속가능한 자립을 돕습니다.', details: ['취업역량 강화', '직업·일자리 정보 제공', '유관기관 일자리 연계', '사회적경제 참여 지원'], iconName: 'BriefcaseBusiness', targetAudience: '구직자·취약계층·지역인재', impactMessage: '한 사람의 자립이 한 가정과 지역의 변화를 만듭니다.', badge: '자립과 일자리' },
  { id: 'prog-04', code: '04', title: '지역사회 협력', subtitle: '혼자가 아닌 함께의 힘으로', summary: '공공·민간·시민사회가 함께 문제를 발견하고 해결하는 협력사업을 추진합니다.', details: ['기관 간 협력 네트워크', '지역문제 해결 프로젝트', '자원봉사·후원 연계', '사회적경제 생태계 확장'], iconName: 'UsersRound', targetAudience: '공공기관·민간기관·주민·조합원', impactMessage: '연결이 많아질수록 지역의 문제 해결력도 커집니다.', badge: '협력과 연대' },
];

export const INITIAL_NOTICES: NoticeItem[] = [
  { id: 'notice-01', title: '가치함께 홈페이지가 새롭게 시작합니다.', category: '공지사항', date: '2026-09-01', views: 0, isImportant: true, author: '가치함께', content: '사회적협동조합 가치함께의 공식 홈페이지를 개편했습니다. 주요 사업과 소식을 편리하게 확인하실 수 있습니다.' },
  { id: 'notice-02', title: '2026년 하반기 프로그램 안내', category: '모집공고', date: '2026-09-05', views: 0, author: '가치함께', content: '하반기 교육·지역사회 프로그램은 기관 일정에 맞춰 순차적으로 안내합니다. 실제 모집 일정과 대상은 공지사항을 통해 확인해 주세요.' },
  { id: 'notice-03', title: '협력기관 및 조합원 참여 안내', category: '사업소식', date: '2026-09-08', views: 0, author: '가치함께', content: '가치함께는 사람과 기관, 지역이 함께 성장할 수 있는 협력 모델을 만들어 갑니다. 협력 문의는 문의하기를 이용해 주세요.' }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 'gallery-01', title: '함께 배우는 지역사회', category: '교육', date: '2026-08-20', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=85', images: [], description: '교육과 소통으로 연결되는 가치함께의 현장입니다.', location: '가치함께 활동 현장' },
  { id: 'gallery-02', title: '지역과 함께하는 협력 활동', category: '지역사회', date: '2026-08-10', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85', images: [], description: '지역기관과 주민이 함께 참여하는 협력 활동을 기록합니다.', location: '지역사회' },
  { id: 'gallery-03', title: '사람을 잇는 나눔', category: '복지', date: '2026-07-24', imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85', images: [], description: '작은 나눔이 따뜻한 변화로 이어지는 현장입니다.', location: '지역사회' }
];

export const INITIAL_PRESS_COVERAGE = [];
export const INITIAL_DONATIONS = [];
export const INITIAL_POPUPS: PopupItem[] = [];
