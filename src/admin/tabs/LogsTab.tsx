import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, limit as fbLimit, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { AlertTriangle, ScrollText, DownloadCloud, Trash2, RefreshCcw, ShieldAlert } from 'lucide-react';

interface ErrorLogRow { id: string; message: string; context?: string; url?: string; createdAt: string }
interface AuditLogRow { id: string; action: string; summary: string; adminEmail?: string; createdAt: string }

type SubTab = 'errors' | 'audit' | 'backup';

const downloadJson = (data: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const LogsTab: React.FC = () => {
  const [sub, setSub] = useState<SubTab>('errors');
  const { settings, timeline, programs, notices, gallery, galleryCategories, popups, partners, participations, inquiries } = useValueTogether();

  const [errorLogs, setErrorLogs] = useState<ErrorLogRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [errSnap, auditSnap] = await Promise.all([
        getDocs(query(collection(db, 'errorLogs'), orderBy('createdAt', 'desc'), fbLimit(50))),
        getDocs(query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), fbLimit(50))),
      ]);
      setErrorLogs(errSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setAuditLogs(auditSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch {
      // 조회 실패는 조용히 무시 — 화면에는 빈 목록으로 표시됩니다.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const clearErrorLogs = async () => {
    if (!confirm('모든 에러 로그를 삭제할까요?')) return;
    await Promise.all(errorLogs.map((e) => deleteDoc(doc(db, 'errorLogs', e.id))));
    setErrorLogs([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-xl text-ink">로그 / 백업</h1>
        <p className="text-xs text-ink-soft mt-1">시스템 오류, 관리자 활동 이력, 데이터 백업을 관리합니다.</p>
      </div>

      <div className="flex gap-2 border-b border-line pb-1">
        {([['errors', '에러 로그'], ['audit', '관리자 활동 로그'], ['backup', '백업']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSub(key)} className={`px-4 py-2.5 rounded-t-xl text-sm font-bold ${sub === key ? 'text-primary-ink bg-primary-soft' : 'text-ink-soft'}`}>
            {label}
          </button>
        ))}
      </div>

      {sub === 'errors' && (
        <div className="space-y-3">
          <div className="flex justify-end gap-2">
            <button onClick={loadLogs} className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft bg-paper-card border border-line px-3.5 py-2 rounded-lg"><RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 새로고침</button>
            {errorLogs.length > 0 && <button onClick={clearErrorLogs} className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3.5 py-2 rounded-lg"><Trash2 className="w-3.5 h-3.5" /> 전체 삭제</button>}
          </div>
          {errorLogs.length === 0 ? (
            <p className="text-sm text-ink-soft py-8 text-center">기록된 에러가 없습니다.</p>
          ) : (
            errorLogs.map((e) => (
              <div key={e.id} className="bg-paper-card border border-line rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-red-600"><AlertTriangle className="w-3.5 h-3.5" />{e.context || 'unknown'}</div>
                <p className="text-xs text-ink">{e.message}</p>
                <p className="text-[10px] text-ink-soft">{new Date(e.createdAt).toLocaleString('ko-KR')} · {e.url}</p>
              </div>
            ))
          )}
        </div>
      )}

      {sub === 'audit' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={loadLogs} className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft bg-paper-card border border-line px-3.5 py-2 rounded-lg"><RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 새로고침</button>
          </div>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-ink-soft py-8 text-center">기록된 활동이 없습니다.</p>
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {auditLogs.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-ink font-medium truncate"><ScrollText className="w-3.5 h-3.5 text-ink-soft shrink-0" />{a.summary}</span>
                  <span className="shrink-0 text-ink-soft">{a.adminEmail || ''} · {new Date(a.createdAt).toLocaleString('ko-KR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {sub === 'backup' && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-paper-card border border-line rounded-2xl p-6 space-y-3">
            <h2 className="font-bold text-ink text-sm flex items-center gap-1.5"><DownloadCloud className="w-4 h-4" /> 일반 콘텐츠 백업</h2>
            <p className="text-xs text-ink-soft leading-relaxed">기본정보·연혁·사업·소식·갤러리·팝업·협력기관 등 개인정보가 없는 공개 콘텐츠만 JSON으로 내려받습니다.</p>
            <button
              onClick={() => downloadJson({ settings, timeline, programs, notices, gallery, galleryCategories, popups, partners, exportedAt: new Date().toISOString() }, `gachihamkke_content_backup_${new Date().toISOString().slice(0, 10)}.json`)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              콘텐츠 백업 다운로드
            </button>
          </div>
          <div className="bg-paper-card border border-line rounded-2xl p-6 space-y-3">
            <h2 className="font-bold text-ink text-sm flex items-center gap-1.5 text-red-700"><ShieldAlert className="w-4 h-4" /> 개인정보 백업 (주의)</h2>
            <p className="text-xs text-ink-soft leading-relaxed">참여신청·문의에 포함된 이름/연락처 등 개인정보가 그대로 담깁니다. 반드시 관리자 본인만 접근 가능한 안전한 곳에 보관하고, 불필요해지면 즉시 삭제해 주세요.</p>
            <button
              onClick={() => downloadJson({ participations, inquiries, exportedAt: new Date().toISOString() }, `gachihamkke_personal_data_backup_${new Date().toISOString().slice(0, 10)}.json`)}
              className="inline-flex items-center gap-1.5 bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
            >
              개인정보 백업 다운로드
            </button>
          </div>
          <p className="sm:col-span-2 text-[11px] text-ink-soft/70">
            정기 자동 백업은 GitHub Actions 워크플로(.github/workflows/backup.yml)에서도 별도로 수행됩니다. 자세한 내용은 프로젝트 README를 참고해 주세요.
          </p>
        </div>
      )}
    </div>
  );
};
