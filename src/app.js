let express = require("express");
let app = express();
let stream = require("./ws/stream");
let path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/landing.html");
});

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/call", (req, res) => {
  res.sendFile(__dirname + "/call.html");
});

let server = app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...")
);
let io = require("socket.io").listen(server);

io.of("/stream").on("connection", stream);
