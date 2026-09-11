import React, { useEffect, useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { Logo } from '../common/Logo';
import { ActiveTab } from '../../types';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_ITEMS: { tab: ActiveTab; label: string }[] = [
  { tab: 'about', label: '가치함께 소개' },
  { tab: 'business', label: '주요사업' },
  { tab: 'news', label: '소식' },
  { tab: 'gallery', label: '활동갤러리' },
  { tab: 'partners', label: '협력 및 참여' },
  { tab: 'contact', label: '오시는 길·문의' },
];

const DETAIL_TO_TOP: Partial<Record<ActiveTab, ActiveTab>> = {
  'news-detail': 'news',
  'business-detail': 'business',
  'gallery-detail': 'gallery',
};

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useValueTogether();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentTop = DETAIL_TO_TOP[activeTab] || activeTab;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeTab]);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b transition-shadow ${
        scrolled ? 'border-line shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 sm:h-[92px] flex items-center justify-between gap-4">
        <button type="button" onClick={() => setActiveTab('main')} className="shrink-0" aria-label="홈으로 이동">
          <Logo size="header" />
        </button>

        <nav className="hidden lg:flex items-center gap-1" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`px-4 py-2.5 rounded-xl text-base font-bold transition-colors ${
                currentTop === item.tab ? 'text-primary-ink bg-primary-soft' : 'text-ink-soft hover:text-ink hover:bg-paper-soft'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="px-6 py-3 rounded-xl bg-primary text-primary-ink text-base font-extrabold shadow-sm hover:opacity-90 transition-opacity"
          >
            문의하기
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 text-ink rounded-lg hover:bg-paper-soft"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-line bg-paper-card px-4 py-3 space-y-1" aria-label="모바일 메뉴">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-colors ${
                currentTop === item.tab ? 'text-primary-ink bg-primary-soft' : 'text-ink hover:bg-paper-soft'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
