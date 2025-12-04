import { NextResponse } from "next/server";
import db from "@/lib/sqlite";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const fmtDate = (value: string) => {
  if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(value)) return value;
  const tryFormat = (d: Date) => {
    if (isNaN(d.getTime())) return String(value ?? "");
    const pad = (v: number) => String(v).padStart(2, "0");
    const DD = pad(d.getDate());
    const MM = pad(d.getMonth() + 1);
    const YYYY = d.getFullYear();
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${DD}-${MM}-${YYYY} ${hh}:${mm}:${ss}`;
  };
  const cleaned = value.replace(/ UTC[+-]\d{2}:\d{2}$/, "");
  let d = new Date(cleaned.replace(" ", "T"));
  if (!isNaN(d.getTime())) return tryFormat(d);
  d = new Date(value);
  return tryFormat(d);
};

export async function GET() {
  try {
    const rows = db
      .prepare(
        `SELECT participantId, age, gender, education, llmUsage, createdAt
         FROM "Survey"
         ORDER BY id DESC`,
      )
      .all() as Array<{
        participantId: string;
        age: number;
        gender: string;
        education: string;
        llmUsage: string;
        createdAt: string;
      }>;

    const header = [
      "ID участника",
      "Возраст",
      "Пол",
      "Образование",
      "Опыт LLM",
      "Дата",
    ];

    const rowsHtml = rows
      .map((r) => {
        return `<tr>
  <td>${esc(r.participantId)}</td>
  <td>${esc(r.age)}</td>
  <td>${esc(r.gender)}</td>
  <td>${esc(r.education)}</td>
  <td>${esc(r.llmUsage)}</td>
  <td>${esc(fmtDate(r.createdAt))}</td>
</tr>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Survey Export</title></head>
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
        "Content-Disposition": `attachment; filename="survey_results.xls"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}


