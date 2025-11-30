import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Collection
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-lg">{session.user.email}</p>
              </div>
              {session.user.name && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <p className="text-lg">{session.user.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Theme</label>
                  <p className="text-sm text-slate-500">Choose light, dark, or system theme</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Preferences - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-500">
                <p>• Default view (Games/Stats)</p>
                <p>• Default sort order</p>
                <p>• Display density</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

