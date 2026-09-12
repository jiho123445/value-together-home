import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 모달/다이얼로그용 접근성 훅.
 *
 * - 열리는 즉시 다이얼로그 내부(또는 지정한 요소)로 포커스를 이동합니다.
 * - Tab / Shift+Tab을 다이얼로그 내부 요소로만 순환시킵니다(포커스 트랩).
 * - Escape 키를 누르면 onClose를 호출합니다.
 * - 닫힐 때 다이얼로그를 열기 전 포커스였던 요소로 되돌립니다.
 *
 * `active`가 true인 동안에만 동작하며, 여러 모달이 겹치는 경우를 대비해
 * 각 모달이 각자의 컨테이너 ref로 독립적으로 사용할 수 있습니다.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onClose: () => void) {
  const containerRef = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // onClose는 렌더링마다 새로 만들어진 함수일 수 있으므로 ref에 최신값만
  // 담아두고, 아래 설정 effect의 의존성에서는 제외합니다 — 그래야 모달이
  // 열려 있는 동안 다른 상태 변화로 리렌더링돼도 포커스 이동이 반복되지
  // 않습니다.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // 다음 페인트 이후 포커스를 이동해 트랜지션/렌더링과 충돌하지 않도록 합니다.
    const focusTimer = window.setTimeout(() => {
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !container) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (e.shiftKey) {
        if (current === first || !container.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last || !container.contains(current)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocused.current?.focus?.();
    };
  }, [active]);

  return containerRef;
}
