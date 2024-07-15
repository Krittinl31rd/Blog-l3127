const express = require("express");
const router = express.Router();

const {
  AdminPage,
  Signup,
  Signin,
  Dashboard,
  AddpostPage,
  EditpostPage,
  Addpost,
  Editpost,
  Deletepost,
  Signout,
} = require("../controllers/admin");

router.get("/", AdminPage);
router.get("/dashboard", Dashboard);
router.get("/addpost", AddpostPage);
router.get("/post/:id", EditpostPage);

router.post("/signin", Signin);
router.get("/signout", Signout);
// router.post("/signup", Signup);
router.post("/api/addpost", Addpost);
router.put("/api/editpost/:id", Editpost);
router.delete("/api/deletepost/:id", Deletepost);

module.exports = router;
