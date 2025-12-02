"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectIfFinished() {
	const router = useRouter();
	useEffect(() => {
		try {
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


