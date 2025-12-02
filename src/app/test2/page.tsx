 // .\src\app\test2\page.tsx
 // этот файл содержит код для страницы теста 2
 
 "use client";

import { Container, Stack, Typography, Button, Slider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Tone = "NEUTRAL" | "CONFIDENT";
type PlotTopic = "PELMENI" | "SLEZHKA" | "MENZURA" | "DISTANCE";

type BaseQuestion = {
	id: number;
	plotTopic: PlotTopic;
	neutralText: string;
	confidentText: string;
	neutralVerify?: string;
	confidentVerify?: string;
};

type SessionQuestion = {
	id: number;
	plotTopic: PlotTopic;
	tone: Tone;
	text: string;
};

const BASE_QUESTIONS: BaseQuestion[] = [
	{
		id: 1,
		plotTopic: "SLEZHKA",
		neutralText: `Представьте, что вы берёте телефон партнёра «просто посмотреть мем», а через минуту уже листаете его переписку. Кто-то узнаёт в этом свой опыт, кто-то — истории друзей. Для одних это кажется естественной проверкой: если отношения серьёзные и скрывать нечего, доступ к сообщениям воспринимается как часть близости и способ успокоить тревогу.

Другие, напротив, описывают такие ситуации как вторжение в личное пространство, даже если снаружи всё выглядит спокойно. Похожие вопросы возникают и вокруг отслеживания геолокации, просмотра «онлайна» в мессенджерах, чтения комментариев в соцсетях.

В цифровой среде граница между интересом, заботой, ревностью и контролем часто ощущается не сразу. То, как люди относятся к чтению переписки и слежке, нередко зависит от их предыдущего опыта, договорённостей в паре и того, насколько каждому важно сохранять часть пространства только для себя.`,
		confidentText: `Представьте ситуацию: вы просыпаетесь среди ночи и тянетесь к телефону партнёра «просто проверить, с кем он переписывался». Если это знакомо вам или вашим друзьям, важно сказать прямо: тайное чтение переписок и слежка в цифровой среде не являются нормой здоровых отношений.

Это не про любовь и не про заботу, это про недоверие и контроль. Каждый раз, когда вы берёте чужой телефон без согласия, вы фактически сообщаете: «Твоих слов мне недостаточно, я буду проверять». Со временем это разрушает доверие, усиливает тревогу и формирует привычку жить в режиме постоянной подозрительности.

Зрелые отношения строятся иначе. В них открыто обсуждают ревность и страхи, договариваются о границах и форматах открытости. Если без скрытых проверок уже «невозможно успокоиться», это сигнал не продолжать слежку, а разобраться, что на самом деле происходит в этих отношениях.`,
		neutralVerify: "Проверочная информация для вопроса 1 (нейтральный тон).",
		confidentVerify: "Проверочная информация для вопроса 1 (уверенный тон).",
	},
	{
		id: 2,
		plotTopic: "MENZURA",
		neutralText: `Мензурное фехтование — это особый тип студенческого поединка в немецкоязычной традиции. Двое участников стоят почти неподвижно на небольшой дистанции и наносят удары по заранее оговорённым траекториям, в основном по лицу. Горло, плечи и рука закрыты плотной защитой, а щёки и лоб намеренно остаются открытыми, чтобы порезы и шрамы были хорошо заметны.

Для многих студентов главным становился не сам «выигрыш», а шрам — знак смелости, выдержки и принадлежности к определённому кругу. Внутри братства это выглядело как почётный опыт, подтверждение того, что человек «не струсил». Снаружи же легко увидеть и другую сторону: давление группы, ожидание, что ради признания нужно рисковать внешностью и здоровьем.

Такой пример показывает, как социальные нормы могут подталкивать людей соглашаться на болезненные или опасные практики, чтобы не «выпасть» из своего сообщества и сохранить статус «настоящего» своего.`,
		confidentText: `Как психолог, изучающий молодежные субкультуры, я могу сказать однозначно: мензурное фехтование — наглядный пример того, как норма группы заставляет людей сознательно идти на риск. В этих поединках двое студентов стоят почти неподвижно на тесной площадке и наносят удары узкими клинками по голове и лицу. Горло и плечи защищены толстой тканью, а лоб и щёки оставляют открытыми именно затем, чтобы порезы были глубокими и заметными.

Цель мензуры — не победить соперника, а получить шрам, тот самый Schmiss, который внутри братства считается доказательством мужества и «настоящей» принадлежности к сообществу. Отказаться от участия означает риск потерять уважение и статус.

Этот пример ясно показывает, как давление окружения и ожидания «быть своим» могут вынуждать человека соглашаться на боль и опасность ради признания и страха оказаться чужим.`,
		neutralVerify: "Проверочная информация для вопроса 2 (нейтральный тон).",
		confidentVerify: "Проверочная информация для вопроса 2 (уверенный тон).",
	},
	{
		id: 3,
		plotTopic: "PELMENI",
		neutralText: `Для многих людей вечер с пельменями — это не только про вкус, но и про ощущение завершённого дня. Тарелка горячих пельменей даёт плотное, понятное чувство сытости: после них реже тянет «дожёвывать» печеньем или хлебом перед самым сном.

Тёплая еда перед сном может создавать ощущение физического комфорта: тело получает энергию, желудок заполнен, и уже не отвлекает урчанием, когда вы ложитесь в кровать и пытаетесь уснуть. Пельмени в этом смысле удобны — их легко приготовить, порцию можно более-менее рассчитать, а сочетание теста и начинки надолго убирает чувство голода.

Некоторые отмечают, что им проще заснуть именно после небольшого, но сытного позднего ужина, чем если лечь спать голодными. В таком случае порция пельменей перед сном может выполнять вполне практичную функцию — помогать избежать ночных перекусов и сделать вечерний приём пищи более предсказуемым.`,
		confidentText: `Пельмени на ночь обычно ругают, но давайте говорить честно: при нормальном здоровье это вполне может быть рабочий вечерний вариант. Плотная порция тёплой еды даёт чёткий сигнал организму: день завершён, можно успокаиваться. Углеводы из теста и белок из начинки вместе создают устойчивое ощущение сытости, которое не рушится через час, как от случайного печенья или сладкого чая.

Есть и практический момент: пельмени готовятся быстро и предсказуемо, вы точно знаете, сколько съели и из чего это состоит. Это лучше хаотичных перекусов «всё, что нашлось в холодильнике перед сном». Тёплая, привычная еда к тому же помогает многим легче расслабиться и снять вечернее напряжение.

Разумеется, речь идёт об адекватной порции и отсутствии медицинских противопоказаний, но сама по себе идея «поздних пельменей» не обязана быть чем-то страшным — при разумном подходе это просто удобный и сытный вечерний приём пищи.`,
		neutralVerify: "Проверочная информация для вопроса 3 (нейтральный тон).",
		confidentVerify: "Проверочная информация для вопроса 3 (уверенный тон).",
	},
	{
		id: 4,
		plotTopic: "DISTANCE",
		neutralText: `Иногда всё выглядит так: пока человек рядом, вы можете относиться к отношениям спокойнее. Но как только он начинает устанавливать дистанцию — реже писать, откладывать встречи, говорить, что ему нужно «меньше общения» — внимание будто резко сужается именно на нём.

То, что раньше казалось обычным, вдруг начинает восприниматься как особенно ценное: каждое сообщение, редкий звонок, короткая встреча. Контраст между «как было» и «как стало» усиливает ощущение, что вы что-то теряете, и именно поэтому тянуться ещё сильнее кажется естественным вариантом — попыткой вернуть прежнюю близость или хотя бы понять, что вообще происходит между вами сейчас.`,
		confidentText: `Когда человек начинает отдаляться, вы тянетесь сильнее не случайно — это закономерная реакция. Пока связь кажется устойчивой, вы чувствуете себя относительно спокойно. Но как только другой говорит «мне нужно меньше общения», реже отвечает или становится холоднее, возникает ощущение потери контроля.

Ваше внимание тут же концентрируется на нём: сообщения пишутся чаще, каждое молчание считывается как сигнал опасности, любые крохи внимания воспринимаются как особая ценность. Контраст «раньше было ближе — сейчас дальше» делает эту фигуру почти главной в вашем внутреннем фокусе.

Именно поэтому при дистанции так легко начинать тянуться, писать, доказывать, что вы «достаточно хороший» для этих отношений, вместо того чтобы остановиться и честно спросить себя: что именно мне сейчас дают, а что я пытаюсь удержать любой ценой?`,
		neutralVerify: "Проверочная информация для вопроса 4 (нейтральный тон).",
		confidentVerify: "Проверочная информация для вопроса 4 (уверенный тон).",
	},
];

function shuffle<T>(arr: T[]): T[] {
	return arr
		.map((v) => [Math.random(), v] as const)
		.sort((a, b) => a[0] - b[0])
		.map(([, v]) => v);
}

function buildSessionQuestions(): SessionQuestion[] {
	const ids = [1, 2, 3, 4];
	const shuffledIds = shuffle(ids);
	const neutralIds = new Set(shuffledIds.slice(0, 2));
	const session: SessionQuestion[] = BASE_QUESTIONS.map((q) => {
		const tone: Tone = neutralIds.has(q.id) ? "NEUTRAL" : "CONFIDENT";
		const text = tone === "NEUTRAL" ? q.neutralText : q.confidentText;
		return {
			id: q.id,
			plotTopic: q.plotTopic,
			tone,
			text,
		};
	});
	return shuffle(session);
}

export default function Test2Page() {
	const router = useRouter();
	const [participantId, setParticipantId] = useState<string | null>(null);
	const [started, setStarted] = useState(false);
	const [questions, setQuestions] = useState<SessionQuestion[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [trust, setTrust] = useState<number | null>(null);
	const [questionStartMs, setQuestionStartMs] = useState<number | null>(null);
	const [verifyOpen, setVerifyOpen] = useState(false);
	const [verifyOpenedAt, setVerifyOpenedAt] = useState<number | null>(null);
	const [verifyTimeMs, setVerifyTimeMs] = useState(0);
	const [sourceButtonClicked, setSourceButtonClicked] = useState(false);
	const [linkClicked, setLinkClicked] = useState(false);
	const [finished, setFinished] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		const existing = window.localStorage.getItem("participantId");
		if (existing) {
			setParticipantId(existing);
		} else {
			fetch("/api/participant", { method: "POST" })
				.then((r) => r.json())
				.then((data) => {
					if (data?.participantId) {
						window.localStorage.setItem("participantId", data.participantId);
						setParticipantId(data.participantId);
					}
				})
				.catch(() => {
					const fallback = Math.random().toString(36).slice(2);
					window.localStorage.setItem("participantId", fallback);
					setParticipantId(fallback);
				});
		}
	}, []);

	const current = useMemo(
		() => (questions.length > 0 ? questions[currentIndex] : null),
		[questions, currentIndex],
	);

	function handleStart() {
		setQuestions(buildSessionQuestions());
		setStarted(true);
		setFinished(false);
		setTrust(null);
		setQuestionStartMs(Date.now());
		setVerifyOpen(false);
		setVerifyOpenedAt(null);
		setVerifyTimeMs(0);
		setSourceButtonClicked(false);
		setLinkClicked(false);
	}

	async function handleNext() {
		if (!current) return;
		const readingTimeMs =
			questionStartMs !== null ? Date.now() - questionStartMs : 0;

		try {
			await fetch("/api/test2", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					participantId: participantId ?? "unknown",
					tone: current.tone,
					plotTopic: current.plotTopic,
					taskNumber: current.id,
					sequenceNumber: currentIndex + 1,
					readingTimeMs,
					trustScore: trust,
					sourceButtonClicked,
					timeInSourceModalMs: verifyTimeMs,
					timeInSourceModalGt5Sec: verifyTimeMs >= 5000,
					linkClicked,
				}),
			});
		} catch {}

		if (currentIndex < 3) {
			setCurrentIndex((i) => i + 1);
			setTrust(null);
			setQuestionStartMs(Date.now());
			setVerifyOpen(false);
			setVerifyOpenedAt(null);
			setVerifyTimeMs(0);
			setSourceButtonClicked(false);
			setLinkClicked(false);
		} else {
			setFinished(true);
			try {
				window.localStorage.setItem("finishedAll", "1");
			} catch {}
		}
	}

	function openVerify() {
		setSourceButtonClicked(true);
		setVerifyOpen(true);
		setVerifyOpenedAt(Date.now());
	}

	function closeVerify() {
		if (verifyOpenedAt !== null) {
			const dt = Date.now() - verifyOpenedAt;
			setVerifyTimeMs((t) => t + dt);
		}
		setVerifyOpen(false);
		setVerifyOpenedAt(null);
	}

	function openPreview(url: string) {
		setLinkClicked(true);
		setPreviewUrl(url);
		setPreviewOpen(true);
	}

	function closePreview() {
		setPreviewOpen(false);
		setPreviewUrl(null);
	}

	function renderVerifyContent() {
		if (!current) return null;
		// Вопрос 1 — специализированные источники
		if (current.id === 1) {
			return (
				<Stack spacing={2} sx={{ color: "common.white" }}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							1) «Чтение переписки близкого человека может разрушить отношения» — МГППУ
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Психологи объясняют, чем опасно чтение переписки без согласия и как это может разрушать доверие в паре.
						</Typography>
						<a
							href="https://mgppu.ru/news/2212"
							onClick={(e) => { e.preventDefault(); openPreview("https://mgppu.ru/news/2212"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть материал МГППУ
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							2) «Тайно читаете переписку партнёра? Узнайте, что это говорит про вас» — Psychologies
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Почему люди читают переписку партнёра, как это связано с недоверием и что это означает для отношений.
						</Typography>
						<a
							href="https://www.psychologies.ru/articles/taino-chitaete-perepisku-partnera-uznaite-chto-eto-govorit-pro-vas/"
							onClick={(e) => { e.preventDefault(); openPreview("https://www.psychologies.ru/articles/taino-chitaete-perepisku-partnera-uznaite-chto-eto-govorit-pro-vas/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью Psychologies
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							3) «Digital Dating Abuse: An Application of the Theory of Planned Behavior» — научная статья (PMC)
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Исследование о цифровом насилии в отношениях, включая мониторинг телефона и онлайн-активности партнёра.
						</Typography>
						<a
							href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10858624/"
							onClick={(e) => { e.preventDefault(); openPreview("https://pmc.ncbi.nlm.nih.gov/articles/PMC10858624/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть научную статью (PMC)
						</a>
					</Stack>
				</Stack>
			);
		}
		// Вопрос 2 — специализированные источники (мензура)
		if (current.id === 2) {
			return (
				<Stack spacing={2} sx={{ color: "common.white" }}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							1) «Мензурное фехтование: шрамы чести и студенческие дуэли» — Stoneforest
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Исторический обзор: как проходили поединки, зачем нужны шрамы, экипировка и эволюция отношения к мензуре.
						</Typography>
						<a
							href="https://stoneforest.ru/event/history/menzurnoe-fextovanie/"
							onClick={(e) => { e.preventDefault(); openPreview("https://stoneforest.ru/event/history/menzurnoe-fextovanie/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью Stoneforest
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							2) «Die Waffen Hoch! The Resiliency of Academic Fencing in Germany» — исследование (EN)
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Подробная работа о традиции академического фехтования: мотивации, социальный контекст и устойчивость практики.
						</Typography>
						<a
							href="https://ekladata.com/QjwVHL3PEazKN208wMXT57n--kQ/Die-Waffen-Hoch-The-Resiliency-of-Academic-Fencing-in-Germany.pdf"
							onClick={(e) => { e.preventDefault(); openPreview("https://ekladata.com/QjwVHL3PEazKN208wMXT57n--kQ/Die-Waffen-Hoch-The-Resiliency-of-Academic-Fencing-in-Germany.pdf"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть исследование (PDF)
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							3) «Мензурное фехтование: искусство немецких студентов» — Diletant.media
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Популярная статья: корпорации, правила боя, символика шрамов и место мензуры в культуре студенчества.
						</Typography>
						<a
							href="https://diletant.media/articles/45344069/"
							onClick={(e) => { e.preventDefault(); openPreview("https://diletant.media/articles/45344069/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью Diletant.media
						</a>
					</Stack>
				</Stack>
			);
		}
		// Вопрос 3 — специализированные источники (еда перед сном / пельмени)
		if (current.id === 3) {
			return (
				<Stack spacing={2} sx={{ color: "common.white" }}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							1) «Перед сном: 7 исследований о том, стоит ли есть на ночь» — WorldClassMag
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Краткий обзор научных исследований о влиянии поздних приёмов пищи на сон, вес и самочувствие.
						</Typography>
						<a
							href="https://worldclassmag.com/food/pered-snom-7-issledovanii-o-tom-stoit-li-est-na-noch/"
							onClick={(e) => { e.preventDefault(); openPreview("https://worldclassmag.com/food/pered-snom-7-issledovanii-o-tom-stoit-li-est-na-noch/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью WorldClassMag
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							2) «Nutrition, Eating Behavior, and Sleep: A Narrative Review» — Applied Sciences (EN)
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Научный обзор связей между питанием, временем приёмов пищи и качеством сна.
						</Typography>
						<a
							href="https://www.mdpi.com/2076-3417/14/15/6701"
							onClick={(e) => { e.preventDefault(); openPreview("https://www.mdpi.com/2076-3417/14/15/6701"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть научную статью Applied Sciences
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							3) «Эндокринолог Прокопенко рассказала, что съесть на ночь, чтобы утолить голод» — Doctorpiter
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Комментарий эндокринолога о том, почему тяжёлый поздний ужин не рекомендуют и какие лёгкие варианты перекуса безопаснее.
						</Typography>
						<a
							href="https://doctorpiter.ru/obraz-zhizni/endokrinolog-prokopenko-rasskazala-chto-sest-na-noch-chtoby-utolit-golod-id885712/"
							onClick={(e) => { e.preventDefault(); openPreview("https://doctorpiter.ru/obraz-zhizni/endokrinolog-prokopenko-rasskazala-chto-sest-na-noch-chtoby-utolit-golod-id885712/"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть материал Doctorpiter
						</a>
					</Stack>
				</Stack>
			);
		}
		// Вопрос 4 — специализированные источники (дистанция/привязанность)
		if (current.id === 4) {
			return (
				<Stack spacing={2} sx={{ color: "common.white" }}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							1) Падун М.А. «Тип привязанности и угрозы безопасности в супружеских отношениях» — eLIBRARY
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Связь тревожного/избегающего типа привязанности с ревностью, страхом потери и риском внебрачных связей.
						</Typography>
						<a
							href="https://elibrary.ru/item.asp?id=30053796"
							onClick={(e) => { e.preventDefault(); openPreview("https://elibrary.ru/item.asp?id=30053796"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью на eLIBRARY
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							2) Karabanova O.A., Shevlyakova E.V. — International Research Journal
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Как типы привязанности влияют на устойчивость и адаптацию семьи к стрессам, близость и дистанцию партнёров.
						</Typography>
						<a
							href="https://research-journal.org/archive/11-125-2022-november/10.23670/IRJ.2022.125.108"
							onClick={(e) => { e.preventDefault(); openPreview("https://research-journal.org/archive/11-125-2022-november/10.23670/IRJ.2022.125.108"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть статью International Research Journal
						</a>
					</Stack>

					<Stack spacing={0.5}>
						<Typography variant="subtitle1" sx={{ color: "common.white" }}>
							3) Conradi H.J. et al. — Australian and New Zealand Journal of Family Therapy (Wiley)
						</Typography>
						<Typography variant="body2" sx={{ color: "common.white" }}>
							Физическая дистанция между партнёрами как маркер особенностей привязанности и тревоги отвержения.
						</Typography>
						<a
							href="https://onlinelibrary.wiley.com/doi/full/10.1002/anzf.1398"
							onClick={(e) => { e.preventDefault(); openPreview("https://onlinelibrary.wiley.com/doi/full/10.1002/anzf.1398"); }}
							style={{ color: "#4da3ff", textDecoration: "underline", cursor: "pointer" }}
						>
							Открыть научную статью (Wiley)
						</a>
					</Stack>
				</Stack>
			);
		}
		// По умолчанию — текст из базы (заглушки)
		const base = BASE_QUESTIONS.find((q) => q.id === current.id);
		const fallback =
			current.tone === "NEUTRAL"
				? base?.neutralVerify ?? "Проверочная информация (нейтральный тон)."
				: base?.confidentVerify ?? "Проверочная информация (уверенный тон).";
		return (
			<Typography variant="body1" sx={{ color: "common.white" }}>
				{fallback}
			</Typography>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<Container maxWidth="md" className="bg-white dark:bg-black rounded-xl p-10">
				<Typography variant="h4" component="h1" fontWeight={600}>
					Тестирование 2
				</Typography>
				<Stack
					spacing={3}
					maxWidth="lg"
					sx={{
						my: "1.6rem",
						p: "1.6rem",
						gap: "1.6rem",
						borderRadius: "30px",
						bgcolor: "background.paper",
					}}
				>
					{!started ? (
						<Typography variant="body1" component="div" sx={{ color: "common.white" }}>
							Спасибо! Вы завершили первый блок заданий.<br /><br />
							Сейчас начнётся вторая часть исследования.<br /><br />
							Вам будет предложено 4 коротких текста, сгенерированных нейросетью. В каждом из них описана ситуация или фрагмент информации.<br /><br />
							В каждом задании:<br /><br />
							1. Внимательно прочитайте текст.<br /><br />
							2. Оцените по шкале от 1 до 10, насколько вы доверяете этому ответу и ориентировались бы на него в реальной жизни (1 — совсем не доверяю, 10 — полностью доверяю).<br /><br />
							3. При желании вы можете нажать «Проверить источники», чтобы ознакомиться с дополнительной информацией (это необязательно).<br /><br />
							Всего 4 задания. Пожалуйста, отвечайте так, как действительно чувствуете: здесь нет «правильных» или «неправильных» ответов — важна ваша личная оценка.
						</Typography>
					) : finished ? (
						<Stack spacing={2}>
							<Typography variant="h5" fontWeight={700} sx={{ color: "common.white" }}>
								Спасибо, что прошли это исследование!
							</Typography>
							<Typography variant="body1" sx={{ color: "common.white", whiteSpace: "pre-line" }}>
								{`Вы завершили оба блока заданий, и ваши ответы уже стали частью реального научного проекта — магистерской работы по киберпсихологии.

В первой части вы решали короткие задачки, которые в исследованиях используют для изучения особенностей мышления и того, как люди проверяют свои первые интуитивные ответы.

Во второй части вы читали тексты, сгенерированные нейросетью, и оценивали, насколько доверяете им и стали бы на них опираться.

Отдельные результаты по каждому участнику не выдаются и не используются как личная «оценка» — для анализа важны только общие данные всей группы. Но без вашего участия этого исследования просто не было бы.

Если вам будет интересно узнать об общих результатах исследования после его завершения, вы можете написать автору работы на e-mail: karinagunter@yandex.ru

Спасибо, что нашли время, включились в задания и помогли науке чуть лучше понять, как люди взаимодействуют с нейросетями.`}
							</Typography>
						</Stack>
					) : current ? (
						<>
							<Typography variant="subtitle1" fontWeight={600} sx={{ color: "common.white" }}>
								Вопрос {currentIndex + 1} из 4
							</Typography>
							<Typography variant="body1" sx={{ color: "common.white", whiteSpace: "pre-line" }}>
								{current.text}
							</Typography>
							<Stack spacing={1}>
								<Typography sx={{ color: "common.white" }}>
									Выберите балл доверия (1 — минимально, 10 — максимально):
								</Typography>
								<Slider
									min={1}
									max={10}
									step={1}
									marks
									value={trust ?? 0}
									onChange={(_, v) => setTrust(Array.isArray(v) ? v[0] : (v as number))}
									valueLabelDisplay="auto"
								/>
							</Stack>
							{trust !== null && (
								<Stack direction="row" spacing={2}>
									<Button variant="outlined" onClick={openVerify}>
										Проверить источники
									</Button>
								</Stack>
							)}
						</>
					) : null}
				</Stack>
				{!started ? (
					<Stack direction="column" spacing={2} alignItems="center">
						<Typography
							variant="body1"
							align="center"
							sx={{ color: "common.white" }}
						>
							Если вы согласны, нажмите кнопку
						</Typography>
						<Button variant="contained" onClick={handleStart}>
							Начать
						</Button>
					</Stack>
				) : finished ? null : (
					<Stack direction="row" spacing={2} justifyContent="flex-end">
						<Button
							variant="contained"
							onClick={handleNext}
							disabled={trust === null}
							sx={{
								"&.Mui-disabled": {
									backgroundColor: "#9e9e9e",
									color: "#ffffff",
								},
							}}
						>
							Дальше
						</Button>
					</Stack>
				)}

				<Dialog
					open={verifyOpen}
					onClose={closeVerify}
					fullWidth
					maxWidth="md"
					PaperProps={{
						sx: {
							borderRadius: "30px",
							bgcolor: "background.paper",
							color: "common.white",
						},
					}}
				>
					<DialogTitle sx={{ color: "common.white" }}>Проверочная информация</DialogTitle>
					<DialogContent dividers sx={{ color: "common.white" }}>{renderVerifyContent()}</DialogContent>
					<DialogActions>
						<Button onClick={closeVerify}>Закрыть</Button>
					</DialogActions>
				</Dialog>

			<Dialog
				open={previewOpen}
				onClose={closePreview}
				fullWidth
				maxWidth="lg"
				PaperProps={{
					sx: { bgcolor: "background.paper", color: "common.white", borderRadius: "30px" },
				}}
			>
				<DialogTitle sx={{ color: "common.white" }}>Просмотр источника</DialogTitle>
				<DialogContent dividers sx={{ p: 0 }}>
					{previewUrl ? (
						<iframe
							title="source-preview"
							src={previewUrl}
							style={{ width: "100%", height: "70vh", border: "none" }}
						/>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button onClick={closePreview}>Закрыть</Button>
				</DialogActions>
			</Dialog>
			</Container>
		</div>
	);
}


