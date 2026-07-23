const express = require('express')
const app = express()
const cors = require("cors")
const port = process.env.PORT || 3000

require("dotenv").config()

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://group-availability-scheduler-frontend.onrender.com"
].filter(Boolean)

const corsOptions = {
  origin(requestOrigin, callback) {
    const hasNoOrigin = !requestOrigin
    const isAllowed =
      allowedOrigins.includes(requestOrigin)

    if (hasNoOrigin || isAllowed) {
      return callback(null, true)
    }

    return callback(
      new Error(
        `CORS denied origin: ${requestOrigin}`
      )
    )
  },

  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const groupRoutes = require("./routes/group.routes")
const scheduleRoutes = require("./routes/schedule.routes")
const inviteRoutes = require("./routes/invite.routes")

const auth = require("./middleware/auth")

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GroupAvail API is running",
  })
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/groups", groupRoutes)
app.use("/schedule", scheduleRoutes)
app.use("/invites", inviteRoutes)

app.listen(port, '0.0.0.0', () => {
    console.log("App listening on port:", port)
})
