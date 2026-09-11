import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, setActiveTab, getImageUrl } = useValueTogether();

  return (
    <section className="relative bg-paper overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 relative grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary-ink bg-secondary-soft px-4 py-2 rounded-full">
            <HeartHandshake className="w-4 h-4" />
            사회적협동조합 가치함께
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.2] text-ink text-balance">
            {settings.sloganMain}
          </h1>
          <p className="text-ink-soft text-base sm:text-lg leading-relaxed max-w-lg">{settings.sloganSub}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('business')}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-primary-ink font-extrabold text-base shadow-sm hover:opacity-90 transition-opacity"
            >
              주요사업 살펴보기
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('partners')}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white border border-line text-ink font-bold text-base hover:border-primary transition-colors"
            >
              함께하는 방법 보기
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] rounded-[2rem] bg-secondary-soft border border-line overflow-hidden shadow-sm">
            {settings.heroImageUrl ? (
              <img src={getImageUrl(settings.heroImageUrl)} alt={settings.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-secondary-ink/60">
                <HeartHandshake className="w-12 h-12" />
                <span className="text-xs font-bold">대표 이미지 — 관리자 설정에서 등록해 주세요</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
