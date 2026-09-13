import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useValueTogether } from '../context/ValueTogetherContext';
import { Logo } from '../components/common/Logo';
import {
  LayoutDashboard, Settings, Briefcase, Newspaper, Image as ImageIcon, Handshake,
  Bell, HeartHandshake, MessageSquare, ScrollText, LogOut, ExternalLink, Menu, X, ShieldCheck,
} from 'lucide-react';

import { DashboardTab } from './tabs/DashboardTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ProgramsTab } from './tabs/ProgramsTab';
import { NoticesTab } from './tabs/NoticesTab';
import { GalleryTab } from './tabs/GalleryTab';
import { PartnersTab } from './tabs/PartnersTab';
import { PopupsTab } from './tabs/PopupsTab';
import { ParticipationsTab } from './tabs/ParticipationsTab';
import { InquiriesTab } from './tabs/InquiriesTab';
import { LogsTab } from './tabs/LogsTab';
import { SecurityTab } from './tabs/SecurityTab';

type AdminTab =
  | 'dashboard' | 'settings' | 'programs' | 'notices' | 'gallery'
  | 'partners' | 'popups' | 'participations' | 'inquiries' | 'logs' | 'security';

export const AdminShell: React.FC = () => {
  const { setAdminOpen, logoutAdmin, pendingParticipationsCount, pendingInquiriesCount } = useValueTogether();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [navOpen, setNavOpen] = useState(false);

  const NAV: { key: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { key: 'settings', label: '기본정보/디자인', icon: Settings },
    { key: 'programs', label: '주요사업', icon: Briefcase },
    { key: 'notices', label: '소식', icon: Newspaper },
    { key: 'gallery', label: '활동갤러리', icon: ImageIcon },
    { key: 'partners', label: '협력기관', icon: Handshake },
    { key: 'popups', label: '팝업 관리', icon: Bell },
    { key: 'participations', label: '참여신청', icon: HeartHandshake, badge: pendingParticipationsCount },
    { key: 'inquiries', label: '문의사항', icon: MessageSquare, badge: pendingInquiriesCount },
    { key: 'logs', label: '로그/백업', icon: ScrollText },
    { key: 'security', label: '보안', icon: ShieldCheck },
  ];

  const goToTab = (t: AdminTab) => {
    setTab(t);
    setNavOpen(false);
  };

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <DashboardTab onNavigate={goToTab} />;
      case 'settings': return <SettingsTab />;
      case 'programs': return <ProgramsTab />;
      case 'notices': return <NoticesTab />;
      case 'gallery': return <GalleryTab />;
      case 'partners': return <PartnersTab />;
      case 'popups': return <PopupsTab />;
      case 'participations': return <ParticipationsTab />;
      case 'inquiries': return <InquiriesTab />;
      case 'logs': return <LogsTab />;
      case 'security': return <SecurityTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-paper-soft flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink text-white/80">
        <div className="p-5 border-b border-white/10">
          <Logo size="footer" className="[&_span]:text-white [&_span.text-secondary-ink]:text-white/50" />
          <p className="text-[11px] text-white/40 mt-1">관리자 시스템</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <SidebarButton key={item.key} item={item} active={tab === item.key} onClick={() => goToTab(item.key)} />
          ))}

          {/* 관리자 메뉴 바로 아래에 주요 이동/종료 기능을 배치해 긴 페이지의 맨 아래까지
              스크롤하지 않아도 사이트로 돌아가거나 로그아웃할 수 있도록 합니다. */}
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
            <button
              onClick={() => setAdminOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white/85 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> 사이트로 돌아가기
            </button>
            <button
              onClick={() => logoutAdmin()}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-ink text-white flex items-center justify-between px-4 h-14">
        <Logo size="footer" className="[&_span]:text-white [&_span.text-secondary-ink]:text-white/50" />
        <button onClick={() => setNavOpen((v) => !v)} aria-label="메뉴">
          {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink text-white/80 pt-14 flex flex-col">
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {NAV.map((item) => (
              <SidebarButton key={item.key} item={item} active={tab === item.key} onClick={() => goToTab(item.key)} />
            ))}

            <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
              <button
                onClick={() => setAdminOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white/85 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> 사이트로 돌아가기
              </button>
              <button
                onClick={() => logoutAdmin()}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">{renderTab()}</div>
      </main>
    </div>
  );
};

const SidebarButton: React.FC<{ item: { key: string; label: string; icon: React.ElementType; badge?: number }; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
        active ? 'bg-primary text-primary-ink' : 'text-white/70 hover:bg-white/10'
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="w-4 h-4" />
        {item.label}
      </span>
      {!!item.badge && item.badge > 0 && (
        <span className="text-[10px] font-black bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>
      )}
    </button>
  );
};
