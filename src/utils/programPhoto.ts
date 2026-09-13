/**
 * 주요사업 카드/상세 페이지에 쓸 대표 이미지를 결정한다.
 *
 * 우선순위: (1) 관리자가 직접 업로드한 이미지(Storage 다운로드 URL 또는
 * /uploads/ 경로) → (2) program.imageUrl에 이미 지정된 값(기본 데이터의
 * 브랜드 일러스트 경로 등) → (3) id/코드/카테고리로 찾은 기본 일러스트.
 */
const DEFAULT_PROGRAM_PHOTOS: Record<string, string> = {
  'prog-01': '/images/programs/program-social-service.jpg',
  'prog-02': '/images/programs/program-education.jpg',
  'prog-03': '/images/programs/program-community.jpg',
  'prog-04': '/images/programs/program-care-welfare.jpg',
  'prog-05': '/images/programs/program-job-support.jpg',
  'prog-06': '/images/programs/program-etc.jpg',
  'prog-07': '/images/programs/program-community.jpg',
  '01': '/images/programs/program-social-service.jpg',
  '02': '/images/programs/program-education.jpg',
  '03': '/images/programs/program-community.jpg',
  '04': '/images/programs/program-care-welfare.jpg',
  '05': '/images/programs/program-job-support.jpg',
  '06': '/images/programs/program-etc.jpg',
  '07': '/images/programs/program-community.jpg',
  '사회서비스': '/images/programs/program-social-service.jpg',
  '교육사업': '/images/programs/program-education.jpg',
  '지역사회사업': '/images/programs/program-community.jpg',
  '돌봄복지사업': '/images/programs/program-care-welfare.jpg',
  '일자리자립지원': '/images/programs/program-job-support.jpg',
  '기타사업': '/images/programs/program-etc.jpg',
  '장애인 활동 지원 인재 양성': '/images/programs/program-care-welfare.jpg',
  '노인 관련 민간 자격증 발급': '/images/programs/program-education.jpg',
  '주민 역량 강화 및 교육': '/images/programs/program-community.jpg',
  '사회복지 위탁사업': '/images/programs/program-care-welfare.jpg',
  '조합원·직원 교육': '/images/programs/program-education.jpg',
  '조합 간 협력': '/images/programs/program-community.jpg',
  '홍보·지역사회사업': '/images/programs/program-community.jpg',
};

export function getProgramPhoto(
  program: { id?: string; code?: string; category?: string; imageUrl?: string },
  getImageUrl?: (url?: string) => string
): string {
  // 관리자가 업로드한 커스텀 이미지(Firebase Storage 다운로드 URL, 또는
  // 로컬 업로드 경로)라면 그대로 사용한다.
  if (
    program.imageUrl &&
    (program.imageUrl.startsWith('data:') ||
      program.imageUrl.startsWith('http') ||
      program.imageUrl.startsWith('/uploads/'))
  ) {
    return getImageUrl ? getImageUrl(program.imageUrl) : program.imageUrl;
  }

  // 이미 기본 데이터에 지정된 로컬 이미지 경로가 있다면 그대로 사용한다.
  if (program.imageUrl) {
    return program.imageUrl;
  }

  // ID, 코드, 카테고리 순으로 기본 일러스트를 찾는다.
  if (program.id && DEFAULT_PROGRAM_PHOTOS[program.id]) {
    return DEFAULT_PROGRAM_PHOTOS[program.id];
  }
  if (program.code && DEFAULT_PROGRAM_PHOTOS[program.code]) {
    return DEFAULT_PROGRAM_PHOTOS[program.code];
  }
  if (program.category && DEFAULT_PROGRAM_PHOTOS[program.category]) {
    return DEFAULT_PROGRAM_PHOTOS[program.category];
  }
  return '/images/programs/program-social-service.jpg';
}
