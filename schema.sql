DROP TABLE IF EXISTS events;
CREATE TABLE events (
	event_id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_name TEXT  NOT NULL,
	open_amount NUMERIC DEFAULT (0.00),
	"open" INTEGER DEFAULT (1),
	created_at TEXT DEFAULT (CURRENT_DATE)
);

DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
	customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
	customer_name TEXT UNIQUE NOT NULL,
	debit_value NUMERIC DEFAULT (0.00)
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
	product_id INTEGER PRIMARY KEY AUTOINCREMENT,
	product_name TEXT UNIQUE NOT NULL,
	product_price NUMERIC DEFAULT (0.00),
	enabled INTEGER DEFAULT (0)
);


DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
	order_id INTEGER PRIMARY KEY AUTOINCREMENT,
	customer_id INTEGER NOT NULL,
	event_id INTEGER NOT NULL,
	deliveried INTEGER DEFAULT (0),
	order_amount NUMERIC DEFAULT (0.00),
	paid_value NUMERIC DEFAULT (0.00),
	FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
	FOREIGN KEY (event_id) REFERENCES events (event_id)
);


DROP TABLE IF EXISTS order_products;
CREATE TABLE order_products (
	order_id INTEGER,
	product_id INTEGER NOT NULL,
	customer_id INTEGER NOT NULL,
	product_quantity INTEGER DEFAULT (0),
	sub_total NUMERIC DEFAULT (0.00),
	FOREIGN KEY (order_id) REFERENCES orders (order_id),
	FOREIGN KEY (product_id) REFERENCES products (product_id),
	FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

DROP TABLE IF EXISTS outgoing;
CREATE TABLE outgoing (
	outgoing_id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL,
	outgoing_description TEXT NOT NULL,
	outgoing_amount NUMERIC DEFAULT (0.00),
	FOREIGN KEY (event_id) REFERENCES events (event_id)
);


