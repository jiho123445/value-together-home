import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';

export const ContactCTASection: React.FC = () => {
  const { setActiveTab } = useValueTogether();
  return (
    <section className="py-20 sm:py-28 bg-secondary-ink text-white">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
          <MessageCircleQuestion className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm sm:text-base font-extrabold tracking-[0.16em] text-white/65">LET'S CONNECT</p>
        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3.2rem] leading-tight">지역사회의 더 나은 내일,<br className="hidden sm:block" /> 가치함께 시작합니다.</h2>
        <p className="text-base sm:text-lg leading-8 text-white/75 max-w-2xl mx-auto">
          사업 문의부터 협력 제안까지, 가치함께와 함께할 이야기를 들려주세요.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-primary text-primary-ink font-extrabold text-base sm:text-lg shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          문의하기
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
