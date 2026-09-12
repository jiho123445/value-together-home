import React, { useEffect, useMemo, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { Pagination } from '../components/common/Pagination';
import { Layers } from 'lucide-react';
import { getGalleryPhoto } from '../utils/galleryPhoto';

const PAGE_SIZE = 12;

export const GalleryPage: React.FC = () => {
  const { gallery, galleryCategories, viewGalleryDetail, getImageUrl } = useValueTogether();
  const [category, setCategory] = useState('전체');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [category]);

  const filtered = useMemo(() => {
    const list = category === '전체' ? gallery : gallery.filter((g) => g.category === category);
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [gallery, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageBanner eyebrow="GALLERY" title="활동갤러리" description="가치함께의 다양한 활동 현장을 사진으로 소개합니다." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {['전체', ...galleryCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-colors ${
                category === c ? 'bg-primary text-primary-ink' : 'bg-paper-card border border-line text-ink-soft hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {pageItems.length === 0 ? (
          <p className="text-sm text-ink-soft py-16 text-center">등록된 사진이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {pageItems.map((item) => {
              const photoSrc = getGalleryPhoto(item, getImageUrl);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => viewGalleryDetail(item)}
                  className="group text-left rounded-2xl overflow-hidden border border-line bg-paper-card shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] bg-paper-soft overflow-hidden relative">
                    <img
                      src={photoSrc}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.images && item.images.length > 1 && (
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {item.images.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-0.5">
                    <p className="text-[11px] font-bold text-secondary-ink">{item.category}</p>
                    <p className="text-xs font-bold text-ink truncate">{item.title}</p>
                    <p className="text-[11px] text-ink-soft">{item.date}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};
