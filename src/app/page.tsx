// .\src\app\page.tsx
// этот файл содержит код для главной страницы

import Link from "next/link";
import RedirectIfFinished from "@/components/RedirectIfFinished";
import {
	Container,
	Stack,
	Typography,
	Button,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";

export default function Home() {
  return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="md" className="rounded-xl p-10">
				<RedirectIfFinished />
				<Stack spacing={4} alignItems="center" textAlign="center">
					<Typography variant="h3" component="h1" fontWeight={600}>
						Добро пожаловать!
					</Typography>
					<Stack
						maxWidth="lg"
						sx={{
							p: "1.6rem",
							gap: "1.6rem",
							borderRadius: "30px",
							bgcolor: "background.paper",
						}}
					>
						<Typography variant="h5" component="h2" fontWeight={500} sx={{ color: "common.white" }}>
							Здравствуйте!
						</Typography>
						<Typography variant="body1" sx={{ color: "common.white" }}>
							Этот онлайн-эксперимент проводится в рамках магистерской диссертации и посвящён
							изучению того, как люди воспринимают и оценивают ответы генеративного искусственного интеллекта.
						</Typography>
						<Typography variant="body1" sx={{ color: "common.white" }}>
							Участие в исследовании займет примерно 20–25 минут.
						</Typography>
						<div className="text-left">
							<Typography variant="body1" sx={{ color: "common.white" }}>Все ваши ответы будут:</Typography>
							<List
								component="ul"
								sx={{ listStyleType: "disc", pl: 3 }}
							>
								<ListItem sx={{ display: "list-item" }}>
									<ListItemText
										primary="использоваться только в обобщённом виде для научных целей;"
									/>
								</ListItem>
								<ListItem sx={{ display: "list-item" }}>
									<ListItemText
										primary="обрабатываться анонимно — личные данные не собираются и не передаются третьим лицам;"
									/>
								</ListItem>
								<ListItem sx={{ display: "list-item" }}>
									<ListItemText
										primary="вы в любой момент можете прекратить участие, просто закрыв страницу, без каких-либо последствий."
									/>
								</ListItem>
							</List>
						</div>
						<Typography variant="body1" color="text.primary" fontWeight={500} sx={{ color: "common.white" }}>
							Если вы согласны принять участие в исследовании, пожалуйста, нажмите кнопку «Начать».
						</Typography>
					</Stack>
					<Link href="/test1">
						<Button variant="contained" color="primary" size="large">
							Начать
						</Button>
					</Link>
				</Stack>
			</Container>
		</div>
  );
}
