require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

const app = express();
const PORT = 88 || process.env.PORT;

const mainRoutes = require("./server/routes/main");
const adminRoutes = require("./server/routes/admin");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    // cookie: {maxAge: new Date(Date.now() + (3600000))}
  })
);
app.use(methodOverride("_method"));

app.use(express.static("public"));

// Templating
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

// Routes
app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`App listening on port ${PORT}`);
});
