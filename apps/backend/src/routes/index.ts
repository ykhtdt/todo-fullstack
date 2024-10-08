import { Hono } from "hono"
import { cors } from "hono/cors"

import {
  login,
  signUp,
} from "~/controllers/auth"

const routes = new Hono()

routes.use("*", cors())

routes.notFound((c) => c.text("Custom 404 Message", 404))

routes.post("/login", login)
routes.post("/signup", signUp)

export { routes }