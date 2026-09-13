# 배포용 수정본 변경사항

## 1. Firestore 연결 안정화
- `initializeFirestore()`를 사용하고 `experimentalForceLongPolling: true`를 적용했습니다.
- 목적: 일부 프록시/보안 프로그램/네트워크 환경에서 Firestore WebChannel이 응답하지 않는 문제에 대응합니다.

## 2. Firestore 저장 무한 대기 방지
- 관리자 저장 요청에 12초 타임아웃을 추가했습니다.
- 성공 응답이 확인된 경우에만 저장 성공 상태가 됩니다.

## 3. 설정 저장 상태 개선
- 대표자/후원계좌 등 `settings` 저장 실패 시 화면 상태가 성공처럼 남지 않도록 수정했습니다.
- Firestore 저장 성공 후에만 로컬 설정 상태를 갱신합니다.

## 4. reCAPTCHA CSP 수정
- 현재 브라우저 콘솔에서 확인된 `https://www.google.com/recaptcha/api.js` CSP 차단을 해결하도록 reCAPTCHA 관련 script/frame 출처를 허용했습니다.

## 5. 동기화 오류 상태 수정
- Firestore 실시간 동기화 및 수동 새로고침 실패를 `success`로 표시하던 오류를 `error`로 수정했습니다.

## 중요
이 수정본은 확인된 오류에 대한 코드 수정본입니다. 실제 Firestore 저장 성공 여부는 Vercel 배포 후 관리자 화면에서 값을 저장하고 Firebase Console의 `content/settings` 문서가 실제로 변경되는지 확인해야 최종 확정할 수 있습니다.
