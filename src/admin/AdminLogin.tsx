import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useValueTogether } from '../context/ValueTogetherContext';
import { Logo } from '../components/common/Logo';
import { Lock, X, Loader2 } from 'lucide-react';

/**
 * 관리자 로그인 화면. 비밀번호를 소스코드에 하드코딩하지 않고 전적으로
 * Firebase Authentication에 위임합니다. 로그인은 성공했지만 로그인한
 * 계정의 UID가 VITE_ADMIN_UID(=firestore.rules/storage.rules의
 * isAdmin())와 다르면 즉시 로그아웃 처리하여 "관리자 계정이 아닙니다"로만
 * 안내합니다 — Firebase 원본 에러 메시지를 그대로 노출하지 않습니다.
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
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 relative">
      <button
        type="button"
        onClick={() => setAdminOpen(false)}
        className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
        aria-label="사이트로 돌아가기"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="bg-paper-card rounded-3xl p-8 sm:p-10 w-full max-w-sm space-y-6 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="hero" withWordmark={false} />
          <div>
            <h1 className="font-display font-black text-lg text-ink">관리자 로그인</h1>
            <p className="text-xs text-ink-soft mt-1">사회적협동조합 가치함께 홈페이지 관리자 전용 화면입니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">관리자 이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-ink font-extrabold text-sm shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};
