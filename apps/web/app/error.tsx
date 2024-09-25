"use client"

import { useEffect } from "react"

const Error = ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.log(error.digest)
    console.log(error.message)
  }, [error])

  switch (error.digest) {
    case "HTTP:404": {
      return <div>Resource Not Found</div>
    }
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        type="button"
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}

export default Error
