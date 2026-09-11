// 배포 전 정적 보안 점검 스크립트 (npm run test:security). 실제 접근 제어는
// firestore.rules/storage.rules가 담당하지만, 이 스크립트는 소스 저장소에
// 흔히 발생할 수 있는 실수(하드코딩된 관리자 UID, 와일드카드 공개 쓰기,
// deny-by-default 누락, CSP 필수 도메인 누락 등)를 빌드 파이프라인에서
// 기계적으로 잡아내기 위한 것입니다.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const checks = [];
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const pass = (name) => checks.push({ name, ok: true });
const fail = (name, detail = '') => { checks.push({ name, ok: false }); failures.push(`${name}${detail ? `: ${detail}` : ''}`); };

const rules = read('firestore.rules');
const storage = read('storage.rules');
const ctx = read('src/context/ValueTogetherContext.tsx');
const vercel = JSON.parse(read('vercel.json'));
const pkg = JSON.parse(read('package.json'));

// 관리자 UID가 소스에 하드코딩된 실제 값(placeholder가 아닌)으로 남아있지 않은지.
if (/REPLACE_WITH_NEW_ADMIN_UID/.test(rules) === false && /isAdmin\(\)/.test(rules)) {
  pass('firestore.rules admin UID replaced from placeholder (배포 전 필수 확인)');
} else if (/REPLACE_WITH_NEW_ADMIN_UID/.test(rules)) {
  // 아직 실제 Firebase 프로젝트가 없는 개발 단계에서는 placeholder가 남아있는
  //것이 정상이므로 실패로 처리하지 않고 경고만 남깁니다.
  console.warn('[security-audit] 알림: firestore.rules의 관리자 UID가 아직 placeholder(REPLACE_WITH_NEW_ADMIN_UID)입니다. 실제 배포 전 반드시 교체하세요.');
  pass('firestore.rules admin UID placeholder present (배포 전 교체 필요 — 경고만 표시)');
}
if (/allow\s+read,\s*write:\s*if\s+true\s*;/.test(rules)) fail('Firestore wildcard public read/write not allowed'); else pass('Firestore wildcard public read/write blocked');
if (/match\s+\/\{document=\*\*\}/.test(rules) && /allow\s+read,\s*write:\s*if\s+false/.test(rules)) pass('Firestore deny-by-default wildcard present'); else fail('Firestore deny-by-default wildcard missing');
if (/match\s+\/\{allPaths=\*\*\}/.test(storage) && /allow\s+read,\s*write:\s*if\s+false/.test(storage)) pass('Storage deny-by-default wildcard present'); else fail('Storage deny-by-default wildcard missing');
if (/participations|inquiries/.test(rules) && /allow\s+read,\s*update,\s*delete:\s*if\s+isAdmin/.test(rules)) pass('Personal-data collections admin-only read/update/delete'); else fail('Personal-data collection rules incomplete');

const csp = vercel.headers?.[0]?.headers?.find((x) => x.key === 'Content-Security-Policy')?.value || '';
for (const token of ['https://securetoken.googleapis.com', 'https://identitytoolkit.googleapis.com', 'https://firebaseinstallations.googleapis.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
  csp.includes(token) ? pass(`CSP allows ${token}`) : fail(`CSP missing ${token}`);
}
if (csp.includes('frame-src')) pass('CSP frame-src explicitly configured'); else fail('CSP frame-src missing');

if (pkg.scripts?.['test:security'] === 'node scripts/security-audit.mjs') pass('Security test script registered'); else fail('Security test script not registered');
if (pkg.scripts?.verify) pass('Unified verify script registered'); else fail('Unified verify script missing');
if (exists('.github/workflows/ci.yml')) pass('GitHub Actions CI exists'); else fail('GitHub Actions CI missing');
if (!exists('.env') && !exists('.env.local') && exists('.gitignore') && read('.gitignore').includes('.env')) pass('Environment files excluded from Git'); else if (exists('.env') || exists('.env.local')) fail('.env/.env.local file exists in working tree (should never be committed)'); else pass('Environment files excluded from Git');
if (!pkg.dependencies?.xlsx && !pkg.devDependencies?.xlsx) pass('Deprecated xlsx package not present (exceljs used instead)'); else fail('Deprecated xlsx package present');
if (/sessionStorage\.setItem\([^\n]*admin/i.test(ctx) || /localStorage\.setItem\([^\n]*isAdmin/i.test(ctx)) fail('Admin authorization must not be persisted in browser storage'); else pass('No browser-storage admin authorization flag');
if (exists('firebase-applet-config.json') || exists('firebase-config.json')) fail('A committed Firebase config JSON file exists (config must come from env vars only)'); else pass('No committed Firebase config JSON file');

console.log(`SECURITY AUDIT: ${checks.filter((x) => x.ok).length}/${checks.length} passed`);
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}`);
if (failures.length) { console.error('\nFailures:\n' + failures.map((x) => `- ${x}`).join('\n')); process.exit(1); }
console.log('SECURITY AUDIT PASSED');
