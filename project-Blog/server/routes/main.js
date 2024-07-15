const express = require("express");
const router = express.Router();

const { Home, About, Post, Search, Contact } = require("../controllers/main");

router.get("/", Home);
router.get("/about", About);
router.get("/contact", Contact);
router.get("/post/:id", Post);
router.post("/search", Search);

module.exports = router;
