import ExcelJS from 'exceljs';
import { NoticeAttachment, ParticipationApplication, ContactInquiry } from '../types';

/**
 * Utility function to download attached files in notices.
 *
 * `file.url` is always an https download URL from Firebase Storage
 * (getDownloadURL) — never a locally-generated fake file. `<a download>`
 * on a cross-origin URL can be ignored by the browser (it may just open a
 * new tab instead of naming the download), so we fetch the real bytes as a
 * blob first and download that, which preserves the original file name.
 * Falls back to opening the URL directly if the fetch itself fails (e.g.
 * a rare Storage CORS hiccup) — the visitor still gets the real file.
 */
export const downloadNoticeFile = async (file: NoticeAttachment) => {
  const fileName = file.name || '첨부파일';

  if (!file.url) {
    console.warn('downloadNoticeFile: 첨부파일 주소가 없습니다.', file);
    return;
  }

  if (file.url.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  try {
    const res = await fetch(file.url);
    if (!res.ok) throw new Error(`파일을 가져오지 못했습니다 (HTTP ${res.status})`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn('downloadNoticeFile: fetch 다운로드 실패, 새 탭에서 원본 열기로 대체합니다.', err);
    window.open(file.url, '_blank', 'noopener,noreferrer');
  }
};

const COLORS = {
  header: 'FF3A6B54', // brand secondary (pine green)
  headerBorder: 'FF274A39',
  summaryHeaderBg: 'FFF2F4F7',
  summaryBorder: 'FFD0D5DD',
  greenFill: 'FFE6F4EA',
  greenText: 'FF008000',
  amberFill: 'FFFEF7E0',
  amberText: 'FFB9832A',
  grayFill: 'FFF8FAFC',
  borderLight: 'FFE2E8F0',
  textMain: 'FF1E293B',
  textMuted: 'FF4A5568',
};

const BORDERS = {
  thinGray: {
    top: { style: 'thin' as const, color: { argb: COLORS.summaryBorder } },
    bottom: { style: 'thin' as const, color: { argb: COLORS.summaryBorder } },
    left: { style: 'thin' as const, color: { argb: COLORS.summaryBorder } },
    right: { style: 'thin' as const, color: { argb: COLORS.summaryBorder } },
  },
  tableData: {
    top: { style: 'thin' as const, color: { argb: COLORS.borderLight } },
    bottom: { style: 'thin' as const, color: { argb: COLORS.borderLight } },
    left: { style: 'thin' as const, color: { argb: COLORS.borderLight } },
    right: { style: 'thin' as const, color: { argb: COLORS.borderLight } },
  },
};

const styleCellRange = (
  ws: ExcelJS.Worksheet,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  style: {
    fill?: ExcelJS.Fill;
    font?: Partial<ExcelJS.Font>;
    alignment?: Partial<ExcelJS.Alignment>;
    border?: Partial<ExcelJS.Borders>;
  }
) => {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = ws.getCell(r, c);
      if (style.fill) cell.fill = style.fill;
      if (style.font) cell.font = style.font;
      if (style.alignment) cell.alignment = style.alignment;
      if (style.border) cell.border = style.border;
    }
  }
};

const fileDateStamp = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

const displayDateStamp = (d: Date) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/**
 * Exports "협력 및 참여" applications (조합원가입/자원봉사/후원협력/기관협력)
 * to a formatted .xlsx workbook, one tab per type plus an "전체" tab.
 */
export const exportParticipationsToExcel = async (
  applications: ParticipationApplication[],
  orgName: string
) => {
  const now = new Date();
  const byType = (type: ParticipationApplication['type']) => applications.filter((a) => a.type === type);

  const sheetDefinitions: { name: string; title: string; data: ParticipationApplication[] }[] = [
    { name: '전체', title: '전체 참여 신청', data: applications },
    { name: '조합원가입', title: '조합원 가입 신청', data: byType('조합원가입') },
    { name: '자원봉사', title: '자원봉사 신청', data: byType('자원봉사') },
    { name: '후원협력', title: '후원·협력 신청', data: byType('후원협력') },
    { name: '기관협력', title: '기관 협력 신청', data: byType('기관협력') },
  ];

  const workbook = new ExcelJS.Workbook();

  sheetDefinitions.forEach((sheetDef) => {
    const ws = workbook.addWorksheet(sheetDef.name, { views: [{ showGridLines: true }] });
    ws.columns = [
      { key: 'colA', width: 7 },
      { key: 'colB', width: 16 },
      { key: 'colC', width: 26 },
      { key: 'colD', width: 16 },
      { key: 'colE', width: 20 },
      { key: 'colF', width: 42 },
      { key: 'colG', width: 22 },
    ];

    ws.mergeCells('A1:G2');
    ws.getCell('A1').value = `${orgName} ${sheetDef.title} 명단`;
    ws.getRow(1).height = 22;
    ws.getRow(2).height = 22;
    styleCellRange(ws, 1, 1, 2, 7, {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } },
      font: { name: '맑은 고딕', size: 15, bold: true, color: { argb: 'FFFFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
    });

    ws.mergeCells('A3:G3');
    ws.getCell('A3').value = `출력일시: ${displayDateStamp(now)}  |  총 제출 건수: ${sheetDef.data.length}건`;
    ws.getRow(3).height = 20;
    styleCellRange(ws, 3, 1, 3, 7, {
      font: { name: '맑은 고딕', size: 9.5, italic: true, color: { argb: COLORS.textMuted } },
      alignment: { horizontal: 'right', vertical: 'middle' },
    });

    ws.getRow(4).height = 10;
    ws.getRow(5).height = 28;
    const headers = ['연번', '성함/단체명', '연락처/이메일', '구분', '소속기관', '전달내용', '신청일시'];
    headers.forEach((h, idx) => (ws.getCell(5, idx + 1).value = h));
    styleCellRange(ws, 5, 1, 5, 7, {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } },
      font: { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FFFFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: COLORS.headerBorder } },
        bottom: { style: 'thin', color: { argb: COLORS.headerBorder } },
        left: { style: 'thin', color: { argb: COLORS.headerBorder } },
        right: { style: 'thin', color: { argb: COLORS.headerBorder } },
      },
    });

    if (sheetDef.data.length === 0) {
      ws.getRow(6).height = 24;
      ['-', '접수 내역 없음', '-', '-', '-', `접수된 ${sheetDef.title} 내역이 없습니다.`, '-'].forEach((v, i) => {
        ws.getCell(6, i + 1).value = v;
      });
      styleCellRange(ws, 6, 1, 6, 7, {
        font: { name: '맑은 고딕', size: 10, color: { argb: COLORS.textMuted } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: BORDERS.tableData,
      });
    } else {
      sheetDef.data.forEach((item, index) => {
        const rowNum = 6 + index;
        const contact = [item.phone, item.email].filter(Boolean).join(' / ') || '-';
        ws.getCell(`A${rowNum}`).value = index + 1;
        ws.getCell(`B${rowNum}`).value = item.name || '-';
        ws.getCell(`C${rowNum}`).value = contact;
        ws.getCell(`D${rowNum}`).value = item.type;
        ws.getCell(`E${rowNum}`).value = item.organization || '-';
        ws.getCell(`F${rowNum}`).value = item.message || '-';
        ws.getCell(`G${rowNum}`).value = item.createdAt || '-';
        ws.getRow(rowNum).height = 24;
        styleCellRange(ws, rowNum, 1, rowNum, 7, {
          font: { name: '맑은 고딕', size: 10, color: { argb: COLORS.textMain } },
          alignment: { horizontal: 'center', vertical: 'middle' },
          border: BORDERS.tableData,
        });
        ws.getCell(`F${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      });
    }
  });

  const fileName = `${orgName}_참여신청명단_${fileDateStamp(now)}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** Exports 문의(일반/사업/협력) to a formatted .xlsx workbook. */
export const exportInquiriesToExcel = async (inquiries: ContactInquiry[], orgName: string) => {
  const now = new Date();
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('문의사항 목록', { views: [{ showGridLines: true }] });

  ws.columns = [
    { key: 'colA', width: 7 },
    { key: 'colB', width: 14 },
    { key: 'colC', width: 12 },
    { key: 'colD', width: 18 },
    { key: 'colE', width: 26 },
    { key: 'colF', width: 45 },
    { key: 'colG', width: 12 },
    { key: 'colH', width: 12 },
    { key: 'colI', width: 20 },
  ];

  ws.mergeCells('A1:I2');
  ws.getCell('A1').value = `${orgName} 홈페이지 문의사항 접수 명단`;
  ws.getRow(1).height = 22;
  ws.getRow(2).height = 22;
  styleCellRange(ws, 1, 1, 2, 9, {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } },
    font: { name: '맑은 고딕', size: 15, bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
  });

  ws.mergeCells('A3:I3');
  ws.getCell('A3').value = `출력일시: ${displayDateStamp(now)}  |  총 접수 건수: ${inquiries.length}건`;
  ws.getRow(3).height = 20;
  styleCellRange(ws, 3, 1, 3, 9, {
    font: { name: '맑은 고딕', size: 9.5, italic: true, color: { argb: COLORS.textMuted } },
    alignment: { horizontal: 'right', vertical: 'middle' },
  });

  ws.getRow(4).height = 10;
  ws.getRow(5).height = 28;
  const headers = ['연번', '성함', '연락처', '이메일', '유형', '제목', '내용', '상태', '접수일시'];
  headers.forEach((h, idx) => (ws.getCell(5, idx + 1).value = h));
  styleCellRange(ws, 5, 1, 5, 9, {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.header } },
    font: { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
  });

  if (inquiries.length === 0) {
    ws.getRow(6).height = 24;
    ['-', '접수 내역 없음', '-', '-', '-', '-', '접수된 문의사항이 없습니다.', '-', '-'].forEach((v, i) => {
      ws.getCell(6, i + 1).value = v;
    });
    styleCellRange(ws, 6, 1, 6, 9, {
      font: { name: '맑은 고딕', size: 10, color: { argb: COLORS.textMuted } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: BORDERS.tableData,
    });
  } else {
    inquiries.forEach((inq, index) => {
      const rowNum = 6 + index;
      ws.getCell(`A${rowNum}`).value = index + 1;
      ws.getCell(`B${rowNum}`).value = inq.name || '-';
      ws.getCell(`C${rowNum}`).value = inq.phone || '-';
      ws.getCell(`D${rowNum}`).value = inq.email || '-';
      ws.getCell(`E${rowNum}`).value = inq.type || '-';
      ws.getCell(`F${rowNum}`).value = inq.subject || '-';
      ws.getCell(`G${rowNum}`).value = inq.message || '-';
      ws.getCell(`H${rowNum}`).value = inq.status || '대기중';
      ws.getCell(`I${rowNum}`).value = inq.createdAt || '-';
      ws.getRow(rowNum).height = 24;
      styleCellRange(ws, rowNum, 1, rowNum, 9, {
        font: { name: '맑은 고딕', size: 10, color: { argb: COLORS.textMain } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: BORDERS.tableData,
      });
      ws.getCell(`G${rowNum}`).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      if (inq.status === '답변완료') {
        ws.getCell(`H${rowNum}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.greenFill } };
        ws.getCell(`H${rowNum}`).font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: COLORS.greenText } };
      } else {
        ws.getCell(`H${rowNum}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.amberFill } };
        ws.getCell(`H${rowNum}`).font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: COLORS.amberText } };
      }
    });
  }

  const fileName = `${orgName}_문의사항접수명단_${fileDateStamp(now)}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
