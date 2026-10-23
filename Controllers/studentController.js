

const User = require("../Models/usermodel.js");
const Admin =require("../Models/adminmodel.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getstudentpage = (req, res) => {
  res.render("register");
}


const studentRegister = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    if (!req.body) {
      return res.status(400).send("Request body is missing");
    }

    const { username, email, password } = req.body;
    const imageFile = req.file;

    if (!username || !email || !password) {
      return res.status(400).send("Please fill all required fields");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: "student",
      image: imageFile ? imageFile.filename : null,
    });

    // Registration success → Login page
    return res.redirect("student/dashboard");

  } catch (error) {
  console.error("Student registration error:", error.stack);

  return res.status(500).send(
    "Registration failed: " + error.message
  );
}
};
const updateProfile = async (req, res) => {
  try {
    // ஏற்கனவே database-லிருந்து user-ஐ எடுத்திருந்தால்
    // அந்த user variable-ஐ பயன்படுத்தவும்

    if (req.file) {
      user.image = "/uploads/" + req.file.filename;
      await user.save();
    }

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Image upload failed");
  }
};


const getloginpage = (req, res) => {
  res.render("login");
}








const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await Admin.findOne({
      email: normalizedEmail
    });

    let role = "admin";

    if (!user) {
      user = await User.findOne({
        email: normalizedEmail
      });
      role = "student";
    }

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      message: "Login successful",
      redirectUrl:
        role === "admin"
          ? "/admin/dashboard"
          : "/studentdashboard"
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

const StudentDashboardController = {
    index: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    message: "Invalid login token"
                });
            }

            const student = await User.findById(req.user.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            return res.status(200).json({
                message: "Dashboard loaded successfully",
                student: {
                    username: student.username,
                    email: student.email
                }
            });

        } catch (error) {
            console.error("Student dashboard error:", error);

            return res.status(500).json({
                message: "Unable to load dashboard"
            });
        }
    },

    update: async (req, res) => {
    try {
        const studentId = req.user.id;
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                message: "Name and Email are required"
            });
        }

        const student = await User.findByIdAndUpdate(
            studentId,
            {
                username: username,
                email: email
            },
            {
                new: true,
                runValidators: true
            }
        ).select("username email");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json({
            message: "Student details updated successfully!",
            student: student
        });

    } catch (error) {
        console.error("Student update error:", error);

        return res.status(500).json({
            message: "Failed to update student details"
        });
    }
}}



const admindashboardController = {
  // Display admin dashboard
  index: async (req, res) => {
    try {
      const students = await Student.find()
        .select("-password")
        .sort({ createdAt: -1 });

      return res.render("adminDashboard", { students });
    } catch (error) {
      console.error("Dashboard error:", error.stack);

      return res.status(500).send("Unable to load dashboard: " + error.message);
    }
  },

  // Update student details
  update: async (req, res) => {
    try {
      const { studentId, username, email, course, phone } = req.body;

      if (!studentId) {
        return res.status(400).send("Student ID is required");
      }

      await Student.findByIdAndUpdate(
        studentId,
        { username, email },
        { runValidators: true }
      );

      return res.redirect("/api/students/admindashbord");
    } catch (error) {
      console.error("Student update error:", error);
      return res.status(500).send("Unable to update student");
    }
  }
};


module.exports = {
  getstudentpage,
  studentRegister,
  getloginpage,
  studentLogin,StudentDashboardController,admindashboardController,updateProfile 
};


