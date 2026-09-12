import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ImageUploadField } from '../components/ImageUploadField';
import { PartnerItem } from '../../types';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

type DraftPartner = Omit<PartnerItem, 'id'>;
const emptyDraft = (order: number): DraftPartner => ({ name: '', logoUrl: undefined, description: '', websiteUrl: '', order });

export const PartnersTab: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner, getImageUrl } = useValueTogether();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPartner | null>(null);

  const startCreate = () => { setEditingId('new'); setDraft(emptyDraft(partners.length + 1)); };
  const startEdit = (p: PartnerItem) => { setEditingId(p.id); setDraft({ ...p }); };
  const cancel = () => { setEditingId(null); setDraft(null); };
  const save = () => {
    if (!draft || !draft.name.trim()) return;
    if (editingId && editingId !== 'new') updatePartner(editingId, draft);
    else addPartner(draft);
    cancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-ink">협력기관 관리</h1>
          <p className="text-xs text-ink-soft mt-1">협력 및 참여 페이지에 소개되는 협력기관 목록입니다.</p>
        </div>
        {!editingId && (
          <button onClick={startCreate} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
            <Plus className="w-3.5 h-3.5" /> 협력기관 추가
          </button>
        )}
      </div>

      {editingId && draft && (
        <div className="bg-paper-card border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editingId === 'new' ? '협력기관 추가' : '협력기관 수정'}</h2>
            <button onClick={cancel} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">기관명 *</label>
            <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">소개</label>
            <input className={inputCls} value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">홈페이지 URL</label>
            <input className={inputCls} value={draft.websiteUrl || ''} onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })} placeholder="https://" />
          </div>
          <ImageUploadField label="로고" value={draft.logoUrl} onChange={(url) => setDraft({ ...draft, logoUrl: url })} folder="partners" aspect="aspect-square" getImageUrl={getImageUrl} />
          <button onClick={save} className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90">
            <Save className="w-4 h-4" /> 저장
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...partners].sort((a, b) => a.order - b.order).map((p) => (
          <div key={p.id} className="bg-paper-card border border-line rounded-2xl p-5 flex items-center gap-4">
            {p.logoUrl ? <img src={getImageUrl(p.logoUrl)} alt="" className="w-12 h-12 object-contain shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-paper-soft shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink text-sm truncate">{p.name}</p>
              {p.description && <p className="text-xs text-ink-soft truncate">{p.description}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => startEdit(p)} className="p-2 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => confirm(`'${p.name}'을(를) 삭제할까요?`) && deletePartner(p.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {partners.length === 0 && <p className="text-sm text-ink-soft py-8 text-center col-span-full">등록된 협력기관이 없습니다.</p>}
      </div>
    </div>
  );
};
