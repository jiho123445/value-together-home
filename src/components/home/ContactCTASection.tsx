import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';

export const ContactCTASection: React.FC = () => {
  const { setActiveTab } = useValueTogether();
  return (
    <section className="py-16 sm:py-20 bg-ink text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <MessageCircleQuestion className="w-10 h-10 mx-auto text-primary" />
        <h2 className="font-display font-black text-3xl sm:text-4xl">궁금한 점이 있으신가요?</h2>
        <p className="text-base text-white/70 leading-relaxed">
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
    </section>
  );
};
