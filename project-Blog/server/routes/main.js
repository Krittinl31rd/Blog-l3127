const express = require("express");
const router = express.Router();

const { Home, About, Post, Search } = require("../controllers/main");

router.get("/", Home);
router.get("/about", About);
router.get("/post/:id", Post);
router.post("/search", Search);

module.exports = router;
