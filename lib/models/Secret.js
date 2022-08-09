const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  created_at;

  constructor({ id, title, description, created_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.created_at = created_at;
  }

  // get all secrets
  static async getAll() {
    const { rows } = await pool.query('SELECT title, description, created_at FROM secrets');

    return rows.map((row) => new Secret(row));
  }
};
