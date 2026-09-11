import React from 'react';
import { Hero } from '../components/home/Hero';
import { CoreValuesSection } from '../components/home/CoreValuesSection';
import { ProgramsPreviewSection } from '../components/home/ProgramsPreviewSection';
import { StatsSection } from '../components/home/StatsSection';
import { NewsPreviewSection } from '../components/home/NewsPreviewSection';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { PartnersPreviewSection } from '../components/home/PartnersPreviewSection';
import { ContactCTASection } from '../components/home/ContactCTASection';

/**
 * 메인 페이지 구조 (요청 사양 그대로):
 * Header(App.tsx) → Hero → 핵심가치 4카드 → 주요사업 → 실적 통계 →
 * 최근소식 → 갤러리 → 협력기관/참여 안내 → 문의 CTA → Footer(App.tsx)
 */
export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <CoreValuesSection />
      <ProgramsPreviewSection />
      <StatsSection />
      <NewsPreviewSection />
      <GalleryPreviewSection />
      <PartnersPreviewSection />
      <ContactCTASection />
    </>
  );
};
