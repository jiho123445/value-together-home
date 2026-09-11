import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, HeartHandshake, Users, Handshake, GraduationCap, Gift } from 'lucide-react';

const OPTIONS = [
  { title: '함께 배우기', description: '교육과 역량강화 프로그램에 참여합니다.', icon: GraduationCap },
  { title: '함께 참여하기', description: '지역사회 활동과 프로그램에 함께합니다.', icon: Users },
  { title: '함께 협력하기', description: '기관·단체와 새로운 협력의 기회를 만듭니다.', icon: Handshake },
  { title: '함께 나누기', description: '후원과 자원봉사로 사회적 가치를 확산합니다.', icon: Gift },
];

export const PartnersPreviewSection: React.FC = () => {
  const { partners, setActiveTab, getImageUrl } = useValueTogether();

  return (
    <section className="py-20 sm:py-24 bg-paper-card">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-[0.16em]">TOGETHER</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3rem] text-ink tracking-tight">함께하는 방법</h2>
            <p className="text-base sm:text-lg text-ink-soft">혼자가 아닌 함께라서 가능한 변화, 다양한 방식으로 가치함께와 연결되어 보세요.</p>
          </div>
          <button type="button" onClick={() => setActiveTab('partners')} className="inline-flex items-center gap-2 text-base font-extrabold text-ink-soft hover:text-ink">
            협력 및 참여 안내 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {OPTIONS.map(({ title, description, icon: Icon }) => (
            <button key={title} type="button" onClick={() => setActiveTab('partners')} className="text-left rounded-3xl border border-line bg-paper p-6 sm:p-7 hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-secondary-soft text-secondary-ink flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-display font-black text-xl sm:text-2xl text-ink">{title}</h3>
              <p className="mt-2 text-base leading-7 text-ink-soft">{description}</p>
            </button>
          ))}
        </div>

        {partners.length > 0 && (
          <div className="pt-8 border-t border-line">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-[0.12em] mb-6">PARTNERS</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-7">
              {partners.slice(0, 8).map((partner) => (
                <div key={partner.id} className="flex flex-col items-center gap-2 w-28">
                  {partner.logoUrl ? (
                    <img src={getImageUrl(partner.logoUrl)} alt={partner.name} className="h-10 max-w-24 object-contain opacity-80" loading="lazy" />
                  ) : (
                    <div className="h-10 w-20 rounded-lg bg-paper-soft" aria-hidden="true" />
                  )}
                  <span className="text-sm text-ink-soft text-center leading-tight">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
