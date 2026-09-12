import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, setActiveTab, getImageUrl, programs, partners } = useValueTogether();

  const commaIndex = settings.sloganMain.indexOf(',');
  const sloganLine1 = commaIndex === -1 ? settings.sloganMain : settings.sloganMain.slice(0, commaIndex + 1);
  const sloganLine2 = commaIndex === -1 ? '' : settings.sloganMain.slice(commaIndex + 1).trim();

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 relative grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-6 items-stretch">
        <div className="space-y-6 flex flex-col justify-center py-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary-ink bg-secondary-soft px-4 py-2 rounded-full w-fit">
            <HeartHandshake className="w-4 h-4" />
            사회적협동조합 가치함께
          </span>
          <h1 className="font-display font-black text-[26px] sm:text-5xl lg:text-[3.25rem] leading-[1.4] text-ink">
            {sloganLine2 ? (
              <>
                {sloganLine1}
                <br />
                {sloganLine2}
              </>
            ) : (
              settings.sloganMain
            )}
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

        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-0">
          <div className="absolute inset-0 lg:rounded-l-[2.5rem] rounded-[2rem] lg:rounded-r-none overflow-hidden bg-secondary-soft border border-line shadow-sm">
            {settings.heroImageUrl ? (
              <img
                src={getImageUrl(settings.heroImageUrl)}
                alt={settings.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-secondary-ink/60">
                <HeartHandshake className="w-12 h-12" />
                <span className="text-xs font-bold">대표 이미지 — 관리자 설정에서 등록해 주세요</span>
              </div>
            )}
          </div>

          <div className="absolute left-4 sm:left-8 lg:-left-8 bottom-6 sm:bottom-10 z-10 bg-paper-card/95 backdrop-blur-sm border border-line rounded-2xl shadow-lg px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-5 sm:gap-6">
            <div className="text-center">
              <p className="font-display font-black text-2xl sm:text-3xl text-primary-ink tabular-nums">{programs.length}</p>
              <p className="text-[11px] sm:text-xs font-bold text-ink-soft mt-0.5">주요사업</p>
            </div>
            <div className="w-px h-9 sm:h-10 bg-line" />
            <div className="text-center">
              <p className="font-display font-black text-2xl sm:text-3xl text-secondary-ink tabular-nums">{partners.length}</p>
              <p className="text-[11px] sm:text-xs font-bold text-ink-soft mt-0.5">협력기관</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
