import Cart from "./cart.js";
import { getConnectionFromPool } from "../utils/database.js";

export default class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  async save() {
    const connection = await getConnectionFromPool();
    if (!connection) {
      return;
    }
    if (this.id) {
      return await this.update(connection);
    }
    return await this.add(connection);
  }

  async update(connection) {
    const sql =
      "UPDATE products SET title = ?, imageUrl = ?, price = ?, description = ? WHERE products.id = ?";
    const values = [
      this.title,
      this.imageUrl,
      this.price,
      this.description,
      this.id,
    ];
    const [rows, fields] = await connection.execute({ sql, values });
    console.log(rows);
    connection.release();
    return rows;
  }

  async add(connection) {
    const sql =
      "INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)";
    const values = [this.title, this.imageUrl, this.price, this.description];
    const [result, fields] = await connection.execute({ sql, values });
    connection.release();
    this.id = result.insertId;
    return result;
  }

  static async delete(id) {
    const connection = await getConnectionFromPool();
    if (!connection) {
      return;
    }
    const sql = "DELETE FROM products WHERE products.id = ?";
    const values = [id];
    const [rows, fields] = await connection.execute({ sql, values });
    console.log(rows);
    connection.release();
    return rows;
  }

  static async fetchAll() {
    let results = [];
    const connection = await getConnectionFromPool();
    if (!connection) {
      return;
    }
    const [rows, fields] = await connection
      .execute("SELECT * FROM products")
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    if (!rows) {
      return;
    }
    results = rows;
    connection.release();
    return results;
  }

  static async findById(id) {
    // create connection
    const connection = await getConnectionFromPool();
    if (!connection) {
      return;
    }
    const sql = "SELECT * FROM products WHERE products.id = ? LIMIT 1";
    const values = [id];
    const [rows, fields] = await connection
      .execute({ sql, values })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    if (!rows && rows.length === 0) {
      return;
    }
    connection.release();
    return rows[0];
  }
}
