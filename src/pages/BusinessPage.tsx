import React, { useMemo, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { ProgramCategory } from '../types';
import * as Icons from 'lucide-react';
import { Briefcase } from 'lucide-react';

const CATEGORIES: (ProgramCategory | '전체')[] = ['전체', '사회서비스', '교육사업', '지역사회사업', '돌봄복지사업', '일자리자립지원', '기타사업'];

export const BusinessPage: React.FC = () => {
  const { programs, viewProgramDetail } = useValueTogether();
  const [category, setCategory] = useState<(ProgramCategory | '전체')>('전체');

  const filtered = useMemo(() => {
    const list = category === '전체' ? programs : programs.filter((p) => p.category === category);
    return [...list].sort((a, b) => a.order - b.order);
  }, [programs, category]);

  return (
    <div>
      <PageBanner eyebrow="OUR BUSINESS" title="주요사업" description="가치함께가 지역사회와 함께 운영하는 사업을 소개합니다." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                category === c ? 'bg-primary text-primary-ink' : 'bg-paper-card border border-line text-ink-soft hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-ink-soft py-16 text-center">등록된 사업이 없습니다.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((program) => {
              const IconComp = (Icons as any)[program.iconName] || Briefcase;
              return (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => viewProgramDetail(program)}
                  className="text-left bg-paper-card border border-line rounded-2xl p-6 space-y-3.5 hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-ink-soft/60">{program.code}</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2.5 py-1 rounded-full">{program.category}</span>
                  <h3 className="font-bold text-ink text-base leading-snug">{program.title}</h3>
                  <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">{program.summary}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
