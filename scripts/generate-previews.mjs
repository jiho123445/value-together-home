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
const SITE_ORIGIN = (process.env.SITE_URL || 'https://your-domain.example').replace(/\/$/, '');
const SITE_NAME = '사회적협동조합 가치함께';
const DIST_DIR = path.join(process.cwd(), 'dist');

// App.tsx / ValueTogetherContext.tsx의 parsePath()가 인식하는 상위 경로와
// 반드시 동일해야 합니다.
const TOP_LEVEL_ROUTES = ['about', 'business', 'news', 'gallery', 'partners', 'contact', 'privacy', 'terms'];

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
  const ogImage = image || `${SITE_ORIGIN}/og-image.png`;

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

  // 앱이 인식하는 모든 상위 경로는 항상 실제 파일을 갖도록 합니다(호스팅
  // rewrite 설정과 무관하게 새로고침/직접 접근이 항상 동작하도록).
  for (const route of TOP_LEVEL_ROUTES) {
    const dir = path.join(DIST_DIR, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), shellHtml, 'utf-8');
  }

  if (!PROJECT_ID) {
    console.warn('[generate-previews] VITE_FIREBASE_PROJECT_ID가 설정되지 않아 항목별 미리보기/사이트맵 생성을 건너뜁니다. (상위 경로 정적 파일은 정상 생성됨)');
    return;
  }

  const newsDir = path.join(DIST_DIR, 'news');
  const businessDir = path.join(DIST_DIR, 'business');
  const galleryDir = path.join(DIST_DIR, 'gallery');

  let notices = [];
  let programs = [];
  let gallery = [];
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
    console.warn('[generate-previews] Firestore 조회 실패, 항목별 미리보기 생성을 건너뜁니다:', e.message);
    return;
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
    fs.writeFileSync(path.join(newsDir, `${notice.id}.html`), html, 'utf-8');
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
    fs.writeFileSync(path.join(businessDir, `${program.id}.html`), html, 'utf-8');
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
    fs.writeFileSync(path.join(galleryDir, `${item.id}.html`), html, 'utf-8');
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
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(`[generate-previews] Generated ${count} static preview pages, sitemap.xml with ${sitemapUrls.length} URLs.`);
}

main().catch((e) => {
  console.warn('[generate-previews] Unexpected error, skipping preview generation:', e);
});
