import React from 'react';

/** 소개/사업/소식/갤러리/협력/문의 등 하위 페이지 상단 공통 배너. */
export const PageBanner: React.FC<{ eyebrow: string; title: string; description?: string }> = ({ eyebrow, title, description }) => (
  <div className="bg-paper-card border-b border-line">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-2">
      <p className="text-xs font-bold text-primary-ink tracking-wide">{eyebrow}</p>
      <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">{title}</h1>
      {description && <p className="text-sm text-ink-soft leading-relaxed max-w-xl">{description}</p>}
    </div>
  </div>
);
