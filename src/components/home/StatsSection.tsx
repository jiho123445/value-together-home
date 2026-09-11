import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { Users, Handshake, Briefcase, Activity } from 'lucide-react';

const STAT_DEFS: { key: keyof import('../../types').OrgStats; label: string; icon: React.ElementType; suffix: string }[] = [
  { key: 'participantCount', label: '누적 참여 인원', icon: Users, suffix: '명' },
  { key: 'partnerCount', label: '협력기관', icon: Handshake, suffix: '개소' },
  { key: 'programCount', label: '운영 사업 수', icon: Briefcase, suffix: '개' },
  { key: 'cumulativeActivityCount', label: '누적 활동 건수', icon: Activity, suffix: '건' },
];

/**
 * 실적 통계. 허위 수치 표시 방지를 위해, 관리자가 값을 입력하지 않은
 * 항목(undefined)은 자동으로 숨겨집니다 — 전부 비어 있으면 섹션 자체를
 * 표시하지 않습니다.
 */
export const StatsSection: React.FC = () => {
  const { settings } = useValueTogether();
  const visibleStats = STAT_DEFS.filter((s) => typeof settings.stats?.[s.key] === 'number');
  if (visibleStats.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-secondary-ink text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-2 ${visibleStats.length >= 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 sm:gap-8`}>
          {visibleStats.map((stat) => {
            const Icon = stat.icon;
            const value = settings.stats[stat.key] as number;
            return (
              <div key={stat.key} className="text-center space-y-2">
                <Icon className="w-7 h-7 mx-auto text-white/60" />
                <p className="font-display font-black text-4xl sm:text-5xl tabular-nums">
                  {value.toLocaleString('ko-KR')}
                  <span className="text-xl font-bold ml-0.5">{stat.suffix}</span>
                </p>
                <p className="text-sm sm:text-base text-white/70 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
