import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("session")?.value;
		if (!token || !verifyToken(token)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const body = await req.json().catch(() => ({}));
		const id = Number(body?.id);
		if (!Number.isFinite(id) || id <= 0) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}
		db.prepare(`DELETE FROM "Survey" WHERE id = ?`).run(id);
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}


