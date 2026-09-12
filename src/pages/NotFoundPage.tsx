import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { Home, SearchX } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setActiveTab } = useValueTogether();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center space-y-6">
      <SearchX className="w-12 h-12 text-ink-soft/50 mx-auto" />
      <div className="space-y-2">
        <p className="font-display font-black text-3xl sm:text-4xl text-ink">404</p>
        <h1 className="font-bold text-lg sm:text-xl text-ink">페이지를 찾을 수 없습니다</h1>
        <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
          요청하신 주소가 삭제되었거나, 주소가 바뀌었거나, 잘못 입력되었을 수 있습니다.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setActiveTab('main')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 transition-opacity"
      >
        <Home className="w-4 h-4" />
        홈으로 이동
      </button>
    </div>
  );
};
