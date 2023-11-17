const { executeSQL } = require('./database');

const initializeAPI = (app) => {

app.get("/api/hello", (req, res) => {
  res.send("Server antwort!");
});

  app.post("/api/message", async (req, res) => {
    try {
      const { userId, message } = req.body;
      const query = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
      await executeSQL(query, [userId, message]);
      res.status(200).send("Nachricht gespeichert");
    } catch (err) {
      console.log(err);
      res.status(500).send("Fehler beim Speichern der Nachricht");
    }
  });
};

module.exports = { initializeAPI };