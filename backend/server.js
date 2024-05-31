const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const DB_NAME = process.env.DB_NAME || "myhealth"
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { dbName: DB_NAME, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users.route.js");
app.use("/users", usersRouter);

const apiRouter = require("./routes/api.route.js");
app.use("/others", apiRouter);

const appointmentsRouter = require("./routes/appointments.route.js");
app.use("/appointments", appointmentsRouter);

const messagesRouter = require("./routes/messages.route.js");
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
