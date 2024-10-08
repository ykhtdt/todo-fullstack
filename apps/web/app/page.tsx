import { api } from "@/shared/api";

const getExample = async () => {
  const response = await api("abc", {
    method: "GET"
  })

  return response
}

const Home = async () => {
  // const example = await getExample()
  // console.log(example);

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-2">
          Turborepo & Shadcn/ui
        </h1>
      </main>
      <footer className="flex flex-col items-center p-4">
        Footer
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic"

export default Home
