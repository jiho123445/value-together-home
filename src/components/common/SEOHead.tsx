import { useEffect } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';

// Production canonical origin. VITE_SITE_URL can override this in another environment.
// For the public production site, the official custom domain is https://gachi.or.kr.
const SITE = (import.meta.env.VITE_SITE_URL || 'https://gachi.or.kr').replace(/\/$/, '');
const SITE_NAME = '사회적협동조합 가치함께';

const pageMeta: Record<string, { title: string; description: string }> = {
  main: {
    title: '사회적협동조합 가치함께',
    description: '사람과 지역을 함께 성장시키는 사회적협동조합 가치함께. 사회서비스, 교육, 돌봄·복지, 일자리·자립지원 사업을 운영합니다.',
  },
  about: {
    title: '가치함께 소개 | 사회적협동조합 가치함께',
    description: '가치함께의 설립 목적과 핵심 가치, 연혁, 조직도를 소개합니다.',
  },
  business: {
    title: '주요사업 | 사회적협동조합 가치함께',
    description: '정관 제65조에서 정한 장애인 활동 지원 인재 양성, 노인 관련 민간 자격증 발급, 주민 역량 강화 및 교육 등 가치함께의 주요 사업을 안내합니다.',
  },
  news: {
    title: '소식 | 사회적협동조합 가치함께',
    description: '가치함께의 공지사항, 사업소식, 모집공고, 보도자료를 확인할 수 있습니다.',
  },
  gallery: {
    title: '활동갤러리 | 사회적협동조합 가치함께',
    description: '가치함께의 교육, 복지, 지역사회, 행사 활동 현장을 사진으로 소개합니다.',
  },
  partners: {
    title: '협력 및 참여 | 사회적협동조합 가치함께',
    description: '조합원 가입, 자원봉사, 후원·협력, 기관 협력 등 가치함께와 함께하는 방법을 안내합니다.',
  },
  contact: { title: '오시는 길·문의 | 사회적협동조합 가치함께', description: '가치함께의 위치, 연락처와 운영시간을 안내하고 문의를 남기실 수 있습니다.' },
  membership: { title: '조합원 가입 | 사회적협동조합 가치함께', description: '가치함께의 조합원 유형, 출자금, 권리와 가입절차를 안내합니다.' },
  donation: { title: '후원하기 | 사회적협동조합 가치함께', description: '사회적협동조합 가치함께의 후원 방법과 후원계좌, 기부금 안내입니다.' },
  governance: { title: '투명경영·경영공시 | 사회적협동조합 가치함께', description: '가치함께의 정관·규정, 총회·이사회, 사업계획과 결산 등 공개자료를 안내합니다.' },
  'social-value': { title: '사회적 가치 | 사회적협동조합 가치함께', description: '가치함께가 사업을 통해 지역사회에 만들어가는 사회적 가치와 성과를 공개합니다.' },
  privacy: { title: '개인정보처리방침 | 가치함께', description: '사회적협동조합 가치함께 개인정보처리방침입니다.' },
  terms: { title: '이용약관 | 가치함께', description: '사회적협동조합 가치함께 홈페이지 이용약관입니다.' },
  'not-found': {
    title: '페이지를 찾을 수 없습니다 | 사회적협동조합 가치함께',
    description: '요청하신 페이지를 찾을 수 없습니다.',
  },
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

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export const SEOHead: React.FC = () => {
  const { activeTab, selectedNotice, selectedProgram, selectedGallery } = useValueTogether();

  useEffect(() => {
    const detail = activeTab === 'news-detail' || activeTab === 'business-detail' || activeTab === 'gallery-detail';
    const meta = pageMeta[activeTab] || pageMeta.main;
    let title = meta.title;
    let description = meta.description;
    let image = `${SITE}/og-image.jpg`;

    if (detail) {
      const item: any = selectedNotice || selectedProgram || selectedGallery;
      if (item) {
        const itemTitle = String(item.title || '').trim();
        const itemDescription = String(item.description || item.summary || item.content || meta.description)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80);
        if (itemTitle) title = `${itemTitle} | ${SITE_NAME}`;
        if (itemDescription) description = itemDescription;
        const attachmentImage = Array.isArray(item.attachments)
          ? item.attachments.find((a: any) => /^(jpe?g|png|webp|gif)$/i.test(a?.type || '') || /\.(jpe?g|png|webp|gif)$/i.test(a?.url || ''))?.url
          : undefined;
        image = String(item.imageUrl || attachmentImage || image);
      }
    }

    const canonical = `${SITE}${window.location.pathname || '/'}`;
    document.title = title;
    upsertMeta('robots', activeTab === 'not-found' ? 'noindex, follow' : 'index, follow');
    upsertMeta('description', description);
    upsertMeta('og:title', title, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:url', canonical, true);
    image = /^https?:\/\//.test(image) ? image : `${SITE}${image.startsWith('/') ? image : `/${image}`}`;
    upsertMeta('og:image', image, true);
    upsertMeta('og:image:secure_url', image, true);
    upsertMeta('og:image:type', 'image/jpeg', true);
    upsertMeta('og:image:width', '1200', true);
    upsertMeta('og:image:height', '630', true);
    upsertMeta('og:image:alt', SITE_NAME, true);
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
      ...(detail ? { image } : {}),
    });
    document.head.appendChild(script);
  }, [activeTab, selectedNotice, selectedProgram, selectedGallery]);

  return null;
};
