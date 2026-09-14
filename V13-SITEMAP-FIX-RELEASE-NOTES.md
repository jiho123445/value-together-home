# V13 Sitemap / Production Domain Fix

## 문제
- `https://gachi.or.kr/sitemap.xml`은 정상 응답했지만 `<loc>`가 이전 `value-together-home-gray.vercel.app` 주소를 가리키는 문제가 확인되었습니다.

## 수정
- `scripts/generate-previews.mjs`의 production sitemap/canonical origin을 `https://gachi.or.kr`로 고정했습니다.
- `SITE_URL` 또는 `VITE_SITE_URL`에 남아 있는 과거 Vercel 값이 sitemap에 유입되지 않도록 했습니다.
- Firebase 프로젝트 ID가 없거나 Firestore 조회가 실패해도 정적 경로가 포함된 sitemap을 생성하도록 보강했습니다.
- sitemap 생성 시 production origin 외 URL이 포함되면 오류를 발생시키는 검증을 추가했습니다.
- `public/sitemap.xml` 정적 fallback을 추가했습니다.

## 배포 후 확인
1. Vercel Production 재배포
2. `https://gachi.or.kr/sitemap.xml` 직접 확인
3. 모든 `<loc>`가 `https://gachi.or.kr/`로 시작하는지 확인
4. Google Search Console에서 기존 실패 sitemap을 제거하거나 다시 제출

## 주의
- 기존 Firebase 환경변수는 변경하지 않습니다.
- 가비아의 Google Search Console TXT 인증 레코드는 삭제하지 않습니다.
