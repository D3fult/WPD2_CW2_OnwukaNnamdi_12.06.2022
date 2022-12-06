const express = require("express"); // Handling requests to the root
const app = express(); // Setting up the server
const mustache = require("mustache-express"); // Importing the template engine

require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Setting up the server
const path = require("path");
app.use(express.urlencoded({ extended: false }));
const public = path.join(__dirname, "public");
app.use(express.static(public));

// Setting up Mustache templates
app.engine("mustache", mustache());
app.set("view engine", "mustache");

// Importing the new router and mapping it to all requests starting from the root of the application
const router = require("./routes/agbRoutes");
app.use("/", router);

// Setting the port for server to listening on
app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
