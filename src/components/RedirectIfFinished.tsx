"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectIfFinished() {
	const router = useRouter();
	useEffect(() => {
		try {
			// Если есть незавершённый тест 2 — продолжаем его
			const t2raw = window.localStorage.getItem("test2_session");
			if (t2raw) {
				const t2 = JSON.parse(t2raw) as { started?: boolean; finished?: boolean };
				if (t2?.started && !t2?.finished) {
					router.replace("/test2");
					return;
				}
			}
			// Если есть незавершённый тест 1 — продолжаем его
			const t1raw = window.localStorage.getItem("test1_progress");
			if (t1raw) {
				const t1 = JSON.parse(t1raw) as { started?: boolean; finished?: boolean };
				if (t1?.started && !t1?.finished) {
					router.replace("/test1");
					return;
				}
			}
			// Если всё завершено — на страницу завершения
			const flag = window.localStorage.getItem("finishedAll");
			if (flag === "1") {
				router.replace("/finished");
			}
		} catch {
			// ignore
		}
	}, [router]);
	return null;
}


