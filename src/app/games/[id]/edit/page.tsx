import Link from "next/link";
import { GameForm } from "@/components/game-form";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

async function getGame(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/games/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);

  if (!game) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Back to Collection</Button>
          </Link>
        </div>
        <GameForm game={game} isEdit={true} />
      </div>
    </main>
  );
}

