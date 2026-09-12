import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ImageUploadField } from '../components/ImageUploadField';
import { ProgramCategory, ProgramItem } from '../../types';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { getProgramPhoto } from '../../utils/programPhoto';

const CATEGORIES: ProgramCategory[] = ['사회서비스', '교육사업', '지역사회사업', '돌봄복지사업', '일자리자립지원', '기타사업'];
const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

type DraftProgram = Omit<ProgramItem, 'id' | 'code'>;

const emptyDraft = (order: number): DraftProgram => ({
  category: '사회서비스', title: '', subtitle: '', summary: '', details: [''], targetAudience: '', impactMessage: '',
  iconName: 'HeartHandshake', imageUrl: undefined, featuredOnHome: false, order,
});

export const ProgramsTab: React.FC = () => {
  const { programs, addProgram, updateProgram, deleteProgram, getImageUrl } = useValueTogether();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftProgram | null>(null);

  const startCreate = () => { setEditingId('new'); setDraft(emptyDraft(programs.length + 1)); };
  const startEdit = (p: ProgramItem) => { setEditingId(p.id); setDraft({ ...p }); };
  const cancel = () => { setEditingId(null); setDraft(null); };

  const save = () => {
    if (!draft || !draft.title.trim()) return;
    const cleanDetails = draft.details.map((d) => d.trim()).filter(Boolean);
    const payload = { ...draft, details: cleanDetails.length > 0 ? cleanDetails : ['-'] };
    if (editingId && editingId !== 'new') updateProgram(editingId, payload);
    else addProgram(payload);
    cancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-ink">주요사업 관리</h1>
          <p className="text-xs text-ink-soft mt-1">홈페이지 &lsquo;주요사업&rsquo; 메뉴에 노출되는 사업 카드를 관리합니다.</p>
        </div>
        {!editingId && (
          <button onClick={startCreate} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
            <Plus className="w-3.5 h-3.5" /> 사업 추가
          </button>
        )}
      </div>

      {editingId && draft && (
        <div className="bg-paper-card border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editingId === 'new' ? '새 사업 추가' : '사업 수정'}</h2>
            <button onClick={cancel} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">카테고리</label>
              <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ProgramCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">lucide 아이콘 이름</label>
              <input className={inputCls} value={draft.iconName} onChange={(e) => setDraft({ ...draft, iconName: e.target.value })} placeholder="예: HeartHandshake, Users, BookOpen" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">사업명 *</label>
            <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">부제</label>
            <input className={inputCls} value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">요약 (카드에 표시)</label>
            <textarea className={inputCls} rows={2} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">세부 내용 (한 줄씩)</label>
            {draft.details.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className={inputCls}
                  value={d}
                  onChange={(e) => { const next = [...draft.details]; next[idx] = e.target.value; setDraft({ ...draft, details: next }); }}
                />
                <button onClick={() => setDraft({ ...draft, details: draft.details.filter((_, i) => i !== idx) })} className="p-2 text-ink-soft hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => setDraft({ ...draft, details: [...draft.details, ''] })} className="text-xs font-bold text-primary-ink">+ 줄 추가</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">지원 대상</label>
              <input className={inputCls} value={draft.targetAudience} onChange={(e) => setDraft({ ...draft, targetAudience: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">기대 효과 문구</label>
              <input className={inputCls} value={draft.impactMessage} onChange={(e) => setDraft({ ...draft, impactMessage: e.target.value })} />
            </div>
          </div>

          <ImageUploadField label="대표 이미지" value={draft.imageUrl} onChange={(url) => setDraft({ ...draft, imageUrl: url })} folder="programs" getImageUrl={getImageUrl} />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!draft.featuredOnHome} onChange={(e) => setDraft({ ...draft, featuredOnHome: e.target.checked })} />
            메인 페이지 &lsquo;주요사업&rsquo; 미리보기에 노출
          </label>

          <button onClick={save} className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90">
            <Save className="w-4 h-4" /> 저장
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {[...programs].sort((a, b) => a.order - b.order).map((p) => {
          const photo = getProgramPhoto(p, getImageUrl);
          return (
            <div key={p.id} className="bg-paper-card border border-line rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-line shrink-0 bg-paper-soft">
                    <img src={photo} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2 py-0.5 rounded-full">{p.category}</span>
                    <h3 className="font-bold text-ink text-sm mt-1 truncate">{p.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(p)} className="p-2 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => confirm(`'${p.title}' 사업을 삭제할까요?`) && deleteProgram(p.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-ink-soft line-clamp-2">{p.summary}</p>
              {p.featuredOnHome && <span className="text-[10px] font-bold text-primary-ink">메인 노출중</span>}
            </div>
          );
        })}
        {programs.length === 0 && <p className="text-sm text-ink-soft py-8 text-center col-span-2">등록된 사업이 없습니다.</p>}
      </div>
    </div>
  );
};
