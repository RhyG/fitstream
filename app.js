const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

require("./middleware/auth");

// Databse
const db = require("./db/connection");

db.authenticate()
  .then(() => console.log("Database connected... 🚀"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

app.set("port", process.env.PORT || 6000);
const server = app.listen(app.get("port"), () => {
  console.log(`Server running → PORT ${server.address().port}`);
});
