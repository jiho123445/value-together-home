import React, { useRef, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { ParticipationType } from '../types';
import { HONEYPOT_FIELD_NAME, honeypotStyle, isLikelyBot, checkRateLimit } from '../utils/spamGuard';
import { CheckCircle2, HeartHandshake } from 'lucide-react';

const TYPES: ParticipationType[] = ['조합원가입', '자원봉사', '후원협력', '기관협력'];

const TYPE_HINT: Record<ParticipationType, string> = {
  조합원가입: '가치함께의 조합원으로 함께하고 싶으신 분',
  자원봉사: '가치함께의 사업 현장에서 자원봉사를 하고 싶으신 분',
  후원협력: '후원 또는 물품·재능 기부로 함께하고 싶으신 분',
  기관협력: '기관·단체 차원의 협력 사업을 제안하고 싶으신 분',
};

export const PartnersPage: React.FC = () => {
  const { partners, submitParticipation, getImageUrl } = useValueTogether();
  const mountedAt = useRef(Date.now());

  const [type, setType] = useState<ParticipationType>('조합원가입');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName(''); setPhone(''); setEmail(''); setOrganization(''); setMessage(''); setPrivacyAgreed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !privacyAgreed) {
      setError('이름, 연락처를 입력하고 개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    if (isLikelyBot(honeypot, mountedAt.current)) {
      // 봇으로 추정되는 제출은 저장하지 않되, 정상 제출처럼 보이도록 성공
      // 메시지를 그대로 보여줍니다 (탐지 로직을 봇에게 노출하지 않기 위함).
      setSuccess(true);
      resetForm();
      return;
    }

    const rate = checkRateLimit('gachihamkke_participation_rate');
    if (!rate.allowed) {
      setError(`너무 많은 신청이 접수되었습니다. 약 ${rate.retryAfterMinutes}분 후 다시 시도해 주세요.`);
      return;
    }

    setSubmitting(true);
    try {
      await submitParticipation({ type, name: name.trim(), phone: phone.trim(), email: email.trim(), organization: organization.trim() || undefined, message: message.trim() || undefined, privacyAgreed });
      setSuccess(true);
      resetForm();
    } catch {
      setError('신청 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주시거나 전화로 문의해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner eyebrow="PARTNERS" title="협력 및 참여" description="조합원 가입, 자원봉사, 후원·협력, 기관 협력 등 다양한 방법으로 가치함께와 함께하실 수 있습니다." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">
        {partners.length > 0 && (
          <div className="space-y-5">
            <h2 className="font-bold text-ink text-lg">협력기관 소개</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-paper-card border border-line rounded-2xl p-5 flex items-center gap-4">
                  {partner.logoUrl ? (
                    <img src={getImageUrl(partner.logoUrl)} alt={partner.name} className="w-12 h-12 object-contain shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-paper-soft shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-ink text-sm truncate">{partner.name}</p>
                    {partner.description && <p className="text-xs text-ink-soft truncate">{partner.description}</p>}
                    {partner.websiteUrl && (
                      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary-ink underline underline-offset-2">
                        바로가기
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-paper-card border border-line rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-primary-ink" />
            <h2 className="font-bold text-ink text-lg">참여·협력 신청서</h2>
          </div>

          {success ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-secondary-ink mx-auto" />
              <p className="font-bold text-ink">신청이 접수되었습니다.</p>
              <p className="text-xs text-ink-soft">담당자가 확인 후 남겨주신 연락처로 안내해 드리겠습니다.</p>
              <button type="button" onClick={() => setSuccess(false)} className="text-xs font-bold text-primary-ink underline underline-offset-2">
                새 신청서 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                      type === t ? 'bg-primary text-primary-ink border-primary' : 'bg-paper border-line text-ink-soft hover:text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-soft -mt-2">{TYPE_HINT[type]}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">이름 *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">연락처 *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">이메일</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary" />
                </div>
                {type === '기관협력' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink">소속 기관명</label>
                    <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">전하고 싶은 말씀</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary resize-none" />
              </div>

              {/* 허니팟: 실제 방문자에게는 보이지 않지만 봇은 채우는 필드 */}
              <input
                type="text"
                name={HONEYPOT_FIELD_NAME}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={honeypotStyle}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label className="flex items-start gap-2.5 text-xs text-ink-soft">
                <input type="checkbox" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} className="mt-0.5" />
                <span>
                  신청 처리를 위한 개인정보(이름, 연락처, 이메일) 수집·이용에 동의합니다. 수집된 정보는 신청 확인 및 안내 목적으로만 사용되며, 처리 완료 후 관련 법령에 따라 보관·파기됩니다.
                </span>
              </label>

              {error && <p className="text-xs font-bold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? '접수 중...' : '신청서 제출하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
