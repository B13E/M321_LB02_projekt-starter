document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const messagesList = document.getElementById('chat-messages');
  const usernameInput = document.getElementById('username-input');
  const usernameSubmit = document.getElementById('username-submit');
  const socket = new WebSocket("ws://localhost:3000");

  let username = '';

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connected!");
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'activeParticipants') {
      updateActiveParticipantsList(data.data);
    } else {
      addMessageToList(`${data.username}: ${data.message}`, 'from-friend');
    }
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed.");
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });

  usernameSubmit.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
      socket.send(JSON.stringify({ type: 'setUsername', username: username }));
      usernameInput.value = '';
      document.getElementById('username-container').style.display = 'none'; // Verstecke das Eingabefeld nach der Eingabe
    }
  });

  chatForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message && username) {
      const messageWithUsername = { username: username, message: message };
      socket.send(JSON.stringify(messageWithUsername));
      addMessageToList(`${username}: ${message}`, 'from-user');
      messageInput.value = '';

      // Nachricht an die API senden
      fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageWithUsername)
      });
    }
  });

  function addMessageToList(msg, className) {
    const messageElement = document.createElement('li');
    messageElement.classList.add(className);
    messageElement.textContent = msg;
    messagesList.appendChild(messageElement);
    messageElement.scrollIntoView({ behavior: 'smooth' });
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function changeUsername(newUsername) {
    username = newUsername.trim();
    if (username) {
      socket.send(JSON.stringify({ type: 'changeUsername', newUsername: username }));
    }
  }
  
  function updateActiveParticipantsList(activeParticipants) {
    const activeParticipantsList = document.getElementById('active-participants');
    activeParticipantsList.innerHTML = '';
    activeParticipants.forEach((participant) => {
      const listItem = document.createElement('li');
      listItem.textContent = participant;
      activeParticipantsList.appendChild(listItem);
    });
  }
});

usernameSubmit.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.send(JSON.stringify({ type: 'setUsername', username: username }));
  }
});

function changeUsername(newUsername) {
  username = newUsername.trim();
  socket.send(JSON.stringify({ type: 'setUsername', username: username }));
}