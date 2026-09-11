# 사회적협동조합 가치함께 홈페이지

`happy-share-main(3).zip`의 검증된 Firebase/관리자/라우팅 구조를 기반으로 브랜드와 공개 UI를 `사회적협동조합 가치함께`에 맞게 재구성한 프로젝트입니다.

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 검증

```bash
npm run lint
npm test
npm run test:security
npm run build
```

## 배포 전

- 새로운 Firebase 프로젝트/환경변수 사용
- `VITE_ADMIN_UID` 설정
- Firestore/Storage Rules의 관리자 UID 교체
- 실제 기관정보/로고/사업콘텐츠 입력
