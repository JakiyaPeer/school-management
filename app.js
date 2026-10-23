
const express = require("express");
const path = require("path");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const studentRoutes = require("./Routers/studentroute");
app.use("/", studentRoutes);

module.exports = app;
