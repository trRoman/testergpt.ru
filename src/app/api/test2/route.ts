import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";

const ToneAllowed = new Set(["NEUTRAL", "CONFIDENT"]);
const TopicAllowed = new Set(["PELMENI", "SLEZHKA", "MENZURA", "DISTANCE"]);

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			participantId,
			tone,
			plotTopic,
			taskNumber,
			sequenceNumber,
			readingTimeMs,
			trustScore,
			sourceButtonClicked = false,
			timeInSourceModalMs = 0,
			timeInSourceModalGt5Sec = false,
			linkClicked = false,
		} = body ?? {};

		if (typeof participantId !== "string") {
			return NextResponse.json({ error: "participantId обязателен" }, { status: 400 });
		}

		const toneNorm = typeof tone === "string" ? tone.toUpperCase() : "";
		const topicNorm = typeof plotTopic === "string" ? plotTopic.toUpperCase() : "";

		if (!ToneAllowed.has(toneNorm) || !TopicAllowed.has(topicNorm)) {
			return NextResponse.json(
				{ error: "Некорректные значения tone или plotTopic" },
				{ status: 400 },
			);
		}

		if (
			typeof taskNumber !== "number" ||
			typeof sequenceNumber !== "number" ||
			typeof readingTimeMs !== "number" ||
			typeof trustScore !== "number"
		) {
			return NextResponse.json(
				{ error: "Неверные данные запроса" },
				{ status: 400 },
			);
		}

		if (trustScore < 1 || trustScore > 10) {
			return NextResponse.json(
				{ error: "trustScore должен быть от 1 до 10" },
				{ status: 400 },
			);
		}

		const stmt = db.prepare(
			`INSERT INTO "Test2Result"
      ("participantId","tone","plotTopic","taskNumber","sequenceNumber","readingTimeMs","trustScore","sourceButtonClicked","timeInSourceModalMs","timeInSourceModalGt5Sec","linkClicked")
      VALUES (@participantId,@tone,@plotTopic,@taskNumber,@sequenceNumber,@readingTimeMs,@trustScore,@sourceButtonClicked,@timeInSourceModalMs,@timeInSourceModalGt5Sec,@linkClicked)`,
		);
		const result = stmt.run({
			participantId,
			tone: toneNorm,
			plotTopic: topicNorm,
			taskNumber,
			sequenceNumber,
			readingTimeMs,
			trustScore,
			sourceButtonClicked: sourceButtonClicked ? 1 : 0,
			timeInSourceModalMs: Number(timeInSourceModalMs) || 0,
			timeInSourceModalGt5Sec: timeInSourceModalGt5Sec ? 1 : 0,
			linkClicked: linkClicked ? 1 : 0,
		});

		return NextResponse.json({ id: Number(result.lastInsertRowid) });
	} catch (error) {
		return NextResponse.json(
			{ error: "Не удалось сохранить результат" },
			{ status: 500 },
		);
	}
}


