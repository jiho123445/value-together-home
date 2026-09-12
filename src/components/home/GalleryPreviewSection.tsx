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
      className={`group relative rounded-2xl overflow-hidden text-left shadow-sm hover:shadow-lg transition-shadow ${aspect}`}
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

        <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-3 sm:gap-4 sm:h-[480px] lg:h-[560px]">
          <div className="col-span-2 sm:row-span-2">
            <GalleryTile item={feature} aspect="aspect-video sm:aspect-auto sm:h-full" textSize="text-base sm:text-lg" onOpen={viewGalleryDetail} getImageUrl={getImageUrl} />
          </div>
          {restItems.map((item) => (
            <div key={item.id} className="col-span-1">
              <GalleryTile item={item} aspect="aspect-square sm:aspect-auto sm:h-full" textSize="text-sm" onOpen={viewGalleryDetail} getImageUrl={getImageUrl} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
