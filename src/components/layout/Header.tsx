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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-24 sm:h-[136px] flex items-center justify-between gap-4 lg:gap-10">
        <button type="button" onClick={() => setActiveTab('main')} className="shrink-0 transition-transform hover:scale-[1.02]" aria-label="홈으로 이동">
          <Logo size="header" />
        </button>

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`px-4 xl:px-5 py-3 rounded-xl text-[18px] xl:text-[19px] transition-all whitespace-nowrap ${
                currentTop === item.tab
                  ? 'text-primary-ink bg-primary-soft font-black shadow-xs'
                  : 'text-ink/85 hover:text-ink hover:bg-paper-soft font-extrabold'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-ink text-base font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span>문의하기</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2.5 text-ink rounded-xl hover:bg-paper-soft border border-line"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-line bg-paper-card px-4 py-4 space-y-1.5 shadow-lg" aria-label="모바일 메뉴">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-extrabold transition-colors ${
                currentTop === item.tab ? 'text-primary-ink bg-primary-soft font-black' : 'text-ink hover:bg-paper-soft'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className="pt-3 border-t border-line mt-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setActiveTab('contact');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-primary text-primary-ink text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90"
            >
              <span>문의하기</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
