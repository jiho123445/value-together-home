import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export const PartnersPreviewSection: React.FC = () => {
  const { partners, setActiveTab, getImageUrl } = useValueTogether();
  if (partners.length === 0) return null;

  // 마퀴가 매끄럽게 반복되려면 트랙을 "최소 6개로 채운 기본 목록"을
  // 정확히 2배로 이어붙여야 합니다 (translateX(-50%) 루프 계산과 일치).
  const base = partners.length >= 6 ? partners : Array.from({ length: 6 }, (_, i) => partners[i % partners.length]);
  const track = [...base, ...base];

  return (
    <section className="py-14 sm:py-20 bg-paper-card overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <p className="text-sm font-bold text-primary-ink tracking-wide">PARTNERS</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">함께하는 협력기관</h2>
        </div>
      </div>

      <div className="group marquee-viewport mt-2">
        <div className="marquee-track group-hover:[animation-play-state:paused] flex items-center gap-10 sm:gap-14 w-max">
          {track.map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="flex flex-col items-center gap-2 w-28 shrink-0">
              {partner.logoUrl ? (
                <img src={getImageUrl(partner.logoUrl)} alt={partner.name} className="h-14 object-contain grayscale opacity-80" />
              ) : (
                <div className="h-14 w-20 rounded-lg bg-paper-soft" />
              )}
              <span className="text-sm text-ink-soft text-center leading-tight">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mt-10">
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-primary-ink font-extrabold text-base shadow-sm hover:opacity-90 transition-opacity"
        >
          <HeartHandshake className="w-5 h-5" />
          협력기관 안내 및 참여 신청
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
