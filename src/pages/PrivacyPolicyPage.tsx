import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';

/**
 * 개인정보처리방침 — 표준 템플릿입니다. 실제 게시 전 반드시 담당자/법률
 * 자문을 통해 조합의 실제 수집 항목·보관 기간·위탁 현황에 맞게 검토·수정해
 * 주세요. 이 템플릿은 사실을 지어내지 않기 위해 구체적 수치(보관기간 등)를
 * 일반적인 법정 기준으로만 표기했습니다.
 */
export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useValueTogether();

  return (
    <div>
      <PageBanner eyebrow="LEGAL" title="개인정보처리방침" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8 text-sm text-ink-soft leading-relaxed">
        <p className="text-xs bg-primary-soft text-primary-ink font-bold px-4 py-3 rounded-xl">
          본 방침은 표준 템플릿입니다. 게시 전 실제 운영 현황에 맞게 관리자/법률 자문을 통해 검토해 주세요.
        </p>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">1. 수집하는 개인정보 항목</h2>
          <p>{settings.name}(이하 &lsquo;조합&rsquo;)는 참여 신청 및 문의 접수를 위해 다음 정보를 수집합니다: 이름, 연락처(전화번호), 이메일, 신청/문의 내용. 기관 협력 신청 시 소속 기관명을 추가로 수집할 수 있습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">2. 개인정보의 수집 및 이용 목적</h2>
          <p>수집된 개인정보는 참여 신청 처리, 문의 확인 및 답변, 관련 안내 목적으로만 이용되며, 목적 외 용도로 이용하지 않습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">3. 개인정보의 보유 및 이용 기간</h2>
          <p>개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기함을 원칙으로 하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 안전하게 보관합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">4. 개인정보의 제3자 제공 및 처리 위탁</h2>
          <p>조합은 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 원활한 서비스 제공을 위해 필요한 범위 내에서만 외부 기술 인프라(예: 데이터베이스·저장소 운영사)를 이용합니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">5. 정보주체의 권리와 행사 방법</h2>
          <p>정보주체는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있으며, 아래 문의처를 통해 요청하실 수 있습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-ink text-base">6. 개인정보 보호책임자 및 문의처</h2>
          <p>단체명: {settings.name}</p>
          {settings.phone && <p>연락처: {settings.phone}</p>}
          {settings.email && <p>이메일: {settings.email}</p>}
          {!settings.phone && !settings.email && <p>연락처 — 관리자 설정에서 입력해 주세요.</p>}
        </section>

        <p className="text-xs text-ink-soft/70 pt-4 border-t border-line">본 방침은 관련 법령 및 조합 내부 방침에 따라 변경될 수 있으며, 변경 시 홈페이지를 통해 공지합니다.</p>
      </div>
    </div>
  );
};
