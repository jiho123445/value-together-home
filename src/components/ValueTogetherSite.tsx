import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  CheckCircle2, ChevronRight, HeartHandshake, Mail, MapPin, Menu, Phone, ShieldCheck,
  Sparkles, UsersRound, X
} from 'lucide-react';
import { useFoundation } from '../context/FoundationContext';
import type { ProgramItem } from '../types';

const iconMap: Record<string, React.ComponentType<any>> = {
  HeartHandshake, BookOpen, BriefcaseBusiness, UsersRound, Building2,
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.55, delay, ease: 'easeOut' }}
  >{children}</motion.div>
);

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, adminOpen, setAdminOpen, isAdmin } = useFoundation();
  const [open, setOpen] = useState(false);
  const go = (tab: any) => { setOpen(false); setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const nav = [
    ['about', '가치함께 소개'], ['programs', '주요사업'], ['news', '소식'], ['gallery', '활동갤러리'], ['contact', '오시는 길']
  ] as const;
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand-button" onClick={() => go('main')} aria-label="가치함께 홈">
          <img src="/value-together-logo.png" alt="사회적협동조합 가치함께" className="brand-logo" />
        </button>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {nav.map(([tab, label]) => <button key={tab} className={activeTab === tab ? 'nav-link active' : 'nav-link'} onClick={() => go(tab)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          {isAdmin ? (
            <button onClick={() => setAdminOpen(true)} className="admin-chip"><ShieldCheck size={15} />관리자</button>
          ) : null}
          <button onClick={() => go('contact')} className="header-cta">함께하기 <ArrowUpRight size={16} /></button>
          <button className="mobile-menu-btn" onClick={() => setOpen(v => !v)} aria-label={open ? '메뉴 닫기' : '메뉴 열기'}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <div className="mobile-nav">
        {nav.map(([tab, label]) => <button key={tab} className={activeTab === tab ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={() => go(tab)}>{label}<ChevronRight size={16} /></button>)}
        <button className="mobile-nav-link emphasis" onClick={() => go('contact')}>참여·협력 문의<ArrowRight size={17} /></button>
      </div>}
    </header>
  );
};

export const Hero: React.FC = () => {
  const { setActiveTab, settings } = useFoundation();
  return <section className="hero">
    <div className="hero-bg" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,35,29,.94) 0%, rgba(7,35,29,.82) 38%, rgba(7,35,29,.28) 72%, rgba(7,35,29,.12) 100%), url(${settings.heroImageUrl})` }} />
    <div className="hero-glow" />
    <div className="container hero-content">
      <FadeIn>
        <div className="eyebrow"><Sparkles size={15} /> PEOPLE · COMMUNITY · VALUE · TOGETHER</div>
        <h1>{settings.sloganMain}</h1>
        <p>{settings.sloganSub}</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => setActiveTab('programs')}>주요사업 살펴보기 <ArrowRight size={18} /></button>
          <button className="button button-ghost" onClick={() => setActiveTab('about')}>가치함께 알아보기</button>
        </div>
        <div className="hero-proof"><span>사람을 잇고</span><span>가치를 만들고</span><span>지역과 함께합니다</span></div>
      </FadeIn>
    </div>
  </section>;
};

export const Stats: React.FC = () => {
  const { programs, notices, gallery } = useFoundation();
  const stats = [
    ['사업 영역', `${String(programs.length).padStart(2, '0')}+`, '지역의 필요에 맞춘 핵심 사업'],
    ['콘텐츠', `${String(notices.length + gallery.length).padStart(2, '0')}+`, '소식과 활동을 기록하고 공유'],
    ['핵심 가치', '4', '사람 · 연결 · 성장 · 지속가능성'],
    ['운영 원칙', '100%', '투명성 · 참여 · 협력 · 책임']
  ];
  return <section className="stats-section"><div className="container stats-grid">{stats.map(([label, value, desc], i) => <FadeIn key={label} delay={i * .05}><div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{desc}</small></div></FadeIn>)}</div></section>;
};

const SectionTitle: React.FC<{ kicker: string; title: string; text?: string; action?: React.ReactNode }> = ({ kicker, title, text, action }) => <div className="section-title-row"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{action}</div>;

export const Values: React.FC = () => {
  const values = [
    ['01', '사람', '사람의 존엄과 선택을 중심에 둡니다.'],
    ['02', '연결', '필요한 자원과 관계를 촘촘하게 잇습니다.'],
    ['03', '성장', '배움과 자립의 기회를 함께 넓힙니다.'],
    ['04', '지속가능성', '지역 안에서 오래가는 변화를 설계합니다.'],
  ];
  return <section className="section values-section"><div className="container"><SectionTitle kicker="OUR VALUE" title="함께해야 가치가 커집니다" text="가치함께는 한 사람의 변화가 지역의 변화로 이어질 수 있도록 사람·기관·지역을 연결합니다." />
    <div className="values-grid">{values.map(([n, title, text], i) => <FadeIn key={n} delay={i * .06}><article className="value-card"><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article></FadeIn>)}</div>
  </div></section>;
};

export const AboutPreview: React.FC = () => {
  const { settings, timeline, setActiveTab } = useFoundation();
  return <section className="section about-preview"><div className="container about-grid"><FadeIn><div className="about-visual"><div className="about-logo-card"><img src="/value-together-logo.png" alt="가치함께 CI" /></div><div className="about-note"><strong>People · Community · Value</strong><span>함께 만드는 더 나은 내일</span></div></div></FadeIn><FadeIn delay={.1}><div className="about-copy"><span className="section-kicker">ABOUT VALUE TOGETHER</span><h2>지역의 필요를 발견하고<br /><em>함께 해결하는 조직</em></h2><p>{settings.chairmanGreeting}</p><div className="mini-timeline">{timeline.slice(0, 3).map((item) => <div key={item.year}><span>{item.year}</span><strong>{item.title}</strong></div>)}</div><button className="text-button" onClick={() => setActiveTab('about')}>조합 소개 자세히 보기 <ArrowRight size={17} /></button></div></FadeIn></div></section>;
};

const ProgramCard: React.FC<{ item: ProgramItem; onOpen: () => void }> = ({ item, onOpen }) => {
  const Icon = iconMap[item.iconName] || HeartHandshake;
  return <motion.button whileHover={{ y: -6 }} className="program-card" onClick={onOpen}><div className="program-top"><span>{item.code}</span><Icon size={26} /></div><h3>{item.title}</h3><p className="program-subtitle">{item.subtitle}</p><p className="program-summary">{item.summary}</p><div className="program-foot"><span>{item.badge}</span><ArrowUpRight size={17} /></div></motion.button>;
};

export const Programs: React.FC = () => {
  const { programs, viewProgramDetail, setActiveTab } = useFoundation();
  return <section className="section programs-section"><div className="container"><SectionTitle kicker="WHAT WE DO" title="주요사업" text="지역주민과 조합원이 체감할 수 있는 사회서비스와 협력사업을 만듭니다." action={<button className="outline-button" onClick={() => setActiveTab('programs')}>사업 전체보기 <ArrowRight size={17} /></button>} />
    <div className="programs-grid">{programs.slice(0, 4).map((p, i) => <FadeIn key={p.id} delay={i * .05}><ProgramCard item={p} onOpen={() => viewProgramDetail(p)} /></FadeIn>)}</div>
  </div></section>;
};

export const NewsAndGallery: React.FC = () => {
  const { notices, gallery, setActiveTab, viewNoticeDetail, viewGalleryDetail, getImageUrl } = useFoundation();
  const latestNews = useMemo(() => [...notices].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 4), [notices]);
  const latestGallery = useMemo(() => [...gallery].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 3), [gallery]);
  return <section className="section light-section"><div className="container news-gallery-grid">
    <div><SectionTitle kicker="NEWS" title="새로운 소식" action={<button className="text-button" onClick={() => setActiveTab('news')}>전체보기 <ArrowRight size={16} /></button>} />
      <div className="news-list">{latestNews.map((n) => <button key={n.id} className="news-row" onClick={() => viewNoticeDetail(n)}><span className="news-date">{n.date}</span><span className="news-title">{n.title}</span><ChevronRight size={16} /></button>)}</div></div>
    <div><SectionTitle kicker="ACTIVITY" title="활동갤러리" action={<button className="text-button" onClick={() => setActiveTab('gallery')}>전체보기 <ArrowRight size={16} /></button>} /><div className="gallery-mini-grid">{latestGallery.map((g) => <button key={g.id} className="gallery-mini-card" onClick={() => viewGalleryDetail(g)}><img src={getImageUrl(g.imageUrl)} alt={g.title} loading="lazy" /><span>{g.category}</span><strong>{g.title}</strong></button>)}</div></div>
  </div></section>;
};

export const ContactCTA: React.FC = () => {
  const { settings, setActiveTab } = useFoundation();
  return <section className="contact-cta"><div className="container contact-cta-inner"><div><span className="section-kicker light">TOGETHER</span><h2>함께할수록 더 큰 가치가 만들어집니다.</h2><p>조합원·기관 협력·프로그램·사회서비스 등 다양한 문의를 기다립니다.</p></div><div className="contact-cta-actions"><button className="button button-light" onClick={() => setActiveTab('contact')}>문의하기 <ArrowRight size={18} /></button><div className="contact-quick"><span><Phone size={15} />{settings.phone || '전화번호 입력'}</span><span><Mail size={15} />{settings.email || '이메일 입력'}</span></div></div></div></section>;
};

export const AboutPage: React.FC = () => <section className="page-section"><div className="container"><SectionTitle kicker="ABOUT" title="가치함께 소개" text="사회적협동조합 가치함께는 사람과 지역을 연결하여 지속가능한 사회적 가치를 만들어 갑니다."/><div className="story-grid"><div className="story-card dark"><span>CORE MESSAGE</span><h3>사람이 만드는 오늘,<br />함께 만드는 더 나은 내일</h3><p>가치함께의 모든 사업은 이용자와 지역주민의 삶에서 출발합니다.</p></div><div className="story-card"><h3>운영 방향</h3><ul><li><CheckCircle2 /> 이용자 중심의 서비스</li><li><CheckCircle2 /> 지역 기반의 협력</li><li><CheckCircle2 /> 투명하고 책임 있는 운영</li><li><CheckCircle2 /> 지속가능한 사회적 가치</li></ul></div></div></div></section>;

export const ProgramsPage: React.FC = () => { const { programs, viewProgramDetail } = useFoundation(); return <section className="page-section"><div className="container"><SectionTitle kicker="PROGRAMS" title="주요사업" text="가치함께의 사업은 실제 지역의 필요를 발견하고 협력으로 해결하는 데 초점을 둡니다."/><div className="programs-grid full">{programs.map((p,i)=><FadeIn key={p.id} delay={i*.04}><ProgramCard item={p} onOpen={()=>viewProgramDetail(p)} /></FadeIn>)}</div></div></section>; };

export const NewsPage: React.FC = () => { const { notices, viewNoticeDetail } = useFoundation(); const [q,setQ]=useState(''); const list=notices.filter(n=>`${n.title} ${n.content}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date)); return <section className="page-section"><div className="container"><SectionTitle kicker="NEWS" title="소식" text="공지사항과 사업소식을 빠르게 확인하세요."/><div className="search-line"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="소식 검색" aria-label="소식 검색" /></div><div className="news-table">{list.map(n=><button key={n.id} className="news-table-row" onClick={()=>viewNoticeDetail(n)}><span>{n.category}</span><strong>{n.title}</strong><time>{n.date}</time><ChevronRight size={16}/></button>)}</div></div></section>; };

export const GalleryPage: React.FC = () => { const { gallery, viewGalleryDetail, getImageUrl } = useFoundation(); return <section className="page-section"><div className="container"><SectionTitle kicker="GALLERY" title="활동갤러리" text="함께한 순간과 현장의 변화를 기록합니다."/><div className="gallery-full-grid">{gallery.map((g,i)=><FadeIn key={g.id} delay={i*.03}><button className="gallery-full-card" onClick={()=>viewGalleryDetail(g)}><img src={getImageUrl(g.imageUrl)} alt={g.title} loading="lazy"/><div><span>{g.category}</span><h3>{g.title}</h3><p>{g.description}</p><small><CalendarDays size={14}/> {g.date}</small></div></button></FadeIn>)}</div></div></section>; };

export const ContactPage: React.FC = () => {
  const { settings, addInquiry } = useFoundation();
  const [form,setForm]=useState({name:'',phone:'',email:'',subject:'',message:'',privacy:false});
  const [sent,setSent]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');if(!form.privacy){setError('개인정보 수집·이용에 동의해 주세요.');return;}setLoading(true);try{await addInquiry({name:form.name,phone:form.phone,email:form.email,subject:form.subject,message:form.message});setSent(true);setForm({name:'',phone:'',email:'',subject:'',message:'',privacy:false});}catch{setError('문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');}finally{setLoading(false);}};
  return <section className="page-section"><div className="container"><SectionTitle kicker="CONTACT" title="함께하기" text="협력·사업·프로그램·기관문의 등 어떤 내용이든 편하게 남겨주세요."/><div className="contact-grid"><div className="contact-info"><div className="contact-info-card"><MapPin/><div><strong>주소</strong><span>{settings.address || '주소 정보 입력'}</span></div></div><div className="contact-info-card"><Phone/><div><strong>전화</strong><span>{settings.phone || '전화번호 입력'}</span></div></div><div className="contact-info-card"><Mail/><div><strong>이메일</strong><span>{settings.email || '이메일 입력'}</span></div></div><div className="contact-info-card"><CalendarDays/><div><strong>운영시간</strong><span>{settings.operatingHours || '평일 09:00 - 18:00'}</span></div></div></div><form className="contact-form" onSubmit={submit}><div className="form-grid"><label>이름<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>연락처<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>이메일<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>문의제목<input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label></div><label>문의내용<textarea required rows={7} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label><label className="check-line"><input type="checkbox" checked={form.privacy} onChange={e=>setForm({...form,privacy:e.target.checked})}/><span>문의 접수를 위한 개인정보 수집·이용에 동의합니다.</span></label>{error&&<div className="form-error">{error}</div>}{sent?<div className="form-success"><CheckCircle2/>문의가 접수되었습니다. 감사합니다.</div>:<button className="button button-primary form-submit" disabled={loading}>{loading?'접수 중...':'문의 접수하기'} <ArrowRight size={18}/></button>}</form></div></div></section>;
};

export const Footer: React.FC = () => { const { settings, setActiveTab, setAdminOpen }=useFoundation(); return <footer className="site-footer"><div className="container footer-top"><div><img src="/value-together-logo.png" alt="사회적협동조합 가치함께" className="footer-logo"/><p>사람과 가치, 지역이 함께하는<br/>사회적협동조합 가치함께</p></div><div className="footer-links"><button onClick={()=>setActiveTab('about')}>조합 소개</button><button onClick={()=>setActiveTab('programs')}>주요사업</button><button onClick={()=>setActiveTab('news')}>소식</button><button onClick={()=>setActiveTab('gallery')}>갤러리</button><button onClick={()=>setActiveTab('privacy')}>개인정보처리방침</button></div><div className="footer-contact"><span><Phone size={15}/>{settings.phone || '전화번호 입력'}</span><span><Mail size={15}/>{settings.email || '이메일 입력'}</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} 사회적협동조합 가치함께. All rights reserved.</span><button onClick={()=>setAdminOpen(true)} className="footer-admin">관리자</button></div></footer>; };
