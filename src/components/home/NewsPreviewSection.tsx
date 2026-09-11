import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, Pin } from 'lucide-react';

export const NewsPreviewSection: React.FC = () => {
  const { notices, viewNoticeDetail, setActiveTab } = useValueTogether();
  const list = [...notices]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
  if (list.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-paper-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-wide">NEWS</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3rem] text-ink">최근소식</h2>
            <p className="text-base sm:text-lg text-ink-soft">가치함께의 새로운 소식과 현장의 이야기를 전합니다.</p>
          </div>
          <button type="button" onClick={() => setActiveTab('news')} className="inline-flex items-center gap-1.5 text-base font-extrabold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {list.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => viewNoticeDetail(notice)}
              className="w-full flex items-center gap-4 py-4 text-left hover:bg-paper-soft/50 transition-colors px-2 -mx-2 rounded-lg"
            >
              <span className="shrink-0 text-sm font-bold text-primary-ink bg-primary-soft px-2.5 py-1 rounded-full">{notice.category}</span>
              <span className="flex-1 min-w-0 flex items-center gap-1.5 text-sm text-ink font-medium truncate">
                {notice.isImportant && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
                <span className="truncate">{notice.title}</span>
              </span>
              <span className="shrink-0 text-xs text-ink-soft">{notice.date}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
