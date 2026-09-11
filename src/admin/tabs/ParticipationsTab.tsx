import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { exportParticipationsToExcel } from '../../utils/download';
import { ParticipationApplication } from '../../types';
import { FileSpreadsheet, Trash2, Loader2 } from 'lucide-react';

const STATUS_COLOR: Record<ParticipationApplication['status'], string> = {
  접수완료: 'bg-primary-soft text-primary-ink',
  확인중: 'bg-secondary-soft text-secondary-ink',
  처리완료: 'bg-paper-soft text-ink-soft',
};

export const ParticipationsTab: React.FC = () => {
  const { participations, updateParticipationStatus, deleteParticipation, settings } = useValueTogether();
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState<'전체' | ParticipationApplication['type']>('전체');

  const filtered = filter === '전체' ? participations : participations.filter((p) => p.type === filter);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportParticipationsToExcel(participations, settings.name);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-xl text-ink">참여신청 관리</h1>
          <p className="text-xs text-ink-soft mt-1">조합원가입·자원봉사·후원협력·기관협력 신청 내역입니다. 이름/연락처가 포함된 개인정보이므로 관리자만 조회할 수 있습니다.</p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-ink bg-secondary-soft px-4 py-2.5 rounded-xl hover:opacity-80 disabled:opacity-50">
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />} 엑셀 다운로드
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['전체', '조합원가입', '자원봉사', '후원협력', '기관협력'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold ${filter === t ? 'bg-primary text-primary-ink' : 'bg-paper-card border border-line text-ink-soft'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-paper-card border border-line rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2.5 py-1 rounded-full">{p.type}</span>
                <span className="font-bold text-ink text-sm">{p.name}</span>
              </div>
              <span className="text-xs text-ink-soft">{p.createdAt}</span>
            </div>
            <p className="text-xs text-ink-soft">{[p.phone, p.email].filter(Boolean).join(' · ')}{p.organization ? ` · ${p.organization}` : ''}</p>
            {p.message && <p className="text-xs text-ink bg-paper-soft rounded-lg p-3 whitespace-pre-line">{p.message}</p>}
            <div className="flex items-center justify-between pt-1">
              <select
                value={p.status}
                onChange={(e) => updateParticipationStatus(p.id, e.target.value as ParticipationApplication['status'])}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 ${STATUS_COLOR[p.status]}`}
              >
                <option value="접수완료">접수완료</option>
                <option value="확인중">확인중</option>
                <option value="처리완료">처리완료</option>
              </select>
              <button onClick={() => confirm('이 신청 내역을 삭제할까요?') && deleteParticipation(p.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink-soft py-8 text-center">접수된 신청이 없습니다.</p>}
      </div>
    </div>
  );
};
