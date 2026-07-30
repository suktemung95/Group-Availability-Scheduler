const request = require("supertest")

const app = require("../app")
const runQuery = require("../db/pool")

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

async function loginUser(
  username = "alice",
  password = "password123"
) {
  const res = await request(app)
    .post("/auth/login")
    .send({
      username,
      password,
    })

  return res.body.data
}

async function createUserAndGetToken(
  username = "alice",
  password = "password123"
) {
  await registerUser(username, password)

  return loginUser(username, password)
}

describe("Schedule", () => {
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

  test("create valid block", async () => {
    const token = await createUserAndGetToken()

    const res = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "Available",
      })
      
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const blocks = await runQuery(`
      SELECT *
      FROM schedule_blocks
    `)

    expect(blocks).toHaveLength(1)
  })

  test("overlapping block rejected", async () => {
    const token = await createUserAndGetToken()

    await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "First",
      })

    const res = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "11:00",
        end: "13:00",
        block_type: "free",
        label: "Overlap",
      })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  test("adjacent blocks accepted", async () => {
    const token = await createUserAndGetToken()

    await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "First",
      })

    const res = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "12:00",
        end: "14:00",
        block_type: "free",
        label: "Second",
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const blocks = await runQuery(`
      SELECT *
      FROM schedule_blocks
    `)

    expect(blocks).toHaveLength(2)
  })

  test("update own block", async () => {
    const token = await createUserAndGetToken()

    const createRes = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "Original",
      })

    const blockId = createRes.body.data.id

    const res = await request(app)
      .patch(`/schedule/${blockId}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "11:00",
        end: "13:00",
        block_type: "free",
        label: "Updated",
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const blocks = await runQuery(
      `
        SELECT *
        FROM schedule_blocks
        WHERE id = $1
      `,
      [blockId]
    )

    expect(blocks).toHaveLength(1)
    expect(blocks[0].label).toBe("Updated")
  })

  test("cannot update someone else's block", async () => {
    const aliceToken =
      await createUserAndGetToken(
        "alice",
        "password123"
      )

    const bobToken =
      await createUserAndGetToken(
        "bob",
        "password123"
      )

    const createRes = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${aliceToken}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "Alice block",
      })

    const blockId = createRes.body.data?.id

    const res = await request(app)
      .put(`/schedule/${blockId}`)
      .set(
        "Authorization",
        `Bearer ${bobToken}`
      )
      .send({
        dow: 1,
        start: "14:00",
        end: "16:00",
        block_type: "free",
        label: "Bob tried to change this",
      })

    expect([403, 404]).toContain(res.status)
  })

  test("delete own block", async () => {
    const token = await createUserAndGetToken()

    const createRes = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 1,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "Delete me",
      })

    const blockId =
      createRes.body.data?.id ??
      createRes.body.data?.block_id ??
      createRes.body.schedule?.id

    const res = await request(app)
      .delete(`/schedule/${blockId}`)
      .set(
        "Authorization",
        `Bearer ${token}`
      )

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const blocks = await runQuery(
      `
        SELECT *
        FROM schedule_blocks
        WHERE id = $1
      `,
      [blockId]
    )

    expect(blocks).toHaveLength(0)
  })

  test("invalid day rejected", async () => {
    const token = await createUserAndGetToken()

    const res = await request(app)
      .post("/schedule")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        dow: 9,
        start: "10:00",
        end: "12:00",
        block_type: "free",
        label: "Invalid",
      })

    expect(res.status).toBe(422)
    expect(res.body.success).toBe(false)
  })
})