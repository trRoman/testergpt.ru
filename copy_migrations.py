# copy_migrations.py
# Этот скрипт копирует данные из одной базы данных в другую.

import sqlite3
import sys

def copy_prisma_migrations(source_db, target_db):
    # Подключение к исходной базе
    source_conn = sqlite3.connect(source_db)
    source_cursor = source_conn.cursor()
    
    # Подключение к целевой базе
    target_conn = sqlite3.connect(target_db)
    target_cursor = target_conn.cursor()
    
    # Создание таблицы в целевой базе (если не существует)
    target_cursor.execute('''
        CREATE TABLE IF NOT EXISTS _prisma_migrations (
            id TEXT PRIMARY KEY,
            checksum TEXT NOT NULL,
            finished_at DATETIME,
            migration_name TEXT NOT NULL,
            logs TEXT,
            rolled_back_at DATETIME,
            started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            applied_steps_count INTEGER NOT NULL DEFAULT 0
        )
    ''')
    
    # Очистка существующих данных (если нужно)
    target_cursor.execute('DELETE FROM _prisma_migrations')
    
    # Получение данных из исходной таблицы
    source_cursor.execute('SELECT * FROM _prisma_migrations')
    rows = source_cursor.fetchall()
    
    # Вставка данных в целевую таблицу
    target_cursor.executemany('''
        INSERT INTO _prisma_migrations 
        (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', rows)
    
    # Сохранение изменений
    target_conn.commit()
    
    print(f"Скопировано {len(rows)} записей из {source_db} в {target_db}")
    
    # Закрытие соединений
    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    copy_prisma_migrations('prisma/dev.db', 'prisma/1dev.db')