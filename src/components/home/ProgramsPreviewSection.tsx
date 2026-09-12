import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getProgramPhoto } from '../../utils/programPhoto';

export const ProgramsPreviewSection: React.FC = () => {
  const { programs, viewProgramDetail, setActiveTab, getImageUrl } = useValueTogether();
  const featured = programs.filter((p) => p.featuredOnHome).slice(0, 6);
  const list = featured.length > 0 ? featured : programs.slice(0, 6);
  if (list.length === 0) return null;

  const [spotlight, ...rest] = list;
  const spotlightImg = getProgramPhoto(spotlight, getImageUrl);

  return (
    <section className="py-14 sm:py-20 bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-bold text-primary-ink tracking-wide">OUR BUSINESS</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink">주요사업</h2>
          </div>
          <button type="button" onClick={() => setActiveTab('business')} className="inline-flex items-center gap-1.5 text-base font-bold text-ink-soft hover:text-ink">
            전체보기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 items-stretch">
          <button
            type="button"
            onClick={() => viewProgramDetail(spotlight)}
            className="group relative rounded-3xl overflow-hidden text-left min-h-[300px] sm:min-h-[380px] shadow-sm hover:shadow-lg transition-shadow"
          >
            <img
              src={spotlightImg}
              alt={spotlight.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 space-y-2.5 text-white">
              <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                사업 {spotlight.code} · {spotlight.category}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl leading-tight text-balance">{spotlight.title}</h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md line-clamp-2">{spotlight.summary}</p>
            </div>
          </button>

          <div className="divide-y divide-line border-t border-b border-line flex flex-col">
            {rest.map((program) => {
              const imgSrc = getProgramPhoto(program, getImageUrl);
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => viewProgramDetail(program)}
                  className="group flex items-center gap-4 py-4 sm:py-5 text-left hover:bg-paper-soft/50 transition-colors px-2 -mx-2 rounded-lg"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-line bg-paper-soft group-hover:scale-105 transition-transform duration-300">
                    <img src={imgSrc} alt={program.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-secondary-ink">{program.category}</p>
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
