const express = require("express");
const mongoose = require("mongoose");

const Users = require("./routes/api/users");
const Profile = require("./routes/api/profile");
const Posts = require("./routes/api/posts");

const app = express();

// DB Config
const db = require("./config/keys").monogUI;

// Connect MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDb Connenct"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World..."));

// Use routes
app.use("/api/users", Users);
app.use("/api/profile", Profile);
app.use("/api/posts", Posts);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is listen on port ${port}`));
