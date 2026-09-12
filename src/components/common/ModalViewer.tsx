import React, { useState, useEffect } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { downloadNoticeFile } from '../../utils/download';
import { isAttachmentPreviewable } from '../../utils/attachmentPreview';
import { AttachmentPreviewModal } from './AttachmentPreviewModal';
import { GalleryItem, NoticeAttachment } from '../../types';
import { X, Calendar, Eye, MapPin, CheckCircle2, HeartHandshake, Download, Paperclip, ChevronLeft, ChevronRight, Image as ImageIcon, Layers, ExternalLink } from 'lucide-react';
import { getGalleryPhoto } from '../../utils/galleryPhoto';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { isSafeHttpUrl } from '../../utils/safeUrl';

interface GalleryModalProps {
  item: GalleryItem;
  onClose: () => void;
  getImageUrl: (url?: string) => string;
}

const GalleryModalContent: React.FC<GalleryModalProps> = ({ item, onClose, getImageUrl }) => {
  const rawImages = item.images && item.images.length > 0 ? item.images : item.imageUrl ? [item.imageUrl] : [];
  const allImages = rawImages.length > 0 ? rawImages : [getGalleryPhoto(item, getImageUrl)];
  const [activeIdx, setActiveIdx] = useState(0);
  const dialogRef = useFocusTrap<HTMLDivElement>(true, onClose);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      else if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length]);

  const rawTarget = allImages[activeIdx] || item.imageUrl;
  const activePhotoUrl = rawTarget ? getImageUrl(rawTarget) : getGalleryPhoto(item, getImageUrl);

  return (
    <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        className="bg-paper-card rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        <div className="relative bg-ink flex items-center justify-center min-h-[300px] max-h-[55vh] overflow-hidden select-none">
          <img src={activePhotoUrl} alt={`${item.title} - 사진 ${activeIdx + 1}`} className="w-full h-full object-contain max-h-[55vh]" />
          <button onClick={onClose} aria-label="닫기" className="absolute top-4 right-4 p-2.5 text-white bg-black/60 hover:bg-black/80 rounded-full shadow-lg transition-all z-20">
            <X className="w-5 h-5" />
          </button>
          {allImages.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-20">
              <Layers className="w-3.5 h-3.5 text-secondary" />
              <span>사진 {activeIdx + 1} / {allImages.length}</span>
            </div>
          )}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center shadow-lg transition-all z-20"
                aria-label="이전 사진"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center shadow-lg transition-all z-20"
                aria-label="다음 사진"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="bg-ink px-4 py-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-white/60 shrink-0 flex items-center gap-1 mr-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>전체 {allImages.length}장:</span>
            </span>
            {allImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                  activeIdx === idx ? 'border-primary scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(imgUrl)} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-3 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-secondary-ink bg-secondary-soft px-3 py-1 rounded-full">{item.category}</span>
            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary-ink" />
                  {item.location}
                </span>
              )}
            </div>
          </div>
          <h3 id="gallery-modal-title" className="text-xl font-extrabold text-ink">{item.title}</h3>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed whitespace-pre-line">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export const ModalViewer: React.FC = () => {
  const {
    selectedNotice,
    setSelectedNotice,
    selectedProgram,
    setSelectedProgram,
    selectedGallery,
    setSelectedGallery,
    activeTab,
    setActiveTab,
    goBackFromDetail,
    getImageUrl,
  } = useValueTogether();

  const [previewFile, setPreviewFile] = useState<NoticeAttachment | null>(null);
  const noticeDialogRef = useFocusTrap<HTMLDivElement>(!!selectedNotice, () => goBackFromDetail('news'));
  const programDialogRef = useFocusTrap<HTMLDivElement>(!!selectedProgram, () => setSelectedProgram(null));

  if (['news-detail', 'gallery-detail', 'business-detail'].includes(activeTab)) return null;

  if (selectedNotice) {
    return (
      <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div
          ref={noticeDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          className="bg-paper-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <span className="text-xs font-bold text-primary-ink bg-primary-soft px-3 py-1 rounded-full">{selectedNotice.category}</span>
            <button onClick={() => goBackFromDetail('news')} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft" aria-label="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 id="notice-modal-title" className="text-xl sm:text-2xl font-bold text-ink leading-snug">{selectedNotice.title}</h3>
            <div className="flex items-center gap-4 text-xs text-ink-soft pt-1">
              <span>작성자: {selectedNotice.author}</span>
              <span>작성일: {selectedNotice.date}</span>
              <span>조회수: {selectedNotice.views}</span>
            </div>
          </div>

          <div className="bg-paper-soft p-5 rounded-2xl text-ink text-sm leading-relaxed whitespace-pre-wrap">{selectedNotice.content}</div>

          {selectedNotice.category === '보도자료' && isSafeHttpUrl(selectedNotice.externalUrl) && (
            <a
              href={selectedNotice.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-ink underline underline-offset-2"
            >
              {selectedNotice.outlet ? `${selectedNotice.outlet}에서 원문 보기` : '원문 기사 보기'}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
            <div className="space-y-2.5">
              {selectedNotice.attachments.map((file, idx) => (
                <div key={idx} className="p-4 sm:p-5 bg-primary-soft/40 border border-primary-soft rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-primary-ink shrink-0" />
                    <span className="font-bold text-ink text-xs sm:text-sm truncate">{file.name}</span>
                    {file.size && <span className="text-[11px] font-medium text-ink-soft shrink-0">({file.size})</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isAttachmentPreviewable(file) && (
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="bg-white border border-primary/40 hover:bg-primary-soft/40 text-primary-ink font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span>미리보기</span>
                      </button>
                    )}
                    <button
                      onClick={() => downloadNoticeFile(file)}
                      className="bg-primary hover:opacity-90 active:scale-95 text-primary-ink font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>다운로드</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {previewFile && <AttachmentPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}

          <div className="pt-2 text-right">
            <button onClick={() => goBackFromDetail('news')} className="bg-ink hover:opacity-90 text-white font-extrabold text-sm px-7 py-3 rounded-xl shadow-md transition-all">
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProgram) {
    return (
      <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div
          ref={programDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="program-modal-title"
          className="bg-paper-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <span className="text-xs font-bold text-primary-ink bg-primary-soft px-3 py-1 rounded-full">
              사업 {selectedProgram.code} · {selectedProgram.category}
            </span>
            <button onClick={() => setSelectedProgram(null)} className="p-1.5 text-ink-soft hover:text-ink rounded-lg hover:bg-paper-soft" aria-label="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 id="program-modal-title" className="text-2xl font-bold text-ink">{selectedProgram.title}</h3>
            <p className="text-xs text-ink-soft italic">&ldquo;{selectedProgram.subtitle}&rdquo;</p>
          </div>

          <div className="bg-secondary-soft p-4 rounded-2xl text-xs text-secondary-ink font-medium">{selectedProgram.impactMessage}</div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">세부 내용</h4>
            <ul className="space-y-2 text-xs text-ink">
              {selectedProgram.details.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-paper-soft p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-secondary-ink shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-ink-soft font-medium">지원 대상: {selectedProgram.targetAudience}</span>
            <button
              onClick={() => {
                setSelectedProgram(null);
                setActiveTab('partners');
              }}
              className="bg-primary text-primary-ink font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>이 사업에 참여·협력하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGallery) {
    return <GalleryModalContent item={selectedGallery} onClose={() => setSelectedGallery(null)} getImageUrl={getImageUrl} />;
  }

  return null;
};
