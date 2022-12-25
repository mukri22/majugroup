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
// import multer from "multer";
// import FileUpload from "express-fileupload";
// import cloudinary from "./utils/cloudinary.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toString() + '-' + file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if(
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ){
//         cb(null, true);
//     }else{
//         cb(null, false);
//     }
// }


// (async()=>{
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(UserRoute);
app.use(ProductRoute);
app.use(AdminRoute);
app.use(AuthRoute);
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
// app.use(FileUpload());
// app.use(express.static("public"));
// app.use(cloudinary);

// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});
