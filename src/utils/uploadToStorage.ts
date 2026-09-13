/**
 * uploadToStorage.ts
 *
 * 이미지·첨부파일 업로드 전용 유틸리티.
 *
 * ⚠️ 중요: 절대로 이미지를 base64(data:image/...)로 인코딩해서
 * Firestore 문서(content/settings, content/gallery 등)에 직접 저장하지 말 것.
 * Firestore는 문서 1개당 최대 1MB 제한이 있어, base64 이미지 몇 장만
 * 들어가도 저장이 조용히 실패하고, 이후 동기화 시 최신 데이터가 통째로
 * 예전 상태로 "리셋"된다.
 *
 * 반드시 Cloud Storage에 실제 파일을 업로드하고, Firestore에는
 * 다운로드 URL(수십~수백 바이트 문자열)만 저장해야 한다.
 *
 * ⚠️ 이 파일에는 "Firebase Storage 업로드 실패 시 서버(/api/upload)나
 * data URL로 대신 저장하는" 폴백을 추가하지 말 것. 그런 폴백은 위 경고를
 * 그대로 무력화하며(다시 base64가 Firestore에 들어감), 인증되지 않은
 * 업로드 엔드포인트를 만드는 결과로도 이어진다. 업로드가 실패하면 에러를
 * 그대로 상위로 전달해 관리자 화면에 실패로 표시되게 한다.
 */
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth } from '../lib/firebase';

const generateFileName = (extension = 'webp'): string => {
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return `${unique}.${extension}`;
};

const MAX_IMAGE_DIMENSION = 2000;
const WEBP_QUALITY = 0.82;

/**
 * Resize/compress browser images before they reach Firebase Storage.
 *
 * A unique filename is generated for every upload, so immutable caching is
 * safe: replacing an image creates a new URL while repeat visits can reuse
 * the existing image from cache.
 */
async function optimizeImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    // Avoid an unnecessary re-encode for already-small images.
    if (bitmap.width <= MAX_IMAGE_DIMENSION && bitmap.height <= MAX_IMAGE_DIMENSION && file.size <= 350 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const webp = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY);
    });

    return webp && webp.size > 0 && webp.size < file.size ? webp : file;
  } catch {
    // Older/blocked browser image APIs should never break an upload.
    return file;
  }
}

/**
 * 이미지를 브라우저에서 적정 크기로 최적화한 뒤 Cloud Storage에 업로드하고
 * 다운로드 URL을 반환한다. 원본이 이미 작으면 불필요한 재인코딩을 하지 않는다.
 * @param blob 업로드할 이미지 데이터
 * @param folder Storage 상위 폴더 (예: 'gallery', 'settings', 'popups')
 * @param originalName 원본 파일명 (확장자 추출용)
 */
export async function uploadImageBlob(
  blob: Blob,
  folder: string,
  _originalName: string = 'image.jpg'
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('ADMIN_AUTH_REQUIRED: 관리자 인증 세션이 확인되지 않았습니다. 관리자 화면을 새로고침한 뒤 다시 로그인해 주세요.');
  }
  const bucket = String(storage.app.options.storageBucket || '').trim();
  if (!bucket) {
    throw new Error('STORAGE_BUCKET_MISSING: Firebase Storage 버킷 설정이 없습니다. VITE_FIREBASE_STORAGE_BUCKET 환경변수를 확인해 주세요.');
  }

  const optimized = await optimizeImage(blob);
  const isWebp = optimized.type === 'image/webp';
  const extension = isWebp ? 'webp' : (optimized.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const fileName = generateFileName(extension);
  const storageRef = ref(storage, `${folder}/${fileName}`);
  try {
    const snapshot = await uploadBytes(storageRef, optimized, {
      contentType: optimized.type || blob.type || 'image/jpeg',
      cacheControl: 'public,max-age=31536000,immutable',
    });
    return await getDownloadURL(snapshot.ref);
  } catch (error: any) {
    const code = String(error?.code || 'unknown');
    const message = String(error?.message || '');
    throw new Error(`STORAGE_UPLOAD_FAILED [${code}] ${message}`);
  }
}

/**
 * 원본 파일(이미지가 아닌 첨부파일 등)을 Cloud Storage에 업로드하고
 * 다운로드 URL을 반환한다. 공지사항 첨부파일(PDF, HWP, DOCX 등)에 사용.
 * @param file 업로드할 원본 File 객체
 * @param folder Storage 상위 폴더 (예: 'notices')
 */
export async function uploadRawFile(file: File, folder: string): Promise<string> {
  const fileName = generateFileName(file.name);
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
  });
  return await getDownloadURL(snapshot.ref);
}

/**
 * <canvas> 엘리먼트를 JPEG Blob으로 변환한다. (Promise 래퍼)
 */
export function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.85): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// 교체/삭제된 Storage 파일 정리
//
// 관리자가 이미지를 새로 업로드해 필드를 교체하면, 예전 파일은 Firebase
// Storage에 그대로 남아 계속 용량을 차지합니다(수년간 로고·대표사진·사업
// 이미지를 계속 바꾸면 쓰이지 않는 파일이 계속 쌓이는 문제).
//
// 여기서는 Firestore 문서 전체를 "교체 전(previous) / 교체 후(next)"로
// 통째로 비교해, previous에는 있었지만 next에는 더 이상 어디에도 등장하지
// 않는 Firebase Storage 다운로드 URL만 추려 삭제합니다. 이 방식은 필드
// 이름을 일일이 알 필요 없이 settings/programs/notices/gallery/partners/
// popups 문서 전체에 공통으로 적용할 수 있습니다.
//
// ⚠️ 반드시 Firestore 저장이 성공적으로 끝난 뒤에만 호출해야 합니다.
// 저장이 실패했는데 먼저 파일을 지워버리면, 여전히 예전 URL을 참조하는
// 실제 서비스 문서가 깨진 이미지를 보여주게 됩니다.
const FIREBASE_STORAGE_URL_PATTERN = /^https:\/\/firebasestorage\.googleapis\.com\/.+/;

function collectStorageUrls(value: unknown, acc: Set<string> = new Set()): Set<string> {
  if (typeof value === 'string') {
    if (FIREBASE_STORAGE_URL_PATTERN.test(value)) acc.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStorageUrls(item, acc));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStorageUrls(item, acc));
  }
  return acc;
}

/**
 * previous/next 문서를 비교해 더 이상 참조되지 않는 Storage 파일을
 * 삭제합니다. 개별 파일 삭제 실패(이미 지워짐, 네트워크 오류 등)는 조용히
 * 무시합니다 — 통계성 정리 작업이 실패했다고 방문자나 관리자 화면에 영향을
 * 주어서는 안 되기 때문입니다.
 */
export function cleanupReplacedStorageFiles(previous: unknown, next: unknown): void {
  try {
    const before = collectStorageUrls(previous);
    const after = collectStorageUrls(next);
    before.forEach((url) => {
      if (after.has(url)) return;
      try {
        deleteObject(ref(storage, url)).catch(() => {
          // 이미 삭제됐거나 권한/네트워크 문제 — 무시.
        });
      } catch {
        // ref(storage, url) 파싱 실패 등 — 무시.
      }
    });
  } catch {
    // 정리 작업 자체의 예외는 저장 성공 흐름에 영향을 주면 안 되므로 무시.
  }
}
