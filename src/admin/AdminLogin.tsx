import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  type MultiFactorResolver,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useValueTogether } from '../context/ValueTogetherContext';
import { Logo } from '../components/common/Logo';
import { Lock, X, Loader2 } from 'lucide-react';

/**
 * 관리자 로그인 화면.
 *
 * 오직 Firebase Authentication 계정 로그인만 지원합니다. 관리자 여부는
 * 이 화면이 아니라 ValueTogetherContext의 onAuthStateChanged 핸들러가
 * "로그인한 Firebase 계정의 UID === VITE_ADMIN_UID"로만 판단하며, 그 결과가
 * 실제 데이터 접근 권한으로 이어지는지는 firestore.rules / storage.rules가
 * 최종적으로 검증합니다. 이 화면에 "체험 로그인"이나 비밀번호 우회 같은
 * 지름길을 추가하지 마세요 — 그런 지름길은 이 화면뿐 아니라 실제 서비스
 * 전체의 관리자 인증을 무력화합니다.
 */
export const AdminLogin: React.FC = () => {
  const { setAdminOpen } = useValueTogether();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 관리자 계정에 TOTP 2단계 인증이 등록되어 있으면, 비밀번호 확인 직후
  // Firebase가 signInWithEmailAndPassword를 'auth/multi-factor-auth-required'
  // 에러로 실패시킵니다(이 시점엔 세션이 전혀 생성되지 않습니다). 이 resolver를
  // 받아 인증 앱의 6자리 코드까지 확인해야 실제 로그인이 완료됩니다.
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  const ADMIN_UID = String(import.meta.env.VITE_ADMIN_UID || '').trim();

  const finalizeAdminCheck = async (uid: string) => {
    if (!ADMIN_UID || uid !== ADMIN_UID) {
      await signOut(auth);
      setError('관리자 계정이 아닙니다. 관리자 계정으로만 접속할 수 있습니다.');
    }
    // uid가 일치하면 onAuthStateChanged가 isAdmin을 true로 갱신합니다.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await finalizeAdminCheck(cred.user.uid);
    } catch (err: any) {
      if (err?.code === 'auth/multi-factor-auth-required') {
        setMfaResolver(getMultiFactorResolver(auth, err));
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver) return;

    const totpHint = mfaResolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
    if (!totpHint) {
      setError('이 계정에 등록된 인증 방식을 확인할 수 없습니다. 관리자에게 문의해 주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, mfaCode.trim());
      const cred = await mfaResolver.resolveSignIn(assertion);
      await finalizeAdminCheck(cred.user.uid);
      setMfaResolver(null);
      setMfaCode('');
    } catch {
      setError('인증 코드가 올바르지 않거나 만료되었습니다. 인증 앱의 최신 코드로 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const cancelMfa = () => {
    // 이 시점까지는 Firebase 세션이 아직 만들어지지 않은 상태이므로,
    // 상태만 초기화하면 처음 로그인 화면으로 돌아갑니다.
    setMfaResolver(null);
    setMfaCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-8 relative">
      <button
        type="button"
        onClick={() => setAdminOpen(false)}
        className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
        aria-label="사이트로 돌아가기"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="bg-paper-card rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6 shadow-2xl border border-line">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="hero" withWordmark={false} />
          <div>
            <h1 className="font-display font-black text-xl text-ink">관리자 모드</h1>
            <p className="text-xs text-ink-soft mt-1">사회적협동조합 가치함께 홈페이지 통합 관리 시스템</p>
          </div>
        </div>

        {mfaResolver ? (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <p className="text-xs text-ink-soft text-center">
              등록된 인증 앱에 표시된 6자리 코드를 입력해 주세요.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">인증 코드</label>
              <input
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                inputMode="numeric"
                autoFocus
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm tracking-[0.3em] font-mono text-center focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              />
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ink text-white font-extrabold text-sm shadow-sm hover:bg-ink/90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              확인
            </button>
            <button type="button" onClick={cancelMfa} className="w-full text-xs font-bold text-ink-soft hover:text-ink">
              처음부터 다시 로그인하기
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">관리자 이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gachihamkke.or.kr"
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-ink text-white font-extrabold text-sm shadow-sm hover:bg-ink/90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              로그인
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
