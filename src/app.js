const express = require("express");
const connectDb = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")

require("dotenv").config();

const app = express();

const corsOptions = {
  origin:[ 
    "http://localhost:5173",
    "https://dev-tinder-frontend-zeta.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ Preflight (OPTIONS) handler
// app.options("*", cors(corsOptions)); // this is safe — won't crash


app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRouter = require("./routes/connection")
const userRouter = require("./routes/user")


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRouter)
app.use("/", userRouter)



connectDb().then(() => {
    console.log("succesfully connected to Database");
    app.listen(7000, () => {
        console.log("successfully listening to port 7000")
    })
}).catch(err => console.error("database cannot be connected"))
