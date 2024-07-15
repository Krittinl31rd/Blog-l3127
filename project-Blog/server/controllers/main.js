const post = require("../models/post");
const locals = {
  title: "NodeJs Blog",
  description: "Simple Blog created with NodeJs, Express & MongoDb",
};

exports.Home = async (req, res) => {
  try {
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await post
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};

exports.About = (req, res) => {
  res.render("about", { locals, currentRoute: "/about" });
};

exports.Contact = (req, res) => {
  res.render("contact", {
    locals,
    currentRoute: "/contact",
  });
};

exports.Post = async (req, res) => {
  try {
    const data = await post.findOne({ _id: req.params.id }).exec();
    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${req.params.id}`,
    });
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};

exports.Search = async (req, res) => {
  try {
    const dataSearch = req.body.searchTerm;
    if (!dataSearch) {
      return res.redirect("/");
    } else {
      const seachNoSpecialChar = dataSearch.replace(/[^a-zA-Z0-9]/g, "");
      const data = await post.find({
        $or: [
          { title: { $regex: new RegExp(seachNoSpecialChar, "i") } },
          { body: { $regex: new RegExp(seachNoSpecialChar, "i") } },
        ],
      });
      res.render("search", { locals, data, currentRoute: "/" });
    }
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};
