import { NextResponse } from "next/server";
import db from "@/lib/sqlite";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const msToHms = (ms: number) => {
  const n = Number(ms);
  if (!Number.isFinite(n) || n < 0) return "00:00:00";
  const totalSec = Math.floor(n / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

export async function GET() {
  try {
    const rows = db
      .prepare(
        `SELECT participantId, tone, plotTopic, taskNumber, sequenceNumber, readingTimeMs, trustScore, sourceButtonClicked, timeInSourceModalMs, timeInSourceModalGt5Sec, linkClicked, createdAt
         FROM "Test2Result"
         ORDER BY createdAt DESC`,
      )
      .all() as Array<{
        participantId: string;
        tone: string;
        plotTopic: string;
        taskNumber: number;
        sequenceNumber: number;
        readingTimeMs: number;
        trustScore: number;
        sourceButtonClicked: number;
        timeInSourceModalMs: number;
        timeInSourceModalGt5Sec: number;
        linkClicked: number;
        createdAt: string;
      }>;

    const header = [
      "ID участника",
      "Тон",
      "Тема сюжета",
      "№ задания",
      "№ последовательности",
      "Время чтения (ч:м:с)",
      "Балл доверия",
      "Кнопка источника",
      "Время в модалке (ч:м:с)",
      "В модалке > 5 с",
      "Клик ссылки",
      "Дата",
    ];

    const rowsHtml = rows
      .map((r) => {
        const readHms = msToHms(r.readingTimeMs);
        const modalHms = msToHms(r.timeInSourceModalMs);
        return `<tr>
  <td>${esc(r.participantId)}</td>
  <td>${esc(r.tone)}</td>
  <td>${esc(r.plotTopic)}</td>
  <td>${esc(r.taskNumber)}</td>
  <td>${esc(r.sequenceNumber)}</td>
  <td>${esc(readHms)}</td>
  <td>${esc(r.trustScore)}</td>
  <td>${esc(r.sourceButtonClicked ? "Да" : "Нет")}</td>
  <td>${esc(modalHms)}</td>
  <td>${esc(r.timeInSourceModalGt5Sec ? "Да" : "Нет")}</td>
  <td>${esc(r.linkClicked ? "Да" : "Нет")}</td>
  <td>${esc(fmtDate(r.createdAt))}</td>
</tr>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Test2 Export</title></head>
<body>
  <table border="1" cellspacing="0" cellpadding="3">
    <thead><tr>${header.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="test2_results.xls"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}


