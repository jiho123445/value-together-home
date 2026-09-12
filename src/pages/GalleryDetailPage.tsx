import React, { useEffect, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Layers, Image as ImageIcon } from 'lucide-react';
import { getGalleryPhoto } from '../utils/galleryPhoto';

export const GalleryDetailPage: React.FC = () => {
  const { selectedGallery, goBackFromDetail, setActiveTab, getImageUrl } = useValueTogether();
  const [activeIdx, setActiveIdx] = useState(0);

  const rawImages = selectedGallery
    ? selectedGallery.images && selectedGallery.images.length > 0
      ? selectedGallery.images
      : selectedGallery.imageUrl
        ? [selectedGallery.imageUrl]
        : []
    : [];

  const allImages = rawImages.length > 0
    ? rawImages
    : selectedGallery
      ? [getGalleryPhoto(selectedGallery, getImageUrl)]
      : [];

  useEffect(() => {
    setActiveIdx(0);
  }, [selectedGallery?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      else if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length]);

  if (!selectedGallery) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center space-y-4">
        <p className="text-ink-soft text-sm">사진을 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.</p>
        <button type="button" onClick={() => setActiveTab('gallery')} className="text-sm font-bold text-primary-ink underline underline-offset-2">
          갤러리 목록으로 이동
        </button>
      </div>
    );
  }

  const item = selectedGallery;
  const rawTarget = allImages[activeIdx] || item.imageUrl;
  const activePhotoUrl = rawTarget ? getImageUrl(rawTarget) : getGalleryPhoto(item, getImageUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <button type="button" onClick={() => goBackFromDetail('gallery')} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink mb-6">
        <ChevronLeft className="w-4 h-4" /> 목록으로
      </button>

      <div className="rounded-3xl overflow-hidden border border-line bg-ink">
        <div className="relative bg-ink flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden select-none">
          {activePhotoUrl ? (
            <img src={getImageUrl(activePhotoUrl)} alt={`${item.title} - 사진 ${activeIdx + 1}`} className="w-full h-full object-contain max-h-[60vh]" />
          ) : (
            <ImageIcon className="w-12 h-12 text-white/30" />
          )}
          {allImages.length > 1 && (
            <>
              <span className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-secondary" />
                사진 {activeIdx + 1} / {allImages.length}
              </span>
              <button
                onClick={() => setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center shadow-lg transition-all"
                aria-label="이전 사진"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center shadow-lg transition-all"
                aria-label="다음 사진"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="bg-ink px-4 py-3 flex items-center gap-2 overflow-x-auto">
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                  activeIdx === idx ? 'border-primary scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(imgUrl)} alt={`썸네일 ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-secondary-ink bg-secondary-soft px-3 py-1 rounded-full">{item.category}</span>
          <div className="flex items-center gap-4 text-xs text-ink-soft">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
            {item.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-secondary-ink" />{item.location}</span>}
          </div>
        </div>
        <h1 className="text-xl font-extrabold text-ink">{item.title}</h1>
        <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{item.description}</p>
      </div>
    </div>
  );
};
