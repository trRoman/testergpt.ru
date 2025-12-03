"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton, Tooltip } from "@mui/material";

type Props = {
	endpoint: string; // e.g. /api/admin/delete/test1
	id: number;
	confirmText?: string;
};

export default function AdminDeleteButton({ endpoint, id, confirmText = "Удалить запись?" }: Props) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function onDelete() {
		if (loading) return;
		// Простое подтверждение
		const ok = typeof window !== "undefined" ? window.confirm(confirmText) : false;
		if (!ok) return;
		setLoading(true);
		try {
			const res = await fetch(endpoint, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) {
				// no-op; в реальном проекте стоит показать ошибку
			}
		} finally {
			setLoading(false);
			router.refresh();
		}
	}

	// Используем простую "корзину" в виде символа, чтобы не тянуть иконки
	return (
		<Tooltip title="Удалить">
			<span>
				<IconButton
					onClick={onDelete}
					disabled={loading}
					size="small"
					sx={{ color: "error.light", "&:hover": { color: "error.main" } }}
				>
					<span role="img" aria-label="trash" style={{ fontSize: 16, lineHeight: 1 }}>
						🗑️
					</span>
				</IconButton>
			</span>
		</Tooltip>
	);
}


