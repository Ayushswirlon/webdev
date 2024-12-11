//i made this not fully used ai too but yeah got inspire from this though

const net = require("net");
const EventEmitter = require("events");

const chatEvents = new EventEmitter();

// Array to store connected clients
const clients = [];

// Create a server
const server = net.createServer((socket) => {
  console.log("New user connected.");

  // Add the new client to the array
  clients.push(socket);

  // Listen for incoming messages
  socket.on("data", (data) => {
    const message = data.toString().trim();
    console.log(`Received: ${message}`);

    // Emit a "message" event
    chatEvents.emit("message", message, socket);
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("User disconnected (graceful).");
    removeClient(socket);
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
    removeClient(socket);
  });

  socket.on("close", (hadError) => {
    if (hadError) {
      console.log("User disconnected (unexpectedly).");
    } else {
      console.log("User disconnected (socket closed).");
    }
    removeClient(socket);
  });

  // Helper function to remove the client
  function removeClient(socket) {
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  }
});

function shutDownServer() {
  console.log("\nShutting down server...");

  // Close all client sockets
  clients.forEach((client) => {
    client.end("Server is shutting down...\n");
    client.destroy(); // Force close the socket
  });

  // Close the server
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
}

// Listen for the "message" event
chatEvents.on("message", (message, sender) => {
  console.log(`Broadcasting: ${message}`);
  // Send the message to all clients except the sender
  if (message === `/SERVER shutdown ${PORT}`) {
    console.log("Shutdown command received.");
    shutDownServer(); // Call the shutdown function
  } else {
    clients.forEach((client) => {
      if (client !== sender) {
        client.write(`Message: ${message}`);
      }
    });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
