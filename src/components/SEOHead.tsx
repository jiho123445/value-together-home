import { useEffect } from 'react';
import { useFoundation } from '../context/FoundationContext';

const SITE = 'https://value-together.vercel.app';
const SITE_NAME = '사단법인 사회적협동조합 가치함께';

const pageMeta: Record<string, { title: string; description: string; keywords: string }> = {
  main: {
    title: '홍천 봉사단체 | 사단법인 사회적협동조합 가치함께',
    description: '홍천 봉사단체 사회적협동조합 가치함께은 지역사회 나눔과 봉사, 취약계층 지원 및 복지사업을 실천하는 비영리단체입니다.',
    keywords: '홍천 봉사단체, 홍천 봉사, 홍천 봉사활동, 홍천 나눔단체, 사회적협동조합 가치함께, 홍천 사회공헌, 홍천 사회복지',
  },
  about: {
    title: '재단소개 | 홍천 봉사단체 사회적협동조합 가치함께',
    description: '홍천 봉사단체 사회적협동조합 가치함께의 설립목적과 연혁, 인사말 및 주요 활동을 소개합니다.',
    keywords: '홍천 봉사단체, 사회적협동조합 가치함께, 홍천 사회복지, 홍천 나눔, 홍천 사회공헌',
  },
  programs: {
    title: '주요사업 | 홍천 나눔·봉사활동 | 사회적협동조합 가치함께',
    description: '홍천 지역의 장학사업, 취약계층 지원, 긴급구호, 주거환경 개선 등 주요 나눔사업을 안내합니다.',
    keywords: '홍천 봉사활동, 홍천 나눔사업, 홍천 취약계층 지원, 홍천 장학사업, 홍천 복지사업',
  },
  news: {
    title: '공지사항 | 홍천 봉사단체 사회적협동조합 가치함께',
    description: '사회적협동조합 가치함께의 공지사항과 홍천 지역사회 나눔·봉사 관련 소식을 확인할 수 있습니다.',
    keywords: '사회적협동조합 가치함께 공지사항, 홍천 봉사, 홍천 나눔, 홍천 봉사단체',
  },
  gallery: {
    title: '활동갤러리 | 홍천 봉사활동 | 사회적협동조합 가치함께',
    description: '홍천 지역에서 진행한 사회적협동조합 가치함께의 봉사활동과 나눔 현장을 사진으로 소개합니다.',
    keywords: '홍천 봉사활동, 홍천 봉사사진, 홍천 나눔활동, 사회적협동조합 가치함께',
  },
  press: {
    title: '보도자료 | 홍천 지역사회 나눔 | 사회적협동조합 가치함께',
    description: '홍천 지역사회 나눔과 봉사활동을 실천하는 사회적협동조합 가치함께의 언론 보도입니다.',
    keywords: '홍천 봉사단체, 홍천 사회공헌, 홍천 나눔, 사회적협동조합 가치함께 보도자료',
  },
  'family-center': {
    title: '홍천군가족센터 | 사회적협동조합 가치함께',
    description: '사회적협동조합 가치함께이 운영하는 홍천군가족센터와 가족복지 사업을 안내합니다.',
    keywords: '홍천군가족센터, 홍천 가족복지, 사회적협동조합 가치함께',
  },
  donate: {
    title: '후원안내 | 홍천 나눔·기부 | 사회적협동조합 가치함께',
    description: '홍천 지역 이웃을 위한 나눔과 후원 참여 방법을 안내합니다.',
    keywords: '홍천 기부, 홍천 후원, 홍천 나눔, 사회적협동조합 가치함께 후원',
  },
  contact: {
    title: '오시는 길·문의 | 홍천 봉사단체 사회적협동조합 가치함께',
    description: '홍천군에 위치한 사회적협동조합 가치함께의 주소와 연락처, 오시는 길을 안내합니다.',
    keywords: '사회적협동조합 가치함께 주소, 홍천 봉사단체, 홍천 복지단체',
  },
  privacy: { title: '개인정보처리방침 | 사회적협동조합 가치함께', description: '사회적협동조합 가치함께 개인정보처리방침입니다.', keywords: '사회적협동조합 가치함께 개인정보처리방침' },
  terms: { title: '이용약관 | 사회적협동조합 가치함께', description: '사회적협동조합 가치함께 홈페이지 이용약관입니다.', keywords: '사회적협동조합 가치함께 이용약관' },
};

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, extra: Record<string, string> = {}) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  Object.entries(extra).forEach(([key, value]) => el!.setAttribute(key, value));
}

export const SEOHead: React.FC = () => {
  const { activeTab, selectedNotice, selectedProgram, selectedGallery } = useFoundation();

  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    const detail = activeTab === 'notice-detail' || activeTab === 'program-detail' || activeTab === 'gallery-detail';
    const meta = pageMeta[activeTab] || pageMeta.main;
    let title = meta.title;
    let description = meta.description;
    let image = `${SITE}/og-image.png`;

    if (detail) {
      const item = selectedNotice || selectedProgram || selectedGallery;
      if (item) {
        const itemTitle = String((item as any).title || (item as any).name || '').trim();
        const itemDescription = String((item as any).description || (item as any).summary || (item as any).content || meta.description)
          .replace(/\s+/g, ' ').trim().slice(0, 80);
        if (itemTitle) title = `${itemTitle} | ${SITE_NAME}`;
        if (itemDescription) description = itemDescription;
        // Notices don't carry `imageUrl`/`image` (only `attachments[]`) —
        // pick the first image-type attachment, same as the build-time
        // static previews in scripts/generate-previews.mjs do, so a
        // shared notice link shows its own photo instead of always
        // falling back to the site-wide default image.
        const attachmentImage = Array.isArray((item as any).attachments)
          ? (item as any).attachments.find((a: any) =>
              /^(jpe?g|png|webp|gif)$/i.test(a?.type || '') || /\.(jpe?g|png|webp|gif)$/i.test(a?.url || '')
            )?.url
          : undefined;
        image = String((item as any).imageUrl || (item as any).image || attachmentImage || image);
      }
    }

    const canonical = `${SITE}${window.location.pathname || '/'}`;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', meta.keywords);
    upsertMeta('og:title', title, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:url', canonical, true);
    upsertMeta('og:image', image, true);
    upsertMeta('og:site_name', SITE_NAME, true);
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', image);
    upsertLink('canonical', canonical);

    const id = 'dynamic-seo-jsonld';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': detail ? 'Article' : 'WebPage',
      '@id': `${canonical}#webpage`,
      name: title,
      headline: title,
      description,
      url: canonical,
      inLanguage: 'ko-KR',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#organization` },
      ...(detail ? { image, publisher: { '@id': `${SITE}/#organization` } } : {}),
    });
    document.head.appendChild(script);
  }, [activeTab, selectedNotice, selectedProgram, selectedGallery]);

  return null;
};
