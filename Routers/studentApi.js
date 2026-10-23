const express = require("express");
const router = express.Router();
const multer = require("multer");

const { studentRegister } = require("../Controllers/studentController");

const upload = multer({
  dest: "public/uploads/"
});

router.post(
  "/register",
  upload.single("image"),
  studentRegister
);

module.exports = router;