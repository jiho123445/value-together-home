# V12 — gachi.or.kr 실도메인 배포 준비

## 반영 내용
- 기본 canonical URL을 `https://gachi.or.kr/`로 변경
- Open Graph `og:url`, `og:image`, `og:image:secure_url`을 `gachi.or.kr` 기준으로 변경
- Twitter/X 이미지 URL을 `gachi.or.kr` 기준으로 변경
- Organization JSON-LD의 `url`, `logo`를 `gachi.or.kr` 기준으로 변경
- `SEOHead.tsx`의 production 기본 SITE를 `https://gachi.or.kr`로 변경
- `generate-previews.mjs`의 sitemap/정적 미리보기 기본 SITE_ORIGIN을 `https://gachi.or.kr`로 변경
- `robots.txt`의 Sitemap 주소를 `https://gachi.or.kr/sitemap.xml`로 변경
- `.env.example`에 `VITE_SITE_URL` / `SITE_URL` 설정 추가
- `DOMAIN-GACHI-DEPLOYMENT.md`에 Vercel/Firebase/DNS 연결 체크리스트 추가

## 중요한 점
도메인 DNS 연결 자체는 소스코드로 처리할 수 없습니다. Vercel 프로젝트의 Domains에 `gachi.or.kr`을 추가하고 도메인 등록기관 DNS를 Vercel이 안내하는 값으로 설정해야 합니다.

Firebase Authentication을 사용하는 관리자 모드이므로 Firebase Console의 Authentication > Settings > Authorized domains에 `gachi.or.kr`도 추가해야 합니다.
