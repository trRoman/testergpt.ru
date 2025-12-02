import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthConfig, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		if (typeof email !== "string" || typeof password !== "string") {
			return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
		}
		const cfg = getAuthConfig();
		const okEmail =
			email.length === cfg.email.length &&
			crypto.timingSafeEqual(Buffer.from(email), Buffer.from(cfg.email));
		const okPass =
			password.length === cfg.password.length &&
			crypto.timingSafeEqual(Buffer.from(password), Buffer.from(cfg.password));
		if (!okEmail || !okPass) {
			return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
		}

		// Вычисляем флаг secure для cookie: если за прокси и приходит https — включаем,
		// иначе (на голом http) выключаем, чтобы браузер принял cookie.
		const forwardedProto = req.headers.get("x-forwarded-proto");
		const envSecure = (process.env.COOKIE_SECURE ?? "").toLowerCase();
		const secure =
			envSecure === "true"
				? true
				: envSecure === "false"
				? false
				: forwardedProto
				? forwardedProto.split(",")[0].trim() === "https"
				: false;

		const now = Math.floor(Date.now() / 1000);
		const exp = now + 60 * 60 * 24 * 7; // 7 days
		const token = signToken({ sub: email, iat: now, exp });
		const res = NextResponse.json({ ok: true });
		res.cookies.set("session", token, {
			httpOnly: true,
			sameSite: "lax",
			secure,
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
		return res;
	} catch {
		return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
	}
}


