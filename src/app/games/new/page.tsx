"use client";

import Link from "next/link";
import { GameForm } from "@/components/game-form";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/auth-guard";

export default function NewGamePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost">← Back to Collection</Button>
            </Link>
          </div>
          <GameForm />
        </div>
      </main>
    </AuthGuard>
  );
}

