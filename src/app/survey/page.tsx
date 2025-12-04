// src/app/survey/page.tsx
// Минимальная анкета для участия в исследовании

"use client";

import { useEffect, useState } from "react";
import { Container, Stack, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

const EDUCATION_OPTIONS = [
	"Среднее общее (школа)",
	"Среднее профессиональное (колледж / техникум)",
	"Неоконченное высшее",
	"Высшее (бакалавриат)",
	"Высшее (специалитет / магистратура)",
	"Ученая степень (кандидат / доктор наук)",
	"Другое",
];

const USAGE_OPTIONS = [
	"никогда не пользовался(ась)",
	"пробовал(а) пару раз",
	"использую примерно раз в месяц",
	"использую несколько раз в неделю",
	"использую почти каждый день",
];

export default function SurveyPage() {
	const router = useRouter();
	const [participantId, setParticipantId] = useState<string | null>(null);
	const [age, setAge] = useState<string>("");
	const [gender, setGender] = useState<"женский" | "мужской" | "">("");
	const [education, setEducation] = useState<string>("");
	const [llmUsage, setLlmUsage] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const existing = window.localStorage.getItem("participantId");
		if (existing) {
			setParticipantId(existing);
		} else {
			// Создаём идентификатор сразу, как на страницах тестов
			const fallback = Math.random().toString(36).slice(2);
			window.localStorage.setItem("participantId", fallback);
			setParticipantId(fallback);
		}
	}, []);

	const ageNum = Number(age);
	const ageValid = Number.isFinite(ageNum) && ageNum >= 18 && ageNum <= 99;
	const canSubmit = ageValid && gender && education && llmUsage && !!participantId && !submitting;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit || !participantId) return;
		setError(null);
		setSubmitting(true);
		const buildClientLocalTimestamp = () => {
			const d = new Date();
			const pad = (v: number) => String(v).padStart(2, "0");
			const Y = d.getFullYear();
			const M = pad(d.getMonth() + 1);
			const D = pad(d.getDate());
			const h = pad(d.getHours());
			const m = pad(d.getMinutes());
			const s = pad(d.getSeconds());
			// DD-MM-YYYY HH:mm:ss (локальное время пользователя)
			return `${D}-${M}-${Y} ${h}:${m}:${s}`;
		};
		try {
			const res = await fetch("/api/survey", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					participantId,
					age: ageNum,
					gender,
					education,
					llmUsage,
					createdAtLocal: buildClientLocalTimestamp(),
				}),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error ?? "Не удалось сохранить анкету");
			}
			router.replace("/test1");
		} catch (err: any) {
			setError(err?.message ?? "Не удалось сохранить анкету");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="md" className="rounded-xl p-10">
				<Stack spacing={3}>
					<Typography variant="h4" component="h1" fontWeight={700} sx={{ color: "common.white" }}>
						Мини-анкета
					</Typography>
					<Typography variant="body1" sx={{ color: "common.white" }}>
						Пожалуйста, ответьте на несколько вопросов перед началом первого блока заданий. Все поля обязательны.
					</Typography>
					{error && <Alert severity="error">{error}</Alert>}
					<form onSubmit={handleSubmit}>
						<Stack spacing={3}>
							<TextField
								label="Возраст"
								type="number"
								inputProps={{ min: 18, max: 99 }}
								value={age}
								onChange={(e) => setAge(e.target.value)}
								error={Boolean(age) && !ageValid}
								required
								fullWidth
								variant="outlined"
								helperText={!age || ageValid ? " " : "Допустимый диапазон 18–99"}
								FormHelperTextProps={{ sx: { color: !age || ageValid ? "inherit" : "error.main" } }}
								sx={{
									"& .MuiInputBase-input": { color: "common.white" },
									"& .MuiInputLabel-root": { color: "#9e9e9e" },
									"& .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
									"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
								}}
							/>

							<FormControl component="fieldset">
								<Typography variant="subtitle1" sx={{ color: "common.white", mb: 1 }}>
									Пол
								</Typography>
								<RadioGroup
									row
									value={gender}
									onChange={(e) => setGender(e.target.value as "женский" | "мужской")}
								>
									<FormControlLabel
										value="женский"
										control={<Radio sx={{ color: "common.white", "&.Mui-checked": { color: "primary.main" } }} />}
										label="женский"
										sx={{ color: "common.white" }}
									/>
									<FormControlLabel
										value="мужской"
										control={<Radio sx={{ color: "common.white", "&.Mui-checked": { color: "primary.main" } }} />}
										label="мужской"
										sx={{ color: "common.white" }}
									/>
								</RadioGroup>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel id="education-label" sx={{ color: "#9e9e9e" }}>
									Образование
								</InputLabel>
								<Select
									labelId="education-label"
									value={education}
									label="Образование"
									onChange={(e) => setEducation(e.target.value)}
									required
									sx={{
										color: "common.white",
										"& .MuiSelect-icon": { color: "common.white" },
										"& .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
										"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
										"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
									}}
									MenuProps={{
										PaperProps: {
											sx: { bgcolor: "background.paper", color: "common.white" },
										},
									}}
								>
									{EDUCATION_OPTIONS.map((opt) => (
										<MenuItem key={opt} value={opt} sx={{ color: "common.white" }}>
											{opt}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel id="llm-label" sx={{ color: "#9e9e9e" }}>
									Опыт использования нейросетей / LLM
								</InputLabel>
								<Select
									labelId="llm-label"
									value={llmUsage}
									label="Опыт использования нейросетей / LLM"
									onChange={(e) => setLlmUsage(e.target.value)}
									required
									sx={{
										color: "common.white",
										"& .MuiSelect-icon": { color: "common.white" },
										"& .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
										"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
										"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "common.white" },
									}}
									MenuProps={{
										PaperProps: {
											sx: { bgcolor: "background.paper", color: "common.white" },
										},
									}}
								>
									{USAGE_OPTIONS.map((opt) => (
										<MenuItem key={opt} value={opt} sx={{ color: "common.white" }}>
											{opt}
										</MenuItem>
									))}
								</Select>
							</FormControl>

								<Stack direction="row" justifyContent="flex-end">
								<Button
									type="submit"
									variant="contained"
									disabled={!canSubmit}
									sx={{
										"&.Mui-disabled": {
											backgroundColor: "#9e9e9e",
											color: "#ffffff",
										},
									}}
								>
									Перейти к тесту
								</Button>
							</Stack>
						</Stack>
					</form>
				</Stack>
			</Container>
		</div>
	);
}


