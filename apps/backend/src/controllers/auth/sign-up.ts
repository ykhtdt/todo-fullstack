import type { Context } from "hono"

import bcrypt from "bcrypt"

import db from "~/database"

export const signUp = async (c: Context) => {
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
}