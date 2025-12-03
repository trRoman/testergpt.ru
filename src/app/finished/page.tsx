import { Container, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function FinishedPage() {
	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="md" className="bg-white dark:bg-black rounded-xl p-10">
				<Stack spacing={3} alignItems="center" textAlign="center">
					<Typography variant="h4" component="h1" fontWeight={700} sx={{ color: "common.white" }}>
						Вы уже прошли тестирование. Спасибо!
					</Typography>
					<Typography variant="body1" sx={{ color: "common.white" }}>
						Если хотите, вы можете вернуться на главную страницу.
					</Typography>
					<Stack direction="row" spacing={2} justifyContent="center">
						<Link href="/">
							<Button variant="outlined">На главную</Button>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}


