// 배포 직후 기본 동작 확인용 스모크 테스트. 실제 URL(SITE_URL)에 대해 새로고침
// 시나리오를 흉내내어 핵심 경로가 200으로 응답하는지만 빠르게 확인합니다.
// (진짜 렌더링 검증은 아니며, "최소한 서버가 그 경로에 뭔가는 응답한다"는
// 수준의 매우 얕은 점검입니다 — 배포 후 수동 점검을 대체하지 않습니다.)
const base = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
const paths = ['/', '/about', '/business', '/news', '/gallery', '/partners', '/contact', '/privacy', '/terms', '/robots.txt', '/sitemap.xml'];
let failed = 0;
for (const p of paths) {
  try {
    const r = await fetch(base + p, { redirect: 'follow' });
    console.log(`${r.ok ? 'PASS' : 'FAIL'} ${p} ${r.status}`);
    if (!r.ok) failed++;
  } catch (e) {
    console.log(`FAIL ${p} ${e.message}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
