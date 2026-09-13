import React, { useRef, useState } from 'react';
import { validateImageFile } from '../../utils/uploadValidation';
import { uploadImageBlob } from '../../utils/uploadToStorage';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: string;
  getImageUrl: (url?: string) => string;
  aspect?: string;
}

/**
 * 관리자 화면 전용 이미지 업로드 필드. 클라이언트 측 확장자/MIME/용량
 * 검증(uploadValidation.ts) 후 Firebase Storage에 업로드하고, Firestore에는
 * 다운로드 URL 문자열만 저장합니다(base64 직접 저장 금지 원칙).
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange, folder, getImageUrl, aspect = 'aspect-video' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      validateImageFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 파일을 확인할 수 없습니다.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageBlob(file, folder, file.name);
      onChange(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[ImageUploadField] upload failed:', err);
      if (message.includes('ADMIN_AUTH_REQUIRED')) setError('관리자 인증 세션이 없습니다. 관리자 화면을 새로고침한 뒤 다시 로그인해 주세요.');
      else if (message.includes('STORAGE_BUCKET_MISSING')) setError('Firebase Storage 버킷 설정이 없습니다. Vercel 환경변수 VITE_FIREBASE_STORAGE_BUCKET을 확인해 주세요.');
      else if (message.includes('storage/unauthorized')) setError('Firebase Storage 권한이 거부되었습니다. storage.rules의 관리자 UID와 현재 관리자 UID를 확인해 주세요.');
      else if (message.includes('storage/quota-exceeded')) setError('Firebase Storage 용량 한도를 초과했습니다. Firebase Storage 사용량을 확인해 주세요.');
      else setError('이미지 업로드에 실패했습니다. 브라우저 콘솔의 [ImageUploadField] 오류에서 Firebase 오류 코드를 확인해 주세요.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-ink">{label}</label>
      <div className={`relative ${aspect} w-full max-w-xs rounded-xl overflow-hidden border border-line bg-paper-soft flex items-center justify-center`}>
        {value ? (
          <img src={getImageUrl(value)} alt="" className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-8 h-8 text-ink-soft/40" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full"
            aria-label="이미지 삭제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-3.5 py-2 rounded-lg hover:opacity-80 disabled:opacity-50"
      >
        <Upload className="w-3.5 h-3.5" />
        {value ? '이미지 교체' : '이미지 업로드'}
      </button>
      {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
    </div>
  );
};
