import React, { useRef, useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { validateNoticeFile } from '../../utils/uploadValidation';
import { uploadRawFile } from '../../utils/uploadToStorage';
import { NoticeCategory, NoticeItem, NoticeAttachment } from '../../types';
import { Plus, Trash2, Pencil, X, Save, Paperclip, Loader2, Pin } from 'lucide-react';

const CATEGORIES: NoticeCategory[] = ['공지사항', '사업소식', '모집공고', '보도자료', '자료실'];
const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

type DraftNotice = Omit<NoticeItem, 'id' | 'views' | 'date'> & { date?: string };

const emptyDraft = (): DraftNotice => ({
  title: '', category: '공지사항', content: '', author: '관리자', isImportant: false, attachments: [], externalUrl: '', outlet: '',
});

export const NoticesTab: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useValueTogether();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftNotice | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startCreate = () => { setEditingId('new'); setDraft(emptyDraft()); };
  const startEdit = (n: NoticeItem) => { setEditingId(n.id); setDraft({ ...n, attachments: n.attachments || [] }); };
  const cancel = () => { setEditingId(null); setDraft(null); };

  const save = () => {
    if (!draft || !draft.title.trim() || !draft.content.trim()) return;
    if (editingId && editingId !== 'new') updateNotice(editingId, draft);
    else addNotice(draft);
    cancel();
  };

  const handleAttach = async (file: File) => {
    try {
      validateNoticeFile(file);
    } catch (err) {
      alert(err instanceof Error ? err.message : '파일을 확인할 수 없습니다.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadRawFile(file, 'notices');
      const attachment: NoticeAttachment = { name: file.name, url, size: `${(file.size / 1024).toFixed(0)}KB`, type: file.type };
      setDraft((prev) => (prev ? { ...prev, attachments: [...(prev.attachments || []), attachment] } : prev));
    } catch {
      alert('파일 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-ink">소식 관리</h1>
          <p className="text-xs text-ink-soft mt-1">공지사항, 사업소식, 모집공고, 보도자료, 자료실 글을 관리합니다.</p>
        </div>
        {!editingId && (
          <button onClick={startCreate} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
            <Plus className="w-3.5 h-3.5" /> 새 글 작성
          </button>
        )}
      </div>

      {editingId && draft && (
        <div className="bg-paper-card border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editingId === 'new' ? '새 글 작성' : '글 수정'}</h2>
            <button onClick={cancel} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">분류</label>
              <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as NoticeCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm pt-6">
              <input type="checkbox" checked={!!draft.isImportant} onChange={(e) => setDraft({ ...draft, isImportant: e.target.checked })} />
              중요 공지로 상단 고정
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">제목 *</label>
            <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">내용 *</label>
            <textarea className={inputCls} rows={8} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </div>

          {draft.category === '보도자료' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">언론사명</label>
                <input className={inputCls} value={draft.outlet || ''} onChange={(e) => setDraft({ ...draft, outlet: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink">원문 기사 링크</label>
                <input className={inputCls} value={draft.externalUrl || ''} onChange={(e) => setDraft({ ...draft, externalUrl: e.target.value })} placeholder="https://" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink">첨부파일</label>
            {(draft.attachments || []).map((a, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 bg-paper rounded-lg px-3 py-2 border border-line">
                <span className="text-xs text-ink flex items-center gap-1.5 truncate"><Paperclip className="w-3.5 h-3.5 shrink-0" />{a.name}</span>
                <button onClick={() => setDraft({ ...draft, attachments: (draft.attachments || []).filter((_, i) => i !== idx) })} className="p-1 text-ink-soft hover:text-red-600 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleAttach(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-3.5 py-2 rounded-lg hover:opacity-80 disabled:opacity-50">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />} 파일 첨부
            </button>
          </div>

          <button onClick={save} className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90">
            <Save className="w-4 h-4" /> 저장
          </button>
        </div>
      )}

      <div className="divide-y divide-line border-y border-line">
        {[...notices].sort((a, b) => (a.date < b.date ? 1 : -1)).map((n) => (
          <div key={n.id} className="flex items-center gap-3 py-3.5">
            <span className="shrink-0 text-[11px] font-bold text-primary-ink bg-primary-soft px-2.5 py-1 rounded-full">{n.category}</span>
            <span className="flex-1 min-w-0 flex items-center gap-1.5 text-sm text-ink font-medium truncate">
              {n.isImportant && <Pin className="w-3.5 h-3.5 text-primary shrink-0" />}
              <span className="truncate">{n.title}</span>
            </span>
            <span className="shrink-0 text-xs text-ink-soft hidden sm:inline">{n.date} · 조회 {n.views}</span>
            <button onClick={() => startEdit(n)} className="p-2 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft shrink-0"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => confirm(`'${n.title}' 글을 삭제할까요?`) && deleteNotice(n.id)} className="p-2 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50 shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {notices.length === 0 && <p className="text-sm text-ink-soft py-8 text-center">등록된 글이 없습니다.</p>}
      </div>
    </div>
  );
};
