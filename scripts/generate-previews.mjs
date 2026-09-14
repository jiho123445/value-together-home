// 빌드 시점 정적 미리보기(og:*)/sitemap.xml 생성 스크립트.
//
// 왜 필요한가: 이 앱은 클라이언트에서 렌더링되는 SPA이기 때문에, 카카오톡/
// 페이스북 등 링크 미리보기 봇과 검색엔진 크롤러는 JS를 실행하지 않고
// index.html의 <head> 메타태그만 읽습니다. 그대로 두면 소식/사업/갤러리
// 상세 링크를 공유해도 항상 메인 페이지의 제목/설명만 보이게 됩니다.
//
// 어떻게 하는가: `npm run build`(vite build 이후)에서 dist/index.html을
// 각 항목별로 복사하고 <head> 메타태그(title/description/og:*/twitter:*)만
// 그 항목의 실제 제목/요약/이미지로 치환해 dist/news/{id}.html 등에
// 저장합니다. 나머지(<script>/<link>)는 그대로이므로, 실제 방문자가 링크를
// 열면 평소와 동일하게 React 앱이 그대로 부팅합니다.
//
// 안전장치: Firebase 프로젝트 정보(VITE_FIREBASE_PROJECT_ID)가 아직 설정되지
// 않았거나 Firestore를 가져오지 못해도 절대 빌드 자체를 실패시키지 않고
// 경고만 남긴 뒤 건너뜁니다.
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || '';
const DATABASE_ID = process.env.VITE_FIREBASE_DATABASE_ID || '(default)';
// Production canonical origin is intentionally fixed here so a stale Vercel
// environment variable can never leak the old *.vercel.app host into sitemap.xml
// or static preview canonical/OG URLs. If a staging build is needed, clone this
// script/config rather than overriding the production sitemap origin.
const SITE_ORIGIN = 'https://www.gachi.or.kr';
const SITE_NAME = '사회적협동조합 가치함께';
const DIST_DIR = path.join(process.cwd(), 'dist');

// App.tsx / ValueTogetherContext.tsx의 parsePath()가 인식하는 상위 경로와
// 반드시 동일해야 합니다.
const TOP_LEVEL_ROUTES = ['about', 'business', 'news', 'gallery', 'partners', 'membership', 'donation', 'governance', 'social-value', 'contact', 'privacy', 'terms'];

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

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(text, max) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

function buildPreviewHtml(shellHtml, opts) {
  const { title, description, image, canonicalPath } = opts;
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImage = image || `${SITE_ORIGIN}/og-image.jpg`;

  let html = shellHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);

  const metaReplacements = [
    [/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escapeHtml(description)}$2`],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escapeHtml(title)}$2`],
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escapeHtml(description)}$2`],
    [/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${escapeHtml(ogImage)}$2`],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${escapeHtml(canonicalUrl)}$2`],
    [/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${escapeHtml(title)}$2`],
    [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escapeHtml(description)}$2`],
    [/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${escapeHtml(ogImage)}$2`],
  ];
  for (const [pattern, replacement] of metaReplacements) html = html.replace(pattern, replacement);

  if (!html.includes('rel="canonical"')) {
    html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n  </head>`);
  }
  return html;
}

async function fetchContentDoc(docId) {
  if (!PROJECT_ID) return null;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/content/${docId}`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Firestore fetch failed for content/${docId}: ${res.status}`);
    const json = await res.json();
    const fields = json.fields || {};
    const out = {};
    for (const key of Object.keys(fields)) out[key] = unwrapFirestoreValue(fields[key]);
    return out;
  } catch (e) {
    console.warn(`[generate-previews] Could not fetch content/${docId}:`, e.message);
    return null;
  }
}

async function main() {
  let shellHtml;
  try {
    shellHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  } catch {
    console.warn('[generate-previews] dist/index.html not found, skipping preview generation.');
    return;
  }

  // 앱이 인식하는 모든 상위 경로는 실제 index.html을 갖도록 하고,
  // 검색/공유 봇이 JS를 실행하지 않아도 페이지별 기본 제목·설명·canonical을
  // 읽을 수 있도록 정적 메타데이터를 주입합니다.
  const ROUTE_META = {
    about: { title: '가치함께 | 사회적협동조합 가치함께', description: '사회적협동조합 가치함께의 설립 목적, 핵심가치, 연혁, 조직을 소개합니다.' },
    business: { title: '주요사업 | 사회적협동조합 가치함께', description: '정관에서 정한 주사업과 기타사업 등 가치함께의 주요 사업을 안내합니다.' },
    news: { title: '소식 | 사회적협동조합 가치함께', description: '가치함께의 공지사항, 사업소식, 모집공고, 보도자료를 확인할 수 있습니다.' },
    gallery: { title: '활동갤러리 | 사회적협동조합 가치함께', description: '가치함께의 교육·복지·지역사회 활동 현장을 사진으로 소개합니다.' },
    partners: { title: '조합원·참여 | 사회적협동조합 가치함께', description: '조합원 가입, 자원봉사, 후원 및 기관협력 등 함께하는 방법을 안내합니다.' },
    membership: { title: '조합원 가입 | 사회적협동조합 가치함께', description: '조합원 유형, 출자금, 권리와 가입 절차를 안내합니다.' },
    donation: { title: '후원하기 | 사회적협동조합 가치함께', description: '가치함께의 후원 방법과 후원계좌, 기부금 관련 안내를 제공합니다.' },
    governance: { title: '투명경영·경영공시 | 사회적협동조합 가치함께', description: '정관·규정, 총회·이사회, 사업계획·결산 등 공개자료를 제공합니다.' },
    'social-value': { title: '사회적 가치 | 사회적협동조합 가치함께', description: '사업을 통해 지역사회에 만들어가는 사회적 가치와 성과를 공개합니다.' },
    contact: { title: '오시는 길·문의 | 사회적협동조합 가치함께', description: '가치함께의 위치와 연락처, 문의 방법을 안내합니다.' },
    privacy: { title: '개인정보처리방침 | 가치함께', description: '사회적협동조합 가치함께 개인정보처리방침입니다.' },
    terms: { title: '이용약관 | 가치함께', description: '사회적협동조합 가치함께 홈페이지 이용약관입니다.' },
  };
  for (const route of TOP_LEVEL_ROUTES) {
    const dir = path.join(DIST_DIR, route);
    fs.mkdirSync(dir, { recursive: true });
    const meta = ROUTE_META[route] || { title: SITE_NAME, description: '사회적협동조합 가치함께 홈페이지' };
    fs.writeFileSync(path.join(dir, 'index.html'), buildPreviewHtml(shellHtml, { title: meta.title, description: meta.description, canonicalPath: `/${route}` }), 'utf-8');
  }

  if (!PROJECT_ID) {
    console.warn('[generate-previews] VITE_FIREBASE_PROJECT_ID가 설정되지 않아 동적 항목 미리보기는 건너뜁니다. 정적 사이트맵은 계속 생성합니다.');
  }

  const newsDir = path.join(DIST_DIR, 'news');
  const businessDir = path.join(DIST_DIR, 'business');
  const galleryDir = path.join(DIST_DIR, 'gallery');

  let notices = [];
  let programs = [];
  let gallery = [];
  if (PROJECT_ID) {
    try {
      const [noticesDoc, programsDoc, galleryDoc] = await Promise.all([
        fetchContentDoc('notices'),
        fetchContentDoc('programs'),
        fetchContentDoc('gallery'),
      ]);
      notices = noticesDoc?.items ?? [];
      programs = programsDoc?.items ?? [];
      gallery = galleryDoc?.items ?? [];
    } catch (e) {
      console.warn('[generate-previews] Firestore 조회 실패, 정적 경로만 포함한 사이트맵을 생성합니다:', e.message);
    }
  }

  let count = 0;
  for (const notice of notices) {
    if (!notice?.id) continue;
    fs.mkdirSync(newsDir, { recursive: true });
    const imageAttachment = (notice.attachments || []).find(
      (a) => /^(jpe?g|png|webp|gif)$/i.test(a.type || '') || /\.(jpe?g|png|webp|gif)$/i.test(a.url || '')
    );
    const html = buildPreviewHtml(shellHtml, {
      title: notice.title || '소식',
      description: truncate(notice.content || '', 120),
      image: imageAttachment?.url,
      canonicalPath: `/news/${encodeURIComponent(notice.id)}`,
    });
    const detailDir = path.join(newsDir, encodeURIComponent(String(notice.id)));
    fs.mkdirSync(detailDir, { recursive: true });
    fs.writeFileSync(path.join(detailDir, 'index.html'), html, 'utf-8');
    count++;
  }
  for (const program of programs) {
    if (!program?.id) continue;
    fs.mkdirSync(businessDir, { recursive: true });
    const html = buildPreviewHtml(shellHtml, {
      title: program.title || '주요사업',
      description: truncate(program.summary || '', 120),
      image: program.imageUrl,
      canonicalPath: `/business/${encodeURIComponent(program.id)}`,
    });
    const detailDir = path.join(businessDir, encodeURIComponent(String(program.id)));
    fs.mkdirSync(detailDir, { recursive: true });
    fs.writeFileSync(path.join(detailDir, 'index.html'), html, 'utf-8');
    count++;
  }
  for (const item of gallery) {
    if (!item?.id) continue;
    fs.mkdirSync(galleryDir, { recursive: true });
    const html = buildPreviewHtml(shellHtml, {
      title: item.title || '갤러리',
      description: truncate(item.description || '', 120),
      image: item.imageUrl,
      canonicalPath: `/gallery/${encodeURIComponent(item.id)}`,
    });
    const detailDir = path.join(galleryDir, encodeURIComponent(String(item.id)));
    fs.mkdirSync(detailDir, { recursive: true });
    fs.writeFileSync(path.join(detailDir, 'index.html'), html, 'utf-8');
    count++;
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const sitemapUrls = [
    { loc: `${SITE_ORIGIN}/`, changefreq: 'weekly', priority: '1.0' },
    ...TOP_LEVEL_ROUTES.map((route) => ({
      loc: `${SITE_ORIGIN}/${route}`,
      changefreq: route === 'news' ? 'daily' : 'monthly',
      priority: route === 'news' || route === 'business' ? '0.8' : '0.6',
    })),
    ...notices.filter((n) => n?.id).map((n) => ({ loc: `${SITE_ORIGIN}/news/${encodeURIComponent(n.id)}`, changefreq: 'monthly', priority: '0.6' })),
    ...programs.filter((p) => p?.id).map((p) => ({ loc: `${SITE_ORIGIN}/business/${encodeURIComponent(p.id)}`, changefreq: 'monthly', priority: '0.6' })),
    ...gallery.filter((g) => g?.id).map((g) => ({ loc: `${SITE_ORIGIN}/gallery/${encodeURIComponent(g.id)}`, changefreq: 'monthly', priority: '0.5' })),
  ];
  const invalidSitemapUrls = sitemapUrls.filter((u) => !u.loc.startsWith(`${SITE_ORIGIN}/`));
  if (invalidSitemapUrls.length) {
    throw new Error(`Invalid sitemap origin detected: ${invalidSitemapUrls[0].loc}`);
  }
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(`[generate-previews] Generated ${count} static preview pages, sitemap.xml with ${sitemapUrls.length} URLs for ${SITE_ORIGIN}.`);
}

main().catch((e) => {
  console.warn('[generate-previews] Unexpected error, skipping preview generation:', e);
});
