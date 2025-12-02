import { NextResponse } from "next/server";
import db from "@/lib/sqlite";

export async function GET() {
  try {
    const rows = db
      .prepare(
        `SELECT participantId, tone, plotTopic, taskNumber, sequenceNumber, readingTimeMs, trustScore, sourceButtonClicked, timeInSourceModalMs, timeInSourceModalGt5Sec, linkClicked, createdAt
         FROM "Test2Result"
         ORDER BY createdAt DESC`
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

    const esc = (v: unknown) =>
      `"${String(v ?? "").replace(/"/g, '""')}"`;

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

    const lines = [header.map(esc).join(",")];
    for (const r of rows) {
      const readSec = (Number(r.readingTimeMs) / 1000).toFixed(2);
      const modalSec = (Number(r.timeInSourceModalMs) / 1000).toFixed(2);
      lines.push(
        [
          r.participantId,
          r.tone,
          r.plotTopic,
          r.taskNumber,
          r.sequenceNumber,
          readSec,
          r.trustScore,
          r.sourceButtonClicked ? "Да" : "Нет",
          modalSec,
          r.timeInSourceModalGt5Sec ? "Да" : "Нет",
          r.linkClicked ? "Да" : "Нет",
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
        "Content-Disposition": `attachment; filename="test2_results.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}


