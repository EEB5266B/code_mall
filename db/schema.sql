DROP TABLE IF EXISTS order_cards;
CREATE TABLE order_cards
(
	id          TEXT    NOT NULL,
	order_no    TEXT    NOT NULL,
	goods_no    TEXT    NOT NULL,
	biz_order_no TEXT NOT NULL,
	create_time INTEGER NOT NULL,
	goods       TEXT,
	consume_time INTEGER
);

DROP TABLE IF EXISTS goods;
create table goods
(
	goods_no TEXT    not null,
	goods_name  TEXT    not null,
	price    INTEGER not null,
	stock    INTEGER not null,
	goods_type INTEGER not null,
	status   INTEGER not null,
	update_time INTEGER not null
);

