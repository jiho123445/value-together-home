import React, { useRef, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { InquiryType } from '../types';
import { HONEYPOT_FIELD_NAME, honeypotStyle, isLikelyBot, checkRateLimit } from '../utils/spamGuard';
import { isPlaceholderAddress } from '../utils/orgInfo';
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

const TYPES: InquiryType[] = ['일반문의', '사업문의', '협력문의'];

export const ContactPage: React.FC = () => {
  const { settings, submitInquiry } = useValueTogether();
  const mountedAt = useRef(Date.now());

  const [type, setType] = useState<InquiryType>('일반문의');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName(''); setPhone(''); setEmail(''); setSubject(''); setMessage(''); setPrivacyAgreed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !subject.trim() || !message.trim() || !privacyAgreed) {
      setError('이름, 연락처, 제목, 내용을 입력하고 개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    if (isLikelyBot(honeypot, mountedAt.current)) {
      setSuccess(true);
      resetForm();
      return;
    }

    const rate = checkRateLimit('gachihamkke_inquiry_rate');
    if (!rate.allowed) {
      setError(`너무 많은 문의가 접수되었습니다. 약 ${rate.retryAfterMinutes}분 후 다시 시도해 주세요.`);
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({ type, name: name.trim(), phone: phone.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), privacyAgreed });
      setSuccess(true);
      resetForm();
    } catch {
      setError('문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주시거나 전화로 문의해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner eyebrow="CONTACT" title="오시는 길·문의" description="가치함께의 위치와 연락처를 안내해 드리며, 궁금하신 점을 남겨주시면 확인 후 안내해 드립니다." />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden border border-line bg-paper-soft">
            {settings.mapEmbedUrl ? (
              <iframe src={settings.mapEmbedUrl} title="오시는 길 지도" className="w-full h-full border-0" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-soft/50 text-xs font-bold">
                지도 — 관리자 설정에서 지도 embed URL을 등록해 주세요
              </div>
            )}
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary-ink mt-0.5 shrink-0" />
              <span className="text-ink">
                {isPlaceholderAddress(settings.address) ? '주소 정보 준비 중입니다.' : settings.address}
              </span>
            </div>
            {settings.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-ink shrink-0" />
                <span className="text-ink">{settings.phone}</span>
              </div>
            )}
            {settings.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-ink shrink-0" />
                <span className="text-ink">{settings.email}</span>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-primary-ink mt-0.5 shrink-0" />
              <span className="text-ink">{settings.operatingHours}</span>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-3 bg-paper-card border border-line rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-bold text-ink text-lg">문의하기</h2>

          {success ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-secondary-ink mx-auto" />
              <p className="font-bold text-ink">문의가 접수되었습니다.</p>
              <p className="text-xs text-ink-soft">담당자가 확인 후 남겨주신 연락처로 답변해 드리겠습니다.</p>
              <button type="button" onClick={() => setSuccess(false)} className="text-xs font-bold text-primary-ink underline underline-offset-2">
                새 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                      type === t ? 'bg-primary text-primary-ink border-primary' : 'bg-paper border-line text-ink-soft hover:text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">이름 *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">연락처 *</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-ink">이메일</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">제목 *</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">문의 내용 *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper resize-none" />
              </div>

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
                <span>문의 처리를 위한 개인정보(이름, 연락처, 이메일) 수집·이용에 동의합니다. 수집된 정보는 답변 목적으로만 사용됩니다.</span>
              </label>

              {error && <p className="text-xs font-bold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? '접수 중...' : '문의 보내기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
