import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { CoreValue } from '../../types';
import { CoreValueIcon } from '../common/CoreValueIcon';

const DEFAULT_CORE_IMAGES: Record<string, string> = {
  people: '/images/core-values/core-people.jpg',
  together: '/images/core-values/core-together.jpg',
  community: '/images/core-values/core-community.jpg',
  sustainability: '/images/core-values/core-sustainability.jpg',
};

export const CoreValuesSection: React.FC = () => {
  const { settings, getImageUrl } = useValueTogether();
  if (!settings.coreValues || settings.coreValues.length === 0) return null;

  const getCoreValueImage = (value: CoreValue) => {
    if (value.imageUrl && value.imageUrl.trim() !== '') return value.imageUrl;
    if (value.icon && DEFAULT_CORE_IMAGES[value.icon]) return DEFAULT_CORE_IMAGES[value.icon];
    if (value.title?.includes('사람')) return DEFAULT_CORE_IMAGES.people;
    if (value.title?.includes('함께')) return DEFAULT_CORE_IMAGES.together;
    if (value.title?.includes('지역')) return DEFAULT_CORE_IMAGES.community;
    if (value.title?.includes('지속')) return DEFAULT_CORE_IMAGES.sustainability;
    return DEFAULT_CORE_IMAGES.people;
  };

  return (
    <section className="py-16 sm:py-24 bg-paper-card border-b border-line/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28 space-y-4">
          <p className="text-xs sm:text-sm font-black text-secondary-ink tracking-widest uppercase">CORE VALUES</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight text-balance">
            가치함께가 지키는 핵심가치
          </h2>
          <p className="text-ink-soft text-base leading-relaxed max-w-md">
            사업의 방향을 정하고 결정할 때마다 돌아보는, 가치함께가 지키는 네 가지 기준입니다.
          </p>
        </div>

        <div className="divide-y divide-line border-t border-b border-line">
          {settings.coreValues.map((value) => {
            const imgSrc = getCoreValueImage(value);
            return (
              <div key={value.id} className="flex items-center gap-5 sm:gap-6 py-6 sm:py-7">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-line bg-paper-soft">
                  <img
                    src={getImageUrl(imgSrc)}
                    alt={value.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center shrink-0">
                  <CoreValueIcon icon={value.icon} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-display font-black text-ink text-lg sm:text-xl tracking-tight">{value.title}</h3>
                  <p className="text-sm sm:text-base font-semibold text-ink/75 leading-relaxed break-keep">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
