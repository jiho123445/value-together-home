import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export const PartnersPreviewSection: React.FC = () => {
  const { partners, setActiveTab, getImageUrl } = useValueTogether();
  if (partners.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-paper-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <p className="text-xs font-bold text-primary-ink tracking-wide">PARTNERS</p>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink">함께하는 협력기관</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.slice(0, 8).map((partner) => (
            <div key={partner.id} className="flex flex-col items-center gap-2 w-24">
              {partner.logoUrl ? (
                <img src={getImageUrl(partner.logoUrl)} alt={partner.name} className="h-10 object-contain grayscale opacity-80" />
              ) : (
                <div className="h-10 w-16 rounded-lg bg-paper-soft" />
              )}
              <span className="text-[11px] text-ink-soft text-center leading-tight">{partner.name}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 transition-opacity"
          >
            <HeartHandshake className="w-4 h-4" />
            협력기관 안내 및 참여 신청
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
