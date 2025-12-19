DROP TABLE IF EXISTS order_cards;
CREATE TABLE "order_cards"
(
	"id"           TEXT NOT NULL,
	"order_id"     TEXT NOT NULL,
	"create_time"  TEXT NOT NULL,
	"consume_time" TEXT
);
