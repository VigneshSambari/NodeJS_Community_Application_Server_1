const express = require("express");
const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/messageRoutes");
const personalChatRoutes = require("./routes/personalChatRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

//const {messageURLS} = require('./utils/socket/messageURLS');

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", userRoutes);
app.use("/room", roomRoutes);
app.use("/profile", profileRoutes);
app.use("/blog", blogRoutes);
app.use("/message", messageRoutes);
app.use("/textuser", personalChatRoutes);
app.use("/session", sessionRoutes);
app.use("/media", mediaRoutes);

//Disabling SSL temporarily
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const PORT = 5000 || process.env.PORT;
connectDB();

app.get("/", async (req, res) => {
  
  res.json("Hello... ");
});

app.listen(PORT, "0.0.0.0", () => console.log("App is Up and Running ..."));
