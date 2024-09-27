import { serve } from "@hono/node-server"
import bcrypt from "bcrypt"
import { Hono } from "hono"
import { cors } from "hono/cors"
import db from "~/model/db"

const app = new Hono()

app.use("*", cors())

app.notFound((c) => {
  return c.text("Custom 404 Message", 404)
})

app.get("/", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!"
  })
})

app.post("/signup", async (c) => {
  const body = await c.req.json()

  const { email, password } = body

  const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email])

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    return c.json({
      ok: false,
      message: "This email is already registered.",
    }, 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const query = "INSERT INTO users (email, password) VALUES ($1, $2)";
  const values = [email, hashedPassword];

  await db.query(query, values);

  return c.json({
    ok: true,
    message: "Your account has been created successfully.",
  }, 201)
})

const port = 3002
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
