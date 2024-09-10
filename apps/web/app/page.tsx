import { Button } from "@repo/ui/components/ui/button";

const getExample = async () => {
  const response = await fetch("http://localhost:3002/", {
    method: "GET"
  })

  return await response.json()
}

export default async function Home() {
  const example = await getExample()

  console.log(example);

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-2">
          Turborepo & Shadcn/ui
        </h1>
        <Button>
          @repo/ui Button
        </Button>
      </main>
      <footer className="flex flex-col items-center p-4">
        Footer
      </footer>
    </div>
  );
}
