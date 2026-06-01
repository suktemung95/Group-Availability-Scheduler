const express = require('express')
const app = express()

app.use(express.json())

const userRoutes = require('./routes/users.routes')

app.use("/users", userRoutes)

app.listen(port, () => {
    console.log("App listening on port:", port)
})
