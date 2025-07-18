-- PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Books(
		Id INTEGER PRIMARY KEY AUTOINCREMENT,
		BookTitle TEXT,
		Author TEXT,
		Editor TEXT,
		Category TEXT,
		SubCategory TEXT,
		Publisher TEXT,
		PublishedDate TEXT,
		Edition TEXT,
		Language TEXT,
		ShelfLocation TEXT,
		ISBN TEXT,
		Notes TEXT,
		Read INTEGER,
		DateAdded TEXT,
		DateAcquired TEXT,
		ImageLink TEXT
	);
INSERT INTO Books VALUES(1,'The Song of Achilles','Madeline Miller','','Fiction','Fiction','Ecco','2012-08-28','','English','English General Fiction','9780062060624','',0,'2025-07-16T23:08:21-07:00','2025-07-16T23:08:21-07:00','');
INSERT INTO sqlite_sequence VALUES('Books',1);
COMMIT;
