import React, { useEffect, useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { HeartHandshake, MessageCircle, ArrowUp } from 'lucide-react';

/** 화면 우하단 고정 퀵메뉴 — 참여 신청 / 문의 / 맨 위로. */
export const FloatingQuickMenu: React.FC = () => {
  const { setActiveTab } = useValueTogether();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-30 flex flex-col items-end gap-2.5">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="맨 위로"
          className="w-11 h-11 rounded-full bg-white border border-line shadow-md flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <button
        type="button"
        onClick={() => setActiveTab('contact')}
        aria-label="문의하기"
        className="w-12 h-12 rounded-full bg-ink text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('partners')}
        aria-label="참여 및 협력 신청"
        className="h-12 pl-4 pr-5 rounded-full bg-primary text-primary-ink shadow-lg flex items-center gap-2 font-extrabold text-sm hover:opacity-90 transition-opacity"
      >
        <HeartHandshake className="w-5 h-5" />
        <span className="hidden sm:inline">참여·협력 신청</span>
      </button>
    </div>
  );
};
