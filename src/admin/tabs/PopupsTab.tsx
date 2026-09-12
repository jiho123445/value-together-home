import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ImageUploadField } from '../components/ImageUploadField';
import { PopupItem } from '../../types';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

type DraftPopup = Omit<PopupItem, 'id' | 'createdAt'>;
const emptyDraft = (): DraftPopup => ({ title: '', content: '', imageUrl: undefined, linkUrl: '', startDate: '', endDate: '', isActive: true });

export const PopupsTab: React.FC = () => {
  const { popups, addPopup, updatePopup, deletePopup, getImageUrl } = useValueTogether();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPopup | null>(null);

  const startCreate = () => { setEditingId('new'); setDraft(emptyDraft()); };
  const startEdit = (p: PopupItem) => { setEditingId(p.id); setDraft({ ...p }); };
  const cancel = () => { setEditingId(null); setDraft(null); };
  const save = () => {
    if (!draft || !draft.title.trim()) return;
    if (editingId && editingId !== 'new') updatePopup(editingId, draft);
    else addPopup(draft);
    cancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-ink">팝업 관리</h1>
          <p className="text-xs text-ink-soft mt-1">메인 페이지에 노출되는 방문자 공지 팝업을 관리합니다.</p>
        </div>
        {!editingId && (
          <button onClick={startCreate} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
            <Plus className="w-3.5 h-3.5" /> 팝업 추가
          </button>
        )}
      </div>

      {editingId && draft && (
        <div className="bg-paper-card border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editingId === 'new' ? '팝업 추가' : '팝업 수정'}</h2>
            <button onClick={cancel} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">제목 *</label>
            <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">내용</label>
            <textarea className={inputCls} rows={3} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">클릭 시 이동 링크 (선택)</label>
            <input className={inputCls} value={draft.linkUrl || ''} onChange={(e) => setDraft({ ...draft, linkUrl: e.target.value })} placeholder="https://" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">노출 시작일</label>
              <input type="date" className={inputCls} value={draft.startDate || ''} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">노출 종료일</label>
              <input type="date" className={inputCls} value={draft.endDate || ''} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
            </div>
          </div>
          <ImageUploadField label="팝업 이미지 (선택)" value={draft.imageUrl} onChange={(url) => setDraft({ ...draft, imageUrl: url })} folder="popups" getImageUrl={getImageUrl} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
            활성화 (체크 해제 시 즉시 숨김)
          </label>
          <button onClick={save} className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90">
            <Save className="w-4 h-4" /> 저장
          </button>
        </div>
      )}

      <div className="space-y-3">
        {popups.map((p) => (
          <div key={p.id} className="bg-paper-card border border-line rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-paper-soft shrink-0">
              {p.imageUrl && <img src={getImageUrl(p.imageUrl)} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-ink text-sm truncate">{p.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-secondary-soft text-secondary-ink' : 'bg-paper-soft text-ink-soft'}`}>
                  {p.isActive ? '노출중' : '비활성'}
                </span>
              </div>
              <p className="text-xs text-ink-soft">{p.startDate || '제한 없음'} ~ {p.endDate || '제한 없음'}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => confirm(`'${p.title}' 팝업을 삭제할까요?`) && deletePopup(p.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {popups.length === 0 && <p className="text-sm text-ink-soft py-8 text-center">등록된 팝업이 없습니다.</p>}
      </div>
    </div>
  );
};
