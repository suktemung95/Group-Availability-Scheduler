const app = require("./app")

const port = process.env.PORT || 3000

if (
  process.env.NODE_ENV === "test" &&
  process.env.IS_TEST_DATABASE !== "true"
) {
  throw new Error(
    "SAFETY CHECK FAILED: tests are not using the test database"
  )
}

app.listen(port, '0.0.0.0', () => {
    console.log("App listening on port:", port)
})