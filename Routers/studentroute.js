const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User=require("../Models/usermodel")
const router = express.Router();
const authMiddleware=require("../Middleware/authMiddleware");
const studentMiddleware=require("../Middleware/studentMiddleware")
const adminMiddleware=require("../Middleware/adminMiddleware")

const {
  getstudentpage,
  studentRegister,
  getloginpage,
  studentLogin,
  StudentDashboardController,
  admindashboardController
} = require("../Controllers/studentController");



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.get("/register", getstudentpage);


router.post(
  "/register",
  upload.single("image"),
  studentRegister
);


router.get("/student/dashboard", (req, res) => {
  res.render("Dashboard");
});
router.get("/login",getloginpage);
router.post("/login",studentLogin);

console.log("authMiddleware:", typeof authMiddleware);
console.log("studentMiddleware:", typeof studentMiddleware);
console.log(
    "StudentDashboardController:",
    typeof StudentDashboardController
);
console.log("authMiddleware:", typeof authMiddleware);
console.log("studentMiddleware:", typeof studentMiddleware);
console.log("StudentDashboardController:", StudentDashboardController);
console.log(
    "StudentDashboardController.index:",
    typeof StudentDashboardController?.index
);
console.log(
    "StudentDashboardController.update:",
    typeof StudentDashboardController?.update
);

/*router.get(
    "/studentdashboard",
    authMiddleware,
    studentMiddleware,
    StudentDashboardController.index
);
router.post(
    "/studentdashboard",
    authMiddleware,
    studentMiddleware,
    StudentDashboardController.update
);*/
router.get("/studentdashboard", (req, res) => {
    res.render("studentDashboard");
});

// Protected dashboard data/page
router.get(
    "/api/studentdashboard",
    authMiddleware,
    studentMiddleware,
    StudentDashboardController.index
);
router.post(
    "/api/studentdashboard",
    authMiddleware,
    studentMiddleware,
    StudentDashboardController.update
);
router.get(
  "/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  admindashboardController.index
);
router.get(
  "/api/students/admindashbord",
  authMiddleware,
  adminMiddleware,
  admindashboardController.index
);

// Update student
router.post(
  "/api/students/admindashboard",
  authMiddleware,
  adminMiddleware,
  admindashboardController.update
);


/*router.get(
    "/studentdashboard",
    authMiddleware,
    studentMiddleware,
    async (req, res) => {
        try {
            const student = await User.findById(req.user.id);

            if (!student) {
                return res.status(404).send("Student not found");
            }

            res.render("studentDashboard", { student });
        } catch (error) {
            console.error(error);
            res.status(500).send("Dashboard error");
        }
    }
);*/
/*router.get("/", requireAdmin, async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.render("admin-dashboard", { students });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load students");
  }
});*/
module.exports = router;