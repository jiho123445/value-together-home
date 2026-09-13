import React, { useState } from 'react';
import { useValueTogether } from '../../context/ValueTogetherContext';
import { ImageUploadField } from '../components/ImageUploadField';
import { OrgChartItem, OperatingPrinciple, BankAccount, TimelineItem } from '../../types';
import { Plus, Trash2, Save, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-line bg-paper text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper';
const labelCls = 'text-xs font-bold text-ink';

type SectionStatus = 'idle' | 'saving' | 'saved' | 'error';

const SectionCard: React.FC<{ title: string; description?: string; children: React.ReactNode; onSave: () => void; status: SectionStatus }> = ({ title, description, children, onSave, status }) => (
  <section className="bg-paper-card border border-line rounded-2xl p-6 space-y-5">
    <div>
      <h2 className="font-bold text-ink text-base">{title}</h2>
      {description && <p className="text-xs text-ink-soft mt-0.5">{description}</p>}
    </div>
    <div className="space-y-4">{children}</div>
    <div className="flex items-center gap-3 pt-2 border-t border-line">
      <button
        type="button"
        onClick={onSave}
        disabled={status === 'saving'}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-4 py-2.5 rounded-xl hover:opacity-80 disabled:opacity-50"
      >
        {status === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {status === 'saving' ? '저장 중...' : '이 섹션 저장'}
      </button>
      {status === 'saved' && (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary-ink"><CheckCircle2 className="w-3.5 h-3.5" /> 저장됨</span>
      )}
      {status === 'error' && (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600"><AlertCircle className="w-3.5 h-3.5" /> 저장 실패 — 인터넷 연결을 확인하고 다시 시도해 주세요.</span>
      )}
    </div>
  </section>
);

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, timeline, addTimelineItem, updateTimelineItem, deleteTimelineItem, getImageUrl } = useValueTogether();
  const [form, setForm] = useState(settings);
  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({});

  // 실제 Firestore 저장 결과(성공/실패)에 따라 상태를 갱신합니다. 이전에는
  // updateSettings() 호출 직후 무조건 "저장됨"을 띄웠는데, 그 경우 저장이
  // 실패해도 화면에는 성공한 것처럼 보이는 문제가 있었습니다.
  const runSave = async (section: string, mutate: () => Promise<boolean>) => {
    setSectionStatus((prev) => ({ ...prev, [section]: 'saving' }));
    const ok = await mutate();
    setSectionStatus((prev) => ({ ...prev, [section]: ok ? 'saved' : 'error' }));
    if (ok) {
      setTimeout(() => {
        setSectionStatus((prev) => (prev[section] === 'saved' ? { ...prev, [section]: 'idle' } : prev));
      }, 2000);
    }
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveBasic = () => runSave('basic', () => updateSettings({
    name: form.name, englishName: form.englishName, sloganMain: form.sloganMain, sloganSub: form.sloganSub,
    establishedYear: form.establishedYear, businessRegistrationNumber: form.businessRegistrationNumber, heroImageUrl: form.heroImageUrl,
  }));
  const saveGreeting = () => runSave('greeting', () => updateSettings({ representativeTitle: form.representativeTitle, representativeName: form.representativeName, representativeGreeting: form.representativeGreeting, representativeImageUrl: form.representativeImageUrl }));
  const saveIntro = () => runSave('intro', () => updateSettings({ purposeStatement: form.purposeStatement, introStatement: form.introStatement }));
  const saveContact = () => runSave('contact', () => updateSettings({ address: form.address, mapEmbedUrl: form.mapEmbedUrl, phone: form.phone, fax: form.fax, email: form.email, operatingHours: form.operatingHours }));
  const saveSns = () => runSave('sns', () => updateSettings({ snsLinks: form.snsLinks }));
  const saveBank = () => runSave('bank', () => updateSettings({ bankAccounts: form.bankAccounts }));
  const saveCoreValues = () => runSave('core', () => updateSettings({ coreValues: form.coreValues }));
  const savePrinciples = () => runSave('principles', () => updateSettings({ operatingPrinciples: form.operatingPrinciples }));
  const saveOrgChart = () => runSave('org', () => updateSettings({ orgChart: form.orgChart }));
  const saveStats = () => runSave('stats', () => updateSettings({ stats: form.stats }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-xl text-ink">기본정보 / 디자인 관리</h1>
        <p className="text-xs text-ink-soft mt-1">홈페이지 전반에 표시되는 기관 정보를 관리합니다. 섹션별로 저장 버튼을 눌러주세요.</p>
      </div>

      <SectionCard title="기본정보" status={sectionStatus['basic'] || 'idle'} onSave={saveBasic}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="단체명"><input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
          <Field label="영문명"><input className={inputCls} value={form.englishName} onChange={(e) => set('englishName', e.target.value)} /></Field>
          <Field label="설립연도"><input className={inputCls} value={form.establishedYear} onChange={(e) => set('establishedYear', e.target.value)} placeholder="예: 2024" /></Field>
          <Field label="사업자등록번호"><input className={inputCls} value={form.businessRegistrationNumber || ''} onChange={(e) => set('businessRegistrationNumber', e.target.value)} /></Field>
        </div>
        <Field label="메인 슬로건 (제목)"><input className={inputCls} value={form.sloganMain} onChange={(e) => set('sloganMain', e.target.value)} /></Field>
        <Field label="메인 슬로건 (부제)"><textarea className={inputCls} rows={2} value={form.sloganSub} onChange={(e) => set('sloganSub', e.target.value)} /></Field>
        
        <div className="pt-3 border-t border-line/70 space-y-2">
          <div>
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              인덱스(메인) 페이지 대표 배너 이미지
              <span className="text-[11px] font-normal text-secondary-ink">(Hero 메인 비주얼)</span>
            </span>
            <p className="text-[11px] text-ink-soft mt-0.5">
              홈페이지 첫 화면 최상단에 노출되는 대표 배너 이미지입니다. 원하는 사진을 업로드하거나 교체/삭제할 수 있으며, 저장 시 인덱스 페이지에 즉시 적용됩니다.
            </p>
          </div>
          <ImageUploadField
            label="배너 이미지 업로드 / 변경"
            value={form.heroImageUrl}
            onChange={(url) => set('heroImageUrl', url)}
            folder="settings"
            getImageUrl={getImageUrl}
          />
        </div>
      </SectionCard>

      <SectionCard title="대표자 인사말" status={sectionStatus['greeting'] || 'idle'} onSave={saveGreeting}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="대표자 직함"><input className={inputCls} value={form.representativeTitle} onChange={(e) => set('representativeTitle', e.target.value)} /></Field>
          <Field label="대표자 성함"><input className={inputCls} value={form.representativeName} onChange={(e) => set('representativeName', e.target.value)} /></Field>
        </div>
        <Field label="인사말"><textarea className={inputCls} rows={5} value={form.representativeGreeting || ''} onChange={(e) => set('representativeGreeting', e.target.value)} /></Field>
        <ImageUploadField label="대표자 사진" value={form.representativeImageUrl} onChange={(url) => set('representativeImageUrl', url)} folder="settings" aspect="aspect-square" getImageUrl={getImageUrl} />
      </SectionCard>

      <SectionCard title="조합 소개" status={sectionStatus['intro'] || 'idle'} onSave={saveIntro}>
        <Field label="설립 목적"><textarea className={inputCls} rows={3} value={form.purposeStatement || ''} onChange={(e) => set('purposeStatement', e.target.value)} /></Field>
        <Field label="조합 소개 문구"><textarea className={inputCls} rows={3} value={form.introStatement || ''} onChange={(e) => set('introStatement', e.target.value)} /></Field>
      </SectionCard>

      <SectionCard title="연락처 및 오시는 길" status={sectionStatus['contact'] || 'idle'} onSave={saveContact}>
        <Field label="주소"><input className={inputCls} value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <Field label="지도 embed URL (구글맵/네이버맵 iframe 주소)"><input className={inputCls} value={form.mapEmbedUrl || ''} onChange={(e) => set('mapEmbedUrl', e.target.value)} /></Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="전화"><input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          <Field label="팩스"><input className={inputCls} value={form.fax || ''} onChange={(e) => set('fax', e.target.value)} /></Field>
          <Field label="이메일"><input className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        </div>
        <Field label="운영시간"><input className={inputCls} value={form.operatingHours} onChange={(e) => set('operatingHours', e.target.value)} /></Field>
      </SectionCard>

      <SectionCard title="SNS 링크" status={sectionStatus['sns'] || 'idle'} onSave={saveSns}>
        <div className="grid sm:grid-cols-2 gap-4">
          {(['naver', 'facebook', 'instagram', 'youtube'] as const).map((key) => (
            <Field key={key} label={key}>
              <input className={inputCls} value={form.snsLinks?.[key] || ''} onChange={(e) => set('snsLinks', { ...form.snsLinks, [key]: e.target.value })} placeholder="https://" />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="후원계좌" description="후원·기부 안내에 사용할 조합 명의 계좌 정보입니다." status={sectionStatus['bank'] || 'idle'} onSave={saveBank}>
        <ListEditor<BankAccount>
          items={form.bankAccounts || []}
          onChange={(items) => set('bankAccounts', items)}
          newItem={(): BankAccount => ({ bank: '', accountNumber: '', holder: '' })}
          renderRow={(item, update) => (
            <div className="grid sm:grid-cols-3 gap-2 flex-1">
              <input className={inputCls} placeholder="은행명" value={item.bank} onChange={(e) => update({ ...item, bank: e.target.value })} />
              <input className={inputCls} placeholder="계좌번호" value={item.accountNumber} onChange={(e) => update({ ...item, accountNumber: e.target.value })} />
              <input className={inputCls} placeholder="예금주" value={item.holder} onChange={(e) => update({ ...item, holder: e.target.value })} />
            </div>
          )}
          addLabel="계좌 추가"
        />
      </SectionCard>

      <SectionCard title="핵심가치 4카드 (실사 이미지 및 설명)" description="메인 페이지 상단에 노출되는 핵심가치 4대 카드의 대표 실사 이미지, 제목, 설명을 관리합니다." status={sectionStatus['core'] || 'idle'} onSave={saveCoreValues}>
        <div className="space-y-4">
          {form.coreValues.map((cv, idx) => (
            <div key={cv.id} className="bg-paper rounded-2xl p-4 border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary-ink bg-primary-soft px-2.5 py-1 rounded-md uppercase">
                  {cv.icon}
                </span>
                <span className="text-xs text-ink-soft font-medium">카드 #{idx + 1}</span>
              </div>
              <div className="grid sm:grid-cols-[1fr_2fr] gap-3">
                <div>
                  <label className="text-xs font-bold text-ink mb-1 block">카드 제목 (예: 사람, 함께 등)</label>
                  <input
                    className={inputCls}
                    value={cv.title}
                    onChange={(e) => {
                      const next = [...form.coreValues];
                      next[idx] = { ...cv, title: e.target.value };
                      set('coreValues', next);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink mb-1 block">사업 설명 문구</label>
                  <input
                    className={inputCls}
                    value={cv.description}
                    onChange={(e) => {
                      const next = [...form.coreValues];
                      next[idx] = { ...cv, description: e.target.value };
                      set('coreValues', next);
                    }}
                  />
                </div>
              </div>
              <div>
                <ImageUploadField
                  label="카드 대표 실사 사진 (미등록 시 기본 감성 실사 사진 자동 적용)"
                  value={cv.imageUrl || ''}
                  onChange={(url) => {
                    const next = [...form.coreValues];
                    next[idx] = { ...cv, imageUrl: url };
                    set('coreValues', next);
                  }}
                  folder="core-values"
                  aspect="aspect-square"
                  getImageUrl={getImageUrl}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="운영원칙" status={sectionStatus['principles'] || 'idle'} onSave={savePrinciples}>
        <ListEditor<OperatingPrinciple>
          items={form.operatingPrinciples}
          onChange={(items) => set('operatingPrinciples', items)}
          newItem={(): OperatingPrinciple => ({ id: `op-${Date.now()}`, title: '', description: '' })}
          renderRow={(item, update) => (
            <div className="grid sm:grid-cols-[1fr_2fr] gap-2 flex-1">
              <input className={inputCls} placeholder="제목" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} />
              <input className={inputCls} placeholder="설명" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} />
            </div>
          )}
          addLabel="운영원칙 추가"
        />
      </SectionCard>

      <SectionCard title="조직도" status={sectionStatus['org'] || 'idle'} onSave={saveOrgChart}>
        <ListEditor<OrgChartItem>
          items={form.orgChart}
          onChange={(items) => set('orgChart', items)}
          newItem={(): OrgChartItem => ({ id: `org-${Date.now()}`, department: '', role: '', description: '', order: form.orgChart.length + 1 })}
          renderRow={(item, update) => (
            <div className="grid sm:grid-cols-[1fr_1fr_2fr] gap-2 flex-1">
              <input className={inputCls} placeholder="조직 단위명" value={item.department} onChange={(e) => update({ ...item, department: e.target.value })} />
              <input className={inputCls} placeholder="직책" value={item.role || ''} onChange={(e) => update({ ...item, role: e.target.value })} />
              <input className={inputCls} placeholder="설명" value={item.description || ''} onChange={(e) => update({ ...item, description: e.target.value })} />
            </div>
          )}
          addLabel="조직 추가"
        />
      </SectionCard>

      <SectionCard title="실적 통계" description="입력하지 않은 항목은 메인 페이지에서 자동으로 숨겨집니다 (허위 수치 방지)." status={sectionStatus['stats'] || 'idle'} onSave={saveStats}>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            ['participantCount', '누적 참여 인원'],
            ['partnerCount', '협력기관 수'],
            ['programCount', '운영 사업 수'],
            ['cumulativeActivityCount', '누적 활동 건수'],
          ] as const).map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="number"
                className={inputCls}
                value={form.stats[key] ?? ''}
                onChange={(e) => set('stats', { ...form.stats, [key]: e.target.value === '' ? undefined : Number(e.target.value) })}
                placeholder="입력 없으면 표시 안 됨"
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <section className="bg-paper-card border border-line rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-ink text-base">연혁</h2>
        <TimelineEditor timeline={timeline} onAdd={addTimelineItem} onUpdate={updateTimelineItem} onDelete={deleteTimelineItem} />
      </section>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

function ListEditor<T extends object>({
  items, onChange, newItem, renderRow, addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderRow: (item: T, update: (next: T) => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={(item as { id?: string }).id ?? idx} className="flex items-start gap-2">
          {renderRow(item, (next) => {
            const copy = [...items]; copy[idx] = next; onChange(copy);
          })}
          <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="p-2.5 text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50 shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, newItem()])} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-ink bg-primary-soft px-3.5 py-2 rounded-lg hover:opacity-80">
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  );
}

const TimelineEditor: React.FC<{
  timeline: TimelineItem[];
  onAdd: (item: Omit<TimelineItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<TimelineItem>) => Promise<boolean>;
  onDelete: (id: string) => void;
}> = ({ timeline, onAdd, onUpdate, onDelete }) => {
  const [draft, setDraft] = useState<Omit<TimelineItem, 'id'>>({ year: '', title: '', description: '' });

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {[...timeline].sort((a, b) => (a.year < b.year ? 1 : -1)).map((item) => (
          <TimelineRow key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        {timeline.length === 0 && <p className="text-xs text-ink-soft py-4 text-center">등록된 연혁이 없습니다.</p>}
      </div>
      <div className="grid sm:grid-cols-[90px_1fr_2fr_auto] gap-2 items-start bg-primary-soft/30 rounded-xl p-3 border border-dashed border-primary-soft">
        <input className={inputCls} placeholder="연도" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
        <input className={inputCls} placeholder="제목" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <input className={inputCls} placeholder="설명" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <button
          type="button"
          onClick={() => { if (draft.year && draft.title) { onAdd(draft); setDraft({ year: '', title: '', description: '' }); } }}
          className="p-2.5 text-primary-ink hover:bg-primary-soft rounded-lg"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 연혁 한 줄. 예전에는 글자를 한 자 입력할 때마다 바로 Firestore에
// 저장했는데("마" → "마을" → "마을공" ... 입력할 때마다 매번 쓰기 발생),
// 다른 섹션들처럼 로컬에서 편집한 뒤 "저장" 버튼을 눌러야만 실제로
// 저장되도록 바꿨습니다. 변경 사항이 있을 때만 저장 버튼이 활성화됩니다.
const TimelineRow: React.FC<{
  item: TimelineItem;
  onUpdate: (id: string, item: Partial<TimelineItem>) => Promise<boolean>;
  onDelete: (id: string) => void;
}> = ({ item, onUpdate, onDelete }) => {
  const [local, setLocal] = useState({ year: item.year, title: item.title, description: item.description });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const isDirty = local.year !== item.year || local.title !== item.title || local.description !== item.description;

  // 다른 관리자가 같은 항목을 수정해 실시간으로 값이 바뀐 경우, 이 줄을
  // 아직 편집 중이 아니라면(= 변경 사항이 없다면) 최신 값을 반영합니다.
  // 편집 중(dirty)이라면 관리자가 입력하던 내용을 덮어쓰지 않습니다.
  React.useEffect(() => {
    if (!isDirty) {
      setLocal({ year: item.year, title: item.title, description: item.description });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.year, item.title, item.description]);

  const handleSave = async () => {
    setStatus('saving');
    const ok = await onUpdate(item.id, local);
    setStatus(ok ? 'saved' : 'error');
    if (ok) setTimeout(() => setStatus((cur) => (cur === 'saved' ? 'idle' : cur)), 1500);
  };

  return (
    <div className="space-y-1.5">
      <div className="grid sm:grid-cols-[90px_1fr_2fr_auto_auto] gap-2 items-start bg-paper rounded-xl p-3 border border-line">
        <input className={inputCls} value={local.year} onChange={(e) => setLocal((prev) => ({ ...prev, year: e.target.value }))} />
        <input className={inputCls} value={local.title} onChange={(e) => setLocal((prev) => ({ ...prev, title: e.target.value }))} />
        <input className={inputCls} value={local.description} onChange={(e) => setLocal((prev) => ({ ...prev, description: e.target.value }))} />
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || status === 'saving'}
          title={isDirty ? '변경 사항 저장' : '변경 사항 없음'}
          className="inline-flex items-center justify-center gap-1.5 min-w-[68px] px-3 py-2.5 text-xs font-bold text-primary-ink bg-primary-soft rounded-lg hover:opacity-80 disabled:opacity-35 disabled:hover:opacity-35"
        >
          {status === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {status === 'saving' ? '저장 중' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          title="연혁 삭제"
          className="inline-flex items-center justify-center gap-1.5 min-w-[68px] px-3 py-2.5 text-xs font-bold text-ink-soft hover:text-red-600 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          삭제
        </button>
      </div>
      <div className="min-h-[18px] px-1 text-[11px] font-semibold" aria-live="polite">
        {status === 'saved' && <span className="text-secondary-ink inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 홈페이지 반영 완료</span>}
        {status === 'error' && <span className="text-red-600 inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" /> 저장 실패 — 다시 시도해 주세요.</span>}
        {status === 'idle' && isDirty && <span className="text-ink-soft">변경 사항이 있습니다. <strong>저장</strong> 버튼을 눌러 홈페이지에 반영하세요.</span>}
      </div>
    </div>
  );
};
