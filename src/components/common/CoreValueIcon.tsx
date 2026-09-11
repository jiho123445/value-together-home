import React from 'react';
import { CoreValue } from '../../types';

/**
 * 핵심가치 카드용 아이콘. Phase 2 디자인 시스템에서 확정한 4개의 손그림
 * 라인 아이콘을 그대로 사용합니다 (lucide-react의 범용 아이콘과 구분되는
 * 가치함께만의 시각 요소).
 */
export const CoreValueIcon: React.FC<{ icon: CoreValue['icon']; className?: string }> = ({ icon, className = 'w-9 h-9' }) => {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (icon) {
    case 'people':
      return (
        <svg {...common} className={className} aria-hidden="true">
          <circle cx="12" cy="7.5" r="3.2" />
          <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
        </svg>
      );
    case 'together':
      return (
        <svg {...common} className={className} aria-hidden="true">
          <path d="M8 12l3 3 6-6" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'community':
      return (
        <svg {...common} className={className} aria-hidden="true">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 21v-9M4 7.5L12 12l8-4.5" />
        </svg>
      );
    case 'sustainability':
      return (
        <svg {...common} className={className} aria-hidden="true">
          <path d="M4 15c4-8 12-8 16 0" />
          <path d="M12 15v6M9 21h6" />
        </svg>
      );
    default:
      return null;
  }
};
