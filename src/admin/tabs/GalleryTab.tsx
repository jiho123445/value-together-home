import React, { useRef, useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { validateImageFile } from '../../utils/uploadValidation';
import { uploadImageBlob } from '../../utils/uploadToStorage';
import { GalleryItem } from '../../types';
import { Plus, Trash2, Pencil, X, Save, Loader2, Image as ImageIcon, Tag } from 'lucide-react';
import { getGalleryPhoto } from '../../utils/galleryPhoto';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary';

type DraftGallery = Omit<GalleryItem, 'id' | 'date'> & { date?: string };

const emptyDraft = (category: string): DraftGallery => ({ title: '', category, imageUrl: '', images: [], description: '', location: '' });

export const GalleryTab: React.FC = () => {
  const {
    gallery, addGallery, updateGallery, deleteGallery, galleryCategories,
    addGalleryCategory, updateGalleryCategory, deleteGalleryCategory, getImageUrl,
  } = useValueTogether();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftGallery | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newCategory, setNewCategory] = useState('');

  const startCreate = () => { setEditingId('new'); setDraft(emptyDraft(galleryCategories[0] || '기타')); };
  const startEdit = (g: GalleryItem) => { setEditingId(g.id); setDraft({ ...g, images: g.images || (g.imageUrl ? [g.imageUrl] : []) }); };
  const cancel = () => { setEditingId(null); setDraft(null); };

  const save = () => {
    if (!draft || !draft.title.trim() || (draft.images || []).length === 0) {
      alert('제목과 사진 1장 이상이 필요합니다.');
      return;
    }
    const payload = { ...draft, imageUrl: draft.images![0] };
    if (editingId && editingId !== 'new') updateGallery(editingId, payload);
    else addGallery(payload);
    cancel();
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        try {
          validateImageFile(file);
        } catch (err) {
          alert(`${file.name}: ${err instanceof Error ? err.message : '확인할 수 없는 파일입니다.'}`);
          continue;
        }
        const url = await uploadImageBlob(file, 'gallery', file.name);
        setDraft((prev) => (prev ? { ...prev, images: [...(prev.images || []), url] } : prev));
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-ink">활동갤러리 관리</h1>
          <p className="text-xs text-ink-soft mt-1">사진과 카테고리를 관리합니다.</p>
        </div>
        {!editingId && (
          <button onClick={startCreate} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80">
            <Plus className="w-3.5 h-3.5" /> 사진 등록
          </button>
        )}
      </div>

      <div className="bg-paper-card border border-line rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-ink text-sm flex items-center gap-1.5"><Tag className="w-4 h-4" /> 카테고리 관리</h2>
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 bg-paper-soft border border-line rounded-full pl-3 pr-1.5 py-1 text-xs font-bold text-ink">
              <input
                className="bg-transparent w-16 outline-none"
                value={c}
                onChange={(e) => updateGalleryCategory(c, e.target.value)}
              />
              <button onClick={() => confirm(`'${c}' 카테고리를 삭제할까요?`) && deleteGalleryCategory(c)} className="p-0.5 text-ink-soft hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={inputCls} placeholder="새 카테고리명" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button
            onClick={() => { if (newCategory.trim()) { addGalleryCategory(newCategory.trim()); setNewCategory(''); } }}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-primary-ink text-xs font-bold"
          >
            추가
          </button>
        </div>
      </div>

      {editingId && draft && (
        <div className="bg-paper-card border border-primary/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">{editingId === 'new' ? '사진 등록' : '사진 수정'}</h2>
            <button onClick={cancel} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">제목 *</label>
              <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">카테고리</label>
              <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                {galleryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">장소</label>
              <input className={inputCls} value={draft.location || ''} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">설명</label>
            <textarea className={inputCls} rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink">사진 (여러 장 등록 가능, 첫 번째 사진이 대표 이미지)</label>
            <div className="flex flex-wrap gap-2.5">
              {(draft.images || []).map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-line">
                  <img src={getImageUrl(url)} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setDraft({ ...draft, images: (draft.images || []).filter((_, i) => i !== idx) })} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && <span className="absolute bottom-0 inset-x-0 bg-primary text-primary-ink text-[9px] font-bold text-center">대표</span>}
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-line flex items-center justify-center text-ink-soft hover:border-primary disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              </button>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
          </div>

          <button onClick={save} className="inline-flex items-center gap-1.5 bg-primary text-primary-ink font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90">
            <Save className="w-4 h-4" /> 저장
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...gallery].sort((a, b) => (a.date < b.date ? 1 : -1)).map((item) => {
          const photo = getGalleryPhoto(item, getImageUrl);
          return (
            <div key={item.id} className="bg-paper-card border border-line rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-paper-soft">
                <img src={photo} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-[11px] font-bold text-secondary-ink">{item.category}</p>
                <p className="text-xs font-bold text-ink truncate">{item.title}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button onClick={() => startEdit(item)} className="flex-1 py-1.5 text-[11px] font-bold text-ink-soft hover:text-ink bg-paper-soft rounded-lg">수정</button>
                  <button onClick={() => confirm(`'${item.title}'을(를) 삭제할까요?`) && deleteGallery(item.id)} className="flex-1 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 bg-paper-soft rounded-lg">삭제</button>
                </div>
              </div>
            </div>
          );
        })}
        {gallery.length === 0 && <p className="text-sm text-ink-soft py-8 text-center col-span-full">등록된 사진이 없습니다.</p>}
      </div>
    </div>
  );
};
