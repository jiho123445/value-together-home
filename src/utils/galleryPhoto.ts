/**
 * 활동갤러리 카드/상세 페이지에 쓸 대표 이미지를 결정한다.
 *
 * 우선순위: (1) 관리자가 직접 업로드한 이미지(Storage 다운로드 URL 또는
 * /uploads/ 경로) → (2) item.imageUrl에 이미 지정된 값(기본 데이터의
 * 브랜드 일러스트 경로 등) → (3) id/카테고리로 찾은 기본 일러스트.
 */
const DEFAULT_GALLERY_PHOTOS: Record<string, string> = {
  'gallery-01': '/images/gallery/gallery-education-01.jpg',
  'gallery-02': '/images/gallery/gallery-education-02.jpg',
  'gallery-03': '/images/gallery/gallery-welfare-01.jpg',
  'gallery-04': '/images/gallery/gallery-welfare-02.jpg',
  'gallery-05': '/images/gallery/gallery-community-01.jpg',
  'gallery-06': '/images/gallery/gallery-community-02.jpg',
  'gallery-07': '/images/gallery/gallery-event-01.jpg',
  'gallery-08': '/images/gallery/gallery-etc-01.jpg',
  '교육': '/images/gallery/gallery-education-01.jpg',
  '복지': '/images/gallery/gallery-welfare-01.jpg',
  '지역사회': '/images/gallery/gallery-community-01.jpg',
  '행사': '/images/gallery/gallery-event-01.jpg',
  '기타': '/images/gallery/gallery-etc-01.jpg',
};

export function getGalleryPhoto(
  item: { id?: string; category?: string; imageUrl?: string },
  getImageUrl?: (url?: string) => string
): string {
  // 관리자가 업로드한 커스텀 이미지(Firebase Storage 다운로드 URL, 또는
  // 로컬 업로드 경로)라면 그대로 사용한다.
  if (
    item.imageUrl &&
    (item.imageUrl.startsWith('data:') ||
      item.imageUrl.startsWith('http') ||
      item.imageUrl.startsWith('/uploads/'))
  ) {
    return getImageUrl ? getImageUrl(item.imageUrl) : item.imageUrl;
  }

  // 이미 기본 데이터에 지정된 로컬 이미지 경로가 있다면 그대로 사용한다.
  if (item.imageUrl) {
    return item.imageUrl;
  }

  // ID, 카테고리 순으로 기본 일러스트를 찾는다.
  if (item.id && DEFAULT_GALLERY_PHOTOS[item.id]) {
    return DEFAULT_GALLERY_PHOTOS[item.id];
  }
  if (item.category && DEFAULT_GALLERY_PHOTOS[item.category]) {
    return DEFAULT_GALLERY_PHOTOS[item.category];
  }
  return '/images/gallery/gallery-community-01.jpg';
}
