import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake, ChevronDown } from 'lucide-react';

const FALLBACK_HERO_IMAGE =
  'https://images.pexels.com/photos/35043674/pexels-photo-35043674.jpeg?auto=compress&cs=tinysrgb&w=2200';

export const Hero: React.FC = () => {
  const { settings, setActiveTab, getImageUrl } = useValueTogether();
  const heroImage = settings.heroImageUrl ? getImageUrl(settings.heroImageUrl) : FALLBACK_HERO_IMAGE;

  return (
    <section className="relative isolate min-h-[650px] sm:min-h-[700px] lg:min-h-[760px] overflow-hidden bg-ink text-white">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${heroImage}")` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/45 to-black/20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(16,32,24,0.18),rgba(16,32,24,0.18))]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto min-h-[650px] sm:min-h-[700px] lg:min-h-[760px] px-5 sm:px-8 lg:px-10 flex items-center">
        <div className="max-w-3xl py-24 sm:py-28 lg:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm sm:text-base font-bold tracking-tight shadow-sm">
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#b7d977]" />
            사회적협동조합 가치함께
          </div>

          <p className="mt-7 text-sm sm:text-base font-extrabold tracking-[0.18em] text-white/80 uppercase">
            People · Community · Value · Together
          </p>

          <h1 className="mt-4 font-display font-black text-[clamp(2.7rem,5.4vw,4.5rem)] leading-[1.12] tracking-[-0.035em] text-balance">
            {settings.sloganMain || '함께 만드는 더 나은 일상, 함께 성장하는 지역사회'}
          </h1>

          <p className="mt-7 max-w-2xl text-base sm:text-lg lg:text-[1.2rem] leading-8 text-white/88 text-balance">
            {settings.sloganSub || '사람과 지역사회를 연결하고, 함께 성장할 수 있는 사회적 가치를 만들어갑니다.'}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('business')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 sm:px-7 py-4 text-base sm:text-lg font-extrabold text-secondary-ink shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              주요사업 살펴보기
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-black/10 backdrop-blur-sm px-6 sm:px-7 py-4 text-base sm:text-lg font-bold text-white hover:bg-white/10 transition-colors"
            >
              가치함께 알아보기
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5 text-sm font-semibold text-white/80">
            {['사람을 잇고', '가치를 만들고', '지역과 함께합니다'].map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-black/10 px-4 py-2 backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => document.getElementById('value-intro')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-1 text-xs font-bold text-white/75 hover:text-white"
        aria-label="다음 섹션으로 이동"
      >
        <span>SCROLL</span>
        <ChevronDown className="w-5 h-5 animate-pulse" />
      </button>
    </section>
  );
};
