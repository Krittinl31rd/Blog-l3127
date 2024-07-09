const express = require("express");
const router = express.Router();

const {
  AdminPage,
  Signup,
  Signin,
  Dashboard,
} = require("../controllers/admin");

router.get("/", AdminPage);
router.get("/dashboard", Dashboard);
router.post("/signin", Signin);
// router.post("/signup", Signup);

module.exports = router;
