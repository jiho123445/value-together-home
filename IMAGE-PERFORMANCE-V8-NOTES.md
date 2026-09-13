# V8 이미지 성능 개선

- 이미지 URL에 Firestore 동기화 시각을 붙이던 cache-busting 제거
- Firebase Storage 이미지 URL은 고유 URL 자체를 캐시 키로 사용
- Hero 이미지: eager + fetchPriority=high + async decoding
- 핵심가치 이미지 4개: eager + async decoding
- 관리자 이미지 업로드: 최대 2000px, WebP 품질 0.82로 브라우저 최적화
- 업로드된 이미지: `public,max-age=31536000,immutable` 캐시
- 갤러리/하단 콘텐츠: 기존 lazy loading 유지

## 의도

이미지 교체 시 새 Firebase Storage 파일 URL이 생성되므로 장기 캐시를 사용해도
교체된 이미지가 이전 이미지에 고정되는 문제가 생기지 않는다.
