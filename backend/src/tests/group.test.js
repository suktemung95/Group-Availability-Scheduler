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

async function createUser(
  username,
  password = "password123"
) {
  await registerUser(username, password)

  const token = await loginUser(
    username,
    password
  )

  const users = await runQuery(
    `
      SELECT id
      FROM users
      WHERE username = $1
    `,
    [username]
  )

  return {
    id: users[0].id,
    username,
    token,
  }
}

async function createGroup(
  token,
  groupName = "Test Group"
) {
  return request(app)
    .post("/groups")
    .set(
      "Authorization",
      `Bearer ${token}`
    )
    .send({
      name: groupName,
    })
}

describe("Groups", () => {
  beforeEach(async () => {
    await runQuery(`
        TRUNCATE group_invites RESTART IDENTITY CASCADE;
        TRUNCATE group_members RESTART IDENTITY CASCADE;
        TRUNCATE groups RESTART IDENTITY CASCADE;
        TRUNCATE schedule_blocks RESTART IDENTITY CASCADE;
        TRUNCATE users RESTART IDENTITY CASCADE;
    `)
  })

  test("create group", async () => {
    const alice = await createUser("alice")

    const res = await createGroup(
      alice.token,
      "Volleyball"
    )

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)

    const groups = await runQuery(
      `
        SELECT *
        FROM groups
        WHERE name = $1
      `,
      ["Volleyball"]
    )

    expect(groups).toHaveLength(1)

    const members = await runQuery(
      `
        SELECT *
        FROM group_members
        WHERE group_id = $1
          AND user_id = $2
      `,
      [
        groups[0].id,
        alice.id,
      ]
    )

    /*
      Creating a group should normally also
      make the creator a member.
    */
    expect(members).toHaveLength(1)
  })

  test("join/invite member", async () => {
    const alice = await createUser("alice")
    const bob = await createUser("bob")

    const createRes = await createGroup(
      alice.token,
      "Volleyball"
    )

    const groupId = createRes.body.data.group.group_id
    
    const inviteRes = await request(app)
      .post(`/groups/${groupId}/invite/${bob.username}`)
      .set(
        "Authorization",
        `Bearer ${alice.token}`
      )

    expect([201]).toContain(
      inviteRes.status
    )

    expect(
      inviteRes.body.success
    ).toBe(true)

    const inviteId = inviteRes.body.data.id
    await request(app)
    .post(`/invites/${inviteId}/accept`)
    .set(
        "Authorization",
        `Bearer ${bob.token}`
    )

    const members = await runQuery(
      `
        SELECT *
        FROM group_members
        WHERE group_id = $1
          AND user_id = $2
      `,
      [
        groupId,
        bob.id,
      ]
    )

    expect(members).toHaveLength(1)
  })

  test(
    "unrelated user cannot access group",
    async () => {
      const alice = await createUser("alice")

      const charlie = await createUser("charlie")

      await createGroup(
        alice.token,
        "Private Group"
      )

      const groups = await runQuery(
        `
          SELECT id
          FROM groups
          WHERE name = $1
        `,
        ["Private Group"]
      )

      const groupId = groups[0].id

      const res = await request(app)
        .get(`/groups/${groupId}/members`)
        .set(
          "Authorization",
          `Bearer ${charlie.token}`
        )

      /*
        403 = group exists, but forbidden

        404 is also commonly used so outsiders
        aren't told whether the group exists.
      */
      expect([404]).toContain(
        res.status
      )

      expect(res.body.success).toBe(false)
    }
  )

  test(
    "mutual members calculated correctly",
    async () => {
      const alice = await createUser("alice")

      const bob = await createUser("bob")

      const charlie = await createUser("charlie")

      const david = await createUser("david")
        
      const groups = await runQuery(
        `
          INSERT INTO groups (name, created_by)
          VALUES
            ('Group One', 2),
            ('Group Two', 3),
            ('Group Three', 4)
          RETURNING id, name
        `
      )

      const groupOne = groups[0]
      const groupTwo = groups[1]
      const groupThree = groups[2]

      await runQuery(
        `
          INSERT INTO group_members (
            group_id,
            user_id
          )
          VALUES
            ($1, $4),
            ($1, $5),

            ($2, $4),
            ($2, $6),

            ($3, $7)
        `,
        [
          groupOne.id,
          groupTwo.id,
          groupThree.id,

          alice.id,
          bob.id,
          charlie.id,
          david.id,
        ]
      )


      const res = await request(app)
        .get("/groups/mutualMembers")
        .set(
          "Authorization",
          `Bearer ${alice.token}`
        )

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)

      const members = res.body.data

      expect(members).toHaveLength(2)

      expect(members).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: bob.id,
            username: "bob",
          }),

          expect.objectContaining({
            user_id: charlie.id,
            username: "charlie",
          }),
        ])
      )

      expect(members).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: david.id,
          }),
        ])
      )
    }
  )
})