const app = require("./app")
const port = process.env.PORT || 3000
const dotenv = require("dotenv")
const path = require("path")

const envFile =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env"

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  quiet: true,
})

if (
  process.env.NODE_ENV === "test" &&
  process.env.IS_TEST_DATABASE !== "true"
) {
  throw new Error(
    "REFUSING TO RUN TESTS: test database not configured"
  )
}

if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error(
    "SUPABASE_DATABASE_URL is not configured"
  )
}

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured"
  )
}

app.listen(port, '0.0.0.0', () => {
    console.log("App listening on port:", port)
})