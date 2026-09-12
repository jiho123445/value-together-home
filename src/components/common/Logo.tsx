import React from 'react';

interface LogoProps {
  /** 'header' 크기가 기본값입니다. 'hero'는 더 크게, 'footer'는 밝은 배경 없이도 잘 보이게. */
  size?: 'header' | 'hero' | 'footer';
  /** 워드마크("가치함께") 텍스트를 함께 보여줄지 여부 */
  withWordmark?: boolean;
  className?: string;
}

const SIZE_MAP: Record<NonNullable<LogoProps['size']>, { mark: string; word: string; sub: string }> = {
  header: { mark: 'h-14 w-14 sm:h-[64px] sm:w-[64px]', word: 'text-2xl sm:text-[28px]', sub: 'text-xs sm:text-[13px]' },
  hero: { mark: 'h-16 w-16 sm:h-20 sm:w-20', word: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm' },
  footer: { mark: 'h-8 w-8', word: 'text-base', sub: 'text-[11px]' },
};

/**
 * 가치함께 로고. 아이콘 심볼은 별도 이미지 파일(/public/logo-mark.png)로
 * 관리하고, "가치함께" 워드마크는 이미지에 굽지 않고 실제 텍스트로
 * 표시합니다 — 반응형으로 자연스럽게 줄바꿈/축소되고, 디자인 시스템의
 * 제목 서체(Gothic A1)를 그대로 사용할 수 있으며, 스크린리더에서도
 * 읽히기 때문입니다. 실제 CI가 벡터(SVG) 원본으로 제공되면
 * /public/logo-mark.png만 교체하면 됩니다.
 */
export const Logo: React.FC<LogoProps> = ({ size = 'header', withWordmark = true, className = '' }) => {
  const s = SIZE_MAP[size];
  return (
    <span className={`inline-flex items-center gap-3 sm:gap-3.5 ${className}`}>
      <img src="/logo-mark.png" alt="" aria-hidden="true" className={`${s.mark} object-contain shrink-0`} />
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span className={`font-bold tracking-wider text-secondary-ink ${s.sub}`}>
            사회적협동조합
          </span>
          <span className={`font-display font-black text-ink tracking-tight ${s.word}`}>가치함께</span>
        </span>
      )}
    </span>
  );
};
