/**
 * 관리자가 아직 실제 값을 입력하지 않은 기관 기본정보(초기 예시값)를
 * 방문자에게 그대로 노출하지 않기 위한 판별 함수 모음.
 *
 * INITIAL_SETTINGS.address의 기본값("OO도 OO시 OO구 OO로 00")처럼
 * "OO" + 한글로 시작하는 문자열은 관리자가 아직 실제 주소로 바꾸지 않은
 * 예시값으로 간주합니다. 대표자명/사업자등록번호는 기본값이 빈 문자열이라
 * 이미 조건부(`&&`)로 잘 걸러지고 있지만, 주소만 기본값이 채워진 문자열이라
 * 별도의 판별이 필요합니다.
 */
export const isPlaceholderAddress = (address?: string): boolean => {
  const trimmed = (address || '').trim();
  return trimmed === '' || /^OO[가-힣]/.test(trimmed);
};
