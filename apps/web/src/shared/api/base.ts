import ky from "ky"

import { API_PREFIX_URL } from "@/shared/config";
import {
  getClientIP,
  NotFoundError,
} from "@/shared/lib";

const baseApi = ky.create({
  prefixUrl: API_PREFIX_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const ip = await getClientIP()

        request.headers.set("x-forwarded-for", ip)
      }
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const { status, statusText } = response

          if (status === 404) {
            throw new NotFoundError()
          }

          throw new Error(statusText)
        }
      }
    ]
  }
})

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number>;
  body?: Record<string, any>;
  responseType?: "JSON" | "BLOB";
}

export const api = async <T>(
  endpoint: string,
  {
    method = "GET",
    headers,
    searchParams,
    body,
    responseType = "JSON",
  }: ApiRequestOptions = {}
): Promise<T> => {
  try {
    const response = await baseApi(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      searchParams,
      json: body,
    })

    if (responseType === "BLOB") {
      return await response.blob() as T
    }

    return await response.json<T>()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}
