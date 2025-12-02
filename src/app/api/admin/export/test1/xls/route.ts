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
        `SELECT participantId, questionNumber, answerInput, readingTimeMs, answerScore, totalScore, createdAt
         FROM "Test1Result"
         ORDER BY createdAt DESC`,
      )
      .all() as Array<{
        participantId: string;
        questionNumber: number;
        answerInput: string;
        readingTimeMs: number;
        answerScore: number;
        totalScore: number;
        createdAt: string;
      }>;

    const header = [
      "ID участника",
      "№ вопроса",
      "Введённый ответ",
      "Время чтения (сек)",
      "Балл ответа",
      "Сумма баллов",
      "Дата",
    ];

    const rowsHtml = rows
      .map((r) => {
        const sec = (Number(r.readingTimeMs) / 1000).toFixed(2);
        return `<tr>
  <td>${esc(r.participantId)}</td>
  <td>${esc(r.questionNumber)}</td>
  <td>${esc(r.answerInput)}</td>
  <td>${esc(sec)}</td>
  <td>${esc(r.answerScore)}</td>
  <td>${esc(r.totalScore)}</td>
  <td>${esc(new Date(r.createdAt).toISOString())}</td>
</tr>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Test1 Export</title></head>
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
        "Content-Disposition": `attachment; filename="test1_results.xls"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}


