import type { Context } from "hono"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import db from "~/database"

const createJWT = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "", { expiresIn: "1h" })
}

export const login = async (c: Context) => {
  const { email, password } = await c.req.json()

  const user = (await db.query("SELECT * FROM users WHERE email = $1", [email])).rows[0]

  if (!user) {
    return c.json({
      error: "Invalid credentials"
    }, 401)
  }

  const verifyPassword = await bcrypt.compare(password, user.password)

  if (!verifyPassword) {
    return c.json({
      error: "Invalid credentials"
    }, 401)
  }

  const token = createJWT(user.id)

  return c.json({
    message: "Login successful",
    token,
  })
}