import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { exportInquiriesToExcel } from '../../utils/download';
import { ContactInquiry } from '../../types';
import { FileSpreadsheet, Trash2, Loader2 } from 'lucide-react';

export const InquiriesTab: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry, settings } = useValueTogether();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportInquiriesToExcel(inquiries, settings.name);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-xl text-ink">문의사항 관리</h1>
          <p className="text-xs text-ink-soft mt-1">일반·사업·협력 문의 내역입니다. 이름/연락처가 포함된 개인정보이므로 관리자만 조회할 수 있습니다.</p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-ink bg-secondary-soft px-4 py-2.5 rounded-xl hover:opacity-80 disabled:opacity-50">
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />} 엑셀 다운로드
        </button>
      </div>

      <div className="space-y-3">
        {inquiries.map((i) => (
          <div key={i.id} className="bg-paper-card border border-line rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold text-primary-ink bg-primary-soft px-2.5 py-1 rounded-full shrink-0">{i.type}</span>
                <span className="font-bold text-ink text-sm truncate">{i.subject}</span>
              </div>
              <span className="text-xs text-ink-soft shrink-0">{i.createdAt}</span>
            </div>
            <p className="text-xs text-ink-soft">{i.name} · {[i.phone, i.email].filter(Boolean).join(' · ')}</p>
            <p className="text-xs text-ink bg-paper-soft rounded-lg p-3 whitespace-pre-line">{i.message}</p>
            <div className="flex items-center justify-between pt-1">
              <select
                value={i.status}
                onChange={(e) => updateInquiryStatus(i.id, e.target.value as ContactInquiry['status'])}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 ${i.status === '답변완료' ? 'bg-secondary-soft text-secondary-ink' : 'bg-primary-soft text-primary-ink'}`}
              >
                <option value="대기중">대기중</option>
                <option value="답변완료">답변완료</option>
              </select>
              <button onClick={() => confirm('이 문의를 삭제할까요?') && deleteInquiry(i.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-ink-soft py-8 text-center">접수된 문의가 없습니다.</p>}
      </div>
    </div>
  );
};
