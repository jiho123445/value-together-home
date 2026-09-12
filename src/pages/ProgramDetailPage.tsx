import React from 'react';
import { useValueTogether } from '../context/ValueTogetherContext';
import { ChevronLeft, CheckCircle2, HeartHandshake } from 'lucide-react';
import { getProgramPhoto } from '../utils/programPhoto';

export const ProgramDetailPage: React.FC = () => {
  const { selectedProgram, goBackFromDetail, setActiveTab, getImageUrl } = useValueTogether();

  if (!selectedProgram) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center space-y-4">
        <p className="text-ink-soft text-sm">사업 정보를 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.</p>
        <button type="button" onClick={() => setActiveTab('business')} className="text-sm font-bold text-primary-ink underline underline-offset-2">
          주요사업 목록으로 이동
        </button>
      </div>
    );
  }

  const program = selectedProgram;
  const photoSrc = getProgramPhoto(program, getImageUrl);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <button type="button" onClick={() => goBackFromDetail('business')} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink mb-6">
        <ChevronLeft className="w-4 h-4" /> 목록으로
      </button>

      <div className="aspect-video rounded-3xl overflow-hidden border-2 border-line/80 shadow-sm mb-8 bg-paper-soft">
        <img src={photoSrc} alt={program.title} className="w-full h-full object-cover" />
      </div>

      <article className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-primary/25 bg-paper-soft shrink-0">
              <img
                src={photoSrc}
                alt={program.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-primary-ink bg-primary-soft px-3 py-1 rounded-full">사업 {program.code} · {program.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">{program.title}</h1>
          <p className="text-sm text-ink-soft italic">&ldquo;{program.subtitle}&rdquo;</p>
        </header>

        <p className="text-sm font-bold text-ink/90 leading-relaxed whitespace-pre-line">{program.summary}</p>

        <div className="bg-secondary-soft p-5 rounded-2xl text-sm text-secondary-ink font-medium">{program.impactMessage}</div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider">세부 내용</h2>
          <ul className="space-y-2 text-sm text-ink">
            {program.details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-paper-card border border-line p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-secondary-ink shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 flex items-center justify-between gap-3 flex-wrap border-t border-line">
          <span className="text-xs text-ink-soft font-medium">지원 대상: {program.targetAudience}</span>
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className="bg-primary text-primary-ink font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>이 사업에 참여·협력하기</span>
          </button>
        </div>
      </article>
    </div>
  );
};
