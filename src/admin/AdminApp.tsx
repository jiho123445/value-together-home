import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';

/**
 * 관리자 화면 진입점. App.tsx에서 React.lazy로 로드되므로 이 파일과
 * 하위 트리(관리자 전용 컴포넌트 + exceljs)는 일반 방문자 번들에
 * 포함되지 않습니다. isAdmin은 오직 Firebase Authentication 상태에서만
 * 파생됩니다 (ValueTogetherContext.tsx 참고) — 여기서 별도로 인증 여부를
 * 판단하지 않습니다.
 */
export const AdminApp: React.FC = () => {
  const { isAdmin } = useValueTogether();
  return isAdmin ? <AdminShell /> : <AdminLogin />;
};
