import Link from "next/link";
import { GameList } from "@/components/game-list";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">I Like To Play</h1>
            <p className="text-muted-foreground">Retro Game Collection Tool</p>
          </div>
          <Link href="/games/new">
            <Button>Add Game</Button>
          </Link>
        </div>
        <GameList />
      </div>
    </main>
  );
}

