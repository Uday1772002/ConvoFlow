const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Parse a Cookie header string into a key-value object
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const [key, ...val] = cookie.trim().split("=");
    if (key) cookies[key.trim()] = decodeURIComponent(val.join("="));
  });
  return cookies;
}

// Decode the NextAuth v5 JWT from the session cookie and return the user id.
// Returns null if the token is missing, invalid, or cannot be decoded.
async function getVerifiedUserId(cookieHeader) {
  try {
    const { decode } = await import("@auth/core/jwt");
    const cookies = parseCookies(cookieHeader);
    const isProd = process.env.NODE_ENV === "production";
    const cookieName = isProd
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const token = cookies[cookieName];
    if (!token) return null;

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
    if (!secret) return null;

    const decoded = await decode({ token, secret, salt: cookieName });
    return decoded?.id || null;
  } catch {
    return null;
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.NEXTAUTH_URL
          : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Store connected users
  const connectedUsers = new Map();

  // Reject unauthenticated socket connections
  io.use(async (socket, next) => {
    const userId = await getVerifiedUserId(socket.handshake.headers.cookie);
    if (!userId) {
      return next(new Error("Unauthorized"));
    }
    socket.verifiedUserId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // User joins — identity is taken from the verified JWT, NOT from the client
    socket.on("join", () => {
      const userId = socket.verifiedUserId;
      socket.userId = userId;
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);

      // Broadcast to all users that this user is online
      socket.broadcast.emit("user-online", userId);

      // Send list of currently online users to the new user
      const onlineUsers = Array.from(connectedUsers.keys());
      socket.emit("online-users", onlineUsers);
    });

    // Join a conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // New message event
    socket.on("new-message", (data) => {
      const { conversationId, message } = data;
      // Broadcast to all users in the conversation except sender
      socket.to(`conversation:${conversationId}`).emit("message", message);
      console.log(`Message sent to conversation ${conversationId}`);
    });

    // Typing events — always use the server-verified userId
    socket.on("typing", (data) => {
      const { conversationId, userName } = data;
      socket.to(`conversation:${conversationId}`).emit("user-typing", {
        conversationId,
        userId: socket.verifiedUserId,
        userName,
      });
    });

    socket.on("stop-typing", (data) => {
      const { conversationId, userName } = data;
      socket.to(`conversation:${conversationId}`).emit("user-stopped-typing", {
        conversationId,
        userId: socket.verifiedUserId,
        userName,
      });
    });

    // Message read event — always use the server-verified userId
    socket.on("message-read", (data) => {
      const { conversationId, messageId } = data;
      socket.to(`conversation:${conversationId}`).emit("message-read-update", {
        messageId,
        userId: socket.verifiedUserId,
      });
      console.log(`Message ${messageId} read by user ${socket.verifiedUserId}`);
    });

    // New conversation created
    socket.on("new-conversation", (data) => {
      const { conversation, participantIds } = data;
      // Notify all participants
      participantIds.forEach((userId) => {
        const socketId = connectedUsers.get(userId);
        if (socketId && socketId !== socket.id) {
          io.to(socketId).emit("conversation-created", conversation);
        }
      });
      console.log(`New conversation ${conversation.id} created`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);

        // Broadcast to all users that this user is offline
        socket.broadcast.emit("user-offline", socket.userId);
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server running`);
    });
});
