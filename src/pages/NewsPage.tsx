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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
        <div className="space-y-8">
          {/* 카테고리는 화면 폭을 끝까지 활용해 동일한 폭으로 균등 배치합니다. */}
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-cols-6 gap-3 sm:gap-4 min-w-[720px] w-full">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNoticeCategory(c)}
                  className={`w-full min-h-12 px-3 rounded-full text-sm sm:text-base font-bold border transition-colors whitespace-nowrap ${
                    noticeCategory === c ? 'bg-primary text-primary-ink border-primary' : 'bg-paper-card border-line text-ink-soft hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 검색창은 카테고리와 게시글 영역 사이에 충분한 여백을 두어 배치합니다. */}
          <div className="relative w-full">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목/내용 검색"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-line bg-paper-card text-sm sm:text-base focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
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
