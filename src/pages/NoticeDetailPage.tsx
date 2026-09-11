import React, { useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { AttachmentPreviewModal } from '../components/common/AttachmentPreviewModal';
import { isAttachmentPreviewable } from '../utils/attachmentPreview';
import { downloadNoticeFile } from '../utils/download';
import { NoticeAttachment } from '../types';
import { ChevronLeft, Eye, Download, Paperclip, ExternalLink } from 'lucide-react';

/**
 * 소식 상세 페이지 — 실제 URL(/news/:id)로 접근 가능한 전용 페이지입니다.
 * (ModalViewer의 모달 버전과 달리 새로고침/뒤로가기/공유 링크가 모두
 * 정상 동작해야 하므로, 상세 콘텐츠 전체를 이 페이지에서 렌더링합니다.)
 */
export const NoticeDetailPage: React.FC = () => {
  const { selectedNotice, goBackFromDetail, navigateToNewsCategory } = useValueTogether();
  const [previewFile, setPreviewFile] = useState<NoticeAttachment | null>(null);

  if (!selectedNotice) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center space-y-4">
        <p className="text-ink-soft text-sm">글을 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.</p>
        <button type="button" onClick={() => navigateToNewsCategory('전체')} className="text-sm font-bold text-primary-ink underline underline-offset-2">
          소식 목록으로 이동
        </button>
      </div>
    );
  }

  const notice = selectedNotice;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <button type="button" onClick={() => goBackFromDetail('news')} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink mb-6">
        <ChevronLeft className="w-4 h-4" /> 목록으로
      </button>

      <article className="space-y-6">
        <header className="space-y-3 pb-6 border-b border-line">
          <span className="inline-block text-xs font-bold text-primary-ink bg-primary-soft px-3 py-1 rounded-full">{notice.category}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-ink leading-snug">{notice.title}</h1>
          <div className="flex items-center gap-4 text-xs text-ink-soft">
            <span>작성자: {notice.author}</span>
            <span>작성일: {notice.date}</span>
            <span>조회수: {notice.views}</span>
          </div>
        </header>

        <div className="text-ink text-sm leading-relaxed whitespace-pre-wrap">{notice.content}</div>

        {notice.category === '보도자료' && notice.externalUrl && (
          <a
            href={notice.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-ink underline underline-offset-2"
          >
            {notice.outlet ? `${notice.outlet}에서 원문 보기` : '원문 기사 보기'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {notice.attachments && notice.attachments.length > 0 && (
          <div className="space-y-2.5 pt-4">
            <h2 className="text-xs font-bold text-ink-soft uppercase tracking-wide">첨부파일</h2>
            {notice.attachments.map((file, idx) => (
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
                      <Eye className="w-4 h-4" /> <span>미리보기</span>
                    </button>
                  )}
                  <button
                    onClick={() => downloadNoticeFile(file)}
                    className="bg-primary hover:opacity-90 active:scale-95 text-primary-ink font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> <span>다운로드</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      {previewFile && <AttachmentPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
};
