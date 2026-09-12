# 사회적협동조합 가치함께 — 홈페이지

React 19 + TypeScript(strict) + Vite 6 + Tailwind CSS v4 + Firebase(Auth·Firestore·Storage) 기반의 공식 홈페이지 소스코드입니다.

기존 사단법인 너브내행복나눔재단 홈페이지(happy-share-main)의 **검증된 기술 구조**(Firebase 데이터 분리 방식, 업로드 보안, 실제 URL 라우팅, SEO 인프라, 백업 체계, CI)를 재사용하되, **콘텐츠·브랜드·Firebase 프로젝트는 완전히 새로 분리**하여 만들었습니다. 두 단체의 데이터는 어떤 경우에도 섞이지 않습니다.

---

## 목차

1. [프로젝트 구조](#1-프로젝트-구조)
2. [Firebase 프로젝트 설정 방법](#2-firebase-프로젝트-설정-방법)
3. [Firestore 데이터 구조](#3-firestore-데이터-구조)
4. [Firestore / Storage 보안 규칙](#4-firestore--storage-보안-규칙)
4-1. [App Check 설정 방법 (선택, 권장)](#4-1-app-check-설정-방법-선택-권장)
5. [관리자 계정 설정](#5-관리자-계정-설정)
5-1. [관리자 2단계 인증(MFA) 설정 방법](#5-1-관리자-2단계-인증mfa-설정-방법)
6. [환경변수 설정](#6-환경변수-설정)
7. [로컬 실행 방법](#7-로컬-실행-방법)
8. [GitHub 업로드 방법](#8-github-업로드-방법)
9. [Vercel 배포 방법](#9-vercel-배포-방법)
10. [배포 후 점검 사항](#10-배포-후-점검-사항)
11. [관리자 사용 가이드](#11-관리자-사용-가이드)
12. [보안 점검 결과](#12-보안-점검-결과)
13. [SEO 점검 결과](#13-seo-점검-결과)
14. [향후 개선 제안](#14-향후-개선-제안)
15. [알려진 제약사항](#15-알려진-제약사항)

---

## 1. 프로젝트 구조

```
gachihamkke/
├── src/
│   ├── App.tsx                     # 최상위 레이아웃/라우팅 스위치
│   ├── main.tsx                    # 진입점 (에러 리스너, 애널리틱스 초기화)
│   ├── types.ts                    # 전체 데이터 모델 (콘텐츠/보안 설계 노트 포함)
│   ├── index.css                   # Tailwind v4 디자인 토큰(@theme)
│   ├── context/ValueTogetherContext.tsx   # 전역 상태·CRUD·실시간 동기화·라우팅
│   ├── lib/                        # firebase.ts, firestoreService.ts
│   ├── utils/                      # 업로드 검증, 스팸 방지, 감사로그, 에러로그 등
│   ├── data/initialData.ts         # 최초 배포 시 시드 데이터(전부 placeholder)
│   ├── components/
│   │   ├── common/                 # Logo, Pagination, SEOHead, ModalViewer, PopupModal 등
│   │   ├── layout/                 # Header, Footer, FloatingQuickMenu
│   │   └── home/                   # 메인 페이지 섹션들
│   ├── pages/                      # About/Business/News/Gallery/Partners/Contact 등 페이지
│   └── admin/                      # 관리자 전용 화면 (React.lazy로 완전히 분리된 번들)
│       ├── AdminApp.tsx / AdminLogin.tsx / AdminShell.tsx
│       ├── components/ImageUploadField.tsx
│       └── tabs/                   # Dashboard/Settings/Programs/Notices/Gallery/...
├── scripts/                        # 보안점검·백업·미리보기(OG)생성·스모크테스트
├── .github/workflows/              # CI, 자동 백업
├── firestore.rules / storage.rules
├── server.ts / api/index.ts / src/serverApp.ts   # 로컬 dev 서버 + Vercel 서버리스 함수
└── vercel.json
```

### 메뉴 구조 설계 노트

원 요청서에는 8개 상단 메뉴가 제시되었으나, "사업소식/알림마당"과 "오시는 길/문의하기"처럼 방문자 입장에서 실질적으로 같은 성격의 콘텐츠가 서로 다른 메뉴에 중복 배치되어 있었습니다. 이를 아래 **6개 상단 메뉴**로 통합했습니다 (콘텐츠 종류는 하나도 빠짐없이 카테고리/구분 필드로 보존됨). 자세한 판단 근거는 `src/types.ts` 상단 주석과 별도로 전달드린 Phase 1 분석 보고서에 기록되어 있습니다.

1. 가치함께 소개 (about) — 인사말/조합소개/연혁/조직도/운영원칙
2. 주요사업 (business)
3. 소식 (news) — 공지사항·사업소식·모집공고·보도자료·자료실
4. 활동갤러리 (gallery)
5. 협력 및 참여 (partners) — 조합원가입·자원봉사·후원협력·기관협력 신청 + 협력기관 소개
6. 오시는 길·문의 (contact)

---

## 2. Firebase 프로젝트 설정 방법

1. [Firebase Console](https://console.firebase.google.com/)에서 **가치함께 전용 새 프로젝트**를 생성합니다. (기존 너브내행복나눔재단 프로젝트를 **절대 재사용하지 마세요**.)
2. Firestore Database를 생성합니다 (프로덕션 모드, 리전은 `asia-northeast3(서울)` 권장).
3. Authentication에서 "이메일/비밀번호" 로그인 방식을 활성화합니다.
4. Storage를 생성합니다.
5. 프로젝트 설정 > 일반 > "내 앱" > 웹 앱 추가 후 표시되는 설정값을 6번(환경변수) 항목에 입력합니다.

## 3. Firestore 데이터 구조

공개 콘텐츠는 문서 1개당 1MB 제한을 피하기 위해 **`content` 컬렉션 아래 영역별로 분리된 여러 문서**로 저장됩니다. 개인정보가 포함된 데이터는 별도의 최상위 컬렉션으로 완전히 분리됩니다.

| 경로 | 설명 | 읽기 | 쓰기 |
|---|---|---|---|
| `content/settings` | 기관 기본정보, 핵심가치, 운영원칙, 조직도, 실적통계, SNS 등 | 전체 공개 | 관리자만 |
| `content/timeline` | 연혁 (`items: TimelineItem[]`) | 전체 공개 | 관리자만 |
| `content/programs` | 주요사업 (`items: ProgramItem[]`) | 전체 공개 | 관리자만 |
| `content/notices` | 소식 (`items: NoticeItem[]`) | 전체 공개 | 관리자만 |
| `content/gallery` | 갤러리 (`items: GalleryItem[]`, `categories: string[]`) | 전체 공개 | 관리자만 |
| `content/popups` | 메인 팝업 (`items: PopupItem[]`) | 전체 공개 | 관리자만 |
| `content/partners` | 협력기관 (`items: PartnerItem[]`) | 전체 공개 | 관리자만 |
| `participations/{id}` | 참여·협력 신청 (개인정보 포함) | 관리자만 | 생성은 누구나(검증됨), 조회/수정/삭제는 관리자만 |
| `inquiries/{id}` | 문의사항 (개인정보 포함) | 관리자만 | 생성은 누구나(검증됨), 조회/수정/삭제는 관리자만 |
| `visits/{id}` | 페이지뷰 카운터(개인정보 없음, 대시보드 "오늘 페이지뷰" 지표) | 관리자만 | 생성은 누구나(검증됨) |
| `errorLogs/{id}` | 클라이언트 에러 리포트 | 관리자만 | 생성은 누구나(검증됨) |
| `auditLogs/{id}` | 관리자 행위 감사 로그 | 관리자만 | 관리자만 |

정확한 필드 스키마는 `src/types.ts`를 참고하세요. 모든 타입에 한글 주석으로 각 필드의 용도가 설명되어 있습니다.

## 4. Firestore / Storage 보안 규칙

`firestore.rules`, `storage.rules` 파일을 Firebase Console(또는 Firebase CLI: `firebase deploy --only firestore:rules,storage:rules`)로 배포하세요.

**배포 전 반드시** 두 파일에서 `REPLACE_WITH_NEW_ADMIN_UID`를 실제 관리자 계정의 UID로 교체해야 합니다 (5번 항목 참고). 이 상수는 Rules 파일에만 존재하며 클라이언트 번들에는 포함되지 않는 서버 측 보안 경계입니다.

핵심 원칙:
- 실제 권한 판단은 항상 Firebase Security Rules에서 이루어지며, 클라이언트 코드(`isAdmin` 상태값)는 화면 표시 여부만 결정합니다.
- 개인정보 포함 컬렉션(`participations`, `inquiries`)은 방문자가 "생성"만 할 수 있고, 생성 시 필드 구성·타입·길이가 Rules에서 서버 측으로 검증됩니다.
- 이미지/첨부파일은 Storage Rules에서 다시 한 번 용량·MIME 타입·확장자를 검증합니다 (클라이언트 검증은 사용자 경험을 위한 1차 방어일 뿐입니다).

## 4-1. App Check 설정 방법 (선택, 권장)

로그인 없이 누구나 쓸 수 있는 공개 폼(문의하기, 참여·후원 신청)과 페이지뷰 카운터(`visits` 컬렉션)는 구조상 봇/자동화 스크립트의 대량 요청에 노출되어 있습니다. `firestore.rules`의 필드 검증과 코드 상의 레이트리밋(`src/utils/spamGuard.ts`)이 1차 방어선이지만, "이 요청이 실제로 우리 웹사이트에서 브라우저로 보낸 것인지"까지는 확인해 주지 못합니다. **Firebase App Check**가 그 역할을 하는 서비스이며, 코드에는 이미 연동 로직이 준비되어 있습니다(`src/lib/firebase.ts`) — 아래 Firebase Console 설정만 완료하면 됩니다.

1. [Firebase Console](https://console.firebase.google.com/) > 프로젝트 선택 > 왼쪽 메뉴 **App Check**로 이동합니다.
2. "앱 등록"에서 이 프로젝트의 웹 앱을 선택하고, 공급자로 **reCAPTCHA v3**를 선택합니다. Firebase가 자동으로 reCAPTCHA v3 사이트 키를 발급해 주거나, 이미 가진 키를 연결할 수 있습니다.
3. 발급된 **사이트 키**를 복사해서 `.env.local`(로컬)과 Vercel Environment Variables(배포)의 `VITE_RECAPTCHA_V3_SITE_KEY`에 붙여넣고, 다시 배포합니다.
4. 로컬 개발 시에는 reCAPTCHA v3가 `localhost`를 인증할 수 없으므로, 대신 "디버그 토큰"을 씁니다. `npm run dev`로 로컬 사이트를 열면 브라우저 콘솔에 임의의 디버그 토큰이 한 번 출력됩니다 — 이 값을 App Check > 앱 선택 > **"디버그 토큰 관리"**에 한 번 등록해 두면, 이후로는 로컬 개발이 계속 정상 동작합니다.
5. 배포 후 며칠간은 강제 적용(Enforce)하지 말고 **"모니터링(Unenforced)"** 상태로 두세요. App Check > Firestore / App Check > Storage 각각의 "지표(Metrics)" 탭에서 실제 방문자 요청 대부분이 "확인됨(Verified)"으로 표시되는지 확인한 뒤에 "적용(Enforce)"으로 전환해야, 실제 방문자가 실수로 차단되는 사고를 피할 수 있습니다.
6. 확인이 끝나면 App Check > Firestore, App Check > Storage 각각에서 **"적용(Enforce)"**으로 전환합니다. 이 순간부터 App Check 토큰이 없는 요청(스크립트로 직접 Firestore API를 호출하는 등)은 서버 단에서 거부됩니다.

`VITE_RECAPTCHA_V3_SITE_KEY`를 설정하지 않으면 App Check는 그냥 비활성화된 채로 남아 있고 사이트는 지금처럼 정상 동작합니다 — 급하지 않다면 나중에 언제든 추가해도 됩니다.

## 5. 관리자 계정 설정

1. Firebase Console > Authentication > Users에서 "사용자 추가"로 관리자 이메일/비밀번호 계정을 만듭니다.
2. 생성된 사용자의 **UID**를 복사합니다.
3. `firestore.rules`와 `storage.rules`의 `REPLACE_WITH_NEW_ADMIN_UID`를 이 UID로 교체하고 재배포합니다.
4. `.env.local`(로컬) 및 Vercel 환경변수(배포)에 `VITE_ADMIN_UID`(같은 UID)와 `VITE_ADMIN_EMAIL`을 설정합니다.
5. 관리자 화면은 사이트 하단 푸터의 작은 "관리자" 링크로 들어갈 수 있습니다. 비밀번호는 소스코드 어디에도 저장되어 있지 않으며, Firebase Authentication이 전적으로 인증을 담당합니다.

## 5-1. 관리자 2단계 인증(MFA) 설정 방법

현재 조합의 관리자 계정은 홈페이지 전체 콘텐츠와 문의/참여신청을 관리하므로, **관리자 1명 수준에서 필요한 최소한의 추가 보호**로 TOTP(인증 앱) 2단계 인증을 사용합니다. SMS MFA나 별도의 외부 QR 서비스는 사용하지 않습니다.

### 1) Firebase에서 Identity Platform 업그레이드

Firebase Console > Authentication에서 **Identity Platform 업그레이드**를 완료합니다. 현재 프로젝트는 이 단계가 완료된 상태입니다.

### 2) 프로젝트에서 TOTP 한 번만 활성화

TOTP는 현재 Firebase Console의 SMS MFA 버튼으로 켜는 기능이 아닙니다. Google 공식 문서 기준으로 **Admin SDK 또는 Identity Platform REST API**로 프로젝트 수준에서 TOTP를 활성화합니다.

가장 간단한 방법은 Google Cloud Shell에서 아래 명령을 한 번 실행하는 것입니다. Cloud Shell에는 `gcloud`가 이미 준비되어 있습니다.

```bash
curl -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/value-together-home/config?updateMask=mfa" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -H "X-Goog-User-Project: value-together-home" \
  -d '{
    "mfa": {
      "providerConfigs": [{
        "state": "ENABLED",
        "totpProviderConfig": {
          "adjacentIntervals": 5
        }
      }]
    }
  }'
```

`adjacentIntervals`는 인증 앱과 서버의 시간 차이를 허용하는 값이며, 5는 Google 공식 문서의 기본값입니다.

### 3) 관리자 화면에서 인증 앱 등록

1. 관리자 계정으로 홈페이지에 로그인합니다.
2. 관리자 메뉴의 **보안**을 선택합니다.
3. **2단계 인증 설정 시작**을 누릅니다.
4. 현재 관리자 비밀번호를 한 번 더 입력합니다.
5. 화면에 표시되는 **설정 키**를 Google Authenticator 또는 Microsoft Authenticator 등의 인증 앱에 **수동 입력**으로 등록합니다.
6. 앱에 표시되는 6자리 코드를 입력하고 **등록 완료**를 누릅니다.

등록이 끝나면 다음 로그인부터 **비밀번호 + 6자리 인증 코드**가 필요합니다.

### 4) 인증 앱을 하나 더 등록할 필요가 있을 때

현재 관리자 규모에서는 예비 휴대폰이 있다면 인증 앱을 하나 더 등록해 두는 정도면 충분합니다. 별도의 복구 서버나 복잡한 백업 시스템은 현재 범위에서 구축하지 않습니다.

### 5) 인증 앱 해제

해제할 때도 현재 관리자 비밀번호를 한 번 더 확인하도록 되어 있습니다. 해제하면 다음 로그인부터 비밀번호만으로 로그인하게 되므로, 필요할 때만 사용하세요.

> **주의:** 인증 앱을 등록한 휴대폰을 분실하고 예비 기기도 없다면 관리자 계정의 MFA 복구가 필요할 수 있습니다. 이런 경우 Firebase/Identity Platform의 관리자 기능을 이용해 복구해야 합니다.

## 6. 환경변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 실제 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|---|---|
| `VITE_FIREBASE_API_KEY` 등 6개 | Firebase 프로젝트 설정값 |
| `VITE_FIREBASE_DATABASE_ID` | 기본 데이터베이스 사용 시 비워둠 |
| `VITE_ADMIN_UID` | 관리자 계정 UID (Rules와 반드시 동일한 값) |
| `VITE_ADMIN_EMAIL` | 관리자 이메일(참고용) |
| `VITE_GA_MEASUREMENT_ID` | (선택) Google Analytics 4 |

`.env.local`은 `.gitignore`에 의해 절대 커밋되지 않습니다. Vercel 배포 시에는 Vercel 프로젝트의 Settings > Environment Variables에 동일한 값을 등록하세요.

## 7. 로컬 실행 방법

```bash
npm install
cp .env.example .env.local   # 값 입력 후
npm run dev
```

`http://localhost:5173`에서 확인할 수 있습니다.

전체 검증(빌드 전 필수 확인):

```bash
npm run lint          # tsc --noEmit (TypeScript strict 검사)
npm test              # vitest
npm run test:security # 정적 보안 점검
npm run build         # vite build + 서버 번들 + OG 미리보기/sitemap 생성
```

> **중요 — 이번 작업 환경의 한계**: 이 소스코드를 작성한 개발 환경은 보안 정책상 `registry.npmjs.org`로의 외부 네트워크 접근이 차단되어 있어 `npm install`을 실행할 수 없었습니다. 따라서 위 4개 명령(lint/test/test:security/build)을 실제로 실행해 통과를 확인하지 **못했습니다**. 모든 import 경로, context 필드명, 컴포넌트 props는 코드 전체를 대조하는 정적 검사 스크립트로 교차 검증했지만, 이는 `tsc`의 완전한 타입 검사를 대체하지 못합니다. **로컬 환경에서 위 4개 명령을 반드시 직접 실행해 통과 여부를 확인한 뒤 배포해 주세요.** 오류가 발견되면 대부분 타입 하나를 조정하는 수준의 사소한 수정으로 해결될 것으로 예상됩니다.

## 8. GitHub 업로드 방법

```bash
git init
git add .
git commit -m "feat: 가치함께 홈페이지 초기 구축"
git branch -M main
git remote add origin <새로 만든 GitHub 저장소 URL>
git push -u origin main
```

`.gitignore`가 `node_modules/`, `dist/`, `.env*`(예외: `.env.example`)를 제외하므로 비밀값이 실수로 커밋될 위험이 낮습니다. 커밋 전 `git status`로 한 번 더 확인하세요.

GitHub Actions(`.github/workflows/ci.yml`, `backup.yml`)를 사용하려면 저장소 Settings > Secrets and variables > Actions에 6번 항목의 환경변수들을 등록하세요.

## 9. Vercel 배포 방법

1. [Vercel](https://vercel.com)에서 "New Project" > 방금 업로드한 GitHub 저장소 선택.
2. Framework Preset: **Vite**로 인식됩니다(`vercel.json`이 이미 구성되어 있음).
3. Environment Variables에 6번 항목의 값들을 모두 등록합니다.
4. Deploy.

`vercel.json`은 실제 URL 라우팅(새로고침/뒤로가기 대응), CSP 헤더, 캐시 정책을 이미 포함하고 있습니다.

## 10. 배포 후 점검 사항

- [ ] 메인 페이지 및 6개 메뉴가 모두 정상 로드되는지
- [ ] 소식/사업/갤러리 상세 페이지에서 **새로고침**해도 정상 표시되는지 (SPA 라우팅 확인)
- [ ] 브라우저 뒤로가기/앞으로가기가 자연스럽게 동작하는지
- [ ] 참여 신청서 / 문의하기 제출이 정상 접수되는지 (Firestore Console에서 확인)
- [ ] 관리자 로그인 후 콘텐츠 수정이 실시간으로 화면에 반영되는지
- [ ] 카카오톡/문자로 소식·사업·갤러리 링크를 공유했을 때 미리보기(제목/이미지)가 해당 항목에 맞게 표시되는지
- [ ] `/sitemap.xml`, `/robots.txt`가 정상 응답하는지
- [ ] 모바일(360~430px), 태블릿(768~1024px), PC(1280px 이상)에서 레이아웃 확인
- [ ] `npm run test:smoke`로 핵심 경로 응답 확인 (`SITE_URL=https://실제도메인 npm run test:smoke`)

## 11. 관리자 사용 가이드

1. 사이트 하단 "관리자" 링크 클릭 → 이메일/비밀번호 로그인.
2. **대시보드**: 오늘 페이지뷰, 등록된 소식/갤러리 수, 확인 대기 중인 참여신청·문의 건수, 최근 활동 로그를 한눈에 확인.
3. **기본정보/디자인**: 단체명·슬로건·대표자 인사말·연락처·SNS·핵심가치·운영원칙·조직도·연혁·실적통계를 섹션별로 저장.
4. **주요사업/소식/활동갤러리/협력기관/팝업**: 각각 추가·수정·삭제. 이미지는 반드시 화면의 업로드 버튼을 통해서만 등록하세요(직접 URL을 붙여넣지 마세요 — Storage 업로드 검증을 우회하게 됩니다).
5. **참여신청/문의사항**: 접수 내역 확인, 상태 변경(접수완료→확인중→처리완료 등), 개인정보가 포함되므로 목록은 관리자 로그인 상태에서만 보입니다. "엑셀 다운로드"로 명단을 내려받을 수 있습니다.
6. **로그/백업**: 에러 로그·관리자 활동(감사) 로그 조회, 콘텐츠 백업과 개인정보 백업을 분리하여 다운로드 가능.

## 12. 보안 점검 결과

`npm run test:security`(`scripts/security-audit.mjs`)가 아래 항목을 자동 점검합니다. 이번 개발 환경에서는 6번 항목 하단에 설명한 네트워크 제약으로 실제 실행은 하지 못했으므로, **로컬에서 반드시 한 번 실행해 PASS를 확인해 주세요.**

- 관리자 UID가 소스에 하드코딩되어 있지 않은지 (placeholder 상태 여부 확인)
- Firestore/Storage의 `allow read, write: if true` 같은 전면 공개 규칙이 없는지
- deny-by-default(명시되지 않은 모든 경로 차단) 와일드카드 규칙 존재 여부
- 개인정보 컬렉션의 조회/수정/삭제가 관리자로 제한되어 있는지
- CSP에 Firebase Auth/Firestore, Google Fonts 등 필수 도메인이 포함되어 있는지
- 관리자 인증 상태가 `sessionStorage`/`localStorage`에 저장되지 않는지
- 커밋된 Firebase 설정 JSON 파일이 없는지 (환경변수만 사용)

수동 검토로 확인된 사항:
- 참여신청/문의 폼에 허니팟 필드 + 최소 작성시간 + 클라이언트 속도제한(참고용) 적용됨.
- 이미지/첨부파일 업로드는 클라이언트 검증(MIME·확장자·용량) 후 Storage Rules가 재검증.
- Firestore 저장 전 `undefined` 값을 제거하는 `sanitizeForFirestore()`를 모든 쓰기 경로에 적용.

## 13. SEO 점검 결과

- 모든 페이지에 실제 URL(해시 라우팅 없음)이 부여되어 있으며, 새로고침·뒤로가기·직접 URL 접근이 모두 정상 동작하도록 `src/context/ValueTogetherContext.tsx`의 `buildPath`/`parsePath`와 `App.tsx`의 라우팅 스위치를 구성했습니다.
- `SEOHead.tsx`가 탭/상세 항목별로 `<title>`, description, canonical, Open Graph, Twitter Card, JSON-LD(WebPage/Article)를 동적으로 갱신합니다.
- 빌드 시 `scripts/generate-previews.mjs`가 소식/사업/갤러리 **개별 항목**마다 정적 미리보기 HTML과 `sitemap.xml`을 생성하여, 카카오톡 등 링크 미리보기 봇이 실제 콘텐츠를 읽을 수 있도록 합니다.
- **실제 도메인이 정해지면 반드시 아래 3곳의 placeholder(`https://your-domain.example`)를 실제 도메인으로 교체하세요**: `index.html`, `src/components/common/SEOHead.tsx`, `scripts/generate-previews.mjs`(`SITE_URL` 환경변수로 전달 가능).
- `public/robots.txt`, `public/site.webmanifest`가 준비되어 있습니다. `public/og-image.png`(소셜 공유 기본 이미지, 1200×630 권장)는 아직 생성되지 않았으니 실제 로고/브랜드 이미지가 확정되면 추가해 주세요.

## 14. 향후 개선 제안

- **실제 CI 로고 벡터 원본 반영**: 현재 `/public/logo-mark.png`는 첨부 이미지에서 배경을 제거해 만든 래스터(PNG) 임시 로고입니다. 벡터(SVG/AI) 원본을 받으면 더 선명한 아이콘 세트로 교체하는 것을 권장합니다.
- **뉴스레터 기능**: 이번 범위에서는 제외되었습니다(질문에서 "제외" 선택). 추후 필요 시 이메일 발송 서비스(예: SendGrid) 연동이 필요합니다.
- **GA4 Reporting API 기반 정식 방문자 통계**: 현재 대시보드의 "오늘 페이지뷰"는 서버 인증이 필요 없는 경량 Firestore 카운터입니다. 더 정교한 유입경로·체류시간 분석이 필요하면 GA4 Reporting API를 백엔드에서 별도로 연동해야 합니다.
- **컴포넌트 단위 테스트 확대**: 현재 자동 테스트는 유틸리티 함수 위주입니다. React Testing Library로 폼 제출, 관리자 CRUD 등 주요 사용자 흐름에 대한 테스트를 추가하면 안정성이 높아집니다.
- **접근성 수동 감사**: 코드 작성 시 시맨틱 태그, `aria-label`, 키보드 포커스를 고려했지만, 실제 스크린리더/키보드만으로 전체 사이트를 점검하는 수동 접근성 감사를 권장합니다.

## 15. 알려진 제약사항

- 이 저장소를 만든 개발 환경은 npm 레지스트리 접근이 차단되어 있어 `npm install` 및 이에 의존하는 `lint`/`test`/`build`를 실행하지 못했습니다 (7번 항목 참고). 로컬에서 최초 1회 반드시 실행해 주세요.
- 실제 Firebase 프로젝트가 아직 생성되지 않아 모든 Firebase 관련 값은 placeholder입니다.
- 실제 기관 정보(주소/대표자/설립연도/사업자등록번호/연혁/실적 등)가 없어 관리자 화면에서 입력하기 전까지는 "관리자 입력 필요" 문구가 표시됩니다 — 이는 의도된 동작입니다(사실 왜곡 방지).
