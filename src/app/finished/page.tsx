// src/app/finished/page.tsx
// Эта страница отображается после того, как пользователь прошел тестирование

import { Container, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function FinishedPage() {
	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="md" className="rounded-xl p-10" sx={{ bgcolor: "background.paper" }}>
				<Stack spacing={3} alignItems="center" textAlign="center">
					<Typography variant="h4" component="h1" fontWeight={700} sx={{ color: "common.white" }}>
						Вы уже прошли тестирование. Спасибо!
					</Typography>
					<Typography variant="body1" sx={{ color: "common.white" }}>
						Спасибо, что нашли время, включились в задания и помогли науке чуть лучше понять, как люди взаимодействуют с нейросетями.
					</Typography>
					<Stack direction="row" spacing={2} justifyContent="center">
						<Link href="/">
							<Button variant="outlined">Обновить</Button>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}


