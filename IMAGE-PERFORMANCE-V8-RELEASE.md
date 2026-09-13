# V8 이미지 로딩 성능 개선

1. Firestore 동기화 때마다 `?v=현재시각`을 붙이던 이미지 cache-busting 제거
2. Firebase Storage의 고유 다운로드 URL을 그대로 사용하여 브라우저 캐시 활용
3. Hero 이미지에 `loading="eager"`, `fetchPriority="high"`, `decoding="async"` 적용
4. 핵심가치 이미지 4개에 `loading="eager"`, `decoding="async"` 적용
5. 관리자 이미지 업로드 시 최대 2000px로 리사이즈하고 가능한 경우 WebP 품질 0.82로 압축
6. 새로 업로드되는 Firebase Storage 이미지에 `public,max-age=31536000,immutable` 캐시 설정
7. 갤러리 및 하단 콘텐츠의 기존 lazy loading 유지
8. 현재 Vercel 주소 기준 Open Graph/카카오톡 메타태그 유지

주의: 기존 Firebase Storage에 이미 올라간 대용량 이미지는 자동 재압축되지 않습니다. 새로 업로드하는 이미지부터 최적화가 적용됩니다.
