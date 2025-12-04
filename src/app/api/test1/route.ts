import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			participantId,
			questionNumber,
			answerInput,
			readingTimeMs,
			answerScore,
			totalScore,
			createdAtLocal,
		} = body ?? {};

		if (
			typeof participantId !== "string" ||
			typeof questionNumber !== "number" ||
			typeof answerInput !== "string" ||
			typeof readingTimeMs !== "number" ||
			typeof answerScore !== "number" ||
			typeof totalScore !== "number"
		) {
			return NextResponse.json(
				{ error: "Неверные данные запроса" },
				{ status: 400 },
			);
		}

		const hasClientTime = typeof createdAtLocal === "string" && createdAtLocal.length >= 8;
		const sql = hasClientTime
			? `INSERT INTO "Test1Result"
        ("participantId","questionNumber","answerInput","readingTimeMs","answerScore","totalScore","createdAt")
        VALUES (@participantId,@questionNumber,@answerInput,@readingTimeMs,@answerScore,@totalScore,@createdAt)`
			: `INSERT INTO "Test1Result"
        ("participantId","questionNumber","answerInput","readingTimeMs","answerScore","totalScore")
        VALUES (@participantId,@questionNumber,@answerInput,@readingTimeMs,@answerScore,@totalScore)`;
		const stmt = db.prepare(sql);
		const result = stmt.run(
			hasClientTime
				? {
						participantId,
						questionNumber,
						answerInput,
						readingTimeMs,
						answerScore,
						totalScore,
						createdAt: createdAtLocal,
				  }
				: {
						participantId,
						questionNumber,
						answerInput,
						readingTimeMs,
						answerScore,
						totalScore,
				  },
		);

		return NextResponse.json({ id: Number(result.lastInsertRowid) });
	} catch (error) {
		return NextResponse.json(
			{ error: "Не удалось сохранить результат" },
			{ status: 500 },
		);
	}
}


