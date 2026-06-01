const express = require('express')
const app = express()

app.use(express.json())

const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")

app.use("/auth", authRoutes)
app.use("/user", userRoutes)

app.listen(port, () => {
    console.log("App listening on port:", port)
})
