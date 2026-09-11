import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export const GalleryPreviewSection: React.FC = () => {
  const { gallery, viewGalleryDetail, setActiveTab, getImageUrl } = useValueTogether();
  const list = [...gallery].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  if (list.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-wide">GALLERY</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3rem] text-ink">활동갤러리</h2>
            <p className="text-base sm:text-lg text-ink-soft">함께 만들어온 순간과 지역사회 현장의 모습을 기록합니다.</p>
          </div>
          <button type="button" onClick={() => setActiveTab('gallery')} className="inline-flex items-center gap-1.5 text-base font-extrabold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {list.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => viewGalleryDetail(item)}
              className="group text-left rounded-2xl overflow-hidden border border-line bg-paper-card"
            >
              <div className="aspect-[4/3] bg-paper-soft overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-soft/40">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-3 space-y-0.5">
                <p className="text-sm font-bold text-secondary-ink">{item.category}</p>
                <p className="text-base font-bold text-ink truncate">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
