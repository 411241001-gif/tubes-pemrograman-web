const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tanamanku_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal connect");
    console.log(err);
    return;
  }

  console.log("Database connected!");
});

app.get("/", (req, res) => {
  res.send("TanamanKu Backend Running");
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Register gagal",
      });
    }

    res.json({
      success: true,
      message: "Register berhasil",
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        message: "Login berhasil",
        user: result[0],
      });
    } else {
      res.json({
        success: false,
        message: "Email atau password salah",
      });
    }
  });
});

app.post("/create-order", (req, res) => {
  const { user_id, total, items } = req.body;

  const orderSql = `
    INSERT INTO orders
    (user_id, total, status)
    VALUES (?, ?, ?)
  `;

  db.query(orderSql, [user_id, total, "Pending"], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Order gagal dibuat",
      });
    }

    const orderId = result.insertId;

    if (!items || items.length === 0) {
      return res.json({
        success: true,
        message: "Order berhasil dibuat",
      });
    }

    const itemSql = `
      INSERT INTO order_items
      (order_id, product_name, price, quantity, size, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    let completed = 0;

    items.forEach((item) => {
      db.query(
        itemSql,
        [orderId, item.name, item.price, item.quantity, item.size, item.image],
        (err) => {
          if (err) {
            console.log(err);
          }

          completed++;

          if (completed === items.length) {
            res.json({
              success: true,
              message: "Order berhasil dibuat",
            });
          }
        },
      );
    });
  });
});

app.get("/orders/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil order",
      });
    }

    res.json({
      success: true,
      orders: result,
    });
  });
});
app.get("/order-items/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const sql = `
    SELECT *
    FROM order_items
    WHERE order_id = ?
  `;

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil detail order",
      });
    }

    res.json({
      success: true,
      items: result,
    });
  });
});

app.get("/admin/orders", (req, res) => {
  const sql = `
    SELECT
      orders.*,
      users.username
    FROM orders
    JOIN users
    ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result,
    });
  });
});

app.put("/admin/update-status/:id", (req, res) => {
  const orderId = req.params.id;

  const { status } = req.body;

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
      message: "Status berhasil diupdate",
    });
  });
});

app.delete("/admin/delete-order/:id", (req, res) => {
  const orderId = req.params.id;

  const sql = "DELETE FROM orders WHERE id = ?";

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
      message: "Order berhasil dihapus",
    });
  });
});

app.get("/products", (req, res) => {
  const sql = `
    SELECT *
    FROM products
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil produk",
      });
    }

    res.json({
      success: true,
      products: result,
    });
  });
});


app.post("/admin/products", (req, res) => {
  const {
    name,
    category,
    price,
    image,
    description,
    stock,
  } = req.body;

  const sql = `
    INSERT INTO products
    (name, category, price, image, description, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, category, price, image, description, stock],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Gagal menambah produk",
        });
      }

      res.json({
        success: true,
        message: "Produk berhasil ditambahkan",
      });
    },
  );
});

app.delete("/admin/products/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  });
});

app.put("/admin/products/:id", (req, res) => {
  const productId = req.params.id;

  const {
    name,
    category,
    price,
    image,
    description,
    stock,
  } = req.body;

  const sql = `
    UPDATE products
    SET
      name = ?,
      category = ?,
      price = ?,
      image = ?,
      description = ?,
      stock = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      category,
      price,
      image,
      description,
      stock,
      productId,
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
        });
      }

      res.json({
        success: true,
        message: "Produk berhasil diupdate",
      });
    },
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
