import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight } from 'lucide-react';
import { getGalleryPhoto } from '../../utils/galleryPhoto';
import { GalleryItem } from '../../types';

interface GalleryTileProps {
  item: GalleryItem;
  aspect: string;
  textSize: string;
  onOpen: (item: GalleryItem) => void;
  getImageUrl: (url?: string) => string;
}

const GalleryTile: React.FC<GalleryTileProps> = ({ item, aspect, textSize, onOpen, getImageUrl }) => {
  const photoSrc = getGalleryPhoto(item, getImageUrl);
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`group relative block w-full min-w-0 rounded-2xl overflow-hidden text-left shadow-sm hover:shadow-lg transition-shadow ${aspect}`}
    >
      <img
        src={photoSrc}
        alt={item.title}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-3.5 sm:p-4 space-y-0.5">
        <p className="text-[11px] sm:text-xs font-bold text-white/75">{item.category}</p>
        <p className={`font-bold text-white truncate ${textSize}`}>{item.title}</p>
      </div>
    </button>
  );
};

export const GalleryPreviewSection: React.FC = () => {
  const { gallery, viewGalleryDetail, setActiveTab, getImageUrl } = useValueTogether();
  const list = [...gallery].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  if (list.length === 0) return null;

  const [feature, ...rest] = list;
  const restItems = rest.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-bold text-primary-ink tracking-wide">GALLERY</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">활동갤러리</h2>
          </div>
          <button type="button" onClick={() => setActiveTab('gallery')} className="inline-flex items-center gap-1.5 text-base font-bold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="gallery-preview-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-2 lg:h-[560px]">
          {/* 첫 번째 카드는 활동 대표 이미지로 넓게 배치하고 2개 행을 차지합니다. */}
          <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2 min-w-0 min-h-[320px] lg:min-h-0">
            <GalleryTile
              item={feature}
              aspect="h-full min-h-[320px] lg:min-h-0"
              textSize="text-base sm:text-lg lg:text-xl"
              onOpen={viewGalleryDetail}
              getImageUrl={getImageUrl}
            />
          </div>

          {/* 오른쪽 4개 카드는 동일한 크기와 동일한 간격으로 균등 배치합니다. */}
          {restItems.map((item) => (
            <div key={item.id} className="min-w-0 min-h-[220px] lg:min-h-0">
              <GalleryTile
                item={item}
                aspect="h-full min-h-[220px] lg:min-h-0"
                textSize="text-sm sm:text-base"
                onOpen={viewGalleryDetail}
                getImageUrl={getImageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
