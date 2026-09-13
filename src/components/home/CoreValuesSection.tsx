import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { CoreValue } from '../../types';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 lg:space-y-14">
        <div className="max-w-xl space-y-4">
          <p className="text-xs sm:text-sm font-black text-secondary-ink tracking-widest uppercase">CORE VALUES</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight text-balance">
            가치함께가 지키는 핵심가치
          </h2>
          <p className="text-ink-soft text-base leading-relaxed">
            사업의 방향을 정하고 결정할 때마다 돌아보는, 가치함께가 지키는 네 가지 기준입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {settings.coreValues.map((value) => {
            const imgSrc = getCoreValueImage(value);
            return (
              <div key={value.id} className="flex flex-col items-center text-center gap-4">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-3xl overflow-hidden shrink-0 bg-paper-soft"
                >
                  <img
                    src={getImageUrl(imgSrc)}
                    alt={value.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="block w-full h-full object-cover scale-[1.25]"
                  />
                </div>
                <div className="min-w-0 space-y-1.5">
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
