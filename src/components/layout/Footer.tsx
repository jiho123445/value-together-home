import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { Logo } from '../common/Logo';
import { Facebook, Instagram, Youtube } from 'lucide-react';

/**
 * 관리자 로그인 진입점은 이 푸터의 작은 텍스트 링크 하나뿐입니다 — 요구사항
 * ("관리자 기능은 공개적으로 노출되지 않아야 함")에 따라 메인 내비게이션에는
 * 노출하지 않되, 완전히 숨기지는 않아 관리자가 매번 URL을 외워야 하는
 * 불편은 없도록 했습니다. 실제 로그인 여부/권한 판정은 전적으로 Firebase
 * Authentication + Firestore Rules가 담당합니다 (이 버튼은 화면 전환일 뿐).
 */
export const Footer: React.FC = () => {
  const { settings, setActiveTab, setAdminOpen } = useValueTogether();

  return (
    <footer className="bg-ink text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-3">
            <Logo size="footer" className="[&_span]:text-white [&_span.text-secondary-ink]:text-white/50" />
            <p className="text-xs leading-relaxed max-w-sm text-white/60">{settings.sloganSub}</p>
            <div className="flex items-center gap-3 pt-1">
              {settings.snsLinks?.facebook && (
                <a href={settings.snsLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.snsLinks?.instagram && (
                <a href={settings.snsLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.snsLinks?.youtube && (
                <a href={settings.snsLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-xs">
            <div className="space-y-1.5">
              <p className="text-white font-bold mb-1">단체 정보</p>
              <p>{settings.name}</p>
              {settings.representativeName && <p>대표: {settings.representativeName}</p>}
              {settings.businessRegistrationNumber && <p>사업자등록번호: {settings.businessRegistrationNumber}</p>}
              <p>{settings.address}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-white font-bold mb-1">연락처</p>
              {settings.phone && <p>전화: {settings.phone}</p>}
              {settings.fax && <p>팩스: {settings.fax}</p>}
              {settings.email && <p>이메일: {settings.email}</p>}
              <p>{settings.operatingHours}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/50">
          <p>&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setActiveTab('privacy')} className="hover:text-white font-bold">개인정보처리방침</button>
            <button type="button" onClick={() => setActiveTab('terms')} className="hover:text-white">이용약관</button>
            <button type="button" onClick={() => setAdminOpen(true)} className="hover:text-white/70 text-white/30">관리자</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
