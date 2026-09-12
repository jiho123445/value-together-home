import React, { useEffect, useMemo, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { Pagination } from '../components/common/Pagination';
import { NoticeCategory } from '../types';
import { Pin, Search, ExternalLink } from 'lucide-react';

const CATEGORIES: (NoticeCategory | '전체')[] = ['전체', '공지사항', '사업소식', '모집공고', '보도자료', '자료실'];
const PAGE_SIZE = 10;

export const NewsPage: React.FC = () => {
  const { notices, noticeCategory, setNoticeCategory, viewNoticeDetail } = useValueTogether();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [noticeCategory, search]);

  const filtered = useMemo(() => {
    let list = noticeCategory === '전체' ? notices : notices.filter((n) => n.category === noticeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
  }, [notices, noticeCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageBanner eyebrow="NEWS" title="소식" description="공지사항, 사업소식, 모집공고, 보도자료, 자료실을 확인하실 수 있습니다." />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNoticeCategory(c)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-colors ${
                  noticeCategory === c ? 'bg-primary text-primary-ink' : 'bg-paper-card border border-line text-ink-soft hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목/내용 검색"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-paper-card text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {pageItems.length === 0 ? (
          <p className="text-sm text-ink-soft py-16 text-center">등록된 글이 없습니다.</p>
        ) : (
          <div className="divide-y divide-line border-y border-line">
            {pageItems.map((notice) => (
              <button
                key={notice.id}
                type="button"
                onClick={() => (notice.category === '보도자료' && notice.externalUrl ? window.open(notice.externalUrl, '_blank', 'noopener,noreferrer') : viewNoticeDetail(notice))}
                className="w-full flex items-center gap-3 sm:gap-4 py-4 text-left hover:bg-paper-card transition-colors px-2 -mx-2 rounded-lg"
              >
                <span className="shrink-0 text-[11px] font-bold text-primary-ink bg-primary-soft px-2.5 py-1 rounded-full">{notice.category}</span>
                <span className="flex-1 min-w-0 flex items-center gap-1.5 text-sm text-ink font-medium truncate">
                  {notice.isImportant && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
                  <span className="truncate">{notice.title}</span>
                  {notice.category === '보도자료' && notice.externalUrl && <ExternalLink className="w-3.5 h-3.5 text-ink-soft shrink-0" />}
                </span>
                <span className="shrink-0 hidden sm:inline text-xs text-ink-soft">조회 {notice.views}</span>
                <span className="shrink-0 text-xs text-ink-soft">{notice.date}</span>
              </button>
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};
