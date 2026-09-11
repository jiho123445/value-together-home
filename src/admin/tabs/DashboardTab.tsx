import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, getDocs, limit as fbLimit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { Eye, Newspaper, HeartHandshake, MessageSquare, Image as ImageIcon, Plus, ScrollText } from 'lucide-react';

interface AuditRow { id: string; action: string; summary: string; adminEmail?: string; createdAt: string }

export const DashboardTab: React.FC<{ onNavigate: (tab: any) => void }> = ({ onNavigate }) => {
  const { notices, gallery, participations, inquiries, programs, pendingParticipationsCount, pendingInquiriesCount } = useValueTogether();
  const [todayViews, setTodayViews] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditRow[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    getCountFromServer(query(collection(db, 'visits'), where('date', '==', today)))
      .then((snap) => setTodayViews(snap.data().count))
      .catch(() => setTodayViews(null));

    getDocs(query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), fbLimit(8)))
      .then((snap) => setRecentActivity(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))))
      .catch(() => setRecentActivity([]));
  }, []);

  const recentNotices = [...notices].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
  const recentInquiries = [...inquiries].slice(0, 3);
  const recentParticipations = [...participations].slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-xl text-ink">관리자 대시보드</h1>
        <p className="text-xs text-ink-soft mt-1">가치함께 홈페이지 운영 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard icon={Eye} label="오늘 페이지뷰" value={todayViews === null ? '-' : todayViews} hint="집계 오류 시 '-' 표시" />
        <StatCard icon={Newspaper} label="등록된 소식" value={notices.length} />
        <StatCard icon={ImageIcon} label="갤러리 등록 수" value={gallery.length} />
        <StatCard icon={HeartHandshake} label="확인 대기 참여신청" value={pendingParticipationsCount} highlight={pendingParticipationsCount > 0} />
        <StatCard icon={MessageSquare} label="답변 대기 문의" value={pendingInquiriesCount} highlight={pendingInquiriesCount > 0} />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <QuickAction icon={Plus} label="사업 추가" onClick={() => onNavigate('programs')} />
        <QuickAction icon={Plus} label="소식 작성" onClick={() => onNavigate('notices')} />
        <QuickAction icon={Plus} label="갤러리 등록" onClick={() => onNavigate('gallery')} />
        <QuickAction icon={Plus} label="팝업 등록" onClick={() => onNavigate('popups')} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="최근 소식" onMore={() => onNavigate('notices')}>
          {recentNotices.length === 0 ? <Empty /> : recentNotices.map((n) => (
            <Row key={n.id} left={n.title} right={n.date} />
          ))}
        </Panel>
        <Panel title="최근 문의" onMore={() => onNavigate('inquiries')}>
          {recentInquiries.length === 0 ? <Empty /> : recentInquiries.map((i) => (
            <Row key={i.id} left={`[${i.type}] ${i.subject}`} right={i.status} badge={i.status === '대기중'} />
          ))}
        </Panel>
        <Panel title="최근 참여신청" onMore={() => onNavigate('participations')}>
          {recentParticipations.length === 0 ? <Empty /> : recentParticipations.map((p) => (
            <Row key={p.id} left={`[${p.type}] ${p.name}`} right={p.status} badge={p.status === '접수완료'} />
          ))}
        </Panel>
        <Panel title="최근 관리자 활동" onMore={() => onNavigate('logs')} icon={ScrollText}>
          {recentActivity.length === 0 ? <Empty text="활동 기록이 없습니다." /> : recentActivity.map((a) => (
            <Row key={a.id} left={a.summary} right={new Date(a.createdAt).toLocaleString('ko-KR')} />
          ))}
        </Panel>
      </div>

      <p className="text-[11px] text-ink-soft/60">참고: 사업 {programs.length}건이 현재 등록되어 있습니다.</p>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; hint?: string; highlight?: boolean }> = ({ icon: Icon, label, value, hint, highlight }) => (
  <div className={`bg-paper-card border rounded-2xl p-4 space-y-2 ${highlight ? 'border-primary' : 'border-line'}`}>
    <Icon className={`w-4 h-4 ${highlight ? 'text-primary-ink' : 'text-ink-soft'}`} />
    <p className="font-display font-black text-2xl text-ink tabular-nums">{value}</p>
    <p className="text-[11px] text-ink-soft font-bold">{label}</p>
    {hint && <p className="text-[10px] text-ink-soft/50">{hint}</p>}
  </div>
);

const QuickAction: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
    <Icon className="w-3.5 h-3.5" /> {label}
  </button>
);

const Panel: React.FC<{ title: string; onMore: () => void; icon?: React.ElementType; children: React.ReactNode }> = ({ title, onMore, children }) => (
  <div className="bg-paper-card border border-line rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <h2 className="font-bold text-ink text-sm">{title}</h2>
      <button onClick={onMore} className="text-[11px] font-bold text-ink-soft hover:text-ink">더보기</button>
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const Row: React.FC<{ left: string; right: string; badge?: boolean }> = ({ left, right, badge }) => (
  <div className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-line/60 last:border-0">
    <span className="truncate text-ink font-medium">{left}</span>
    <span className={`shrink-0 ${badge ? 'text-primary-ink font-bold' : 'text-ink-soft'}`}>{right}</span>
  </div>
);

const Empty: React.FC<{ text?: string }> = ({ text = '등록된 항목이 없습니다.' }) => (
  <p className="text-xs text-ink-soft py-4 text-center">{text}</p>
);
