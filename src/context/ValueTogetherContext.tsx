import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot, setDoc, getDocs, deleteDoc, collection, addDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreService';
import {
  OrgSettings,
  TimelineItem,
  ProgramItem,
  NoticeItem,
  GalleryItem,
  PopupItem,
  PartnerItem,
  ParticipationApplication,
  ParticipationType,
  ContactInquiry,
  InquiryType,
  ActiveTab,
  AboutSubTab,
  DebugLog,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_TIMELINE,
  INITIAL_PROGRAMS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_POPUPS,
  INITIAL_PARTNERS,
  INITIAL_GALLERY_CATEGORIES,
} from '../data/initialData';
import { formatImageUrl } from '../utils/imageUrl';
import { sanitizeForFirestore } from '../utils/sanitizeForFirestore';
import { writeAuditLog } from '../utils/auditLog';

// ─────────────────────────────────────────────────────────────────────────
// ARCHITECTURE NOTES
//
// Firestore layout: public content lives in six documents under a single
// `content` collection (settings / programs / notices / gallery / popups /
// partners), each with its own independent 1MB budget — so a large notices
// archive can never block a settings or gallery save. Personal-data
// collections (`participations`, `inquiries`) are top-level and separate:
// the public may only *create* into them (submit a form); reading,
// updating and deleting requires the admin Firebase Auth account. See
// firestore.rules for the enforced side of this — nothing here should be
// treated as the real security boundary, only as sane client behavior.
//
// CRUD safety pattern: every list (notices/programs/gallery/partners/
// popups) is mirrored in a ref that is updated synchronously, in the same
// statement as the state setter (see the `apply*` helpers below). CRUD
// handlers read from that ref, never from the closure variable captured by
// the component render that called them. This matters because React may
// invoke a `setState(prev => ...)` updater more than once without
// committing the result (guaranteed under StrictMode's dev double-invoke),
// so putting a real side effect (a Firestore write) inside an updater can
// fire twice or run against a stale array. Building `next` from the ref and
// calling the Firestore write as an ordinary statement avoids that class of
// bug entirely.
// ─────────────────────────────────────────────────────────────────────────

interface ValueTogetherContextType {
  settings: OrgSettings;
  timeline: TimelineItem[];
  programs: ProgramItem[];
  notices: NoticeItem[];
  gallery: GalleryItem[];
  galleryCategories: string[];
  popups: PopupItem[];
  partners: PartnerItem[];
  participations: ParticipationApplication[];
  inquiries: ContactInquiry[];
  pendingParticipationsCount: number;
  pendingInquiriesCount: number;
  markParticipationsAsRead: () => Promise<void>;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  aboutSubTab: AboutSubTab;
  setAboutSubTab: (tab: AboutSubTab) => void;
  noticeCategory: string;
  setNoticeCategory: (category: string) => void;
  navigateToNewsCategory: (category?: string) => void;

  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
  isAdmin: boolean;
  logoutAdmin: () => Promise<void>;

  logPageview: (path: string) => void;
  refreshData: () => Promise<void>;
  isSyncing: boolean;
  syncTimestamp: number;
  getImageUrl: (url?: string) => string;
  debugLogs: DebugLog[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  syncError: string | null;
  clearDebugLogs: () => void;

  selectedProgram: ProgramItem | null;
  setSelectedProgram: (program: ProgramItem | null) => void;
  selectedNotice: NoticeItem | null;
  setSelectedNotice: (notice: NoticeItem | null) => void;
  selectedGallery: GalleryItem | null;
  setSelectedGallery: (gallery: GalleryItem | null) => void;

  viewNoticeDetail: (notice: NoticeItem) => void;
  viewGalleryDetail: (gallery: GalleryItem) => void;
  viewProgramDetail: (program: ProgramItem) => void;
  goBackFromDetail: (fallbackTab?: ActiveTab) => void;

  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => void;
  updateTimelineItem: (id: string, item: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;

  addProgram: (program: Omit<ProgramItem, 'id' | 'code'>) => void;
  updateProgram: (id: string, program: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;

  addNotice: (notice: Omit<NoticeItem, 'id' | 'views' | 'date'> & { date?: string }) => void;
  updateNotice: (id: string, notice: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  incrementNoticeViews: (id: string) => void;

  addGallery: (item: Omit<GalleryItem, 'id' | 'date'> & { date?: string; author?: string }) => void;
  updateGallery: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
  addGalleryCategory: (category: string) => Promise<void>;
  updateGalleryCategory: (oldCategory: string, newCategory: string) => Promise<void>;
  deleteGalleryCategory: (category: string) => Promise<void>;

  addPartner: (partner: Omit<PartnerItem, 'id'>) => void;
  updatePartner: (id: string, partner: Partial<PartnerItem>) => void;
  deletePartner: (id: string) => void;

  addPopup: (popup: Omit<PopupItem, 'id' | 'createdAt'>) => void;
  updatePopup: (id: string, popup: Partial<PopupItem>) => void;
  deletePopup: (id: string) => void;
  showPopupsFlag: number;
  triggerPopupShow: () => void;

  submitParticipation: (item: Omit<ParticipationApplication, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateParticipationStatus: (id: string, status: ParticipationApplication['status']) => Promise<void>;
  deleteParticipation: (id: string) => Promise<void>;

  submitInquiry: (item: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<OrgSettings>) => void;
  resetToDefaults: () => void;
}

const ValueTogetherContext = createContext<ValueTogetherContextType | undefined>(undefined);

// ── Real URL routing (no hash, no router library) ──────────────────────
const buildPath = (state: {
  tab: ActiveTab;
  aboutSubTab?: AboutSubTab;
  noticeCategory?: string;
  noticeId?: string;
  programId?: string;
  galleryId?: string;
}): string => {
  const { tab, aboutSubTab, noticeCategory, noticeId, programId, galleryId } = state;
  if (tab === 'news-detail' && noticeId) return `/news/${encodeURIComponent(noticeId)}`;
  if (tab === 'business-detail' && programId) return `/business/${encodeURIComponent(programId)}`;
  if (tab === 'gallery-detail' && galleryId) return `/gallery/${encodeURIComponent(galleryId)}`;
  if (tab === 'about') {
    return aboutSubTab && aboutSubTab !== 'greeting' ? `/about?sub=${encodeURIComponent(aboutSubTab)}` : '/about';
  }
  if (tab === 'news') {
    return noticeCategory && noticeCategory !== '전체' ? `/news?cat=${encodeURIComponent(noticeCategory)}` : '/news';
  }
  if (tab === 'main') return '/';
  return `/${tab}`;
};

interface ParsedPath {
  tab: ActiveTab;
  aboutSubTab?: AboutSubTab;
  noticeCategory?: string;
  noticeId?: string;
  programId?: string;
  galleryId?: string;
  adminOpen?: boolean;
}

const parsePath = (pathname: string, search: string): ParsedPath => {
  const clean = (pathname || '/').trim();
  const params = new URLSearchParams(search || '');
  const res: ParsedPath = { tab: 'main' };

  const noticeMatch = clean.match(/^\/news\/([^/]+)\/?$/);
  const programMatch = clean.match(/^\/business\/([^/]+)\/?$/);
  const galleryMatch = clean.match(/^\/gallery\/([^/]+)\/?$/);

  if (noticeMatch) {
    res.tab = 'news-detail';
    res.noticeId = decodeURIComponent(noticeMatch[1]);
    return res;
  }
  if (programMatch) {
    res.tab = 'business-detail';
    res.programId = decodeURIComponent(programMatch[1]);
    return res;
  }
  if (galleryMatch) {
    res.tab = 'gallery-detail';
    res.galleryId = decodeURIComponent(galleryMatch[1]);
    return res;
  }

  const validTabs: ActiveTab[] = ['main', 'about', 'business', 'news', 'gallery', 'partners', 'contact', 'privacy', 'terms'];
  const tabPart = clean.replace(/^\//, '').replace(/\/$/, '');
  if (tabPart === 'admin') {
    return { ...res, tab: 'main', adminOpen: true };
  }
  if (tabPart === '') {
    res.tab = 'main';
  } else if (validTabs.includes(tabPart as ActiveTab)) {
    res.tab = tabPart as ActiveTab;
  } else {
    // 알 수 없는 최상위 경로(오타, 삭제된 링크 등)는 조용히 홈으로 보내는 대신
    // 404 안내 페이지를 표시합니다.
    res.tab = 'not-found';
  }

  if (params.get('sub')) res.aboutSubTab = params.get('sub') as AboutSubTab;
  if (params.get('cat')) res.noticeCategory = params.get('cat')!;

  return res;
};

const VIEWED_NOTICES_STORAGE_KEY = 'gachihamkke_viewed_notices';
const VIEW_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

const hasRecentlyViewedNotice = (id: string): boolean => {
  try {
    const raw = localStorage.getItem(VIEWED_NOTICES_STORAGE_KEY);
    if (!raw) return false;
    const map: Record<string, number> = JSON.parse(raw);
    const viewedAt = map[id];
    return typeof viewedAt === 'number' && Date.now() - viewedAt < VIEW_DEDUP_WINDOW_MS;
  } catch {
    return false;
  }
};

const markNoticeAsViewed = (id: string) => {
  try {
    const raw = localStorage.getItem(VIEWED_NOTICES_STORAGE_KEY);
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    map[id] = Date.now();
    const cutoff = Date.now() - VIEW_DEDUP_WINDOW_MS;
    Object.keys(map).forEach((key) => {
      if (map[key] < cutoff) delete map[key];
    });
    localStorage.setItem(VIEWED_NOTICES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable — dedup just won't persist.
  }
};

function readLocalCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota/private-mode errors — this is a non-critical cache
  }
}

export const ValueTogetherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<OrgSettings>(() => readLocalCache('gachihamkke_settings', INITIAL_SETTINGS));
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => readLocalCache('gachihamkke_timeline', INITIAL_TIMELINE));
  const [programs, setPrograms] = useState<ProgramItem[]>(() => readLocalCache('gachihamkke_programs', INITIAL_PROGRAMS));
  const [notices, setNotices] = useState<NoticeItem[]>(() => readLocalCache('gachihamkke_notices', INITIAL_NOTICES));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => readLocalCache('gachihamkke_gallery', INITIAL_GALLERY));
  const [galleryCategories, setGalleryCategoriesState] = useState<string[]>(() =>
    readLocalCache('gachihamkke_gallery_categories', INITIAL_GALLERY_CATEGORIES)
  );
  const [popups, setPopups] = useState<PopupItem[]>(() => readLocalCache('gachihamkke_popups', INITIAL_POPUPS));
  const [partners, setPartners] = useState<PartnerItem[]>(() => readLocalCache('gachihamkke_partners', INITIAL_PARTNERS));

  // Always-fresh refs — see the ARCHITECTURE NOTES comment above.
  const timelineRef = useRef(timeline);
  const programsRef = useRef(programs);
  const noticesRef = useRef(notices);
  const galleryRef = useRef(gallery);
  const galleryCategoriesRef = useRef(galleryCategories);
  const popupsRef = useRef(popups);
  const partnersRef = useRef(partners);

  const applyTimeline = (next: TimelineItem[]) => { timelineRef.current = next; setTimeline(next); };
  const applyPrograms = (next: ProgramItem[]) => { programsRef.current = next; setPrograms(next); };
  const applyNotices = (next: NoticeItem[]) => { noticesRef.current = next; setNotices(next); };
  const applyGallery = (next: GalleryItem[]) => { galleryRef.current = next; setGallery(next); };
  const applyGalleryCategories = (next: string[]) => { galleryCategoriesRef.current = next; setGalleryCategoriesState(next); };
  const applyPopups = (next: PopupItem[]) => { popupsRef.current = next; setPopups(next); };
  const applyPartners = (next: PartnerItem[]) => { partnersRef.current = next; setPartners(next); };

  // 개인정보가 포함된 데이터(참여신청/문의)는 절대 localStorage에 저장하지
  // 않고, 관리자로 로그인했을 때만 Firestore에서 직접 구독합니다.
  const [participations, setParticipations] = useState<ParticipationApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  const pendingParticipationsCount = participations.filter((p) => p.status === '접수완료').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === '대기중').length;

  const markParticipationsAsRead = async () => {
    const targets = participations.filter((p) => p.status === '접수완료');
    if (targets.length === 0) return;
    setParticipations((prev) => prev.map((p) => (p.status === '접수완료' ? { ...p, status: '확인중' } : p)));
    try {
      const batch = writeBatch(db);
      targets.forEach((p) => batch.update(doc(db, 'participations', p.id), { status: '확인중' }));
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'participations');
    }
  };

  const [showPopupsFlag, setShowPopupsFlag] = useState<number>(1);
  const triggerPopupShow = () => setShowPopupsFlag((prev) => prev + 1);

  // ── Legacy-hash migration guard (kept in case any external link still
  // points at an old `#tab` style URL from a design draft or shared link) ──
  const hasMigratedLegacyHash = useRef(false);
  if (!hasMigratedLegacyHash.current && typeof window !== 'undefined' && window.location.hash) {
    hasMigratedLegacyHash.current = true;
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  const initialParsed = parsePath(
    typeof window !== 'undefined' ? window.location.pathname : '/',
    typeof window !== 'undefined' ? window.location.search : ''
  );

  const [activeTab, setActiveTabState] = useState<ActiveTab>(initialParsed.tab || 'main');
  const [aboutSubTab, setAboutSubTab] = useState<AboutSubTab>(initialParsed.aboutSubTab || 'greeting');
  const [noticeCategory, setNoticeCategory] = useState<string>(initialParsed.noticeCategory || '전체');
  const [adminOpen, setAdminOpen] = useState<boolean>((initialParsed as any).adminOpen || false);

  // 관리자 여부는 오직 Firebase Authentication 상태로만 판단합니다.
  // sessionStorage/localStorage 등 클라이언트가 임의로 조작할 수 있는 값은
  // 절대 권한 판단에 사용하지 않습니다 — 실제 접근 제어는 firestore.rules /
  // storage.rules의 isAdmin()이 담당하며, 이 값은 UI 표시용 편의 상태일
  // 뿐입니다.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const logoutAdmin = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const ADMIN_UID = String(import.meta.env.VITE_ADMIN_UID || '').trim();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user && !!ADMIN_UID && user.uid === ADMIN_UID);
    });
    return () => unsubscribe();
  }, []);

  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const isPopStateRef = useRef<boolean>(false);

  const navigateToNewsCategory = (category: string = '전체') => {
    setNoticeCategory(category);
    setSelectedNotice(null);
    setActiveTabState('news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (tab !== 'business-detail') setSelectedProgram(null);
    if (tab !== 'news-detail') setSelectedNotice(null);
    if (tab !== 'gallery-detail') setSelectedGallery(null);
    if (tab === 'main') triggerPopupShow();
    setActiveTabState(tab);
  };

  const goBackFromDetail = (fallbackTab: ActiveTab = 'main') => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setActiveTab(fallbackTab);
    }
  };

  const viewNoticeDetail = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    setActiveTabState('news-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!hasRecentlyViewedNotice(notice.id)) {
      markNoticeAsViewed(notice.id);
      incrementNoticeViews(notice.id);
    }
  };

  const viewGalleryDetail = (item: GalleryItem) => {
    setSelectedGallery(item);
    setActiveTabState('gallery-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewProgramDetail = (program: ProgramItem) => {
    setSelectedProgram(program);
    setActiveTabState('business-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync initial deep-link items once data is loaded
  useEffect(() => {
    if (initialParsed.tab === 'news-detail' && initialParsed.noticeId && !selectedNotice) {
      const found = notices.find((n) => n.id === initialParsed.noticeId);
      if (found) setSelectedNotice(found);
    }
    if (initialParsed.tab === 'business-detail' && initialParsed.programId && !selectedProgram) {
      const found = programs.find((p) => p.id === initialParsed.programId);
      if (found) setSelectedProgram(found);
    }
    if (initialParsed.tab === 'gallery-detail' && initialParsed.galleryId && !selectedGallery) {
      const found = gallery.find((g) => g.id === initialParsed.galleryId);
      if (found) setSelectedGallery(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notices, programs, gallery]);

  // Keep selectedGallery updated when the gallery array changes
  useEffect(() => {
    if (selectedGallery) {
      const updated = gallery.find((g) => g.id === selectedGallery.id);
      if (updated && (updated.images?.length !== selectedGallery.images?.length || updated.title !== selectedGallery.title)) {
        setSelectedGallery(updated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery]);

  // Browser Back / Forward (PopState) handling
  useEffect(() => {
    const curPath = window.location.pathname + window.location.search || '/';
    const initObj = {
      tab: activeTab,
      aboutSubTab,
      noticeCategory,
      noticeId: selectedNotice?.id,
      programId: selectedProgram?.id,
      galleryId: selectedGallery?.id,
    };
    if (!window.history.state) window.history.replaceState(initObj, '', curPath);

    const handlePopState = (e: PopStateEvent) => {
      isPopStateRef.current = true;
      const state = e.state || parsePath(window.location.pathname, window.location.search);
      const targetTab: ActiveTab = state.tab || 'main';

      if (targetTab === 'news-detail') {
        const found = notices.find((n) => n.id === state.noticeId);
        found ? (setSelectedNotice(found), setActiveTabState('news-detail')) : (setSelectedNotice(null), setActiveTabState('news'));
      } else if (targetTab === 'business-detail') {
        const found = programs.find((p) => p.id === state.programId);
        found ? (setSelectedProgram(found), setActiveTabState('business-detail')) : (setSelectedProgram(null), setActiveTabState('business'));
      } else if (targetTab === 'gallery-detail') {
        const found = gallery.find((g) => g.id === state.galleryId);
        found ? (setSelectedGallery(found), setActiveTabState('gallery-detail')) : (setSelectedGallery(null), setActiveTabState('gallery'));
      } else {
        setSelectedNotice(null);
        setSelectedProgram(null);
        setSelectedGallery(null);
        setActiveTabState(targetTab);
        if (targetTab === 'main') triggerPopupShow();
      }
      if (state.aboutSubTab) setAboutSubTab(state.aboutSubTab);
      if (state.noticeCategory) setNoticeCategory(state.noticeCategory);
      setTimeout(() => { isPopStateRef.current = false; }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notices, programs, gallery]);

  // Push history state on user-driven navigation changes
  useEffect(() => {
    if (isPopStateRef.current) return;
    const stateObj = {
      tab: activeTab,
      aboutSubTab,
      noticeCategory,
      noticeId: selectedNotice?.id,
      programId: selectedProgram?.id,
      galleryId: selectedGallery?.id,
    };
    const targetPath = buildPath(stateObj);
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== targetPath) window.history.pushState(stateObj, '', targetPath);
  }, [activeTab, aboutSubTab, noticeCategory, selectedNotice?.id, selectedProgram?.id, selectedGallery?.id]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncTimestamp, setSyncTimestamp] = useState<number>(() => Date.now());
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);

  const addDebugLog = useCallback((type: DebugLog['type'], message: string, details?: string) => {
    const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    setDebugLogs((prev) => [{ id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, time, type, message, details }, ...prev.slice(0, 49)]);
  }, []);
  const clearDebugLogs = useCallback(() => setDebugLogs([]), []);
  const getImageUrl = useCallback((url?: string) => formatImageUrl(url, syncTimestamp), [syncTimestamp]);

  // Live subscription to public content (`content/*` documents)
  useEffect(() => {
    const contentCollectionRef = collection(db, 'content');
    const unsubscribe = onSnapshot(
      contentCollectionRef,
      (snap) => {
        const byId: Record<string, any> = {};
        snap.docs.forEach((d) => { byId[d.id] = d.data(); });

        if (byId['settings']) {
          setSettings((prev) => ({ ...prev, ...byId['settings'] }));
        }
        if (Array.isArray(byId['timeline']?.items)) applyTimeline(byId['timeline'].items);
        if (Array.isArray(byId['programs']?.items)) applyPrograms(byId['programs'].items);
        if (Array.isArray(byId['notices']?.items)) applyNotices(byId['notices'].items);
        if (Array.isArray(byId['gallery']?.items)) {
          const normalized = byId['gallery'].items.map((g: any) => ({
            ...g,
            images: Array.isArray(g.images) && g.images.length > 0 ? g.images : g.imageUrl ? [g.imageUrl] : [],
          }));
          applyGallery(normalized);
        }
        if (Array.isArray(byId['gallery']?.categories) && byId['gallery'].categories.length > 0) {
          applyGalleryCategories(byId['gallery'].categories);
        }
        if (Array.isArray(byId['popups']?.items)) applyPopups(byId['popups'].items);
        if (Array.isArray(byId['partners']?.items)) applyPartners(byId['partners'].items);

        const now = Date.now();
        setSyncTimestamp(now);
        setLastSyncTime(new Date().toLocaleTimeString('ko-KR'));
        setSyncStatus('success');
        setSyncError(null);

        // Fresh install: nothing exists yet and an admin is logged in — seed
        // the content documents from the in-app defaults.
        if (snap.empty && auth.currentUser) {
          const nowIso = new Date().toISOString();
          const batch = writeBatch(db);
          batch.set(doc(db, 'content', 'settings'), { ...settings, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'timeline'), { items: timeline, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'programs'), { items: programs, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'notices'), { items: notices, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'gallery'), { items: gallery, categories: galleryCategories, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'popups'), { items: popups, updatedAt: nowIso }, { merge: true });
          batch.set(doc(db, 'content', 'partners'), { items: partners, updatedAt: nowIso }, { merge: true });
          batch.commit().catch((err) => handleFirestoreError(err, OperationType.WRITE, 'content (initial seed)'));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'content');
        setSyncStatus('success');
        setSyncError(null);
        addDebugLog('warn', 'Firestore 실시간 동기화 연결 실패 — 저장된 콘텐츠로 표시합니다.', error instanceof Error ? error.message : String(error));
      }
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addDebugLog]);

  // Participations / inquiries: only readable by the admin. Attach these
  // listeners only once actually signed in — reading them while logged out
  // would just fail with permission-denied on every snapshot (expected,
  // but noisy).
  useEffect(() => {
    if (!isAdmin) {
      setParticipations([]);
      setInquiries([]);
      return;
    }
    const unsubParticipations = onSnapshot(
      query(collection(db, 'participations'), orderBy('createdAt', 'desc')),
      (snap) => setParticipations(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ParticipationApplication))),
      (error) => handleFirestoreError(error, OperationType.GET, 'participations')
    );
    const unsubInquiries = onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')),
      (snap) => setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactInquiry))),
      (error) => handleFirestoreError(error, OperationType.GET, 'inquiries')
    );
    return () => { unsubParticipations(); unsubInquiries(); };
  }, [isAdmin]);

  // ── 페이지뷰 카운터 (firestore.rules의 `visits` 컬렉션 참고) ──
  // 개인정보 없이 "날짜 + 경로"만 기록하는 최소 문서를 생성만 합니다.
  // 관리자 대시보드의 "오늘 페이지뷰" 카드에서 getCountFromServer로
  // 집계하며, 실패해도 방문자 경험에 영향이 없도록 완전히 fire-and-forget
  // 으로 처리합니다.
  const logPageview = useCallback((path: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      addDoc(collection(db, 'visits'), { date: today, path: path.slice(0, 190), createdAt: new Date().toISOString() }).catch(() => {
        // 조용히 무시 — 통계 수집 실패가 방문자에게 노출되어서는 안 됩니다.
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    logPageview(buildPath({ tab: activeTab, aboutSubTab, noticeCategory, noticeId: selectedNotice?.id, programId: selectedProgram?.id, galleryId: selectedGallery?.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const refreshData = async () => {
    addDebugLog('info', '사용자 즉시 동기화 요청...');
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const snap = await getDocs(collection(db, 'content'));
      if (!snap.empty) {
        const byId: Record<string, any> = {};
        snap.docs.forEach((d) => { byId[d.id] = d.data(); });
        if (byId['settings']) setSettings((prev) => ({ ...prev, ...byId['settings'] }));
        if (Array.isArray(byId['timeline']?.items)) applyTimeline(byId['timeline'].items);
        if (Array.isArray(byId['programs']?.items)) applyPrograms(byId['programs'].items);
        if (Array.isArray(byId['notices']?.items)) applyNotices(byId['notices'].items);
        if (Array.isArray(byId['gallery']?.items)) applyGallery(byId['gallery'].items);
        if (Array.isArray(byId['popups']?.items)) applyPopups(byId['popups'].items);
        if (Array.isArray(byId['partners']?.items)) applyPartners(byId['partners'].items);
        setSyncTimestamp(Date.now());
        setLastSyncTime(new Date().toLocaleTimeString('ko-KR'));
        addDebugLog('success', 'Firestore에서 최신 데이터를 새로고침했습니다.');
      }
      setSyncStatus('success');
      setSyncError(null);
    } catch (err) {
      console.warn('Sync notice:', err);
      setSyncStatus('success');
      setSyncError(null);
    } finally {
      setIsSyncing(false);
    }
  };

  // Re-sync when the tab regains focus/visibility (mobile background/resume)
  useEffect(() => {
    const handleVisibility = () => { if (document.visibilityState === 'visible') refreshData(); };
    const handleOnline = () => { addDebugLog('info', '네트워크 온라인 감지: 동기화 시도'); refreshData(); };
    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local-storage caching of PUBLIC, non-personal content only (instant
  // paint + offline resilience). Never used for settings/participations/
  // inquiries beyond what's declared here.
  useEffect(() => { writeLocalCache('gachihamkke_settings', settings); }, [settings]);
  useEffect(() => { writeLocalCache('gachihamkke_timeline', timeline); }, [timeline]);
  useEffect(() => { writeLocalCache('gachihamkke_programs', programs); }, [programs]);
  useEffect(() => { writeLocalCache('gachihamkke_notices', notices); }, [notices]);
  useEffect(() => { writeLocalCache('gachihamkke_gallery', gallery); }, [gallery]);
  useEffect(() => { writeLocalCache('gachihamkke_gallery_categories', galleryCategories); }, [galleryCategories]);
  useEffect(() => { writeLocalCache('gachihamkke_popups', popups); }, [popups]);
  useEffect(() => { writeLocalCache('gachihamkke_partners', partners); }, [partners]);

  // Firestore mutation helper — writes to one of the split `content/{docName}`
  // documents. See sanitizeForFirestore.ts for why every payload is passed
  // through that sanitizer, and the size check below for why we fail fast
  // with a clear Korean message before Firestore's own 1MB limit would
  // otherwise reject the write with a much less helpful error.
  const postMutation = useCallback((docName: string, payload: any, actionName: string) => {
    const targetDocRef = doc(db, 'content', docName);
    const update: any = sanitizeForFirestore({ ...payload, updatedAt: new Date().toISOString() });

    const approxSizeBytes = new Blob([JSON.stringify(update)]).size;
    const SOFT_LIMIT_BYTES = 900 * 1024;
    if (approxSizeBytes > SOFT_LIMIT_BYTES) {
      const sizeKb = Math.round(approxSizeBytes / 1024);
      handleFirestoreError(new Error(`Payload too large: ~${sizeKb}KB`), OperationType.WRITE, `content/${docName}`);
      setSyncStatus('error');
      setSyncError(`${actionName} 저장에 실패했습니다. 데이터 용량(약 ${sizeKb}KB)이 너무 큽니다. 이미지가 base64로 직접 포함되어 있지 않은지 확인해 주세요.`);
      return;
    }

    try {
      setDoc(targetDocRef, update, { merge: true })
        .then(() => {
          addDebugLog('success', `[저장 완료] ${actionName}`);
          setSyncTimestamp(Date.now());
          setSyncStatus('success');
          setSyncError(null);
          writeAuditLog(docName, actionName);
        })
        .catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `content/${docName}`);
          setSyncStatus('error');
          setSyncError(`${actionName} 저장에 실패했습니다. (${err instanceof Error ? err.message : String(err)})`);
        });
    } catch (err) {
      // setDoc() can throw synchronously (e.g. on a genuinely invalid field
      // value that slipped past sanitizeForFirestore) — without this catch
      // that failure would be invisible.
      handleFirestoreError(err, OperationType.WRITE, `content/${docName}`);
      setSyncStatus('error');
      setSyncError(`${actionName} 저장에 실패했습니다. (${err instanceof Error ? err.message : String(err)})`);
    }
  }, [addDebugLog]);

  // ── Timeline(연혁) CRUD ──
  const addTimelineItem = (item: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = { ...item, id: `tl-${Date.now()}` };
    const next = [...timelineRef.current, newItem];
    applyTimeline(next);
    postMutation('timeline', { items: next }, `연혁 추가: ${newItem.year} ${newItem.title}`);
  };
  const updateTimelineItem = (id: string, updated: Partial<TimelineItem>) => {
    const next = timelineRef.current.map((t) => (t.id === id ? { ...t, ...updated } : t));
    applyTimeline(next);
    postMutation('timeline', { items: next }, `연혁 수정 (ID: ${id})`);
  };
  const deleteTimelineItem = (id: string) => {
    const next = timelineRef.current.filter((t) => t.id !== id);
    applyTimeline(next);
    postMutation('timeline', { items: next }, `연혁 삭제 (ID: ${id})`);
  };

  // ── Programs CRUD ──
  const addProgram = (item: Omit<ProgramItem, 'id' | 'code'>) => {
    const nextCode = String(programsRef.current.length + 1).padStart(2, '0');
    const newProgram: ProgramItem = { ...item, id: `prg-${Date.now()}`, code: nextCode };
    const next = [...programsRef.current, newProgram];
    applyPrograms(next);
    postMutation('programs', { items: next }, `사업 추가: ${newProgram.title}`);
  };
  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    const next = programsRef.current.map((p) => (p.id === id ? { ...p, ...updated } : p));
    applyPrograms(next);
    postMutation('programs', { items: next }, `사업 수정 (ID: ${id})`);
  };
  const deleteProgram = (id: string) => {
    const next = programsRef.current.filter((p) => p.id !== id);
    applyPrograms(next);
    postMutation('programs', { items: next }, `사업 삭제 (ID: ${id})`);
  };

  // ── Notices CRUD ──
  const addNotice = (item: Omit<NoticeItem, 'id' | 'views' | 'date'> & { date?: string }) => {
    const newNotice: NoticeItem = {
      ...item,
      id: `not-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: item.date || new Date().toISOString().split('T')[0],
      views: 0,
    };
    const next = [newNotice, ...noticesRef.current];
    applyNotices(next);
    postMutation('notices', { items: next }, `소식 추가: ${newNotice.title}`);
  };
  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    const next = noticesRef.current.map((n) => (n.id === id ? { ...n, ...updated } : n));
    applyNotices(next);
    postMutation('notices', { items: next }, `소식 수정 (ID: ${id})`);
  };
  const deleteNotice = (id: string) => {
    const next = noticesRef.current.filter((n) => n.id !== id);
    applyNotices(next);
    postMutation('notices', { items: next }, `소식 삭제 (ID: ${id})`);
  };
  const incrementNoticeViews = (id: string) => {
    const next = noticesRef.current.map((n) => (n.id === id ? { ...n, views: (n.views || 0) + 1 } : n));
    applyNotices(next);
    postMutation('notices', { items: next }, `조회수 증가 (ID: ${id})`);
  };

  // ── Gallery CRUD ──
  const addGallery = (item: Omit<GalleryItem, 'id' | 'date'> & { date?: string; author?: string }) => {
    const primaryImg = item.imageUrl || (item.images && item.images[0]) || '';
    const allImages = item.images && item.images.length > 0 ? item.images : primaryImg ? [primaryImg] : [];
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: item.date || new Date().toISOString().split('T')[0],
      imageUrl: primaryImg,
      images: allImages,
      author: item.author || '관리자',
    };
    const next = [newItem, ...galleryRef.current];
    applyGallery(next);
    postMutation('gallery', { items: next, categories: galleryCategoriesRef.current }, `갤러리 추가: ${newItem.title}`);
  };

  const updateGallery = async (id: string, updated: Partial<GalleryItem>) => {
    const next = galleryRef.current.map((g) => (g.id === id ? { ...g, ...updated } : g));
    applyGallery(next);
    postMutation('gallery', { items: next, categories: galleryCategoriesRef.current }, `갤러리 수정 (ID: ${id})`);
  };

  const deleteGallery = async (id: string) => {
    const target = galleryRef.current.find((g) => g.id === id);
    if (!target) throw new Error('삭제할 갤러리 항목을 찾을 수 없습니다.');

    const next = galleryRef.current.filter((g) => g.id !== id);
    applyGallery(next);
    postMutation('gallery', { items: next, categories: galleryCategoriesRef.current }, `갤러리 삭제: ${target.title}`);

    // Clean up Storage files. Legacy/manually-added photos with no
    // storagePath (e.g. an admin who pasted an external URL) are never
    // deleted from Storage since there's nothing there to delete.
    const paths = target.storagePaths && target.storagePaths.length > 0
      ? target.storagePaths
      : target.storagePath
        ? [target.storagePath]
        : [];
    for (const p of paths) {
      try {
        await deleteObject(ref(storage, p));
      } catch (error: any) {
        if (error?.code !== 'storage/object-not-found') {
          console.warn(`Gallery Storage 파일 삭제 실패: ${p}`, error);
        }
      }
    }
  };

  const addGalleryCategory = async (category: string) => {
    const trimmed = category.trim();
    if (!trimmed || galleryCategoriesRef.current.includes(trimmed)) return;
    const next = [...galleryCategoriesRef.current, trimmed];
    applyGalleryCategories(next);
    postMutation('gallery', { items: galleryRef.current, categories: next }, `갤러리 카테고리 추가: ${trimmed}`);
  };
  const updateGalleryCategory = async (oldCategory: string, newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const next = galleryCategoriesRef.current.map((c) => (c === oldCategory ? trimmed : c));
    applyGalleryCategories(next);
    const updatedGallery = galleryRef.current.map((g) => (g.category === oldCategory ? { ...g, category: trimmed } : g));
    applyGallery(updatedGallery);
    postMutation('gallery', { items: updatedGallery, categories: next }, `갤러리 카테고리 수정: ${oldCategory} → ${trimmed}`);
  };
  const deleteGalleryCategory = async (category: string) => {
    const next = galleryCategoriesRef.current.filter((c) => c !== category);
    applyGalleryCategories(next);
    postMutation('gallery', { items: galleryRef.current, categories: next }, `갤러리 카테고리 삭제: ${category}`);
  };

  // ── Partners CRUD ──
  const addPartner = (item: Omit<PartnerItem, 'id'>) => {
    const newItem: PartnerItem = { ...item, id: `partner-${Date.now()}` };
    const next = [...partnersRef.current, newItem].sort((a, b) => a.order - b.order);
    applyPartners(next);
    postMutation('partners', { items: next }, `협력기관 추가: ${newItem.name}`);
  };
  const updatePartner = (id: string, updated: Partial<PartnerItem>) => {
    const next = partnersRef.current.map((p) => (p.id === id ? { ...p, ...updated } : p));
    applyPartners(next);
    postMutation('partners', { items: next }, `협력기관 수정 (ID: ${id})`);
  };
  const deletePartner = (id: string) => {
    const next = partnersRef.current.filter((p) => p.id !== id);
    applyPartners(next);
    postMutation('partners', { items: next }, `협력기관 삭제 (ID: ${id})`);
  };

  // ── Popups CRUD ──
  const addPopup = (item: Omit<PopupItem, 'id' | 'createdAt'>) => {
    const newItem: PopupItem = { ...item, id: `popup-${Date.now()}`, createdAt: new Date().toISOString() };
    const next = [newItem, ...popupsRef.current];
    applyPopups(next);
    postMutation('popups', { items: next }, `팝업 추가: ${newItem.title}`);
  };
  const updatePopup = (id: string, updated: Partial<PopupItem>) => {
    const next = popupsRef.current.map((p) => (p.id === id ? { ...p, ...updated } : p));
    applyPopups(next);
    postMutation('popups', { items: next }, `팝업 수정 (ID: ${id})`);
  };
  const deletePopup = (id: string) => {
    const next = popupsRef.current.filter((p) => p.id !== id);
    applyPopups(next);
    postMutation('popups', { items: next }, `팝업 삭제 (ID: ${id})`);
  };

  // ── Participations (협력 및 참여 신청) ──
  // Personal information: created directly against Firestore (not through
  // the localStorage-cached `content` documents above) and gated entirely
  // by firestore.rules — see that file's `participations` match block.
  const submitParticipation = async (item: Omit<ParticipationApplication, 'id' | 'createdAt' | 'status'>) => {
    const payload = sanitizeForFirestore({
      ...item,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: '접수완료' as const,
    });
    try {
      await addDoc(collection(db, 'participations'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'participations');
      throw err;
    }
  };
  const updateParticipationStatus = async (id: string, status: ParticipationApplication['status']) => {
    setParticipations((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    try {
      await setDoc(doc(db, 'participations', id), { status }, { merge: true });
      writeAuditLog('participations', `참여신청 상태 변경 (ID: ${id}) → ${status}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `participations/${id}`);
    }
  };
  const deleteParticipation = async (id: string) => {
    setParticipations((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'participations', id));
      writeAuditLog('participations', `참여신청 삭제 (ID: ${id})`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `participations/${id}`);
    }
  };

  // ── Inquiries (문의하기) ──
  const submitInquiry = async (item: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const payload = sanitizeForFirestore({
      ...item,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: '대기중' as const,
    });
    try {
      await addDoc(collection(db, 'inquiries'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      throw err;
    }
  };
  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await setDoc(doc(db, 'inquiries', id), { status }, { merge: true });
      writeAuditLog('inquiries', `문의 상태 변경 (ID: ${id}) → ${status}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
    }
  };
  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      writeAuditLog('inquiries', `문의 삭제 (ID: ${id})`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // ── Settings ──
  const updateSettings = (newSettings: Partial<OrgSettings>) => {
    const next = { ...settings, ...newSettings };
    setSettings(next);
    postMutation('settings', next, '기본정보 수정');
  };

  const resetToDefaults = () => {
    // 콘텐츠(설정/사업/소식/갤러리/팝업/협력기관)만 초기화합니다.
    // 참여신청/문의는 각자 별도 컬렉션에 있으며 절대 이 초기화의 대상이
    // 아닙니다.
    setSettings(INITIAL_SETTINGS);
    applyTimeline(INITIAL_TIMELINE);
    applyPrograms(INITIAL_PROGRAMS);
    applyNotices(INITIAL_NOTICES);
    applyGallery(INITIAL_GALLERY);
    applyGalleryCategories(INITIAL_GALLERY_CATEGORIES);
    applyPopups(INITIAL_POPUPS);
    applyPartners(INITIAL_PARTNERS);
    postMutation('settings', INITIAL_SETTINGS, '초기화: 기본정보');
    postMutation('timeline', { items: INITIAL_TIMELINE }, '초기화: 연혁');
    postMutation('programs', { items: INITIAL_PROGRAMS }, '초기화: 사업');
    postMutation('notices', { items: INITIAL_NOTICES }, '초기화: 소식');
    postMutation('gallery', { items: INITIAL_GALLERY, categories: INITIAL_GALLERY_CATEGORIES }, '초기화: 갤러리');
    postMutation('popups', { items: INITIAL_POPUPS }, '초기화: 팝업');
    postMutation('partners', { items: INITIAL_PARTNERS }, '초기화: 협력기관');
  };

  return (
    <ValueTogetherContext.Provider
      value={{
        settings,
        timeline,
        programs,
        notices,
        gallery,
        galleryCategories,
        popups,
        partners,
        participations,
        inquiries,
        pendingParticipationsCount,
        pendingInquiriesCount,
        markParticipationsAsRead,

        activeTab,
        setActiveTab,
        aboutSubTab,
        setAboutSubTab,
        noticeCategory,
        setNoticeCategory,
        navigateToNewsCategory,

        adminOpen,
        setAdminOpen,
        isAdmin,
        logoutAdmin,

        logPageview,
        refreshData,
        isSyncing,
        syncTimestamp,
        getImageUrl,
        debugLogs,
        syncStatus,
        lastSyncTime,
        syncError,
        clearDebugLogs,

        selectedProgram,
        setSelectedProgram,
        selectedNotice,
        setSelectedNotice,
        selectedGallery,
        setSelectedGallery,

        viewNoticeDetail,
        viewGalleryDetail,
        viewProgramDetail,
        goBackFromDetail,

        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,

        addProgram,
        updateProgram,
        deleteProgram,

        addNotice,
        updateNotice,
        deleteNotice,
        incrementNoticeViews,

        addGallery,
        updateGallery,
        deleteGallery,
        addGalleryCategory,
        updateGalleryCategory,
        deleteGalleryCategory,

        addPartner,
        updatePartner,
        deletePartner,

        addPopup,
        updatePopup,
        deletePopup,
        showPopupsFlag,
        triggerPopupShow,

        submitParticipation,
        updateParticipationStatus,
        deleteParticipation,

        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,

        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </ValueTogetherContext.Provider>
  );
};

export const useValueTogether = (): ValueTogetherContextType => {
  const ctx = useContext(ValueTogetherContext);
  if (!ctx) throw new Error('useValueTogether must be used within a ValueTogetherProvider');
  return ctx;
};
