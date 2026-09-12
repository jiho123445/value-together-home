import React, { useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  multiFactor,
  reauthenticateWithCredential,
  TotpMultiFactorGenerator,
  type TotpSecret,
  type MultiFactorInfo,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ShieldCheck, ShieldAlert, KeyRound, Loader2, Trash2, Copy, Check } from 'lucide-react';

/**
 * 관리자 계정의 2단계 인증(TOTP, 인증 앱 기반) 설정 화면.
 *
 * Firebase Authentication의 TOTP 다단계 인증을 사용합니다. SMS 방식과
 * 달리 문자 발송 비용이 들지 않고, Google OTP/Microsoft Authenticator/
 * Authy 등 표준 인증 앱과 호환됩니다.
 *
 * QR코드 이미지를 만들어주는 외부 서비스나 라이브러리는 의도적으로
 * 쓰지 않습니다 — 로그인 보안 키를 제3자 서버로 전송하는 경로 자체를
 * 만들지 않기 위해서입니다. 대신 모든 표준 인증 앱이 지원하는 "수동 키
 * 입력" 방식만 사용합니다.
 *
 * 사전 조건: Firebase Authentication을 Identity Platform으로 업그레이드한 뒤
 * 프로젝트 수준에서 TOTP MFA를 한 번 활성화해야 합니다. 실제 활성화 방법은
 * README의 5-1 절을 따릅니다.
 *
 * 등록/해제처럼 관리자 계정의 보안 상태를 바꾸는 작업은 현재 로그인 세션만
 * 믿지 않고 관리자 비밀번호를 한 번 더 확인합니다. 이 정도의 재인증만으로
 * 현재 조합 규모에서 필요한 관리자 보호 수준을 확보합니다.
 */

type Step = 'idle' | 'generating' | 'awaiting-code' | 'enrolling';

export const SecurityTab: React.FC = () => {
  const user = auth.currentUser;
  const [factors, setFactors] = useState<MultiFactorInfo[]>([]);
  const [step, setStep] = useState<Step>('idle');
  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removingUid, setRemovingUid] = useState<string | null>(null);
  const [reauthMode, setReauthMode] = useState<'enroll' | 'remove' | null>(null);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthenticating, setReauthenticating] = useState(false);

  const refreshFactors = () => {
    if (!user) return;
    setFactors(multiFactor(user).enrolledFactors);
  };

  useEffect(() => {
    refreshFactors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <p className="text-sm text-ink-soft">로그인 정보를 불러오는 중입니다...</p>;
  }

  const startEnrollment = () => {
    setError(null);
    if (!user.emailVerified) {
      setError('관리자 이메일 인증이 완료된 계정에서만 2단계 인증을 설정할 수 있습니다. 먼저 Firebase에서 이메일을 인증해 주세요.');
      return;
    }
    setReauthPassword('');
    setReauthMode('enroll');
  };

  const beginEnrollmentAfterReauth = async () => {
    setReauthenticating(true);
    setError(null);
    try {
      if (!reauthPassword) {
        setError('현재 관리자 비밀번호를 입력해 주세요.');
        return;
      }
      const credential = EmailAuthProvider.credential(user.email || '', reauthPassword);
      await reauthenticateWithCredential(user, credential);
      setReauthPassword('');
      setReauthMode(null);
      setStep('generating');
      const session = await multiFactor(user).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(session);
      setTotpSecret(secret);
      setStep('awaiting-code');
    } catch (err: any) {
      console.error(err);
      setError(
        err?.code === 'auth/operation-not-allowed'
          ? 'Firebase에서 TOTP MFA가 아직 활성화되지 않았습니다. README의 5-1 절에 있는 프로젝트 활성화 절차를 먼저 진행해 주세요.'
          : '관리자 비밀번호가 올바르지 않거나 2단계 인증 설정을 시작하지 못했습니다.'
      );
      setStep('idle');
    } finally {
      setReauthenticating(false);
    }
  };

  const completeEnrollment = async () => {
    if (!totpSecret || code.trim().length < 6) {
      setError('인증 앱에 표시된 6자리 코드를 입력해 주세요.');
      return;
    }
    setError(null);
    setStep('enrolling');
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, code.trim());
      await multiFactor(user).enroll(assertion, 'TOTP 인증 앱');
      setTotpSecret(null);
      setCode('');
      setStep('idle');
      refreshFactors();
    } catch (err) {
      console.error(err);
      setError('코드가 올바르지 않거나 만료되었습니다. 인증 앱의 최신 코드로 다시 시도해 주세요.');
      setStep('awaiting-code');
    }
  };

  const cancelEnrollment = () => {
    setTotpSecret(null);
    setCode('');
    setError(null);
    setStep('idle');
  };

  const removeFactor = (factor: MultiFactorInfo) => {
    if (
      !confirm(
        `"${factor.displayName || '등록된 인증 수단'}"을(를) 해제하시겠습니까? 해제하면 다음 로그인부터 2단계 인증 없이 비밀번호만으로 로그인할 수 있게 됩니다.`
      )
    ) {
      return;
    }
    setError(null);
    setReauthPassword('');
    setReauthMode('remove');
    setRemovingUid(factor.uid);
  };

  const completeRemovalAfterReauth = async () => {
    if (!reauthMode || !removingUid) return;
    setReauthenticating(true);
    setError(null);
    try {
      if (!reauthPassword) {
        setError('현재 관리자 비밀번호를 입력해 주세요.');
        return;
      }
      const credential = EmailAuthProvider.credential(user.email || '', reauthPassword);
      await reauthenticateWithCredential(user, credential);
      const factor = multiFactor(user).enrolledFactors.find((item) => item.uid === removingUid);
      if (!factor) {
        setError('해제할 인증 수단을 찾을 수 없습니다. 화면을 새로고침한 뒤 다시 시도해 주세요.');
        return;
      }
      await multiFactor(user).unenroll(factor);
      refreshFactors();
      setReauthPassword('');
      setReauthMode(null);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.code === 'auth/user-token-expired'
          ? '보안 상태가 만료되었습니다. 로그아웃 후 다시 로그인한 다음 해제를 다시 시도해 주세요.'
          : '관리자 비밀번호가 올바르지 않거나 인증 수단을 해제하지 못했습니다.'
      );
    } finally {
      setReauthenticating(false);
      setRemovingUid(null);
    }
  };

  const copySecret = async () => {
    if (!totpSecret) return;
    try {
      await navigator.clipboard.writeText(totpSecret.secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API를 쓸 수 없는 환경입니다 — 사용자가 직접 선택해서 복사하면 됩니다.
    }
  };

  return (
    <>
      {reauthMode && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (reauthMode === 'enroll') beginEnrollmentAfterReauth();
              else completeRemovalAfterReauth();
            }}
            className="w-full max-w-sm bg-paper-card rounded-2xl border border-line shadow-2xl p-5 space-y-4"
          >
            <div>
              <h3 className="font-bold text-ink">관리자 확인</h3>
              <p className="text-xs text-ink-soft mt-1">
                {reauthMode === 'enroll'
                  ? '2단계 인증을 설정하기 전에 현재 관리자 비밀번호를 한 번 더 확인합니다.'
                  : '2단계 인증을 해제하기 전에 현재 관리자 비밀번호를 한 번 더 확인합니다.'}
              </p>
            </div>
            <input
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="현재 관리자 비밀번호"
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            />
            {error && <p className="text-xs font-bold text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={reauthenticating}
                className="flex-1 py-3 rounded-xl bg-ink text-white text-sm font-bold disabled:opacity-50"
              >
                {reauthenticating ? '확인 중...' : '확인'}
              </button>
              <button
                type="button"
                disabled={reauthenticating}
                onClick={() => {
                  setReauthPassword('');
                  setReauthMode(null);
                  setRemovingUid(null);
                  setError(null);
                }}
                className="px-4 py-3 rounded-xl border border-line text-ink-soft text-sm font-bold disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-bold text-ink text-lg">보안 — 관리자 2단계 인증</h2>
        <p className="text-xs text-ink-soft mt-1">
          비밀번호가 유출되더라도 인증 앱의 코드 없이는 로그인할 수 없도록 보호합니다.
        </p>
      </div>

      {factors.length > 0 && (
        <div className="space-y-2.5">
          {factors.map((factor) => (
            <div
              key={factor.uid}
              className="flex items-center justify-between gap-3 p-4 bg-secondary-soft/40 border border-secondary-soft rounded-2xl"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-secondary-ink shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-ink text-sm truncate">{factor.displayName || '인증 앱 (TOTP)'}</p>
                  <p className="text-[11px] text-ink-soft">
                    등록일: {factor.enrollmentTime ? new Date(factor.enrollmentTime).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFactor(factor)}
                disabled={removingUid === factor.uid}
                className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50 px-3 py-2 rounded-lg hover:bg-red-50"
              >
                {removingUid === factor.uid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                해제
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 'idle' && (
        <div className="p-5 bg-paper-card border border-line rounded-2xl space-y-3">
          {factors.length === 0 ? (
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-ink">아직 2단계 인증이 설정되어 있지 않습니다. 지금 설정하시는 걸 권장합니다.</p>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">인증 앱을 하나 더 등록하거나(예비 기기 대비), 기존 인증 수단을 교체할 수 있습니다.</p>
          )}
          <button
            onClick={startEnrollment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-white text-xs font-bold hover:bg-ink/90"
          >
            <KeyRound className="w-4 h-4" />
            {factors.length === 0 ? '2단계 인증 설정 시작' : '인증 앱 추가 등록'}
          </button>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      )}

      {step === 'generating' && (
        <div className="p-5 bg-paper-card border border-line rounded-2xl flex items-center gap-2.5 text-sm text-ink-soft">
          <Loader2 className="w-4 h-4 animate-spin" /> 보안 키 생성 중...
        </div>
      )}

      {(step === 'awaiting-code' || step === 'enrolling') && totpSecret && (
        <div className="p-5 bg-paper-card border border-line rounded-2xl space-y-4">
          <ol className="text-sm text-ink space-y-3 list-decimal list-inside">
            <li>휴대폰에 Google OTP, Microsoft Authenticator, Authy 등 인증 앱을 엽니다.</li>
            <li>
              "계정 추가" &gt; "설정 키 직접 입력"(또는 "수동 입력")을 선택하고, 아래 키를 그대로 입력합니다. 계정 이름은
              자유롭게 지정하셔도 됩니다 (예: 가치함께 관리자).
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 px-3 py-2.5 rounded-xl bg-ink/5 border border-line text-xs font-mono tracking-wider break-all">
                  {totpSecret.secretKey}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="shrink-0 p-2.5 rounded-xl border border-line hover:bg-ink/5"
                  aria-label="키 복사"
                >
                  {copied ? <Check className="w-4 h-4 text-secondary-ink" /> : <Copy className="w-4 h-4 text-ink-soft" />}
                </button>
              </div>
            </li>
            <li>인증 앱에 표시되는 6자리 숫자 코드를 아래에 입력합니다.</li>
          </ol>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">인증 코드 (6자리)</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm tracking-[0.3em] font-mono focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            />
          </div>

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={completeEnrollment}
              disabled={step === 'enrolling'}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {step === 'enrolling' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              등록 완료
            </button>
            <button
              onClick={cancelEnrollment}
              disabled={step === 'enrolling'}
              className="px-4 py-3 rounded-xl border border-line text-ink-soft text-sm font-bold hover:bg-ink/5 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
