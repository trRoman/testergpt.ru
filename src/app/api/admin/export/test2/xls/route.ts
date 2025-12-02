import { NextResponse } from "next/server";
import db from "@/lib/sqlite";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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
      "Время чтения (сек)",
      "Балл доверия",
      "Кнопка источника",
      "Время в модалке (сек)",
      "В модалке > 5 с",
      "Клик ссылки",
      "Дата",
    ];

    const rowsHtml = rows
      .map((r) => {
        const readSec = (Number(r.readingTimeMs) / 1000).toFixed(2);
        const modalSec = (Number(r.timeInSourceModalMs) / 1000).toFixed(2);
        return `<tr>
  <td>${esc(r.participantId)}</td>
  <td>${esc(r.tone)}</td>
  <td>${esc(r.plotTopic)}</td>
  <td>${esc(r.taskNumber)}</td>
  <td>${esc(r.sequenceNumber)}</td>
  <td>${esc(readSec)}</td>
  <td>${esc(r.trustScore)}</td>
  <td>${esc(r.sourceButtonClicked ? "Да" : "Нет")}</td>
  <td>${esc(modalSec)}</td>
  <td>${esc(r.timeInSourceModalGt5Sec ? "Да" : "Нет")}</td>
  <td>${esc(r.linkClicked ? "Да" : "Нет")}</td>
  <td>${esc(new Date(r.createdAt).toISOString())}</td>
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


