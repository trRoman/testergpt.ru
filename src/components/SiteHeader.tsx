"use client";

import Link from "next/link";
import { AppBar, Toolbar, Container, Stack, Button, Typography } from "@mui/material";

export default function SiteHeader() {
	return (
		<AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", color: "common.white" }}>
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ py: 1 }}>
					<Stack
						direction={{ xs: "row", sm: "row" }}
						spacing={{ xs: 1, sm: 2 }}
						alignItems={{ xs: "center", sm: "center" }}
						justifyContent="space-between"
						sx={{ width: "100%" }}
					>
						<Typography variant="h6" component={Link} href="/" sx={{ color: "common.white", textDecoration: "none" }}>
							Testergpt
						</Typography>
						<Stack direction="row" spacing={1}>
							<Button
								component={Link}
								href="/"
								color="inherit"
								sx={{
									border: "1px solid transparent",
									transition: "all .2s ease",
									"&:hover": {
										borderColor: "common.white",
										transform: "translateY(-2px)",
										bgcolor: "action.hover",
									},
									"&:active": { transform: "translateY(0)" },
								}}
							>
								Главная
							</Button>
							<Button
								component={Link}
								href="/login"
								variant="outlined"
								color="inherit"
								sx={{
									borderColor: "transparent",
									transition: "all .2s ease",
									"&:hover": {
										borderColor: "common.white",
										bgcolor: "rgba(255,255,255,0.08)",
										transform: "translateY(-2px)",
									},
									"&:active": { transform: "translateY(0)" },
								}}
							>
								Вход
							</Button>
						</Stack>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
}


