import React, { Suspense, lazy } from 'react';
import { FoundationProvider, useFoundation } from './context/FoundationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NoticeDetailPage } from './components/NoticeDetailPage';
import { GalleryDetailPage } from './components/GalleryDetailPage';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { PopupModal } from './components/PopupModal';
import { SyncErrorBanner } from './components/SyncErrorBanner';
import { ModalViewer } from './components/ModalViewer';
import { Header, Hero, Stats, Values, AboutPreview, Programs, NewsAndGallery, ContactCTA, AboutPage, ProgramsPage, NewsPage, GalleryPage, ContactPage, Footer } from './components/ValueTogetherSite';

const AdminModal = lazy(() => import('./components/AdminModal').then(m => ({ default: m.AdminModal })));

const MainContent: React.FC = () => {
  const { activeTab, adminOpen } = useFoundation();
  return <main className="min-h-screen">
    {activeTab === 'main' && <><Hero/><Stats/><Values/><AboutPreview/><Programs/><NewsAndGallery/><ContactCTA/></>}
    {activeTab === 'about' && <AboutPage/>}
    {activeTab === 'programs' && <ProgramsPage/>}
    {activeTab === 'news' && <NewsPage/>}
    {activeTab === 'gallery' && <GalleryPage/>}
    {activeTab === 'contact' && <ContactPage/>}
    {activeTab === 'press' && <NewsPage/>}
    {activeTab === 'donate' && <ContactPage/>}
    {activeTab === 'privacy' && <PrivacyPolicyPage/>}
    {activeTab === 'terms' && <TermsPage/>}
    {activeTab === 'notice-detail' && <NoticeDetailPage/>}
    {activeTab === 'gallery-detail' && <GalleryDetailPage/>}
    {activeTab === 'program-detail' && <ProgramDetailPage/>}
    {adminOpen && <Suspense fallback={null}><AdminModal/></Suspense>}
  </main>;
};

export default function App(){return <ErrorBoundary><FoundationProvider><div className="app-shell"><Header/><MainContent/><PopupModal/><ModalViewer/><SyncErrorBanner/><Footer/></div></FoundationProvider></ErrorBoundary>}
