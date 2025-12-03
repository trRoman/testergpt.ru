 "use client";

import { Container, Stack, Typography, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error ?? "Ошибка входа");
			}
			router.replace("/admin");
		} catch (err: any) {
			setError(err?.message ?? "Ошибка входа");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="sm" className="bg-[#1D2630] rounded-xl p-10">
				<Stack spacing={2} alignItems="stretch" textAlign="center">
					<Typography variant="h4" component="h1" fontWeight={600} sx={{ color: "common.white" }}>
						Вход
					</Typography>
					{error && <Alert severity="error">{error}</Alert>}
					<form onSubmit={onSubmit}>
						<Stack spacing={2}>
							<TextField
								label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								fullWidth
								variant="outlined"
								InputLabelProps={{ sx: { color: "#9e9e9e" } }}
								InputProps={{ sx: { color: "common.white" } }}
								sx={{
									"& .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
									"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
								}}
							/>
							<TextField
								label="Пароль"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								fullWidth
								variant="outlined"
								InputLabelProps={{ sx: { color: "#9e9e9e" } }}
								InputProps={{ sx: { color: "common.white" } }}
								sx={{
									"& .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
									"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9e9e9e" },
								}}
							/>
							<Button type="submit" variant="contained" disabled={loading}>
								{loading ? "Вход..." : "Войти"}
							</Button>
						</Stack>
					</form>
				</Stack>
			</Container>
		</div>
	);
}


