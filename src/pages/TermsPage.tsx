import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';

/** 이용약관 — 표준 템플릿. 개인정보처리방침과 마찬가지로 게시 전 검토가 필요합니다. */
export const TermsPage: React.FC = () => {
  const { settings } = useValueTogether();

  return (
    <div>
      <PageBanner eyebrow="LEGAL" title="이용약관" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8 text-sm text-ink-soft leading-relaxed">
        <p className="text-xs bg-primary-soft text-primary-ink font-bold px-4 py-3 rounded-xl">
          본 약관은 표준 템플릿입니다. 게시 전 실제 운영 현황에 맞게 관리자/법률 자문을 통해 검토해 주세요.
        </p>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제1조 (목적)</h2>
          <p>본 약관은 {settings.name}(이하 &lsquo;조합&rsquo;)이 운영하는 홈페이지(이하 &lsquo;사이트&rsquo;) 이용과 관련하여 조합과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제2조 (사이트의 제공 내용)</h2>
          <p>사이트는 조합 소개, 주요사업 안내, 소식, 활동갤러리, 참여·협력 신청, 문의 접수 등의 정보를 제공합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제3조 (이용자의 의무)</h2>
          <p>이용자는 신청 및 문의 시 사실에 근거한 정보를 제공해야 하며, 타인의 정보를 도용하거나 사이트의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제4조 (저작권)</h2>
          <p>사이트에 게시된 콘텐츠(글, 사진 등)에 대한 저작권은 조합 또는 정당한 권리자에게 있으며, 사전 동의 없이 무단으로 복제·배포·전송할 수 없습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제5조 (약관의 변경)</h2>
          <p>본 약관은 관련 법령 및 조합 내부 방침에 따라 변경될 수 있으며, 변경 시 사이트를 통해 공지합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">제6조 (문의)</h2>
          <p>본 약관과 관련한 문의는 사이트 내 &lsquo;오시는 길·문의&rsquo; 메뉴를 통해 접수해 주시기 바랍니다.</p>
        </section>
      </div>
    </div>
  );
};
