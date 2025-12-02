"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

function createEmotionCache() {
	const cache = createCache({ key: "mui", prepend: true });
	cache.compat = true;
	return cache;
}

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	const [{ cache, flush }] = React.useState(() => {
		const cache = createEmotionCache();
		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = function (selector: any, serialized: any, sheet: any, shouldCache: any) {
			if ((cache.inserted as Record<string, string>)[serialized.name] === undefined) {
				inserted.push(serialized.name);
			}
			return (prevInsert as any)(selector, serialized, sheet, shouldCache);
		} as any;
		const flush = () => {
			const prev = inserted;
			inserted = [];
			return prev;
		};
		return { cache, flush };
	});

	useServerInsertedHTML(() => {
		const names = flush();
		if (names.length === 0) {
			return null;
		}
		let styles = "";
		for (const name of names) {
			styles += (cache.inserted as Record<string, string>)[name];
		}
		return (
			<style
				data-emotion={`${cache.key} ${names.join(" ")}`}
				dangerouslySetInnerHTML={{ __html: styles }}
			/>
		);
	});

	return <CacheProvider value={cache}>{children}</CacheProvider>;
}


