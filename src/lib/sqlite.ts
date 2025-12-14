import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

// Ensure the database directory exists before opening the DB
const dbDirectoryPath = path.resolve(process.cwd(), "prisma");
if (!fs.existsSync(dbDirectoryPath)) {
  fs.mkdirSync(dbDirectoryPath, { recursive: true });
}

const dbFilePath = path.join(dbDirectoryPath, "dev.db");
const db = new Database(dbFilePath);

// Pragmas to improve concurrency and reduce "database is locked" errors
try {
  db.pragma("journal_mode = DELETE");
  db.pragma("synchronous = NORMAL");
  db.pragma("busy_timeout = 5000"); // ms
} catch {
  // ignore pragma errors on some platforms
}

// Ensure table exists (compatible with Prisma schema)
db.exec(`
CREATE TABLE IF NOT EXISTS "Test1Result" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "participantId" TEXT NOT NULL,
  "questionNumber" INTEGER NOT NULL,
  "answerInput" TEXT NOT NULL,
  "readingTimeMs" INTEGER NOT NULL,
  "answerScore" REAL NOT NULL,
  "totalScore" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "Test2Result" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "participantId" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "plotTopic" TEXT NOT NULL,
  "taskNumber" INTEGER NOT NULL,
  "sequenceNumber" INTEGER NOT NULL,
  "readingTimeMs" INTEGER NOT NULL,
  "trustScore" INTEGER NOT NULL,
  "sourceButtonClicked" INTEGER NOT NULL DEFAULT 0,
  "timeInSourceModalMs" INTEGER NOT NULL DEFAULT 0,
  "timeInSourceModalGt5Sec" INTEGER NOT NULL DEFAULT 0,
  "linkClicked" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "Survey" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "participantId" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "gender" TEXT NOT NULL,
  "education" TEXT NOT NULL,
  "llmUsage" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT (datetime('now'))
);
`);

export default db;


