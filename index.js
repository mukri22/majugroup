import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async()=>{
//     await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(UserRoute);
app.use(ProductRoute);
app.use(AdminRoute);
app.use(AuthRoute);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    limit: "100mb",
    extended: true,
  })
);
app.use(cookieParser());

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
