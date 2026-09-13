import React, { useMemo, useState } from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { PageBanner } from '../components/common/PageBanner';
import { FileText, Download, CalendarDays, Scale, Landmark, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['전체', '경영공시', '정관·규정', '총회', '이사회', '사업계획', '결산·사업보고', '기부금 공개'] as const;

export const GovernancePage: React.FC = () => {
  const { governanceDocuments, meetings, settings } = useValueTogether();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('전체');
  const docs = useMemo(() => governanceDocuments
    .filter(d => d.isPublic && (category === '전체' || d.category === category))
    .sort((a,b) => (b.year + b.order).localeCompare(a.year + a.order)), [governanceDocuments, category]);
  const publicMeetings = meetings.filter(m => m.isPublic).sort((a,b) => (b.date + b.order).localeCompare(a.date + a.order));

  return <div>
    <PageBanner eyebrow="GOVERNANCE" title="투명경영" description="정관과 관련 규정에 따라 조합의 운영 정보를 투명하게 공개합니다." />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      <section className="grid md:grid-cols-3 gap-4">
        <InfoCard icon={Scale} title="정관·규정" text="조합의 목적과 운영 원칙, 조합원의 권리와 의무를 확인할 수 있습니다." />
        <InfoCard icon={Landmark} title="총회·이사회" text="주요 의사결정과 활동 내용을 공개 가능한 범위에서 확인할 수 있습니다." />
        <InfoCard icon={ShieldCheck} title="경영공시" text="사업계획·결산·사업결과 등 공개 자료를 연도별로 제공합니다." />
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="투명경영 자료 분류">
          {CATEGORIES.map(c => <button key={c} type="button" onClick={() => setCategory(c)} className={`px-4 py-2.5 rounded-xl text-sm font-bold border ${category===c?'bg-primary text-primary-ink border-primary':'bg-paper-card text-ink-soft border-line hover:text-ink'}`}>{c}</button>)}
        </div>
        {docs.length === 0 ? <EmptyNotice /> : <div className="grid md:grid-cols-2 gap-4">{docs.map(d => <DocumentCard key={d.id} doc={d} />)}</div>}
      </section>

      {category === '전체' && publicMeetings.length > 0 && <section className="space-y-5">
        <div><h2 className="font-display font-black text-xl text-ink">회의 활동</h2><p className="text-sm text-ink-soft mt-1">총회와 이사회의 공개 가능한 활동 정보를 확인할 수 있습니다.</p></div>
        <div className="space-y-3">{publicMeetings.map(m => <div key={m.id} className="bg-paper-card border border-line rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span className="text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2 py-1 rounded-full">{m.type}</span><h3 className="font-bold text-ink mt-2">{m.title}</h3><p className="text-xs text-ink-soft mt-1">{m.date} · {m.year}</p>{m.summary && <p className="text-sm text-ink-soft mt-2">{m.summary}</p>}</div></div>)}</div>
      </section>}

      <section className="bg-primary-soft/60 border border-primary-soft rounded-3xl p-6 sm:p-8">
        <h2 className="font-display font-black text-xl text-ink">공시 자료가 아직 등록되지 않았나요?</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">공시 대상 자료가 확정되면 관리자 화면에서 연도와 분류를 지정하여 PDF로 등록할 수 있습니다. 공개 전에는 개인정보와 비공개 정보가 포함되지 않았는지 확인해 주세요.</p>
        {settings.businessRegistrationNumber && <p className="text-xs text-ink-soft mt-4">단체명: {settings.name} · 고유번호: {settings.businessRegistrationNumber}</p>}
      </section>
    </div>
  </div>;
};

const DocumentCard: React.FC<{doc: any}> = ({doc}) => <article className="bg-paper-card border border-line rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
  <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>
  <div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 items-center"><span className="text-[11px] font-bold text-secondary-ink bg-secondary-soft px-2 py-1 rounded-full">{doc.category}</span><span className="text-xs text-ink-soft">{doc.year}</span></div><h3 className="font-bold text-ink mt-2 break-words">{doc.title}</h3>{doc.description && <p className="text-sm text-ink-soft mt-1 leading-relaxed">{doc.description}</p>}<a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-primary-ink hover:underline"><Download className="w-3.5 h-3.5" /> 문서 열기</a></div>
</article>;
const InfoCard: React.FC<{icon: React.ElementType;title:string;text:string}> = ({icon:Icon,title,text}) => <div className="bg-paper-card border border-line rounded-2xl p-5"><Icon className="w-5 h-5 text-primary-ink"/><h2 className="font-bold text-ink mt-3">{title}</h2><p className="text-sm text-ink-soft leading-relaxed mt-2">{text}</p></div>;
const EmptyNotice = () => <div className="bg-paper-soft rounded-2xl p-8 text-center"><CalendarDays className="w-7 h-7 text-ink-soft/50 mx-auto"/><p className="font-bold text-ink mt-3">등록된 공개 자료가 없습니다.</p><p className="text-xs text-ink-soft mt-1">공시 자료가 준비되면 이곳에서 연도별로 확인하실 수 있습니다.</p></div>;
