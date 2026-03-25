import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import cookieParser from "cookie-parser"

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then
    (() => {
        console.log("database is connected sucessfully")
    })
    .catch((err) => {
        console.log(err)
    })

const app = express()
app.use(cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);

app.listen(3000, () => {
    console.log("server is running on port 3000..")
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
