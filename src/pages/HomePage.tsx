import React from 'react';
import { Hero } from '../components/home/Hero';
import { CoreValuesSection } from '../components/home/CoreValuesSection';
import { ProgramsPreviewSection } from '../components/home/ProgramsPreviewSection';
import { NewsPreviewSection } from '../components/home/NewsPreviewSection';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { PartnersPreviewSection } from '../components/home/PartnersPreviewSection';
import { ContactCTASection } from '../components/home/ContactCTASection';

/**
 * 메인 페이지 구조:
 * Header(App.tsx) → Hero(실적 통계 포함) → 핵심가치 → 주요사업 →
 * 최근소식 → 갤러리 → 협력기관/참여 안내 → 문의 CTA → Footer(App.tsx)
 *
 * StatsSection.tsx는 더 이상 이 페이지에서 쓰지 않습니다(실적 수치는 Hero의
 * 플로팅 카드로 통합됨) — 파일 자체는 다른 화면에서 재사용할 수 있어
 * 삭제하지 않고 남겨두었습니다.
 */
export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <CoreValuesSection />
      <ProgramsPreviewSection />
      <NewsPreviewSection />
      <GalleryPreviewSection />
      <PartnersPreviewSection />
      <ContactCTASection />
    </>
  );
};
