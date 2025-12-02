"use client";

import { Container, Stack, Typography } from "@mui/material";

export default function SiteFooter() {
	const year = new Date().getFullYear();
	return (
		<footer>
			<Container maxWidth="lg" sx={{ py: 2 }}>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={1}
					alignItems={{ xs: "flex-start", sm: "center" }}
					justifyContent="space-between"
					sx={{ color: "common.white" }}
				>
					<Typography variant="body2">
						{year} · testergpt.ru
					</Typography>
					<Typography variant="body2">
						Разработчик{" "}
						<a href="https://yaRoman.ru" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
							yaRoman.ru
						</a>
					</Typography>
				</Stack>
			</Container>
		</footer>
	);
}


