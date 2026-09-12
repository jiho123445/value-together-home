/**
 * 관리자가 입력한 외부 링크(SNS, 협력기관 홈페이지, 보도자료 원문, 팝업
 * 링크, 지도 embed 등)를 방문자 화면에 <a href>/<iframe src>로 그대로
 * 내보내기 전에 거치는 가벼운 방어 계층.
 *
 * 관리자는 신뢰할 수 있는 사용자이므로 당장 급한 취약점은 아니지만,
 * 관리자 계정이 탈취되거나 실수로 이상한 값을 붙여넣는 경우에 대비해
 * http(s)가 아닌 스킴(javascript:, data:, vbscript: 등)은 렌더링 단계에서
 * 걸러냅니다. Firestore Rules는 이 필드들의 "값"까지 검증하지는 않으므로,
 * 여기가 사실상 마지막 방어선입니다.
 */
export function isSafeHttpUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** 안전하지 않으면 undefined를 반환해 <a href={...}>를 사실상 무력화합니다. */
export function safeHref(url?: string | null): string | undefined {
  return isSafeHttpUrl(url) ? (url as string) : undefined;
}
