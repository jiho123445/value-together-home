import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { CoreValueIcon } from '../common/CoreValueIcon';

export const CoreValuesSection: React.FC = () => {
  const { settings } = useValueTogether();
  if (!settings.coreValues || settings.coreValues.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-paper-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <p className="text-xs font-bold text-primary-ink tracking-wide">CORE VALUES</p>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink">가치함께가 지키는 핵심가치</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {settings.coreValues.map((value) => (
            <div key={value.id} className="bg-paper rounded-2xl p-5 sm:p-6 border border-line text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary-ink flex items-center justify-center mx-auto">
                <CoreValueIcon icon={value.icon} className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-ink text-sm sm:text-base">{value.title}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
