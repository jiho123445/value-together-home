# 가치함께 V10 최종 업그레이드

## 반영 내용

- 사회적협동조합 정관 기준의 주사업/기타사업 구조 반영
- 조합원 5개 유형 안내 및 조합원 가입 신청 기능 추가
- 출자 1좌 500,000원 및 1인 1표 원칙 안내
- 투명경영/경영공시 공개자료 관리 및 공개 페이지 추가
- 정관·규정, 총회, 이사회, 사업계획, 결산·사업보고, 기부금 공개 분류 지원
- 후원 안내 및 후원 의향/영수증 안내 신청 기능 추가
- 사업성과 및 사회적 가치 지표 관리/공개 기능 추가
- 관리자 대시보드에 조합원/후원 신청 배지 및 신규 관리 탭 추가
- 경영공시 문서용 Firebase Storage 경로 및 보안 규칙 추가
- 개인정보 포함 신청 데이터는 localStorage에 저장하지 않으며 관리자만 조회 가능
- 기존 공개 콘텐츠 localStorage cache key를 V10으로 분리해 이전 버전의 오래된 캐시가 신규 기관정보를 덮지 않도록 개선
- OG 이미지 경로를 `og-image.jpg`로 통일하고 OG secure URL/type/size/alt 메타 추가
- `VITE_SITE_URL` 환경변수 지원
- 상위 페이지 정적 preview 생성 시 페이지별 title/description/canonical 주입
- 상세 페이지 preview를 `/news/{id}/index.html`, `/business/{id}/index.html`, `/gallery/{id}/index.html` 구조로 생성
- 공개 콘텐츠 백업 대상에 governance/businessResults/socialValue 추가
- 실제 자료로 확인되지 않은 연혁/공지/갤러리/협력기관 샘플 데이터는 초기값에서 제거
- 고유번호증에서 확인된 기관명, 대표자, 고유번호, 소재지를 초기 기관정보에 반영

## 고유번호증 기준 반영 정보

- 단체명: 사회적협동조합 가치함께
- 대표자: 장상섭
- 고유번호: 351-82-00767
- 소재지: 강원특별자치도 홍천군 북방면 홍천로 38-9
- 발급일: 2024-12-18

법인등록번호 등 홈페이지 운영에 불필요한 식별정보는 공개 설정 데이터에 넣지 않습니다.

## 배포 전 필수 확인

1. Vercel `VITE_SITE_URL`을 실제 최종 도메인으로 설정
2. Firebase 프로젝트 ID / Storage bucket / Auth 설정 확인
3. `firestore.rules`와 `storage.rules`의 관리자 UID가 실제 관리자 UID와 일치하는지 확인
4. Firebase App Check를 실제 프로젝트에서 등록하고 가능하면 enforcement 적용
5. 홈페이지 공개용 정관 PDF는 등기사용 원본과 분리하고 개인정보 비식별 처리본을 사용
6. 전화번호, 이메일, 후원계좌, 운영시간은 실제 정보를 관리자 화면에서 입력
7. 실제 총회/이사회/경영공시 자료를 공개 가능한 범위에서 등록
8. 개인정보처리방침의 수집항목/보유기간/처리위탁 내용을 실제 운영과 일치시켜 검토
9. 카카오톡 공유 디버거 및 실제 모바일 공유로 OG 이미지 확인
10. Vercel 배포 후 `/`, `/about`, `/business`, `/news`, `/membership`, `/donation`, `/governance`, `/social-value` 및 상세 URL 새로고침 테스트

## CI TypeScript Provider Fix
- Fixed `TS2740` in `src/context/ValueTogetherContext.tsx` by exposing all V10 CRUD/application methods through `ValueTogetherContext.Provider`.
- Added provider bindings for governance documents, meetings, business results, social-value metrics, membership applications, and donation inquiries.
- Verified that every `ValueTogetherContextType` member is now present in the provider value object.

## V10 사업 정관 정합성 보완
- 홈페이지 초기 사업을 첨부 정관 제65조의 실제 사업명과 항목에 맞춰 7개 사업으로 재구성
- 주사업 3개: 장애인 활동 지원 인재 양성 사업 / 노인 관련 민간 자격증 발급 사업 / 주민 역량 강화 및 교육 사업
- 기타사업 4개: 국가 및 지방자치단체 위탁 사회복지 관련 사업 / 조합원·직원 상담·교육·훈련 및 정보 제공 사업 / 조합 간 협력 사업 / 조합의 홍보 및 지역사회를 위한 사업
- 정관에 근거하지 않는 기존 사업 설명·성과 수치를 초기 데이터에서 제거하고, 실제 사업계획 확정 후 입력하도록 변경
- 관리자 주요사업 등록 시 선택한 정관상 사업 항목에 따라 주사업/기타사업 구분이 자동 결정되도록 개선
- 관리자 주요사업 화면에 정관상 주사업 40% 이상 기준을 안내
- 기존 V9 및 이전 V10의 샘플 사업 데이터가 Firestore에 남아 있는 경우, 알려진 기본 시드 데이터에 한해 V10 최종 사업목록으로 자동 마이그레이션
- 사업용 localStorage cache key를 `gachihamkke_v10_final_programs`로 분리하여 이전 V10 사업 캐시가 새 사업을 덮지 않도록 개선
