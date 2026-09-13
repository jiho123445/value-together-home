import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { Logo } from '../common/Logo';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { isPlaceholderAddress } from '../../utils/orgInfo';
import { isSafeHttpUrl } from '../../utils/safeUrl';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Logo size="footer" className="[&_span]:text-white [&_span.text-secondary-ink]:text-white/50" />
            <p className="text-sm sm:text-base leading-relaxed text-white/60">{settings.sloganSub}</p>
            <div className="flex items-center gap-3 pt-1">
              {isSafeHttpUrl(settings.snsLinks?.facebook) && (
                <a href={settings.snsLinks!.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 rounded-full bg-white/10 hover:bg-white/20">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {isSafeHttpUrl(settings.snsLinks?.instagram) && (
                <a href={settings.snsLinks!.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 rounded-full bg-white/10 hover:bg-white/20">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {isSafeHttpUrl(settings.snsLinks?.youtube) && (
                <a href={settings.snsLinks!.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2.5 rounded-full bg-white/10 hover:bg-white/20">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm sm:text-base">
            <p className="text-white font-bold text-base sm:text-lg mb-1.5">단체 정보</p>
            <p>{settings.name}</p>
            {settings.representativeName && <p>대표: {settings.representativeName}</p>}
            {settings.businessRegistrationNumber && <p>고유번호: {settings.businessRegistrationNumber}</p>}
            {!isPlaceholderAddress(settings.address) && <p>{settings.address}</p>}
          </div>

          <div className="space-y-2 text-sm sm:text-base">
            <p className="text-white font-bold text-base sm:text-lg mb-1.5">연락처</p>
            {settings.phone && <p>전화: {settings.phone}</p>}
            {settings.fax && <p>팩스: {settings.fax}</p>}
            {settings.email && <p>이메일: {settings.email}</p>}
            <p className="whitespace-nowrap">{settings.operatingHours}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/50">
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
