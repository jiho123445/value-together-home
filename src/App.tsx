import React, { Suspense } from 'react';
import { ValueTogetherProvider, useValueTogether } from './context/ValueTogetherContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SEOHead } from './components/common/SEOHead';
import { ModalViewer } from './components/common/ModalViewer';
import { PopupModal } from './components/common/PopupModal';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingQuickMenu } from './components/layout/FloatingQuickMenu';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BusinessPage } from './pages/BusinessPage';
import { NewsPage } from './pages/NewsPage';
import { GalleryPage } from './pages/GalleryPage';
import { PartnersPage } from './pages/PartnersPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NoticeDetailPage } from './pages/NoticeDetailPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { GalleryDetailPage } from './pages/GalleryDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// 관리자 화면은 방문자 번들에 전혀 포함되지 않도록 React.lazy로 완전히
// 분리합니다 (관리자 UID 확인 → 로그인 화면 → 대시보드까지 전부 이 청크 안).
const AdminApp = React.lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));

const SiteShell: React.FC = () => {
  const { activeTab, adminOpen } = useValueTogether();

  if (adminOpen) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-ink text-white text-sm font-bold">
            관리자 화면을 불러오는 중...
          </div>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  let page: React.ReactNode;
  switch (activeTab) {
    case 'about':
      page = <AboutPage />; break;
    case 'business':
      page = <BusinessPage />; break;
    case 'news':
      page = <NewsPage />; break;
    case 'gallery':
      page = <GalleryPage />; break;
    case 'partners':
      page = <PartnersPage />; break;
    case 'contact':
      page = <ContactPage />; break;
    case 'privacy':
      page = <PrivacyPolicyPage />; break;
    case 'terms':
      page = <TermsPage />; break;
    case 'news-detail':
      page = <NoticeDetailPage />; break;
    case 'business-detail':
      page = <ProgramDetailPage />; break;
    case 'gallery-detail':
      page = <GalleryDetailPage />; break;
    case 'not-found':
      page = <NotFoundPage />; break;
    case 'main':
    default:
      page = <HomePage />; break;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <SEOHead />
      <Header />
      <main className="flex-1">{page}</main>
      <Footer />
      <ModalViewer />
      <PopupModal />
      <FloatingQuickMenu />
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <ValueTogetherProvider>
      <SiteShell />
    </ValueTogetherProvider>
  </ErrorBoundary>
);

export default App;
