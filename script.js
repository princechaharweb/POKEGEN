document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Generate a random anonymous user ID
    const anonymousUserId = Math.random().toString(36).substring(2, 15);

    function addMessage(message, isSent = true) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (isSent) {
            messageElement.classList.add('sent');
        }
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message);
            messageInput.value = '';
            
            // Simulate receiving a response (in a real app, this would be handled by a server)
            setTimeout(() => {
                addMessage('This is a demo response. In a real application, messages would be handled by a server.', false);
            }, 1000);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add a welcome message
    addMessage('Welcome to POKEGEN chat! This is a demo version of the chat. Messages are not persisted.', false);
});