DROP TABLE IF EXISTS order_cards;
CREATE TABLE "order_cards"
(
	"id"           TEXT NOT NULL,
	"order_id"     TEXT NOT NULL,
	"create_time"  TEXT NOT NULL,
	"consume_time" TEXT
);

DROP TABLE IF EXISTS goods;
create table goods
(
	goods_no    TEXT    not null,
	goods_name  TEXT    not null,
	price       INTEGER not null,
	stock       INTEGER not null,
	status      INTEGER not null,
	update_time INTEGER not null
);

