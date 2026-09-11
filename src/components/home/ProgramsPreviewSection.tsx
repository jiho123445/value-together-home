import React from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import * as Icons from 'lucide-react';
import { ArrowRight, Briefcase } from 'lucide-react';

const PROGRAM_FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/18449721/pexels-photo-18449721.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/5265333/pexels-photo-5265333.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/6647025/pexels-photo-6647025.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/6684532/pexels-photo-6684532.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

export const ProgramsPreviewSection: React.FC = () => {
  const { programs, viewProgramDetail, setActiveTab, getImageUrl } = useValueTogether();
  const featured = programs.filter((p) => p.featuredOnHome).slice(0, 6);
  const list = featured.length > 0 ? featured : programs.slice(0, 6);
  const displayList = list.length > 0 ? list : [
    { id:'draft-1', code:'01', category:'돌봄복지사업', title:'지역사회 돌봄', summary:'지역 주민의 일상과 생활을 지원하고 사람 중심의 돌봄과 연결을 만들어갑니다.', subtitle:'', details:[], targetAudience:'', impactMessage:'', iconName:'HeartHandshake', featuredOnHome:true, order:1 },
    { id:'draft-2', code:'02', category:'교육사업', title:'교육 및 역량강화', summary:'배움의 기회를 확대하고 개인의 성장과 자립을 지원합니다.', subtitle:'', details:[], targetAudience:'', impactMessage:'', iconName:'GraduationCap', featuredOnHome:true, order:2 },
    { id:'draft-3', code:'03', category:'사회서비스', title:'사회서비스', summary:'지역의 필요를 살피고 사람 중심의 사회서비스를 제공합니다.', subtitle:'', details:[], targetAudience:'', impactMessage:'', iconName:'HandHeart', featuredOnHome:true, order:3 },
    { id:'draft-4', code:'04', category:'지역사회사업', title:'지역사회 연계', summary:'공공·민간기관 및 주민과 협력하여 지역사회 문제 해결을 추진합니다.', subtitle:'', details:[], targetAudience:'', impactMessage:'', iconName:'Handshake', featuredOnHome:true, order:4 },
  ];

  return (
    <section className="py-20 sm:py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-extrabold text-primary-ink tracking-[0.16em]">OUR BUSINESS</p>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[3rem] text-ink tracking-tight">주요사업</h2>
            <p className="text-base sm:text-lg text-ink-soft">지역의 필요를 발견하고, 사람과 자원을 연결해 실질적인 변화를 만들어갑니다.</p>
          </div>
          <button type="button" onClick={() => setActiveTab('business')} className="inline-flex items-center gap-2 text-base font-extrabold text-ink-soft hover:text-ink">
            전체 사업 보기 <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayList.slice(0, 4).map((program: any, index) => {
            const IconComp = (Icons as any)[program.iconName] || Briefcase;
            const imageUrl = program.imageUrl ? getImageUrl(program.imageUrl) : PROGRAM_FALLBACK_IMAGES[index];
            const isDraft = String(program.id).startsWith('draft-');
            return (
              <button
                key={program.id}
                type="button"
                onClick={() => { if (!isDraft) viewProgramDetail(program); else setActiveTab('business'); }}
                className="group text-left bg-paper-card border border-line rounded-3xl overflow-hidden hover:border-secondary hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary-soft">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-secondary-ink bg-secondary-soft px-3 py-1.5 rounded-full">{program.category}</span>
                    <div className="w-11 h-11 rounded-xl bg-primary-soft text-primary-ink flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl leading-snug text-ink">{program.title}</h3>
                  <p className="text-base leading-7 text-ink-soft line-clamp-3">{program.summary}</p>
                  <span className="inline-flex items-center gap-1.5 text-base font-extrabold text-secondary-ink">자세히 보기 <ArrowRight className="w-4 h-4" /></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
