const { executeSQL } = require('./database');

const initializeAPI = (app) => {
  app.get("/api/hello", hello);

  // Neuer Endpunkt zum Speichern von Nachrichten
  app.post("/api/message", async (req, res) => {
    try {
      const { userId, message } = req.body;
      await executeSQL(`INSERT INTO messages (user_id, message) VALUES (${userId}, '${message}')`);
      res.status(200).send("Nachricht gespeichert");
    } catch (err) {
      console.log(err);
      res.status(500).send("Fehler beim Speichern der Nachricht");
    }
  });
};

const hello = (req, res) => {
  res.send("Hello World!");
};

module.exports = { initializeAPI };


/*
const initializeAPI = (app) => {
  // default REST api endpoint
  app.get("/api/hello", hello);
};

const hello = (req, res) => {
  res.send("Hello World!");
};

module.exports = { initializeAPI };
*/