import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { CoreValueIcon } from '../common/CoreValueIcon';

export const CoreValuesSection: React.FC = () => {
  const { settings } = useValueTogether();
  if (!settings.coreValues || settings.coreValues.length === 0) return null;

  return (
    <section id="value-intro" className="py-20 sm:py-24 bg-paper-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-end">
          <div className="space-y-4">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-[0.16em]">OUR VALUE</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3rem] leading-tight text-ink tracking-tight">
              함께해야 가치가 커집니다
            </h2>
          </div>
          <p className="text-base sm:text-lg leading-8 text-ink-soft max-w-2xl">
            가치함께는 사람과 사람, 기관과 지역사회를 연결하고 함께 성장할 수 있는 사회적 가치를 만들어가는 사회적협동조합을 지향합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {settings.coreValues.map((value, index) => (
            <div key={value.id} className="group bg-paper rounded-3xl p-6 sm:p-7 border border-line hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-soft text-primary-ink flex items-center justify-center">
                  <CoreValueIcon icon={value.icon} className="w-8 h-8" />
                </div>
                <span className="text-sm font-black text-ink-soft/55">0{index + 1}</span>
              </div>
              <h3 className="mt-6 font-display font-black text-xl sm:text-2xl text-ink">{value.title}</h3>
              <p className="mt-3 text-base leading-7 text-ink-soft">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
