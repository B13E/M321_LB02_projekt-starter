
let pool = null; // Original Code

// Original Code
const initializeMariaDB = () => {
  const mariadb = require("mariadb");
  pool = mariadb.createPool({
    database: process.env.DB_NAME || "mychat",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "mychat",
    password: process.env.DB_PASSWORD || "mychatpassword",
    connectionLimit: 5,
  });
};

// Original Code nur params in den () ist neu  
const executeSQL = async (query, params) => {
  let conn; // Später verbindung zur datenbank speichern
  try {
    conn = await pool.getConnection();
    const res = await conn.query(query, params);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// Original Code // Benutzer die Beitreten in der 
const initializeDBSchema = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`;

  // Original Code
  await executeSQL(userTableQuery);
  
    // Original Code
  const messageTableQuery = `CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;

  // Original Code
  await executeSQL(messageTableQuery);
};
const findOrCreateUser = async (username) => {
  let userQuery = `SELECT id FROM users WHERE name = ?`;
  let users = await executeSQL(userQuery, [username]);

  if (users.length === 0) {
    let insertUserQuery = `INSERT INTO users (name) VALUES (?)`;
    let result = await executeSQL(insertUserQuery, [username]);
    return { id: result.insertId };
  } else {
    return users[0];
  }
};

const saveMessage = async (username, message) => {
  const user = await findOrCreateUser(username);
  const saveMessageQuery = `INSERT INTO messages (user_id, message) VALUES (?, ?)`;
  await executeSQL(saveMessageQuery, [user.id, message]);
};

// Original Code
module.exports = { executeSQL, initializeMariaDB, initializeDBSchema };
