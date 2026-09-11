import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';

export const ContactCTASection: React.FC = () => {
  const { setActiveTab } = useValueTogether();
  return (
    <section className="py-16 sm:py-20 bg-ink text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <MessageCircleQuestion className="w-9 h-9 mx-auto text-primary" />
        <h2 className="font-display font-black text-2xl sm:text-3xl">궁금한 점이 있으신가요?</h2>
        <p className="text-sm text-white/70 leading-relaxed">
          사업 참여, 협력 제안, 조합원 가입 등 무엇이든 편하게 문의해 주세요.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 transition-opacity"
        >
          문의하기
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
