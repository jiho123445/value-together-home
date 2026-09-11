import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import * as Icons from 'lucide-react';
import { ArrowRight, Briefcase } from 'lucide-react';

export const ProgramsPreviewSection: React.FC = () => {
  const { programs, viewProgramDetail, setActiveTab } = useValueTogether();
  const featured = programs.filter((p) => p.featuredOnHome).slice(0, 6);
  const list = featured.length > 0 ? featured : programs.slice(0, 6);
  if (list.length === 0) return null;

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((program) => {
            const IconComp = (Icons as any)[program.iconName] || Briefcase;
            return (
              <button
                key={program.id}
                type="button"
                onClick={() => viewProgramDetail(program)}
                className="text-left bg-paper-card border border-line rounded-2xl p-6 space-y-3.5 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-ink-soft/60">{program.code}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-secondary-ink bg-secondary-soft px-2.5 py-1 rounded-full">{program.category}</span>
                </div>
                <h3 className="font-bold text-ink text-lg leading-snug">{program.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed line-clamp-2">{program.summary}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
