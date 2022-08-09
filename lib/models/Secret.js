const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;

  constructor(row) {
    this.id = row.id;
    this.title = row.first_name;
    this.description = row.last_name;
  }

  // get all secrets
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM secrets');

    return rows.map((row) => new Secret(row));
  }
};
