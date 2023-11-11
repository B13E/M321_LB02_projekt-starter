document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const messagesList = document.getElementById('chat-messages');
  const socket = new WebSocket("ws://localhost:3000");
  let username = '';

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connected!");
  });

  socket.addEventListener("message", (event) => {
    console.log(`Received message: ${event.data}`);
    addMessageToList(event.data, 'from-friend');
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed.");
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });

  document.getElementById('username-submit').addEventListener('click', () => {
    username = document.getElementById('username-input').value.trim();
    if (username) {
      document.getElementById('username-input').value = '';
      // Weitere Logik für das Beitreten zum Chat, falls erforderlich
    }
  });

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && username) {
      const messageWithUsername = `${username}: ${message}`;
      socket.send(messageWithUsername); // Sendet die Nachricht mit Benutzernamen
      addMessageToList(messageWithUsername, 'from-user');
      messageInput.value = '';
    }
  });

  function addMessageToList(msg, className) {
    const messageElement = document.createElement('li');
    messageElement.classList.add(className);
    messageElement.textContent = msg;
    messagesList.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth' });
  }
});

/*
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const messagesList = document.getElementById('chat-messages');
  const username = 'YourUsername'; // Setzen Sie hier den Benutzernamen des lokalen Benutzers

  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connected!");
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    // Überprüft, ob die empfangene Nachricht vom Server vom aktuellen Benutzer stammt
    const className = data.username === username ? 'from-user' : 'from-friend';
    addMessageToList(data.message, className, data.username);
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed.");
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });

  function addMessageToList(msg, className, msgUsername) {
    const messageElement = document.createElement('li');
    messageElement.classList.add(className);

    const nameTimestampDiv = document.createElement('div');
    nameTimestampDiv.classList.add('name-timestamp');

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('name');
    nameSpan.textContent = msgUsername || username;

    const timestampSpan = document.createElement('span');
    timestampSpan.classList.add('timestamp');
    timestampSpan.textContent = new Date().toLocaleTimeString();

    nameTimestampDiv.appendChild(nameSpan);
    nameTimestampDiv.appendChild(timestampSpan);

    messageElement.appendChild(nameTimestampDiv);
    messageElement.appendChild(document.createTextNode(msg));
    messagesList.appendChild(messageElement);

    messageElement.scrollIntoView({ behavior: 'smooth' });
  }

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = messageInput.value.trim();

    if(message) {
      const data = JSON.stringify({ username, message });
      socket.send(data);

      messageInput.value = ''; // Setzt das Eingabefeld zurück
    }
  });
});

*/