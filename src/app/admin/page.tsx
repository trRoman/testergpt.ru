// .\src\app\admin\page.tsx
// этот файл содержит код для страницы админ-панели

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import db from "@/lib/sqlite";

type Test1Row = {
  participantId: string;
  questionNumber: number;
  answerInput: string;
  readingTimeMs: number;
  answerScore: number;
  totalScore: number;
  createdAt: string;
};

type Test2Row = {
  participantId: string;
  tone: string;
  plotTopic: string;
  taskNumber: number;
  sequenceNumber: number;
  readingTimeMs: number;
  trustScore: number;
  sourceButtonClicked: number;
  timeInSourceModalMs: number;
  timeInSourceModalGt5Sec: number;
  linkClicked: number;
  createdAt: string;
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    redirect("/login");
  }

  const shortId = (id: string) => (id && id.length > 4 ? `…${id.slice(-4)}` : id ?? "");
  const msToSec = (ms: number) => {
    const n = typeof ms === "number" ? ms : Number(ms);
    if (Number.isNaN(n)) return "";
    return (n / 1000).toFixed(2);
  };

  const test1Rows = db
    .prepare(`SELECT participantId, questionNumber, answerInput, readingTimeMs, answerScore, totalScore, createdAt FROM "Test1Result" ORDER BY createdAt DESC`)
    .all() as unknown as Test1Row[];

  const test2Rows = db
    .prepare(`SELECT participantId, tone, plotTopic, taskNumber, sequenceNumber, readingTimeMs, trustScore, sourceButtonClicked, timeInSourceModalMs, timeInSourceModalGt5Sec, linkClicked, createdAt FROM "Test2Result" ORDER BY createdAt DESC`)
    .all() as unknown as Test2Row[];

  return (
    <div className="flex min-h-screen items-start justify-center font-sans">
      <div className="w-full max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-white">Админ-панель: результаты тестирования</h1>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3 text-white">
            Тестирование 1{" "}
            <a
              href="/api/admin/export/test1/xls"
              className="text-blue-300 underline text-sm ml-2"
            >
              (скачать Excel)
            </a>
          </h2>
          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left">ID участника</th>
                  <th className="px-3 py-2 text-left">№ вопроса</th>
                  <th className="px-3 py-2 text-left">Введённый ответ</th>
                  <th className="px-3 py-2 text-left">Время чтения (сек)</th>
                  <th className="px-3 py-2 text-left">Балл ответа</th>
                  <th className="px-3 py-2 text-left">Сумма баллов</th>
                  <th className="px-3 py-2 text-left">Дата</th>
                </tr>
              </thead>
              <tbody>
                {test1Rows.map((r, idx) => (
                  <tr key={idx} className="odd:bg-white/0 even:bg-white/5">
                    <td className="px-3 py-2">{shortId(r.participantId)}</td>
                    <td className="px-3 py-2">{r.questionNumber}</td>
                    <td className="px-3 py-2 break-all">{r.answerInput}</td>
                    <td className="px-3 py-2">{msToSec(r.readingTimeMs)}</td>
                    <td className="px-3 py-2">{r.answerScore}</td>
                    <td className="px-3 py-2">{r.totalScore}</td>
                    <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-white">
            Тестирование 2{" "}
            <a
              href="/api/admin/export/test2/xls"
              className="text-blue-300 underline text-sm ml-2"
            >
              (скачать Excel)
            </a>
          </h2>
          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left">ID участника</th>
                  <th className="px-3 py-2 text-left">Тон</th>
                  <th className="px-3 py-2 text-left">Тема сюжета</th>
                  <th className="px-3 py-2 text-left">№ задания</th>
                  <th className="px-3 py-2 text-left">№ последовательности</th>
                  <th className="px-3 py-2 text-left">Время чтения (сек)</th>
                  <th className="px-3 py-2 text-left">Балл доверия</th>
                  <th className="px-3 py-2 text-left">Кнопка источника</th>
                  <th className="px-3 py-2 text-left">Время в модалке (сек)</th>
                  <th className="px-3 py-2 text-left">В модалке {'>'} 5 с</th>
                  <th className="px-3 py-2 text-left">Клик ссылки</th>
                  <th className="px-3 py-2 text-left">Дата</th>
                </tr>
              </thead>
              <tbody>
                {test2Rows.map((r, idx) => (
                  <tr key={idx} className="odd:bg-white/0 even:bg-white/5">
                    <td className="px-3 py-2">{shortId(r.participantId)}</td>
                    <td className="px-3 py-2">{r.tone}</td>
                    <td className="px-3 py-2">{r.plotTopic}</td>
                    <td className="px-3 py-2">{r.taskNumber}</td>
                    <td className="px-3 py-2">{r.sequenceNumber}</td>
                    <td className="px-3 py-2">{msToSec(r.readingTimeMs)}</td>
                    <td className="px-3 py-2">{r.trustScore}</td>
                    <td className="px-3 py-2">{r.sourceButtonClicked ? "Да" : "Нет"}</td>
                    <td className="px-3 py-2">{msToSec(r.timeInSourceModalMs)}</td>
                    <td className="px-3 py-2">{r.timeInSourceModalGt5Sec ? "Да" : "Нет"}</td>
                    <td className="px-3 py-2">{r.linkClicked ? "Да" : "Нет"}</td>
                    <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}


