import { serve } from "@hono/node-server"
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
  console.log(body)

  const users = await db.query(
    "SELECT * FROM users"
  )

  console.log(users);

  return c.json({
    ok: true,
    message: "Test"
  })
})

const port = 3002
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
