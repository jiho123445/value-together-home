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
    <section className="py-14 sm:py-20 bg-paper-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-bold text-primary-ink tracking-wide">NEWS</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">최근소식</h2>
          </div>
          <button type="button" onClick={() => setActiveTab('news')} className="inline-flex items-center gap-1.5 text-base font-bold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {list.map((notice) => {
            const [y, m, d] = notice.date.split('-');
            return (
              <button
                key={notice.id}
                type="button"
                onClick={() => viewNoticeDetail(notice)}
                className="w-full flex items-center gap-4 sm:gap-6 py-4 sm:py-5 text-left hover:bg-paper-soft/50 transition-colors px-2 -mx-2 rounded-lg"
              >
                <div className="shrink-0 w-14 sm:w-16 text-center">
                  <p className="font-display font-black text-2xl sm:text-3xl text-ink tabular-nums leading-none">{d}</p>
                  <p className="text-[11px] sm:text-xs font-bold text-ink-soft mt-1">{y}.{m}</p>
                </div>
                <div className="w-px self-stretch bg-line hidden sm:block" />
                <span className="shrink-0 text-xs font-bold text-primary-ink bg-primary-soft px-2.5 py-1 rounded-full">{notice.category}</span>
                <span className="flex-1 min-w-0 flex items-center gap-1.5 text-base text-ink font-medium truncate">
                  {notice.isImportant && <Pin className="w-4 h-4 text-primary shrink-0" />}
                  <span className="truncate">{notice.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
