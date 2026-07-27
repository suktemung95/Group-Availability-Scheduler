const request = require("supertest")
const jwt = require("jsonwebtoken")

const app = require("../app")
const runQuery = require("../db/pool")

if (process.env.NODE_ENV === "test") {
  if (process.env.IS_TEST_DATABASE !== "true") {
    throw new Error(
      "REFUSING TO RUN TESTS: test database not configured"
    )
  }
}

async function registerUser(
  username = "alice",
  password = "password123"
) {
  return request(app)
    .post("/auth/register")
    .send({
      username,
      password,
    })
}

describe("Auth", () => {
    beforeEach(async () => {
        await runQuery(`
            TRUNCATE group_invites RESTART IDENTITY CASCADE;
            TRUNCATE group_members RESTART IDENTITY CASCADE;
            TRUNCATE groups RESTART IDENTITY CASCADE;
            TRUNCATE schedule_blocks RESTART IDENTITY CASCADE;
            TRUNCATE users RESTART IDENTITY CASCADE;
        `)
    })

    afterAll(async () => {
        await runQuery.closePool()
    })

    test("register valid user", async () => {
        const res = await registerUser()

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)

        const result = await runQuery(
            `
                SELECT *
                FROM users
                WHERE username = $1
            `,
            ["alice"]
        )

        expect(result).toHaveLength(1)
    })

    test("duplicate username rejected", async () => {
        await registerUser()

        const res = await registerUser()

        expect(res.status).toBe(409)
        expect(res.body.success).toBe(false)
    })

    test("login valid credentials", async () => {
        await registerUser()

        const res = await request(app)
            .post("/auth/login")
            .send({
            username: "alice",
            password: "password123",
            })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(typeof res.body.data).toBe("string")

        const decoded = jwt.verify(
            res.body.data,
            process.env.JWT_SECRET
        )

        const users = await runQuery(
            `
                SELECT id
                FROM users
                WHERE username = $1
            `,
            ["alice"]
        )

        expect(decoded.userId).toBe(users[0].id)
    })

        test("wrong password rejected", async () => {
        await registerUser()

        const res = await request(app)
            .post("/auth/login")
            .send({
            username: "alice",
            password: "wrongpassword",
            })

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    test("missing token rejected", async () => {
        const res = await request(app)
            .get("/users/me")

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })

    test("expired token rejected", async () => {
        const expiredToken = jwt.sign(
            {
            userId: 123,
            },
            process.env.JWT_SECRET,
            {
            expiresIn: "-1s",
            }
        )

        const res = await request(app)
            .get("/users/me")
            .set(
            "Authorization",
            `Bearer ${expiredToken}`
            )

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
    })
})