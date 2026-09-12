import React, { useEffect, useMemo, useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { X } from 'lucide-react';
import { isSafeHttpUrl } from '../../utils/safeUrl';

const HIDDEN_KEY = 'gachihamkke_hidden_popups';

function readHidden(): Record<string, number> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function hideForToday(id: string) {
  try {
    const map = readHidden();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    map[id] = midnight.getTime();
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(map));
  } catch {
    // localStorage 사용 불가 — 이번 방문에서만 닫힘 처리됩니다.
  }
}

function isHidden(id: string): boolean {
  const map = readHidden();
  const until = map[id];
  return typeof until === 'number' && Date.now() < until;
}

function isWithinDateRange(startDate?: string, endDate?: string): boolean {
  const now = Date.now();
  if (startDate && now < new Date(startDate).getTime()) return false;
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (now > end.getTime()) return false;
  }
  return true;
}

/**
 * 메인 화면에 노출되는 방문자용 공지 팝업. 관리자 팝업 관리 화면에서
 * 등록/수정하며, 노출 기간(startDate~endDate)과 활성화 여부(isActive)를
 * 조건으로 걸러낸 뒤 여러 개면 순서대로(작은 카드로 겹쳐) 보여줍니다.
 * "오늘 하루 보지 않기"는 개인정보가 아닌 팝업 ID만 localStorage에
 * 저장하므로 개인정보 보호 요구사항에 저촉되지 않습니다.
 */
export const PopupModal: React.FC = () => {
  const { popups, activeTab, showPopupsFlag, getImageUrl } = useValueTogether();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visiblePopups = useMemo(() => {
    if (activeTab !== 'main') return [];
    return popups.filter(
      (p) => p.isActive && isWithinDateRange(p.startDate, p.endDate) && !isHidden(p.id) && !dismissedIds.includes(p.id)
    );
    // showPopupsFlag가 바뀔 때마다(메인으로 돌아올 때마다) 재평가합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popups, activeTab, showPopupsFlag, dismissedIds]);

  useEffect(() => {
    if (showPopupsFlag) setDismissedIds([]);
  }, [showPopupsFlag]);

  const topPopupId = visiblePopups[0]?.id;

  useEffect(() => {
    if (!topPopupId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDismissedIds((prev) => [...prev, topPopupId]);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [topPopupId]);

  if (visiblePopups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-4 items-center">
        {visiblePopups.slice(0, 3).map((popup, idx) => {
          const hasSafeLink = isSafeHttpUrl(popup.linkUrl);
          return (
          <div
            key={popup.id}
            role="dialog"
            aria-modal="false"
            aria-labelledby={`popup-title-${popup.id}`}
            style={{ transform: `translate(${idx * 14}px, ${idx * 14}px)`, zIndex: 100 - idx }}
            className="relative bg-paper-card rounded-3xl shadow-2xl w-[min(92vw,380px)] overflow-hidden border border-line"
          >
            {popup.imageUrl && (
              <a
                href={hasSafeLink ? popup.linkUrl : undefined}
                target={hasSafeLink ? '_blank' : undefined}
                rel={hasSafeLink ? 'noopener noreferrer' : undefined}
                className="block bg-paper-soft"
              >
                <img src={getImageUrl(popup.imageUrl)} alt={popup.title} className="w-full max-h-56 object-cover" />
              </a>
            )}
            <div className="p-5 space-y-2">
              <h3 id={`popup-title-${popup.id}`} className="font-display font-extrabold text-ink text-base">{popup.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line line-clamp-4">{popup.content}</p>
              {hasSafeLink && (
                <a
                  href={popup.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-primary-ink underline underline-offset-2"
                >
                  자세히 보기
                </a>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  hideForToday(popup.id);
                  setDismissedIds((prev) => [...prev, popup.id]);
                }}
                className="font-bold text-ink-soft hover:text-ink"
              >
                오늘 하루 보지 않기
              </button>
              <button
                type="button"
                onClick={() => setDismissedIds((prev) => [...prev, popup.id])}
                aria-label="닫기"
                className="p-1 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
