import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';
import { CoreValueIcon } from '../common/CoreValueIcon';

export const ContactCTASection: React.FC = () => {
  const { settings, setActiveTab } = useValueTogether();
  return (
    <section className="relative py-16 sm:py-24 bg-ink text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
        aria-hidden="true"
      />
      <div className="absolute -right-16 -bottom-16 text-white/[0.06] pointer-events-none hidden lg:block">
        <CoreValueIcon icon="together" className="w-[26rem] h-[26rem]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div className="space-y-5">
          <MessageCircleQuestion className="w-10 h-10 text-primary" />
          <h2 className="font-display font-black text-3xl sm:text-4xl leading-tight text-balance">궁금한 점이 있으신가요?</h2>
          <p className="text-base text-white/70 leading-relaxed max-w-md">
            사업 참여, 협력 제안, 조합원 가입 등 무엇이든 편하게 문의해 주세요.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-ink font-extrabold text-base shadow-sm hover:opacity-90 transition-opacity"
          >
            문의하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
          <p className="text-xs font-bold text-white/50 tracking-widest uppercase mb-3">OUR PURPOSE</p>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed break-keep">
            {settings.purposeStatement}
          </p>
        </div>
      </div>
    </section>
  );
};
