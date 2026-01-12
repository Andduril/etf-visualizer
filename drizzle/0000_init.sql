CREATE TABLE "etfs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "etfs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"symbol" varchar(32) NOT NULL,
	"name" varchar(255),
	"currency" char(3),
	"exchange" varchar(128),
	"mic_code" char(4),
	"country" varchar(128),
	"figi_code" char(12),
	"cfi_code" char(6),
	"isin" varchar(32),
	"cusip" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "etfs_symbol_exchange_currency_uq" UNIQUE("symbol","currency","exchange")
);
