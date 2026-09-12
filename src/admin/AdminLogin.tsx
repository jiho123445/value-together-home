import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
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

  const ADMIN_UID = String(import.meta.env.VITE_ADMIN_UID || '').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!ADMIN_UID || cred.user.uid !== ADMIN_UID) {
        await signOut(auth);
        setError('관리자 계정이 아닙니다. 관리자 계정으로만 접속할 수 있습니다.');
      }
      // uid가 일치하면 onAuthStateChanged가 isAdmin을 true로 갱신합니다.
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">관리자 이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gachihamkke.or.kr"
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary"
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
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary"
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
      </div>
    </div>
  );
};
