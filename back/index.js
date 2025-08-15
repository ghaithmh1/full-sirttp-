
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config/config");

const globalErrorHandler = require("./middlewares/globalErrorHandler");

const app = express();
const server = http.createServer(app);



app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));



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
const userRoutes = require("./routes/userRoutes");
const entrepriseRoutes = require("./routes/entrepriseRoutes");   
const carRoutes = require('./routes/carRoutes'); 
const articleRoutes = require('./routes/articleRoutes'); 
const clientRoutes = require("./routes/clientRoutes");
const fournisseurRoutes = require("./routes/fournisseurRoutes");
const sousTraitantRoutes = require("./routes/sousTraitantRoutes");


// Root route:
app.get("/", (req, res) => {
  
  res.json({ message: "Hello from Our Server!" });
});  



// Mount routes:
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/depots', require('./routes/depotRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/fournisseurs', require('./routes/fournisseurRoutes'));
app.use('/api/sous-traitants', require('./routes/sousTraitantRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/entreprises', require('./routes/entrepriseRoutes'));


// Basic route for testing   
app.get('/', (req, res) => {
  res.send('Car Management API is running');
});







// Error handler:
app.use(globalErrorHandler);



// Lancement serveur
app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
