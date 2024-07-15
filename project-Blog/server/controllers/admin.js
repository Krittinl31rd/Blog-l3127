const post = require("../models/post");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const locals = {
  title: "Admin",
  description: "Simple Blog created with NodeJs, Express & MongoDb",
};
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// Check Signin
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/admin");
    // return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// GET / ADMIN - Signin Page
exports.AdminPage = async (req, res) => {
  try {
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};

// POST / ADMIN - Sign in
exports.Signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await user.findOne({ username });

    if (!userData) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userData._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};

exports.Signout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.Dashboard = [
  authMiddleware,
  async (req, res) => {
    try {
      const data = await post.find();
      res.render("admin/dashboard", { layout: adminLayout, data, locals });
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  },
];

exports.AddpostPage = [
  authMiddleware,
  async (req, res) => {
    res.render("admin/addpost", { layout: adminLayout, locals });
    try {
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
];

exports.EditpostPage = [
  authMiddleware,
  async (req, res) => {
    const data = await post.findOne({ _id: req.params.id });
    res.render("admin/editpost", { layout: adminLayout, locals, data });
    try {
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
];

exports.Addpost = [
  authMiddleware,
  async (req, res) => {
    const { title, body } = req.body;
    await post.create({
      title,
      body,
    });
    return res.redirect("/admin/dashboard");
    try {
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
];

exports.Editpost = [
  authMiddleware,
  async (req, res) => {
    try {
      const { title, body } = req.body;
      await post.findByIdAndUpdate(req.params.id, {
        title: title,
        body: body,
        updateAt: Date.now(),
      });
      return res.redirect("/admin/dashboard");
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
];

exports.Deletepost = [
  authMiddleware,
  async (req, res) => {
    try {
      await post.deleteOne({ _id: req.params.id });
      return res.redirect("/admin/dashboard");
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
];

// POST / ADMIN - Sign up
// exports.Signup = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const dataUser = await user.create({
//         username,
//         password: hashedPassword,
//       });
//       res.status(201).json({ message: "User Created", dataUser });
//     } catch (err) {
//       if (err.code === 11000) {
//         res.status(409).json({ message: "User already in use" });
//       }
//       res.status(500);
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(500);
//   }
// };
