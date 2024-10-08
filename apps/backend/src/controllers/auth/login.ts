import type { Context } from "hono"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import db from "~/database"

export interface RefreshToken {
  id: number
  user_id: number
  token: string
  expires_at: Date
  created_at: Date
}

const createAccessToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "", { algorithm: "HS256", expiresIn: "2h" })
}

const createRefreshToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "", { algorithm: "HS256", expiresIn: "14d" })
}

export const storeRefreshToken = async (userId: number, token: string, expiresAt: Date): Promise<RefreshToken> => {
  const result = await db.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *",
    [userId, token, expiresAt]
  )
  return result.rows[0]
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

  const accessToken = createAccessToken(user.id)
  const refreshToken = createRefreshToken(user.id)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 14)

  await storeRefreshToken(user.id, refreshToken, expiresAt)

  return c.json({
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
    },
  })
}