// 자동 콘텐츠 백업 (.github/workflows/backup.yml에서 매일 실행).
// `content/{settings,timeline,programs,notices,gallery,popups,partners,governance,businessResults,socialValue}`
// 문서(firestore.rules에서 `allow read: if true`로 전체 공개된 문서들)를
// Firestore REST API로 가져와 backups/ 아래에 날짜별 JSON 스냅샷을 만듭니다.
//
// participations/inquiries(개인정보 포함 컬렉션)는 의도적으로 다루지
// 않습니다 — 그 컬렉션은 관리자 인증 없이는 읽을 수 없으며(firestore.rules
// 참고), 자격증명이 없는 무인 스크립트가 접근해서도 안 됩니다. 개인정보를
// 포함한 전체 백업은 관리자 화면의 "로그/백업 > 개인정보 백업 다운로드"
// 버튼으로만 수행하도록 설계되어 있습니다 (관리자 본인의 명시적 행동).
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || '';
const DATABASE_ID = process.env.VITE_FIREBASE_DATABASE_ID || '(default)';
const DOC_NAMES = ['settings', 'timeline', 'programs', 'notices', 'gallery', 'popups', 'partners', 'governance', 'businessResults', 'socialValue'];
const BACKUPS_DIR = path.join(process.cwd(), 'backups');

function unwrapFirestoreValue(value) {
  if (value == null) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(unwrapFirestoreValue);
  if ('mapValue' in value) {
    const out = {};
    const fields = value.mapValue.fields || {};
    for (const key of Object.keys(fields)) out[key] = unwrapFirestoreValue(fields[key]);
    return out;
  }
  return null;
}

async function fetchDoc(docName) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/content/${docName}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`[backup-content] Could not fetch content/${docName}: HTTP ${res.status}`);
    return null;
  }
  const json = await res.json();
  const fields = json.fields || {};
  const out = {};
  for (const key of Object.keys(fields)) out[key] = unwrapFirestoreValue(fields[key]);
  return out;
}

async function main() {
  if (!PROJECT_ID) {
    console.warn('[backup-content] VITE_FIREBASE_PROJECT_ID가 설정되지 않았습니다 (아직 Firebase 프로젝트를 만들지 않은 개발 단계일 수 있습니다). 백업을 건너뜁니다.');
    return;
  }

  const snapshot = { exportedAt: new Date().toISOString(), kind: 'public-content-only' };
  let anySucceeded = false;

  for (const docName of DOC_NAMES) {
    const data = await fetchDoc(docName);
    if (data) anySucceeded = true;
    snapshot[docName] = data;
  }

  if (!anySucceeded) {
    console.error('[backup-content] Every content/* fetch failed — not writing a backup file (would just be all-null).');
    process.exit(1);
  }

  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  const dateStr = new Date().toISOString().split('T')[0];
  const outPath = path.join(BACKUPS_DIR, `${dateStr}.json`);
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf-8');
  console.log(`[backup-content] Wrote ${outPath}`);
}

main().catch((e) => {
  console.error('[backup-content] Unexpected error:', e);
  process.exit(1);
});
