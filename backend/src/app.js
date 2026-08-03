const express = require('express')
const app = express()
const cors = require("cors")

const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")

const dotenv = require("dotenv")
const path = require("path")

const envFile =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env"

dotenv.config({
  path: path.resolve(process.cwd(), "src", "config", envFile),
  // quiet: true,
})
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
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
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

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

module.exports = app
