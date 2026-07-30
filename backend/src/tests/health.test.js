const request = require("supertest")
const app = require("../app")

describe("GET /health", () => {
  test("returns 200 and confirms API is running", async () => {
    const response = await request(app)
      .get("/health")

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      success: true,
      message: "GroupAvail API is running",
    })
  })
})