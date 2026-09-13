import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getProgramPhoto } from '../../utils/programPhoto';

export const ProgramsPreviewSection: React.FC = () => {
  const { programs, viewProgramDetail, setActiveTab, getImageUrl } = useValueTogether();

  const ordered = [...programs].sort((a, b) => a.order - b.order);
  const mainPrograms = ordered.filter((p) => p.businessType === '주사업');
  const otherPrograms = ordered.filter((p) => p.businessType === '기타사업');

  // 왼쪽에는 대표 주사업 1개 + 기타사업 2개를 같은 높이의 카드로 배치합니다.
  const leftCards = [
    mainPrograms[0],
    otherPrograms[0],
    otherPrograms[1],
  ].filter(Boolean);

  // 나머지 사업은 오른쪽 목록으로 보여줍니다.
  const leftIds = new Set(leftCards.map((p) => p.id));
  const rightList = ordered.filter((p) => !leftIds.has(p.id)).slice(0, 4);

  if (leftCards.length === 0 && rightList.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-bold text-primary-ink tracking-wide">OUR BUSINESS</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">주요사업</h2>
          </div>
          <button type="button" onClick={() => setActiveTab('business')} className="inline-flex items-center gap-1.5 text-base font-bold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,2.05fr)_minmax(360px,1fr)] gap-8 lg:gap-10 items-stretch">
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {leftCards.map((program) => {
              const imgSrc = getProgramPhoto(program, getImageUrl);
              const isMain = program.businessType === '주사업';
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => viewProgramDetail(program)}
                  className="group relative rounded-3xl overflow-hidden text-left min-h-[390px] sm:min-h-[430px] h-full shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={imgSrc}
                    alt={program.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="relative h-full min-h-[390px] sm:min-h-[430px] flex flex-col justify-end p-5 sm:p-6 lg:p-7 space-y-2.5 text-white">
                    <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      사업 {program.code} · {isMain ? '주사업' : '기타사업'}
                    </span>
                    <h3 className={`font-display font-black leading-tight text-balance ${isMain ? 'text-2xl sm:text-[27px]' : 'text-[21px] sm:text-[23px]'}`}>
                      {program.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-white/85 leading-relaxed line-clamp-3">{program.summary}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="divide-y divide-line border-t border-b border-line flex flex-col">
            {rightList.map((program) => {
              const imgSrc = getProgramPhoto(program, getImageUrl);
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => viewProgramDetail(program)}
                  className="group flex items-center gap-4 py-5 sm:py-6 text-left hover:bg-paper-soft/50 transition-colors px-2 -mx-2 rounded-lg flex-1"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-line bg-paper-soft group-hover:scale-105 transition-transform duration-300">
                    <img src={imgSrc} alt={program.title} referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-secondary-ink">{program.subtitle}</p>
                    <p className="font-bold text-ink text-sm sm:text-base truncate">{program.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-soft/50 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
