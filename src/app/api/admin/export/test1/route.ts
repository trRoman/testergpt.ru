import { NextResponse } from "next/server";
import db from "@/lib/sqlite";

export async function GET() {
  try {
    const rows = db
      .prepare(
        `SELECT participantId, questionNumber, answerInput, readingTimeMs, answerScore, totalScore, createdAt
         FROM "Test1Result"
         ORDER BY createdAt DESC`
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

    const esc = (v: unknown) =>
      `"${String(v ?? "").replace(/"/g, '""')}"`;

    const header = [
      "ID участника",
      "№ вопроса",
      "Введённый ответ",
      "Время чтения (сек)",
      "Балл ответа",
      "Сумма баллов",
      "Дата",
    ];

    const lines = [header.map(esc).join(",")];
    for (const r of rows) {
      const sec = (Number(r.readingTimeMs) / 1000).toFixed(2);
      lines.push(
        [
          r.participantId,
          r.questionNumber,
          r.answerInput,
          sec,
          r.answerScore,
          r.totalScore,
          new Date(r.createdAt).toISOString(),
        ]
          .map(esc)
          .join(",")
      );
    }

    const csv = lines.join("\r\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="test1_results.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}


