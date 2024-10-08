import { z } from "zod"

export const formSchema = z.object({
  email: z.string().email({ message: "이메일을 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." })
})
