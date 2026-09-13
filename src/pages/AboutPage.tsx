import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { AboutSubTab } from '../types';
import { Quote, Building2, ListChecks, Milestone } from 'lucide-react';

const SUB_TABS: { key: AboutSubTab; label: string }[] = [
  { key: 'greeting', label: '인사말' },
  { key: 'intro', label: '조합 소개' },
  { key: 'history', label: '연혁' },
  { key: 'organization', label: '조직도' },
  { key: 'principles', label: '운영원칙' },
];

export const AboutPage: React.FC = () => {
  const { settings, timeline, aboutSubTab, setAboutSubTab, getImageUrl } = useValueTogether();

  return (
    <div>
      <PageBanner eyebrow="ABOUT" title="가치함께 소개" description="사회적협동조합 가치함께를 소개합니다." />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-line mb-10 pb-1">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setAboutSubTab(tab.key)}
              className={`px-5 sm:px-7 py-3 sm:py-4 rounded-t-xl text-base sm:text-lg font-bold transition-colors ${
                aboutSubTab === tab.key ? 'text-primary-ink bg-primary-soft' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {aboutSubTab === 'greeting' && (
          <div className="space-y-6">
            <Quote className="w-8 h-8 text-primary" />
            <p className="text-base sm:text-lg text-ink leading-relaxed whitespace-pre-line">{settings.representativeGreeting}</p>
            <div className="flex items-center gap-3 pt-4 border-t border-line">
              {settings.representativeImageUrl && (
                <img src={getImageUrl(settings.representativeImageUrl)} alt="" loading="lazy" className="w-14 h-14 rounded-full object-cover" />
              )}
              <div>
                <p className="font-bold text-ink text-sm">{settings.representativeName}</p>
                <p className="text-xs text-ink-soft">{settings.name} {settings.representativeTitle}</p>
              </div>
            </div>
          </div>
        )}

        {aboutSubTab === 'intro' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-bold text-ink text-lg">설립 목적</h2>
              <p className="text-base sm:text-lg text-ink leading-relaxed whitespace-pre-line">{settings.purposeStatement}</p>
            </div>
            <div className="space-y-2">
              <h2 className="font-bold text-ink text-lg">조합 소개</h2>
              <p className="text-base sm:text-lg text-ink leading-relaxed whitespace-pre-line">{settings.introStatement}</p>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-line text-sm">
              <div className="flex justify-between gap-3 border-b border-line/60 py-2">
                <dt className="text-ink-soft">설립연도</dt>
                <dd className="font-bold text-ink">{settings.establishedYear || '관리자 입력 필요'}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line/60 py-2">
                <dt className="text-ink-soft">고유번호</dt>
                <dd className="font-bold text-ink">{settings.businessRegistrationNumber || '관리자 입력 필요'}</dd>
              </div>
            </dl>
          </div>
        )}

        {aboutSubTab === 'history' && (
          <div className="space-y-6">
            {timeline.length === 0 ? (
              <p className="text-sm text-ink-soft py-10 text-center">등록된 연혁이 아직 없습니다. 관리자 페이지에서 추가해 주세요.</p>
            ) : (
              <ol className="relative border-l-2 border-line ml-2 space-y-8">
                {[...timeline].sort((a, b) => (a.year < b.year ? 1 : -1)).map((item) => (
                  <li key={item.id} className="ml-6">
                    <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-primary border-2 border-paper" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-black text-primary-ink text-lg">{item.year}</span>
                      {item.category && (
                        <span className="text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2 py-0.5 rounded-full">{item.category}</span>
                      )}
                      {item.isMilestone && <Milestone className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <p className="font-bold text-ink text-base sm:text-lg mt-1">{item.title}</p>
                    {item.subtitle && <p className="text-sm sm:text-base text-ink-soft italic">{item.subtitle}</p>}
                    <p className="text-base sm:text-lg text-ink-soft leading-relaxed mt-1 whitespace-pre-line">{item.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {aboutSubTab === 'organization' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-ink-soft text-xs font-bold mb-2">
              <Building2 className="w-4 h-4" /> 조직 구성
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[...settings.orgChart].sort((a, b) => a.order - b.order).map((item) => (
                <div key={item.id} className="bg-paper-card border border-line rounded-2xl p-5">
                  <p className="font-bold text-ink text-base sm:text-lg">{item.department}</p>
                  {item.role && <p className="text-sm sm:text-base text-primary-ink font-bold mt-0.5">{item.role}</p>}
                  {item.description && <p className="text-base sm:text-lg text-ink-soft mt-1.5">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {aboutSubTab === 'principles' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-ink-soft text-xs font-bold mb-2">
              <ListChecks className="w-4 h-4" /> 운영원칙
            </div>
            <div className="space-y-3">
              {settings.operatingPrinciples.map((p) => (
                <div key={p.id} className="bg-paper-card border border-line rounded-2xl p-5">
                  <p className="font-bold text-ink text-base sm:text-lg">{p.title}</p>
                  <p className="text-base sm:text-lg text-ink-soft mt-1 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
