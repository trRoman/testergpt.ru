import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";

export async function POST(req: NextRequest) {
	// 1) Проверка типа содержимого
	const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
	if (!contentType.includes("application/json")) {
		return NextResponse.json({ error: "Требуется application/json" }, { status: 415 });
	}

	// 2) Безопасный парсинг JSON (ошибка парсинга → 400)
	let body: any;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
	}

	// 3) Валидация
	const participantId: string = body?.participantId;
	const age: number = Number(body?.age);
	const gender: string = String(body?.gender ?? "");
	const education: string = String(body?.education ?? "");
	const llmUsage: string = String(body?.llmUsage ?? "");
	const createdAtLocal: string | undefined = body?.createdAtLocal;

	if (!participantId || !Number.isFinite(age) || age < 18 || age > 99 || !gender || !education || !llmUsage) {
		return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
	}

	// 4) Запись в БД (ошибки БД → 500)
	try {
		if (createdAtLocal && typeof createdAtLocal === "string" && createdAtLocal.length >= 8) {
			const stmt = db.prepare(
				`INSERT INTO "Survey" (participantId, age, gender, education, llmUsage, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
			);
			stmt.run(participantId, age, gender, education, llmUsage, createdAtLocal);
		} else {
			const stmt = db.prepare(
				`INSERT INTO "Survey" (participantId, age, gender, education, llmUsage) VALUES (?, ?, ?, ?, ?)`,
			);
			stmt.run(participantId, age, gender, education, llmUsage);
		}
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
	}
}


