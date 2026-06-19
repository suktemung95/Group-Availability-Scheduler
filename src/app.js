const express = require('express')
const app = express()
require("dotenv").config()

const port = 3000

app.use(express.json())

const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const groupRoutes = require("./routes/group.routes")
const scheduleRoutes = require("./routes/schedule.routes")

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/groups", groupRoutes)
app.use("/schedule", scheduleRoutes)

app.listen(port, () => {
    console.log("App listening on port:", port)
})
