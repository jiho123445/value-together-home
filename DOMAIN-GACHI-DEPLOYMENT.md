# gachi.or.kr 실도메인 배포 체크리스트

## 소스 반영
- `index.html`의 canonical / Open Graph / JSON-LD 기본 URL: `https://gachi.or.kr`
- `src/components/common/SEOHead.tsx`의 기본 SITE: `https://gachi.or.kr`
- `scripts/generate-previews.mjs`의 SITE_ORIGIN 기본값: `https://gachi.or.kr`
- `public/robots.txt`의 Sitemap: `https://gachi.or.kr/sitemap.xml`

## Vercel
1. GitHub 저장소에 이 버전을 배포합니다.
2. Vercel 프로젝트 → Settings → Domains → `gachi.or.kr` 추가.
3. 도메인 등록기관 DNS에서 Vercel이 안내하는 값을 정확히 설정합니다.
4. Vercel에서 `gachi.or.kr`의 SSL 인증서가 Ready인지 확인합니다.
5. Vercel의 기존 Firebase 환경변수는 유지합니다. Production sitemap/canonical 생성 주소는 소스에서 `https://gachi.or.kr`로 고정되어 있어 과거 Vercel 주소가 유입되지 않습니다. `VITE_SITE_URL`/`SITE_URL`을 별도로 설정하더라도 production sitemap의 origin은 변경되지 않습니다.
6. Firebase Authentication → Settings → Authorized domains에 `gachi.or.kr`을 추가합니다. (관리자 로그인 등 Firebase Auth를 사용하는 경우 필수)
7. Firebase App Check를 사용하는 경우 reCAPTCHA 설정에서도 실제 도메인 `gachi.or.kr`을 허용합니다.

## 배포 후 확인
- `https://gachi.or.kr/`
- `https://gachi.or.kr/robots.txt`
- `https://gachi.or.kr/sitemap.xml`
- 카카오톡 링크 공유 시 OG 이미지/제목이 `gachi.or.kr` 기준으로 표시되는지 확인
- 관리자 로그인 및 사진 업로드 확인

## 주의
DNS 연결 자체는 소스코드에서 할 수 없습니다. DNS/Vercel Domain 설정은 배포 후 한 번 별도로 해야 합니다.
