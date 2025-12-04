// ./src/app/test1/page.tsx
// 1. Импортируем необходимые компоненты из библиотеки Material-UI
"use client";

import { Container, Stack, Typography, Button, TextField } from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
	id: number;
	text: string;
};

const QUESTIONS: Question[] = [
	{
		id: 1,
		text:
			"У отца Мэри 5 дочерей, но ни одного сына. Четырёх дочерей зовут Нана, Нене, Нини, Ноно. Как могут звать пятую дочь?",
	},
	{
		id: 2,
		text:
			"Допустим, вы участвуете в забеге и обгоняете спортсмена, который бежит вторым, тогда на каком месте вы могли бы быть?",
	},
	{
		id: 3,
		text:
			"Ночью в шторм из аэропорта Нью-Йорка вылетел самолёт. Шторм усилился, и самолёт потерпел крушение – одна половина самолёта упала на территорию США, а другая половина – на территорию Канады. В какой стране похоронят выживших?",
	},
	{
		id: 4,
		text:
			"Если обезьяна, белка и птица доберутся до вершины кокосовой пальмы, кто получит банан первым – обезьяна, белка или птица?",
	},
	{
		id: 5,
		text:
			"В одноэтажном розовом доме жил розовый человек, и у него был розовый кот, розовая рыбка, розовый компьютер, розовый стул, розовый стол, розовый телефон, розовый душ – всё было розовым! Какого цвета могли быть лестницы в этом доме?",
	},
	{
		id: 6,
		text:
			"Сколько животных каждого вида Моисей поместил в ковчег?",
	},
	{
		id: 7,
		text:
			"Ветер дует с востока на запад. Электропоезд идёт с запада на восток. В какую сторону летит дым из трубы поезда?",
	},
	{
		id: 8,
		text:
			"Допустим, у вас только одна спичка. Вы входите в тёмную комнату, в которой есть керосиновая лампа, бумага и дрова. Что вы зажжёте в первую очередь?",
	},
	{
		id: 9,
		text:
			"Можно ли считать мужчину порядочным, если он женится на сестре своей вдовы?",
	},
	{
		id: 10,
		text:
			"Какое предложение верно: а) «желток у яйца белый» или б) «желток в яйце белый»?",
	},
];

function normalizeAnswer(input: string): string {
	return input.trim().toLowerCase();
}

function evaluateAnswer(questionId: number, rawAnswer: string): boolean {
	const answer = normalizeAnswer(rawAnswer);
	const answerNoPunct = answer
		.replace(/[^\w\s\u0400-\u04FF]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (questionId === 1) {
		return answer === "мэри" || answer === "мери";
	}

	if (questionId === 2) {
		// Допустимые варианты: цифра 2 и словоформы "второе", "на втором", "2 место", "2е" и т.п.
		if (
			answer === "2" ||
			answer === "2е" ||
			answer === "2-е" ||
			answer === "2й" ||
			answer === "2-й" ||
			answer.includes("2 место") ||
			answer.includes("2-е место") ||
			answer.includes("на втором") ||
			answer.includes("второе") ||
			answer.includes("вторым") ||
			answer.includes("второй") ||
			answer.includes("второй место") ||
			answer.includes("второе место") ||
			answer.includes("втором")
		) {
			return true;
		}
		return false;
	}

	if (questionId === 3) {
		// Смысл правильного ответа: выживших не хоронят (итого — "нигде/ни в какой стране")
		// Учитываем множество естественных формулировок
		if (
			// короткие и частые
			answer.includes("нигде") ||
			answer.includes("ни в какой") ||
			answer.includes("ни в одной") ||
			answerNoPunct.includes("нивкакой") ||
			answerNoPunct.includes("ниводной") ||
			// отрицание действия хоронить/похоронить
			answer.includes("не хорон") ||
			answer.includes("не похорон") ||
			answer.includes("не будут хорон") ||
			answer.includes("не станут хорон") ||
			// формулировки со словом "выживш"
			(answer.includes("выживш") &&
				(answer.includes("не хорон") || answer.includes("не похорон")))
		) {
			return true;
		}
		return false;
	}

	if (questionId === 4) {
		// Смысл: бананов на кокосовой пальме нет → никто не получит банан
		const hasNikto =
			answer.includes("никто") ||
			answer.includes("никому") ||
			answerNoPunct.includes("ниодин") ||
			answer.includes("ни один") ||
			answerNoPunct.includes("ниодна") ||
			answer.includes("ни одна");

		const mentionsBanana = answer.includes("банан");
		const bananasNo =
			answer.includes("бананов нет") ||
			answer.includes("нет бананов") ||
			(answer.includes("банан") && answer.includes("нет"));

		const notGrowOnCoconut =
			(answer.includes("кокосов") || answer.includes("кокосовой") || answer.includes("кокосовая")) &&
			(answer.includes("пальм") || answer.includes("пальме") || answer.includes("пальма")) &&
			(answer.includes("не растут") || answer.includes("не раст") || answer.includes("не бывают"));

		const nobodyGetsBanana =
			mentionsBanana &&
			(answer.includes("не получит") ||
				answer.includes("не получат") ||
				answer.includes("никто не получит") ||
				answer.includes("не достан") || // не достанется банан
				answer.includes("не будет") // банана не будет
			);

		if (hasNikto && (mentionsBanana || bananasNo || notGrowOnCoconut)) return true;
		if (bananasNo) return true;
		if (notGrowOnCoconut) return true;
		if (nobodyGetsBanana) return true;

		return false;
	}

	if (questionId === 5) {
		// Смысл: в одноэтажном доме лестниц нет → ответ "никакого (цвета)"/"лестниц нет"/"без лестниц"
		const noStairsExplicit =
			answer.includes("нет лестниц") ||
			answer.includes("лестниц нет") ||
			answer.includes("лестницы нет") ||
			answer.includes("нет лестницы") ||
			answer.includes("без лестниц");

		const stairsBySteps =
			answer.includes("ступен") && (answer.includes("нет") || answer.includes("без"));

		const noColor =
			answer.includes("никакого цвета") || answer.includes("никакого");

		if (noStairsExplicit) return true;
		if (stairsBySteps) return true;
		if (noColor) return true;

		return false;
	}

	if (questionId === 6) {
		// Смысл: Моисей не помещал животных — это делал Ной → ответ "нисколько/ноль/0"
		const mentionsMoses = answer.includes("моисе"); // Моисей
		const mentionsNoah = answer.includes("ной"); // Ной

		const zeroish =
			answer === "0" ||
			answerNoPunct === "0" ||
			answer.includes("нисколько") ||
			answer.includes("ноль") ||
			(answer.includes("0") && !answer.includes("10")); // защищаемся от "10"

		const noneish =
			answer.includes("никаких") ||
			answer.includes("ни одного") ||
			answer.includes("ни одного животного") ||
			answer.includes("ни одного вида");

		const noahDid =
			mentionsNoah &&
			(answer.includes("поместил") ||
				answer.includes("помещал") ||
				answer.includes("делал") ||
				answer.includes("это был") ||
				answer.includes("это сделал"));

		const mosesDidNot =
			mentionsMoses &&
			(answer.includes("не") ||
				answer.includes("не помещал") ||
				answer.includes("не делал"));

		if (zeroish) return true;
		if (noneish) return true;
		if (noahDid) return true;
		if (mosesDidNot) return true;

		return false;
	}

	if (questionId === 7) {
		// Смысл: у электропоезда нет дыма → никуда/ни в какую сторону
		const noDirection =
			answer.includes("ни в какую") || answer.includes("никуда");

		const mentionsSmoke = answer.includes("дым");
		const noSmokePhrases =
			(answer.includes("нет дыма") || answer.includes("дыма нет") || answer.includes("без дыма")) ||
			(mentionsSmoke && (answer.includes("не") && (answer.includes("дымит") || answer.includes("дымится"))));

		const mentionsElectricTrain =
			answer.includes("электропоезд") || answer.includes("электропоезд,") ||answer.includes("электро") || answer.includes("электричк");

		if (noDirection) return true;
		if (noSmokePhrases) return true;
		if (mentionsElectricTrain && noSmokePhrases) return true;

		return false;
	}

	if (questionId === 8) {
		// Смысл: сначала зажигают спичку
		// Любые формы слова "спичка": спичка/спичку/спичкой/спички/спичечку и т.п.
		const mentionsMatch = answerNoPunct.includes("спичк") || answerNoPunct.includes("спичеч");
		const phrases =
			mentionsMatch ||
			answer.includes("зажечь спичку") ||
			answer.includes("зажгу спичку") ||
			answer.includes("в первую очередь спичку") ||
			answer.includes("сначала спичку");

		return Boolean(phrases);
	}

	if (questionId === 9) {
		// Смысл: ситуация невозможна (если есть вдова — он умер)
		const impossible =
			answer.includes("невозмож") ||
			answer.includes("нельзя") ||
			answer.includes("такого быть не может") ||
			answer.includes("не может быть") ||
			answer.includes("некоррект");

		const widowLogic =
			answer.includes("вдова") &&
			(answer.includes("умер") || answer.includes("мертв") || answer.includes("мёртв") ||answer.includes("покой") || answer.includes("не может"));

		if (impossible) return true;
		if (widowLogic) return true;

		return false;
	}

	if (questionId === 10) {
		// Смысл: ни один вариант не верен, т.к. желток жёлтый, а не белый
		const neither =
			answer.includes("ни одно") ||
			answer.includes("ни один") ||
			answer.includes("ни первое ни второе") ||
			answer.includes("ни первый ни второй") ||
			answer.includes("ни первое, ни второе") ||
			answer.includes("ни первый, ни второй") ||
			answer.includes("ни а ни б") ||
			answer.includes("ни а, ни б") ||
			answerNoPunct.includes("нианиниб") ||
			answer.includes("оба неверн") ||
			answer.includes("оба неправиль") ||
			answer.includes("оба не верн") ||
			answer.includes("оба не правиль");

		const yolkYellow =
			answer.includes("желток") &&
			(answer.includes("жёлт") || answer.includes("желт")); // жёлтый/желтый

		const yolkNotWhite =
			answer.includes("желток") &&
			(answer.includes("не бел") || answerNoPunct.includes("небел"));

		if (neither) return true;
		if (yolkYellow) return true;
		if (yolkNotWhite) return true;

		return false;
	}
	// По умолчанию для неописанных вопросов — нет проверки (вернётся 0)
	return false;
}

export default function Test1Page() {
	const router = useRouter();
	const [started, setStarted] = useState(false);
	const [participantId, setParticipantId] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0); // 0..9
	const [answer, setAnswer] = useState("");
	const [totalScore, setTotalScore] = useState(0);
	const [questionStartMs, setQuestionStartMs] = useState<number | null>(null);

	// Ключи localStorage
	const PROGRESS_KEY = "test1_progress";
	const ANSWER_DRAFT_PREFIX = "test1_answer_draft_";

	function buildClientLocalTimestamp(): string {
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
	}

	// Получаем/создаём participantId при первом заходе на страницу
	useEffect(() => {
		const existing = window.localStorage.getItem("participantId");
		if (existing) {
			setParticipantId(existing);
			return;
		}
		fetch("/api/participant", { method: "POST" })
			.then((r) => r.json())
			.then((data) => {
				if (data?.participantId) {
					window.localStorage.setItem("participantId", data.participantId);
					setParticipantId(data.participantId);
				}
			})
			.catch(() => {
				// fallback: локальный id
				const fallback = Math.random().toString(36).slice(2);
				window.localStorage.setItem("participantId", fallback);
				setParticipantId(fallback);
			});
	}, []);

	// Восстанавливаем прогресс (если есть)
	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(PROGRESS_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as {
					started?: boolean;
					currentIndex?: number;
					totalScore?: number;
					finished?: boolean;
				};
				if (saved?.finished) {
					// Тест 1 завершён → идём в тест 2
					router.replace("/test2");
					return;
				}
				if (saved?.started) {
					setStarted(true);
					if (Number.isFinite(saved.currentIndex)) {
						setCurrentIndex(saved.currentIndex as number);
					}
					if (Number.isFinite(saved.totalScore)) {
						setTotalScore(saved.totalScore as number);
					}
					setQuestionStartMs(Date.now());
				}
			}
		} catch {}
	}, [router]);

	// Текущий вопрос
	const currentQuestion = useMemo(() => QUESTIONS[currentIndex], [currentIndex]);

	function handleStart() {
		if (!participantId) {
			// если id ещё не готов, создадим мгновенно локальный
			const fallback = Math.random().toString(36).slice(2);
			window.localStorage.setItem("participantId", fallback);
			setParticipantId(fallback);
		}
		setStarted(true);
		setAnswer("");
		setQuestionStartMs(Date.now());
		// Сохраняем начальное состояние прогресса
		try {
			window.localStorage.setItem(
				PROGRESS_KEY,
				JSON.stringify({ started: true, currentIndex: 0, totalScore: 0, finished: false }),
			);
		} catch {}
	}

	// Загружаем черновик ответа при смене вопроса
	useEffect(() => {
		try {
			const draft = window.localStorage.getItem(ANSWER_DRAFT_PREFIX + String(currentIndex));
			setAnswer(draft ?? "");
		} catch {
			setAnswer("");
		}
	}, [currentIndex]);

	// Сохраняем черновик ответа
	useEffect(() => {
		try {
			if (answer) {
				window.localStorage.setItem(ANSWER_DRAFT_PREFIX + String(currentIndex), answer);
			} else {
				window.localStorage.removeItem(ANSWER_DRAFT_PREFIX + String(currentIndex));
			}
		} catch {}
	}, [answer, currentIndex]);

	async function handleNext() {
		// Время чтения и ответ на текущий вопрос
		const readingTimeMs =
			questionStartMs !== null ? Date.now() - questionStartMs : 0;

		const questionNumber = currentQuestion.id;
		const isCorrect = evaluateAnswer(questionNumber, answer);
		const answerScore = isCorrect ? 1 : 0;
		const newTotal = totalScore + answerScore;

		// Запись результата в БД
		try {
			await fetch("/api/test1", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					participantId: participantId ?? "unknown",
					questionNumber,
					answerInput: answer,
					readingTimeMs,
					answerScore,
					totalScore: newTotal,
					createdAtLocal: buildClientLocalTimestamp(),
				}),
			});
		} catch {
			// игнорируем сбои сети, чтобы не блокировать прохождение
		}

		setTotalScore(newTotal);
		// Чистим черновик для текущего вопроса
		try {
			window.localStorage.removeItem(ANSWER_DRAFT_PREFIX + String(currentIndex));
		} catch {}

		// Переходим к следующему вопросу или завершаем
		if (currentIndex < QUESTIONS.length - 1) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);
			setAnswer("");
			setQuestionStartMs(Date.now());
			// Обновляем прогресс
			try {
				window.localStorage.setItem(
					PROGRESS_KEY,
					JSON.stringify({
						started: true,
						currentIndex: nextIndex,
						totalScore: newTotal,
						finished: false,
					}),
				);
			} catch {}
		} else {
			// Завершение тестирования 1 → перейти к тестированию 2
			try {
				window.localStorage.setItem(
					PROGRESS_KEY,
					JSON.stringify({
						started: true,
						currentIndex,
						totalScore: newTotal,
						finished: true,
					}),
				);
			} catch {}
			router.push("/test2");
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center font-sans">
			<Container maxWidth="md" className="rounded-xl p-10">
				{!started && (
					<Typography variant="h4" component="h1" fontWeight={600}>
						Тестирование 1
					</Typography>
				)}
				<Stack spacing={3} 
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
						<Typography variant="body1" component="div">
							Сейчас вам будет предложено 10 коротких вербальных задач.
							<br />
							В каждой задаче нужно самостоятельно вписать ответ в текстовое поле.
							<br />
							<br />
							Пожалуйста, следуйте простым правилам:
							<ol style={{ margin: 0, paddingLeft: "1.25rem", listStyleType: "decimal", listStylePosition: "outside" }}>
								<li>Внимательно прочитайте условие задачи.</li>
								<li>Запишите тот ответ, который считаете правильным, опираясь на своё понимание.</li>
								<li>Можно немного подумать и проверить себя, но не используйте интернет и постороннюю помощь.</li>
							</ol>
							<br />
							После ввода ответа нажмите кнопку «Далее», чтобы перейти к следующей задаче. Вернуться к предыдущим вопросам будет нельзя.
						</Typography>
					) : (
						<>
							<Typography variant="subtitle1" fontWeight={600}>
								Задача {currentQuestion.id} из {QUESTIONS.length}
							</Typography>
							<Typography variant="body1">{currentQuestion.text}</Typography>
							<TextField
                                label="Ваш ответ"
								variant="outlined"
								fullWidth
								value={answer}
								onChange={(e) => setAnswer(e.target.value)}
								sx={{
									"& .MuiInputBase-input": {
										color: "common.white",
										caretColor: "common.white",
									},
									"& .MuiInputLabel-root": {
										color: "#9e9e9e",
									},
									"& .MuiInputLabel-root.Mui-focused": {
										color: "#9e9e9e",
									},
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "common.white",
										},
										"&:hover fieldset": {
											borderColor: "common.white",
										},
										"&.Mui-focused fieldset": {
											borderColor: "common.white",
										},
									},
								}}
							/>
							<Stack direction="row" spacing={2} justifyContent="flex-end">
								<Button
									variant="contained"
									onClick={handleNext}
									disabled={answer.trim().length === 0}
									sx={{
										"&.Mui-disabled": {
											backgroundColor: "#9e9e9e", // серый
											color: "#ffffff",
										},
									}}
								>
									Дальше
								</Button>
							</Stack>
						</>
					)}
				</Stack>
				{!started && (
					<Stack direction="row" spacing={2}>
						<Link href="/">
							<Button variant="outlined">На главную</Button>
						</Link>
						<Button variant="contained" onClick={handleStart}>
							Далее
						</Button>
					</Stack>
				)}
			</Container>
		</div>
	);
}


