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
`);

export default db;


