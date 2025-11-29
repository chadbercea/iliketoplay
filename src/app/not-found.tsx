import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page or game you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button>Return to Collection</Button>
        </Link>
      </div>
    </main>
  );
}

