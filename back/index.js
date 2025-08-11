require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Connect DB
connectDB();

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Routes
const userRoutes = require("./routes/userRoute");
const entrepriseRoutes = require("./routes/entrepriseRoutes");
const carRoutes = require('./routes/carRoutes'); 
const articleRoutes = require('./routes/articleRoutes'); 


app.use("/api/user", userRoutes);
app.use("/api/entreprise",entrepriseRoutes)
app.use('/api/cars', carRoutes);
app.use('/api/articles', articleRoutes);



// Basic route for testing   
app.get('/', (req, res) => {
  res.send('Car Management API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});










// Lancement serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
